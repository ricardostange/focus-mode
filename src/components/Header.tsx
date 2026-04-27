interface HeaderProps {
  showSearch: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onLogoClick: () => void;
}

export function Header({ showSearch, searchTerm, onSearchChange, onLogoClick }: HeaderProps) {
  return (
    <header className="top-bar">
      <div className="header-content">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" 
          id="home-logo" 
          alt="Logo" 
          onClick={onLogoClick}
        />
        <div className="search-container" style={{ visibility: showSearch ? 'visible' : 'hidden' }}>
          <input 
            type="text" 
            placeholder="Search videos..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
