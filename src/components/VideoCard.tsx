import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <div className="video-container" onClick={() => onClick(video)}>
      <img src={video.thumbnailUrl} alt={video.title} />
      <div className="video-info">
        <p>{video.title}</p>
      </div>
    </div>
  );
}
