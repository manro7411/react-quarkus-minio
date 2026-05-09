type LoginPageProps = {
  onLogin: () => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
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

        <form
          className="login-card"
          onSubmit={(event) => {
            event.preventDefault();
            onLogin();
          }}
        >
          <div className="login-card-logo">
            <div className="logo-heart">♡</div>
            <h1>For My Love</h1>
            <p>❤ Admin ❤</p>
          </div>

          <div className="login-title">
            <h2>Welcome Back <span>❤</span></h2>
            <p>Sign in to manage your surprise website</p>
          </div>

          <label className="login-field">
            Email address
            <div className="login-input">
              <span>✉</span>
              <input
                type="email"
                placeholder="admin@formylove.com"
              />
            </div>
          </label>

          <label className="login-field">
            Password
            <div className="login-input">
              <span>🔒</span>
              <input type="password" placeholder="Enter your password" />
              <button type="button">◌</button>
            </div>
          </label>

          <div className="login-options">
            <label>
              <input type="checkbox" defaultChecked />
              Remember me
            </label>

            <a href="#forgot">Forgot password?</a>
          </div>

          <button className="login-submit" type="submit">
            ♡ Sign In
          </button>

          <button className="login-preview" type="button">
            👁 Preview Website
          </button>

          <div className="login-divider">
            <span></span>
            <p>or continue with</p>
            <span></span>
          </div>

          <div className="social-row">
            <button type="button">G Continue with Google</button>
            <button type="button"> Continue with Apple</button>
          </div>

          <p className="login-secure">🛡 Protected admin access • Made with love 💗</p>
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