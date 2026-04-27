import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Video } from './types';
import { Header } from './components/Header';
import { VideoGrid } from './components/VideoGrid';
import { VideoPlayer } from './components/VideoPlayer';
import { AddVideoModal } from './components/AddVideoModal';
import './App.css';

const STORAGE_KEY = 'simplista_user_videos';

function App() {
  // Use a function initializer to load from localStorage synchronously before the first render
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved videos", e);
      }
    }
    return [];
  });

  const [currentScreen, setCurrentScreen] = useState<'home' | 'video'>('home');
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mainDescription, setMainDescription] = useState('Default Description');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Handle URL navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/video/')) {
        const id = path.split('/video/')[1];
        setSelectedVideoId(id);
        setCurrentScreen('video');
        // Find title for selected video if possible
        const video = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').find((v: Video) => v.id === id);
        if (video) setMainDescription(video.title);
      } else {
        setCurrentScreen('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Persist to LocalStorage whenever videos change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (!searchTerm.trim()) return videos;
    const term = searchTerm.toLowerCase();
    return videos.filter(video => video.title.toLowerCase().includes(term));
  }, [videos, searchTerm]);

  const displayVideoScreen = (video: Video) => {
    setCurrentScreen('video');
    setSelectedVideoId(video.id);
    setMainDescription(video.title);
    window.history.pushState({}, '', `/video/${video.id}`);
  };

  const displayHomeScreen = () => {
    setCurrentScreen('home');
    setMainDescription('Default Description');
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
