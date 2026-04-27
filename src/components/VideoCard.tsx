import { Link } from 'react-router-dom';
import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link 
      to={`/video/${video.id}`} 
      className="video-container" 
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <img src={video.thumbnailUrl} alt={video.title} />
      <div className="video-info">
        <p>{video.title}</p>
      </div>
    </Link>
  );
}
