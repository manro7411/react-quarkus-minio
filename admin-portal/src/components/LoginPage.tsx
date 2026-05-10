import { useState } from "react";
import { loginAdmin } from "../services/authService";

type LoginPageProps = {
  onLogin: () => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("admin@n9ne.cc");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await loginAdmin({
        email: email.trim(),
        password,
      });

      if (!rememberMe) {
        // ตอนนี้ token storage ใช้ localStorage อยู่
        // ถ้าต้องการ rememberMe จริงแบบ sessionStorage ค่อยปรับ authStorage ต่อได้
      }

      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-left">
          <div className="love-logo">
            <div className="logo-heart">♡</div>
            <div>
              <h1>For My Love</h1>
              <p>❤ Admin ❤</p>
            </div>
          </div>

          <div className="login-hero-copy">
            <h2>
              Create moments.
              <br />
              <span>Spread love.</span>
            </h2>
            <p>
              Manage your romantic surprises, love letters, countdowns, and
              more — all in one place.
            </p>
          </div>

          <div className="login-gift-card">
            <div className="login-gift">🎁</div>
            <div className="login-envelope">💌</div>
            <div className="login-rose">🌹</div>
          </div>
        </div>

        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-logo">
            <div className="logo-heart">♡</div>
            <h1>For My Love</h1>
            <p>❤ Admin ❤</p>
          </div>

          <div className="login-title">
            <h2>
              Welcome Back <span>❤</span>
            </h2>
            <p>Sign in to manage your surprise website</p>
          </div>

          <label className="login-field">
            Email address
            <div className="login-input">
              <span>✉</span>
              <input
                type="email"
                placeholder="admin@n9ne.cc"
                value={email}
                autoComplete="email"
                disabled={loading}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </label>

          <label className="login-field">
            Password
            <div className="login-input">
              <span>🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                autoComplete="current-password"
                disabled={loading}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                disabled={loading}
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "◉" : "◌"}
              </button>
            </div>
          </label>

          {error && <div className="login-error">{error}</div>}

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                disabled={loading}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember me
            </label>

            <a href="#forgot">Forgot password?</a>
          </div>

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "Signing In..." : "♡ Sign In"}
          </button>

          <button className="login-preview" type="button" disabled={loading}>
            👁 Preview Website
          </button>

          <div className="login-divider">
            <span></span>
            <p>or continue with</p>
            <span></span>
          </div>

          <div className="social-row">
            <button type="button" disabled={loading}>
              G Continue with Google
            </button>
            <button type="button" disabled={loading}>
               Continue with Apple
            </button>
          </div>

          <p className="login-secure">
            🛡 Protected admin access • Made with love 💗
          </p>
        </form>

        <aside className="login-right">
          <div className="security-card">
            <h3>🛡 Secure & Trusted</h3>

            <div>
              <b>🔒 Encrypted Access</b>
              <p>Your data is protected with enterprise security</p>
            </div>

            <div>
              <b>💌 Private & Safe</b>
              <p>Only authorized admins can access the dashboard</p>
            </div>

            <div>
              <b>⏱ Always Available</b>
              <p>24/7 secure access from anywhere</p>
            </div>
          </div>

          <div className="dashboard-preview-card">
            <h3>Dashboard Preview</h3>
            <div className="mini-dashboard-preview">
              <div className="mini-sidebar"></div>
              <div className="mini-main">
                <span></span>
                <span></span>
                <span></span>
                <div></div>
              </div>
            </div>
          </div>

          <div className="quote-card">
            <strong>“</strong>
            <p>
              Every detail matters when
              <br />
              it comes to love. 💗
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}