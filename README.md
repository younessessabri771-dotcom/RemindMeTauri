# 🔔 Remind Me — Desktop Notes & Reminders App

Une application de bureau légère pour gérer des notes et des rappels, construite avec **Tauri v2** + **React**.

---

## 📦 Stack Technique

| Couche | Technologie |
|--------|------------|
| Frontend | React + Vite |
| Backend | Rust (Tauri v2) |
| Stockage | tauri-plugin-store (JSON local) |
| Notifications | tauri-plugin-notification |
| Tray icon | Tauri tray-icon |
| Styles | CSS vanilla |

---

## 🖥️ Plateformes supportées

| OS | Format | Statut |
|----|--------|--------|
| 🪟 Windows 10/11 | `.msi` / `.exe` | ✅ Build OK |
| 🐧 Linux (Ubuntu/Mint/Debian) | `.deb` / `.AppImage` | ✅ Build OK |
| 🍎 macOS | `.dmg` | ✅ Build OK |

> **Note :** Aucune dépendance requise pour l'utilisateur final (Node.js et Rust sont uniquement nécessaires en développement).

---

## 🚀 État d'avancement

### ✅ Terminé
- [x] Migration Electron → Tauri v2
- [x] Interface React (notes, rappels, tray)
- [x] Stockage persistant des notes (plugin-store)
- [x] Notifications natives (plugin-notification)
- [x] Icône dans la barre système (tray icon)
- [x] Build Windows fonctionnel (`.msi` + `.exe`)
- [x] CI/CD GitHub Actions (build automatique multi-plateformes)
- [x] Build Linux fonctionnel (`.deb` + `.AppImage`)
- [x] Build macOS fonctionnel (`.dmg`)
- [x] Premier commit et push sur GitHub
- [x] Release GitHub v1.0.0 (Linux/Debian)

### 🔜 Prochaines étapes
- [ ] Release GitHub complète (Windows + Linux + macOS)
- [ ] Auto-Release à chaque tag Git (via GitHub Actions)
- [ ] Page de téléchargement publique

---

## 🔧 Développement local

### Prérequis
- Node.js 20+
- Rust (stable)
- Tauri CLI v2

### Démarrer en mode développement
```bash
npm install
npm run tauri dev
```

### Compiler pour la production (Windows)
```bash
npm run tauri build
```

---

## ⚙️ CI/CD — GitHub Actions

Le workflow `.github/workflows/build.yml` compile automatiquement l'app sur **3 plateformes en parallèle** à chaque push sur `master`.

### Récupérer les installateurs
1. Aller sur [GitHub Actions](https://github.com/younessessabri771-dotcom/RemindMeTauri/actions)
2. Cliquer sur le dernier run réussi
3. Télécharger les **Artifacts** en bas de page :
   - `RemindMe-Linux` → `.deb` + `.AppImage`
   - `RemindMe-Windows` → `.msi` + `.exe`
   - `RemindMe-macOS` → `.dmg`

---

## 📥 Installation pour l'utilisateur final

### Linux Mint / Ubuntu
```bash
# Option 1 : AppImage (aucune installation)
chmod +x "Remind Me_1.0.0_x86_64.AppImage"
./"Remind Me_1.0.0_x86_64.AppImage"

# Option 2 : Paquet Debian
sudo dpkg -i "remind-me_1.0.0_amd64.deb"
```

### Windows
Double-cliquer sur `Remind Me_1.0.0_x64-setup.exe`

### macOS
Ouvrir `Remind Me_1.0.0_x64.dmg` et glisser l'app dans Applications

---

## 📁 Structure du projet

```
remind-me-tauri/
├── .github/workflows/build.yml   # CI/CD GitHub Actions
├── src/                          # Frontend React
│   ├── components/Note.jsx       # Composant note
│   ├── App.jsx                   # App principale
│   └── styles/index.css          # Styles globaux
├── src-tauri/                    # Backend Rust
│   ├── src/lib.rs                # Logique principale (tray, notifications)
│   ├── tauri.conf.json           # Configuration Tauri
│   └── Cargo.toml                # Dépendances Rust
└── package.json                  # Dépendances Node.js
```
