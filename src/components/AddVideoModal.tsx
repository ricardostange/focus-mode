import { useState } from 'react';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (videoId: string) => void;
}

export function AddVideoModal({ isOpen, onClose, onAdd }: AddVideoModalProps) {
  const [videoId, setVideoId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoId.trim()) {
      onAdd(videoId.trim());
      setVideoId('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Add New Video</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Enter YouTube Video ID (e.g., dQw4w9WgXcQ)"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            autoFocus
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="confirm-btn">Add Video</button>
          </div>
        </form>
      </div>
    </div>
  );
}
