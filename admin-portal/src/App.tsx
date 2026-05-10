import { useEffect, useMemo, useState } from "react";
import "./App.css";
import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/StatCard";
import GalleryManager from "./components/GalleryManager";
import ManagementPanel from "./components/ManagementPanel";
import EditPhotoModal from "./components/EditPhotoModal";
import type { PhotoItem, StatItem } from "./types/admin";
import { isLoggedIn } from "./services/authStorage";
import { logoutAdmin } from "./services/authService";
import {
  getDashboardStats,
  type DashboardStatsResponse,
} from "./services/dashboardService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [galleryReloadKey, setGalleryReloadKey] = useState(0);
  const [dashboardStats, setDashboardStats] =
    useState<DashboardStatsResponse | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const stats: StatItem[] = useMemo(
    () => [
      {
        label: "Total Memories",
        value: dashboardStats?.totalMemories ?? 0,
        change: "Live data",
        icon: "💌",
      },
      {
        label: "Total Photos",
        value: dashboardStats?.totalPhotos ?? 0,
        change: "Live data",
        icon: "🖼️",
      },
      {
        label: "Favorite Photos",
        value: dashboardStats?.favoritePhotos ?? 0,
        change: "Live data",
        icon: "💗",
      },
      {
        label: "Hidden Photos",
        value: dashboardStats?.hiddenPhotos ?? 0,
        change: "Live data",
        icon: "🙈",
      },
    ],
    [dashboardStats]
  );

  async function loadDashboardStats() {
    try {
      setLoadingStats(true);
      const data = await getDashboardStats();
      setDashboardStats(data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoadingStats(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    loadDashboardStats();
  }, [isAuthenticated]);

  function handleLogout() {
    logoutAdmin();
    setIsAuthenticated(false);
    setEditingPhoto(null);
    setDashboardStats(null);
    window.location.reload();
  }

  function handlePhotoSaved() {
    setEditingPhoto(null);
    setGalleryReloadKey((current) => current + 1);
    loadDashboardStats();
    setToastVisible(true);

    window.setTimeout(() => {
      setToastVisible(false);
    }, 1800);
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main">
        <Topbar onLogout={handleLogout} />

        <section className="dashboard-content">
          {loadingStats && (
            <div className="dashboard-loading">Loading stats...</div>
          )}

          <div className="stats-row">
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          <div className="dashboard-grid">
            <GalleryManager
              reloadKey={galleryReloadKey}
              onEdit={setEditingPhoto}
            />
            <ManagementPanel />
          </div>
        </section>
      </main>

      <EditPhotoModal
        photo={editingPhoto}
        onClose={() => setEditingPhoto(null)}
        onSaved={handlePhotoSaved}
      />

      {toastVisible && (
        <div className="toast">
          <span>✓</span>
          <strong>Saved successfully</strong>
          <button onClick={() => setToastVisible(false)}>×</button>
        </div>
      )}
    </div>
  );
}

export default App;