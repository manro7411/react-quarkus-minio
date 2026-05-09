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

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-heart">♡</div>
        <div>
          <h1>For My Love</h1>
          <p>❤ Admin ❤</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menus.map((menu) => (
          <button
            key={menu}
            className={`sidebar-item ${menu === "Gallery" ? "active" : ""}`}
          >
            <span>{getIcon(menu)}</span>
            {menu}
            {menu === "Gallery" && <b>›</b>}
          </button>
        ))}
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