const menus = [
  "Dashboard",
  "Hero Section",
  "Countdown",
  "Memories",
  "Love Letter",
  "Gallery",
  "Final Surprise",
  "Settings",
  "Logout",
];

type SidebarProps = {
  activeMenu?: string;
  onMenuChange?: (menu: string) => void;
  onLogout?: () => void;
};

export default function Sidebar({
  activeMenu = "Gallery",
  onMenuChange,
  onLogout,
}: SidebarProps) {
  function handleMenuClick(menu: string) {
    if (menu === "Logout") {
      onLogout?.();
      return;
    }

    onMenuChange?.(menu);
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-heart">♡</div>

        <div className="sidebar-brand-copy">
          <h1>For My Love</h1>
          <p>❤ Admin ❤</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menus.map((menu) => {
          const isActive = menu === activeMenu;

          return (
            <button
              key={menu}
              type="button"
              className={`sidebar-item ${isActive ? "active" : ""} ${
                menu === "Logout" ? "logout-item" : ""
              }`}
              onClick={() => handleMenuClick(menu)}
            >
              <span className="sidebar-item-icon">{getIcon(menu)}</span>
              <span className="sidebar-item-label">{menu}</span>
              {isActive && <b>›</b>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-rose">
        <div className="rose">🌹</div>
        <p>
          Love is in
          <br />
          every detail.
          <br />❤
        </p>
      </div>
    </aside>
  );
}

function getIcon(menu: string) {
  const icons: Record<string, string> = {
    Dashboard: "⌂",
    "Hero Section": "☆",
    Countdown: "◷",
    Memories: "♡",
    "Love Letter": "✉",
    Gallery: "▧",
    "Final Surprise": "🎁",
    Settings: "⚙",
    Logout: "↪",
  };

  return icons[menu] ?? "•";
}