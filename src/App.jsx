import React, { useState, useEffect } from 'react';
import { Plus, StickyNote, Clock, Volume2, VolumeX } from 'lucide-react';
import { Store } from '@tauri-apps/plugin-store';
import { invoke } from '@tauri-apps/api/core';
import Note from './components/Note';
import './styles/index.css';

const COLORS = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];
const INTERVALS = [
  { label: '10s', value: 10000 },
  { label: '30s', value: 30000 },
  { label: '1m',  value: 60000 },
  { label: '5m',  value: 300000 },
  { label: '10m', value: 600000 },
  { label: '30m', value: 1800000 },
];

let store;
async function getStore() {
  if (!store) store = await Store.load('notes.json', { autoSave: true });
  return store;
}

function App() {
  const [notes, setNotes] = useState([]);
  const [currentInterval, setCurrentInterval] = useState(30000);
  const [isSilent, setIsSilent] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted data on mount
  useEffect(() => {
    const load = async () => {
      try {
        const s = await getStore();
        const savedNotes = await s.get('notes');
        if (Array.isArray(savedNotes)) setNotes(savedNotes);
        const savedInterval = await s.get('notificationInterval');
        if (savedInterval) setCurrentInterval(savedInterval);
        const savedSilent = await s.get('notificationSilent');
        if (savedSilent !== null && savedSilent !== undefined) setIsSilent(savedSilent);
      } catch (e) {
        console.error('Load error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    if (isLoading) return;
    getStore().then(s => s.set('notes', notes));
  }, [notes, isLoading]);

  const addNote = () => {
    const newNote = {
      id: Date.now().toString(),
      content: '',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      timestamp: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id, updated) => setNotes(prev => prev.map(n => n.id === id ? updated : n));
  const deleteNote = (id) => setNotes(prev => prev.filter(n => n.id !== id));
  const duplicateNote = (id) => {
    const note = notes.find(n => n.id === id);
    if (note) setNotes(prev => [{ ...note, id: Date.now().toString(), timestamp: Date.now() }, ...prev]);
  };

  const changeInterval = async (val) => {
    setCurrentInterval(val);
    const s = await getStore();
    await s.set('notificationInterval', val);
    await invoke('update_interval', { interval: val });
  };

  const toggleSound = async () => {
    const next = !isSilent;
    setIsSilent(next);
    const s = await getStore();
    await s.set('notificationSilent', next);
    await invoke('update_silent', { silent: next });
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="header"><h1 className="header-title">✨ Remind Me</h1></div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">✨ Remind Me</h1>
        <div className="header-actions">
          <button
            className={`btn ${isSilent ? 'btn-secondary' : 'btn-primary'}`}
            onClick={toggleSound}
            title={isSilent ? 'Sons désactivés' : 'Sons activés'}
          >
            {isSilent ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button className="btn btn-primary" onClick={addNote}>
            <Plus size={20} />
            Nouvelle Note
          </button>
        </div>
      </header>

      <div className="interval-selector">
        <div className="interval-label">
          <Clock size={18} />
          <span>Fréquence des rappels :</span>
        </div>
        <div className="interval-buttons">
          {INTERVALS.map(i => (
            <button
              key={i.value}
              className={`interval-btn ${currentInterval === i.value ? 'active' : ''}`}
              onClick={() => changeInterval(i.value)}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div className="notes-container">
        {notes.length === 0 ? (
          <div className="empty-state">
            <StickyNote size={80} className="empty-state-icon" />
            <p className="empty-state-text">
              Aucune note pour le moment.<br />
              Cliquez sur "Nouvelle Note" pour commencer !
            </p>
          </div>
        ) : (
          notes.map(note => (
            <Note
              key={note.id}
              note={note}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onDuplicate={duplicateNote}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
