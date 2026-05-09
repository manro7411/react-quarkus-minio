type TopbarProps = {
  onLogout: () => void;
};

export default function Topbar({ onLogout }: TopbarProps) {
  return (
    <header className="topbar">
      <h2>Admin Dashboard</h2>

      <div className="topbar-right">
        <div className="search-box">
          <span>⌕</span>
          <input placeholder="Search anything..." />
          <kbd>⌘K</kbd>
        </div>

        <button className="icon-button" type="button" aria-label="Notifications">
          🔔
          <small>3</small>
        </button>

        <div className="admin-profile">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
            alt="Admin"
          />

          <div>
            <strong>Admin</strong>
            <span>Super Admin</span>
          </div>

          <span>⌄</span>
        </div>

        <button className="preview-button" type="button">
          Preview Website ↗
        </button>

        <button className="logout-button" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}