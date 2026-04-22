# 🚀 Plan — Remind Me avec Tauri v2 + React + Vite

## Pourquoi ce stack ?

| Critère | Electron (actuel) | Tauri v2 (nouveau) |
|---------|------|------|
| Taille `.exe` | ~150 MB | **~5 MB** ✅ |
| Packaging | ❌ 7zip/crash | ✅ `npm run tauri build` |
| Notifications | ⚠️ Problèmes vus | ✅ Natives Windows |
| System Tray | ✅ | ✅ |
| Persistance | electron-store | tauri-plugin-store |
| Frontend | React (gardé) | **React identique** ✅ |
| Backend | Node.js | Rust (léger, rapide) |

---

## 📁 Nouveau Projet

**Dossier** : `C:\Users\PC\OneDrive\Desktop\REMIND-ME-TAURI\`

**Stack** :
- **Tauri v2** — framework desktop Rust
- **React 18 + Vite** — frontend identique à l'actuel
- **tauri-plugin-notification** — notifications natives
- **tauri-plugin-store** — persistance des notes
- **tauri-plugin-autostart** — démarrage automatique (bonus)

---

## 📋 Étapes d'Implémentation

### Phase 1 — Initialisation (5 min)
```bash
npm create tauri-app@latest remind-me-tauri -- --template react --manager npm
cd remind-me-tauri
npm install
```

### Phase 2 — Plugins Tauri (10 min)
Ajouter les plugins nécessaires :
- `tauri-plugin-store` → persistance notes
- `tauri-plugin-notification` → rappels
- `tauri-plugin-autostart` → démarrage avec Windows (bonus)

### Phase 3 — Frontend React (20 min)
Copier/adapter depuis le projet Electron :
- `src/App.jsx` — composant principal
- `src/components/Note.jsx` — composant note
- `src/styles/index.css` — styles complets

### Phase 4 — Backend Rust (20 min)
Dans `src-tauri/src/main.rs` :
- Timer de rappels avec `tokio`
- Intégration system tray
- Commandes IPC Rust ↔ React

### Phase 5 — Build & Test (10 min)
```bash
npm run tauri build
```
→ Génère `target/release/bundle/nsis/RemindMe_x.x.x_x64-setup.exe`

---

## 🎨 Fonctionnalités Reproduites

- ✅ Créer / éditer / supprimer des notes
- ✅ 6 couleurs de notes
- ✅ Duplication de notes
- ✅ Menu contextuel (gras, souligner, copier)
- ✅ Sélecteur de fréquence (10s → 30m)
- ✅ Notifications natives Windows
- ✅ Émoji couleur dans les notifications
- ✅ Bouton son on/off
- ✅ System tray (cacher/afficher, quitter)
- ✅ Persistance automatique
- ✅ Design responsive (mêmes styles CSS)

## 🎁 Bonus Tauri

- ✅ Démarrage automatique avec Windows
- ✅ Exécutable ultra léger (~5 MB)
- ✅ Build en une seule commande sans problème

---

## ⚠️ Points d'attention

> [!IMPORTANT]
> Tauri nécessite que WebView2 soit installé sur Windows 10/11.
> En pratique, il est déjà présent sur Windows 11 et Windows 10 récent.

> [!NOTE]
> Le backend Rust est simple — les commandes IPC remplacent les `ipcMain.handle` d'Electron.
> La logique métier reste dans React.

---

## ✅ Prêt à démarrer ?

Dites **"go"** et je commence l'implémentation étape par étape.
