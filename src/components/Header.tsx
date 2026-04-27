interface HeaderProps {
  showSearch: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onLogoClick: () => void;
  onAddVideoClick: () => void;
}

export function Header({ showSearch, searchTerm, onSearchChange, onLogoClick, onAddVideoClick }: HeaderProps) {
  const handleLogoClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    onLogoClick();
  };

  return (
    <header className="top-bar">
      <div className="header-content">
        <a href="/" onClick={handleLogoClick}>
          <img src="favicon.svg" alt="Focus Mode" className="logo-img" />
        </a>
        <div className="search-container" style={{ visibility: showSearch ? 'visible' : 'hidden' }}>
          <input 
            type="text" 
            placeholder="Search videos..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {showSearch && (
          <button className="add-video-btn" onClick={onAddVideoClick} title="Add New Video">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
