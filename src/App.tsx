import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Video } from './types';
import { Header } from './components/Header';
import { VideoGrid } from './components/VideoGrid';
import { VideoPlayer } from './components/VideoPlayer';
import { AddVideoModal } from './components/AddVideoModal';
import './App.css';

const STORAGE_KEY = 'simplista_user_videos';
const DEFAULT_VIDEO_IDS = [
  'dQw4w9WgXcQ',
  '9bZkp7q19f0',
  'jNQXAC9IVRw'
];

function App() {
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const userVideos = JSON.parse(saved);
        // Ensure we don't load videos that are now in the default list
        return userVideos.filter((v: Video) => !DEFAULT_VIDEO_IDS.includes(v.id));
      } catch (e) {
        console.error("Failed to parse saved videos", e);
      }
    }
    return [];
  });

  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derived state
  const currentScreen = selectedVideoId ? 'video' : 'home';
  const selectedVideo = useMemo(() => 
    videos.find(v => v.id === selectedVideoId), 
    [videos, selectedVideoId]
  );
  const mainDescription = selectedVideo?.title || 'Loading...';

  const fetchMetadata = useCallback(async (id: string): Promise<Video | null> => {
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
      const data = await response.json();
      return {
        id,
        title: data.title || 'No title found',
        thumbnailUrl: `https://img.youtube.com/vi/${id}/mqdefault.jpg`
      };
    } catch (error) {
      console.error(`Error fetching metadata for ${id}:`, error);
      return null;
    }
  }, []);

  // Fetch metadata for default videos on mount and merge
  useEffect(() => {
    const loadDefaults = async () => {
      const results = await Promise.all(DEFAULT_VIDEO_IDS.map(id => fetchMetadata(id)));
      const filteredDefaults = results.filter((v): v is Video => v !== null);
      setVideos(prev => {
        // Filter out any user-added videos that are now defaults to avoid duplicates
        const userVids = prev.filter(v => !DEFAULT_VIDEO_IDS.includes(v.id));
        return [...filteredDefaults, ...userVids];
      });
    };
    loadDefaults();
  }, [fetchMetadata]);

  // Handle URL navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/video/')) {
        const id = path.split('/video/')[1];
        setSelectedVideoId(id);
        
        // If metadata hasn't loaded yet and not in current list, try to fetch it
        if (!videos.some(v => v.id === id)) {
          fetchMetadata(id).then(v => {
            if (v) setVideos(prev => [...prev, v]);
          });
        }
      } else {
        setSelectedVideoId('');
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, [videos, fetchMetadata]);

  // Persist only user-added videos (those not in the default list)
  useEffect(() => {
    const userOnly = videos.filter(v => !DEFAULT_VIDEO_IDS.includes(v.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userOnly));
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (!searchTerm.trim()) return videos;
    const term = searchTerm.toLowerCase();
    return videos.filter(video => video.title.toLowerCase().includes(term));
  }, [videos, searchTerm]);

  const displayVideoScreen = (video: Video) => {
    setSelectedVideoId(video.id);
    window.history.pushState({}, '', `/video/${video.id}`);
  };

  const displayHomeScreen = () => {
    setSelectedVideoId('');
    window.history.pushState({}, '', '/');
  };

  const handleAddVideo = async (videoId: string) => {
    if (videos.some(v => v.id === videoId)) {
      alert('This video is already in your list!');
      return;
    }

    const newVideo = await fetchMetadata(videoId);
    if (newVideo) {
      setVideos(prev => [newVideo, ...prev]);
    } else {
      alert('Could not find video metadata. Please check the ID.');
    }
  };


  return (
    <div className="app-container">
      <Header 
        showSearch={currentScreen === 'home'}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onLogoClick={displayHomeScreen}
        onAddVideoClick={() => setIsModalOpen(true)}
      />

      <main className="main">
        {currentScreen === 'home' ? (
          <>
            {videos.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
                <h2>No videos yet</h2>
                <p>Click "Add Video" to start building your library.</p>
              </div>
            ) : (
              <VideoGrid 
                videos={filteredVideos} 
                onVideoClick={displayVideoScreen} 
              />
            )}
          </>
        ) : (
          <VideoPlayer 
            videoId={selectedVideoId} 
            title={mainDescription} 
          />
        )}
      </main>

      <AddVideoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddVideo}
      />
    </div>
  );
}


export default App;
