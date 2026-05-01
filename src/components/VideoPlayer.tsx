interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  return (
    <div className="video-expanded">
      <div className="video-player-wrapper">
        <iframe 
          width="256"
          height="144"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Video Player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
        ></iframe>
      </div>
      <h1 id="video-description-title">{title}</h1>
    </div>
  );
}
