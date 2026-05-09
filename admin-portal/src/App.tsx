import { useState } from "react";
import "./App.css";

import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/StatCard";
import GalleryManager from "./components/GalleryManager";
import ManagementPanel from "./components/ManagementPanel";
import EditPhotoModal from "./components/EditPhotoModal";

import { photos, stats } from "./data/mockData";
import type { PhotoItem } from "./types/admin";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("admin_logged_in") === "true"
  );

  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(photos[0]);
  const [toastVisible, setToastVisible] = useState(true);

  const handleLogin = () => {
    localStorage.setItem("admin_logged_in", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    setIsLoggedIn(false);
    setEditingPhoto(null);
    setToastVisible(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main">
        <Topbar onLogout={handleLogout} />

        <section className="dashboard-content">
          <div className="stats-row">
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          <div className="dashboard-grid">
            <GalleryManager photos={photos} onEdit={setEditingPhoto} />
            <ManagementPanel />
          </div>
        </section>
      </main>

      <EditPhotoModal
        photo={editingPhoto}
        onClose={() => setEditingPhoto(null)}
      />

      {toastVisible && (
        <div className="toast">
          <span>✓</span>
          <strong>Photo uploaded successfully</strong>
          <button type="button" onClick={() => setToastVisible(false)}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;