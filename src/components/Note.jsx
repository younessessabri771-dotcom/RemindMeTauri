import React from 'react';
import { X, Palette, Copy, Bold, Underline, FileText } from 'lucide-react';

const COLORS = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];

const Note = ({ note, onUpdate, onDelete, onDuplicate }) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [contextMenu, setContextMenu] = React.useState({ show: false, x: 0, y: 0 });
  const textareaRef = React.useRef(null);

  const handleTextChange = (e) => onUpdate(note.id, { ...note, content: e.target.value });
  const handleColorChange = (color) => { onUpdate(note.id, { ...note, color }); setShowColorPicker(false); };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const menuWidth = 220, menuHeight = 200;
    let x = e.clientX, y = e.clientY;
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;
    setContextMenu({ show: true, x: Math.max(10, x), y: Math.max(10, y) });
  };

  React.useEffect(() => {
    const close = () => setContextMenu({ show: false, x: 0, y: 0 });
    if (contextMenu.show) {
      document.addEventListener('click', close);
      return () => document.removeEventListener('click', close);
    }
  }, [contextMenu.show]);

  const handleCopy = () => { navigator.clipboard.writeText(note.content); setContextMenu({ show: false, x: 0, y: 0 }); };
  const handleDuplicate = () => { if (onDuplicate) onDuplicate(note.id); setContextMenu({ show: false, x: 0, y: 0 }); };

  const applyFormat = (wrap) => {
    const ta = textareaRef.current;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const selected = note.content.substring(start, end);
    if (selected) {
      onUpdate(note.id, { ...note, content: note.content.substring(0, start) + wrap(selected) + note.content.substring(end) });
    }
    setContextMenu({ show: false, x: 0, y: 0 });
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      applyFormat(t => `**${t}**`);
    }
  };

  const formatDate = (ts) => {
    const diff = Date.now() - ts;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return "À l'instant";
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    return `Il y a ${days} jours`;
  };

  return (
    <div className={`note ${note.color}`}>
      <div className="note-header">
        <span className="note-date">{formatDate(note.timestamp)}</span>
        <div className="note-actions">
          <button className="note-btn" onClick={() => setShowColorPicker(!showColorPicker)} title="Changer la couleur">
            <Palette size={16} />
          </button>
          <button className="note-btn delete" onClick={() => onDelete(note.id)} title="Supprimer">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="note-content" onContextMenu={handleContextMenu}>
        <textarea
          ref={textareaRef}
          className="note-textarea"
          value={note.content}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez votre note ici..."
          spellCheck={false}
        />
      </div>

      {showColorPicker && (
        <div className="color-picker">
          {COLORS.map(color => (
            <button key={color} className={`color-option ${color}`} onClick={() => handleColorChange(color)} title={color} />
          ))}
        </div>
      )}

      {contextMenu.show && (
        <div className="context-menu" style={{ position: 'fixed', top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}>
          <button className="context-menu-item" onClick={handleCopy}><Copy size={16} /><span>Copier le texte</span></button>
          <button className="context-menu-item" onClick={() => applyFormat(t => `**${t}**`)}><Bold size={16} /><span>Mettre en gras</span></button>
          <button className="context-menu-item" onClick={() => applyFormat(t => `__${t}__`)}><Underline size={16} /><span>Souligner</span></button>
          <div className="context-menu-divider"></div>
          <button className="context-menu-item" onClick={handleDuplicate}><FileText size={16} /><span>Dupliquer la note</span></button>
        </div>
      )}
    </div>
  );
};

export default Note;
