import { useState, useEffect, useMemo } from 'react';
import './App.css';

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
}

const VIDEO_IDS = [
  'jNQXAC9IVRw', 'dQw4w9WgXcQ', '9bZkp7q19f0', 'kJQP7kiw5Fk', 'y6120QOlsfU',
  'jgwWqElkyks', 'V-_O7nl0Ii0', 'L_jWHffIx5E', 'CevxZvSJLk8', 'fHI8X4OXWnU',
  'hT_nvWreIhg', 'JGwWqElkyks', 'l482T0yNkeo', 'M7lc1UVf-VE', 'RgKAFK5djSk',
  'YQHsXMglC9A', '09R8_2nJtjg', 'kXYiU_JCYtU', '9WzIACv_mxs', 'SbYAnF7vS_M',
  'Zi_XLOBDo_Y', 'papuvlVq_3E', 'rYEDA3JcQqw', '0e3t18rrjOA', 'XqZsoesa55w',
  '9H4E5SjYg_w', 'qMtcWqzSK8I', 'ktvTqknDobU', 'LPUU807_3pE', 'feSVtC1BSeQ',
  'fUAnuLzK_m8', 'cMTAUr5Kw6I', 'yCsgoLc_fzI', 'aqf0L2mYVqY', 'U7VStT_O_mY',
  'KneEzG6uDdU', 'JmNfUv-9z6c', 'X8zLJlU_-60', '8XlsicZ6t-0', 'HEfHFsfGXjs',
  'aircAruvnKk', 'OkmNXy7er84', 'wTJI_WuZSwE', 'oRdzL260yVo', 'xKO097vGuU7',
  'eEaZvEZye8', 'hHW1oY26kxQ', '7_VTH52TGOQ', '4bHUsy74Fss', 'KIv2fA7rP9M',
  'kSPrZ4GfXmU', 'uY6Yn7A-Y3k', 'N9qYF9DZPdw', '6_b7RDuLwcI', '9m6wW_V5V-k',
  'Xv-GfT_GzB8', 'Pj-D0U29Y_Q', 'tPEE9uB17yU', 'V6-0kYhg6No', '3tmd-ClpJxA',
  'M-697Lg87h4', 'fC7oUOUEkQg', '6Yp8_2nJtjg', 'v2AC41dglnM', 'C_S5cXbXe-4',
  'q6f-LLM1H6U', 'W6NZfCO5SIk', 'T-YvjNlS7Q4', 'kffacxfA7G4', 'MwpMEbgC7DA',
  'q7vG-88SShI', 'fRh_vgS2dFE', 'oyEuk8j8imI', 'm6VojYshn_A', '3-S8Z9S-E8M8',
  'X8zLJlU_-60', '79Dixm-y_8w', 'pS7m8-R8rM8', 't9RR9N2k9I8', 'ZgeS6_I6XvU',
  'gOMhN-nkf4Q', 'yKNxeF4K9tY', 'tH2w6Oxx0kQ', 'X66Z-8p48p8', 'hY7m5jjJ9mM',
  '0G38353457A', 'p_vYI-p_30I', '60ItHLz5WEA', 'C0DPdy98e4c', 'fJ9rUzIMcZQ',
  'N6p8_2nJtjg', 'P66Yp8_2nJtjg', '2S24-y0IjI', '9m6wW_V5V-k', 'M97vGuU7m6w',
  '7VTH52TGOQ0', 'KIv2fA7rP9M', 't9RR9N2k9I8', 'V6-0kYhg6No', 'SbYAnF7vS_M'
];

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'video'>('home');
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mainDescription, setMainDescription] = useState('Default Description');

  useEffect(() => {
    const fetchVideosMetadata = async () => {
      const videoPromises = VIDEO_IDS.map(async (id) => {
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
      });

      const results = await Promise.all(videoPromises);
      setVideos(results.filter((v): v is Video => v !== null));
    };

    fetchVideosMetadata();

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/video/')) {
        const id = path.split('/video/')[1];
        setSelectedVideoId(id);
        setCurrentScreen('video');
      } else {
        setCurrentScreen('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Initial check

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  return (
    <div className="app-container">
      <header className="top-bar">
        <div className="header-content">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" 
            id="home-logo" 
            alt="Logo" 
            onClick={displayHomeScreen}
          />
          <div className="search-container" style={{ visibility: currentScreen === 'home' ? 'visible' : 'hidden' }}>
            <input 
              type="text" 
              placeholder="Search videos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="main">
        {currentScreen === 'home' ? (
          <div className="video-grid">
            {filteredVideos.map((video) => (
              <div key={video.id} className="video-container" onClick={() => displayVideoScreen(video)}>
                <img src={video.thumbnailUrl} alt={video.title} />
                <div className="video-info">
                  <p>{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="video-expanded">
            <div className="video-player-wrapper">
              <iframe 
                src={`https://www.youtube.com/embed/${selectedVideoId}`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            </div>
            <h1 id="video-description-title">{mainDescription}</h1>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
