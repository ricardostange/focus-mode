import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    // If Ctrl, Cmd, Shift, or Alt is pressed, let the browser handle it (e.g. open in new tab)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    onClick(video);
  };

  return (
    <a 
      href={`/video/${video.id}`} 
      className="video-container" 
      onClick={handleClick}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <img src={video.thumbnailUrl} alt={video.title} />
      <div className="video-info">
        <p>{video.title}</p>
      </div>
    </a>
  );
}
