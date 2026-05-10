import { useEffect, useMemo, useState } from "react";
import "./App.css";
import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/StatCard";
import GalleryManager from "./components/GalleryManager";
import ManagementPanel from "./components/ManagementPanel";
import EditPhotoModal from "./components/EditPhotoModal";
import MemoriesManager from "./components/MemoriesManager";
import type { PhotoItem, StatItem } from "./types/admin";
import { isLoggedIn } from "./services/authStorage";
import { logoutAdmin } from "./services/authService";
import {
  getDashboardStats,
  type DashboardStatsResponse,
} from "./services/dashboardService";

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

const DEFAULT_MENU = "Gallery";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  const [activeMenu, setActiveMenu] = useState(DEFAULT_MENU);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
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
        helper: "Created memories",
        icon: "💌",
        tone: "pink",
      },
      {
        label: "Total Photos",
        value: dashboardStats?.totalPhotos ?? 0,
        change: "Live data",
        helper: "Gallery photos",
        icon: "🖼️",
        tone: "purple",
      },
      {
        label: "Favorite Photos",
        value: dashboardStats?.favoritePhotos ?? 0,
        change: "Live data",
        helper: "Marked as favorite",
        icon: "💗",
        tone: "green",
      },
      {
        label: "Hidden Photos",
        value: dashboardStats?.hiddenPhotos ?? 0,
        change: "Live data",
        helper: "Hidden from public",
        icon: "🙈",
        tone: "orange",
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

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
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
    showToast("success", "Photo saved successfully");
  }

  function handleMemoryChanged() {
    loadDashboardStats();
    showToast("success", "Memories updated successfully");
  }

  function renderMainContent() {
    if (activeMenu === "Dashboard") {
      return (
        <div className="dashboard-grid">
          <div className="dashboard-left-stack">
            <MemoriesManager
              onChanged={handleMemoryChanged}
              onToast={showToast}
            />

            <GalleryManager
              reloadKey={galleryReloadKey}
              onEdit={setEditingPhoto}
            />
          </div>

          <ManagementPanel />
        </div>
      );
    }

    if (activeMenu === "Memories") {
      return (
        <div className="single-content-grid">
          <MemoriesManager
            onChanged={handleMemoryChanged}
            onToast={showToast}
          />
        </div>
      );
    }

    if (activeMenu === "Gallery") {
      return (
        <div className="single-content-grid">
          <GalleryManager
            reloadKey={galleryReloadKey}
            onEdit={setEditingPhoto}
          />
        </div>
      );
    }

    if (
      activeMenu === "Hero Section" ||
      activeMenu === "Countdown" ||
      activeMenu === "Love Letter" ||
      activeMenu === "Final Surprise" ||
      activeMenu === "Settings"
    ) {
      return (
        <div className="management-only-grid">
          <ManagementPanel />
        </div>
      );
    }

    return (
      <div className="dashboard-grid">
        <div className="dashboard-left-stack">
          <MemoriesManager
            onChanged={handleMemoryChanged}
            onToast={showToast}
          />

          <GalleryManager
            reloadKey={galleryReloadKey}
            onEdit={setEditingPhoto}
          />
        </div>

        <ManagementPanel />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="admin-layout">
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={handleLogout}
      />

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

          {renderMainContent()}
        </section>
      </main>

      <EditPhotoModal
        photo={editingPhoto}
        onClose={() => setEditingPhoto(null)}
        onSaved={handlePhotoSaved}
      />

      {toast && (
        <div className={`toast ${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "!"}</span>
          <strong>{toast.message}</strong>
          <button type="button" onClick={() => setToast(null)}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;