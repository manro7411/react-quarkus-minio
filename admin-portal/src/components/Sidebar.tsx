import { useEffect, useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleMenuClick(menu: string) {
    if (menu === "Logout") {
      onLogout?.();
      setMobileOpen(false);
      return;
    }

    onMenuChange?.(menu);
    setMobileOpen(false);
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900) {
        setMobileOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <button
        className="mobile-sidebar-toggle"
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {mobileOpen && (
        <button
          className="mobile-sidebar-backdrop"
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-mobile-header">
          <span>Menu</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

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
    </>
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