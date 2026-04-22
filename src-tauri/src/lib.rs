use tauri::{
    image::Image,
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager, Runtime,
};
use tauri_plugin_notification::NotificationExt;
use tauri_plugin_store::StoreExt;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Note {
    id: String,
    content: String,
    color: String,
    timestamp: u64,
}

#[derive(Clone)]
struct AppState {
    interval_ms: Arc<Mutex<u64>>,
    is_silent: Arc<Mutex<bool>>,
    reminders_enabled: Arc<Mutex<bool>>,
}

#[tauri::command]
fn update_interval(state: tauri::State<AppState>, interval: u64) {
    let mut lock = state.interval_ms.lock().unwrap();
    *lock = interval;
}

#[tauri::command]
fn update_silent(state: tauri::State<AppState>, silent: bool) {
    let mut lock = state.is_silent.lock().unwrap();
    *lock = silent;
}

#[tauri::command]
fn set_reminders_enabled(state: tauri::State<AppState>, enabled: bool) {
    let mut lock = state.reminders_enabled.lock().unwrap();
    *lock = enabled;
}

fn show_notification<R: Runtime>(app: &AppHandle<R>, title: &str, body: &str) {
    let _ = app.notification()
        .builder()
        .title(title)
        .body(body)
        .show();
}

fn get_color_emoji(color: &str) -> &'static str {
    match color {
        "yellow" => "🟡",
        "pink"   => "🔴",
        "blue"   => "🔵",
        "green"  => "🟢",
        "purple" => "🟣",
        "orange" => "🟠",
        _        => "🔔",
    }
}

fn start_reminder_loop(app: AppHandle, state: AppState) {
    tauri::async_runtime::spawn(async move {
        let mut last_interval = 0u64;
        let mut elapsed = 0u64;
        let tick = 1000u64; // check every second

        loop {
            tokio::time::sleep(Duration::from_millis(tick)).await;

            let enabled = *state.reminders_enabled.lock().unwrap();
            if !enabled {
                elapsed = 0;
                continue;
            }

            let interval = *state.interval_ms.lock().unwrap();
            if interval != last_interval {
                last_interval = interval;
                elapsed = 0;
            }

            elapsed += tick;

            if elapsed >= interval {
                elapsed = 0;

                // Get notes from store
                let store = app.get_store("notes.json");
                if let Some(store) = store {
                    let notes_val: Option<serde_json::Value> = store.get("notes");
                    if let Some(val) = notes_val {
                        if let Ok(notes) = serde_json::from_value::<Vec<Note>>(val) {
                            if notes.is_empty() {
                                show_notification(&app, "📝 Remind Me", "Aucune note. Créez votre première note !");
                            } else {
                                let idx = (std::time::SystemTime::now()
                                    .duration_since(std::time::UNIX_EPOCH)
                                    .unwrap_or_default()
                                    .as_secs() as usize) % notes.len();
                                let note = &notes[idx];
                                let emoji = get_color_emoji(&note.color);
                                let content = if note.content.is_empty() {
                                    "Note vide".to_string()
                                } else {
                                    note.content.clone()
                                };
                                show_notification(&app, emoji, &content);
                            }
                        }
                    } else {
                        show_notification(&app, "📝 Remind Me", "Aucune note. Créez votre première note !");
                    }
                }
            }
        }
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let state = AppState {
        interval_ms: Arc::new(Mutex::new(30000)),
        is_silent: Arc::new(Mutex::new(true)),
        reminders_enabled: Arc::new(Mutex::new(true)),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .manage(state.clone())
        .setup(move |app| {
            let handle = app.handle().clone();

            // Build system tray menu
            let show_item = MenuItem::with_id(app, "show", "Afficher l'application", true, None::<&str>)?;
            let reminders_item = MenuItem::with_id(app, "reminders", "✅ Rappels activés", true, None::<&str>)?;
            let separator = PredefinedMenuItem::separator(app)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quitter", true, None::<&str>)?;

            let menu = Menu::with_items(app, &[&show_item, &reminders_item, &separator, &quit_item])?;

            let _tray = TrayIconBuilder::new()
                .icon(Image::from_path("icons/icon.png").unwrap_or_else(|_| app.default_window_icon().unwrap().clone()))
                .menu(&menu)
                .tooltip("Remind Me")
                .on_menu_event({
                    let handle = handle.clone();
                    let state_clone = state.clone();
                    move |app, event| match event.id.as_ref() {
                        "show" => {
                            if let Some(w) = app.get_webview_window("main") {
                                let _ = w.show();
                                let _ = w.set_focus();
                            }
                        }
                        "reminders" => {
                            let mut enabled = state_clone.reminders_enabled.lock().unwrap();
                            *enabled = !*enabled;
                            // Update menu label (simple toggle feedback)
                            let _ = handle.emit("reminders-toggled", *enabled);
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click { button: MouseButton::Left, .. } = event {
                        let app = tray.app_handle();
                        if let Some(w) = app.get_webview_window("main") {
                            if w.is_visible().unwrap_or(false) {
                                let _ = w.hide();
                            } else {
                                let _ = w.show();
                                let _ = w.set_focus();
                            }
                        }
                    }
                })
                .build(app)?;

            // Quitter l'application complètement lorsque la fenêtre principale est fermée
            let w = app.get_webview_window("main").unwrap();
            let handle_clone = handle.clone();
            w.on_window_event(move |event| {
                if let tauri::WindowEvent::CloseRequested { .. } = event {
                    handle_clone.exit(0);
                }
            });

            // Start reminder loop
            start_reminder_loop(app.handle().clone(), state.clone());

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            update_interval,
            update_silent,
            set_reminders_enabled,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
