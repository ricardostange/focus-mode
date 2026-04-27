import type { Video } from '../types';
import { VideoCard } from './VideoCard';

interface VideoGridProps {
  videos: Video[];
}

export function VideoGrid({ videos }: VideoGridProps) {
  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard 
          key={video.id} 
          video={video} 
        />
      ))}
    </div>
  );
}
