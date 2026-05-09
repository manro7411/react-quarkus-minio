export default function ManagementPanel() {
  return (
    <aside className="right-panel">
      <section className="panel-card">
        <div className="panel-title">
          <h3>☆ Hero Section Management</h3>
          <span>⌃</span>
        </div>

        <label>
          Main headline
          <input defaultValue="You Are My Today & All of My Tomorrows" />
        </label>

        <label>
          Subtitle
          <input defaultValue="Every moment with you is my favorite." />
        </label>

        <label>
          CTA Button Text
          <input defaultValue="Open My Heart" />
        </label>

        <div className="hero-preview">
          <div>
            <strong>You Are My Today</strong>
            <strong>& All of My Tomorrows</strong>
            <button>Open My Heart</button>
          </div>
        </div>

        <button className="outline-button">Change Image</button>
      </section>

      <section className="panel-card">
        <div className="panel-title">
          <h3>▧ Countdown Management</h3>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span></span>
          </label>
        </div>

        <label>
          Target Date
          <input defaultValue="June 5, 2025" />
        </label>

        <label>
          Target Time
          <input defaultValue="12:00 AM" />
        </label>

        <div className="mini-countdown">
          <div>
            <b>23</b>
            <span>Days</span>
          </div>
          <div>
            <b>14</b>
            <span>Hours</span>
          </div>
          <div>
            <b>38</b>
            <span>Minutes</span>
          </div>
          <div>
            <b>42</b>
            <span>Seconds</span>
          </div>
        </div>
      </section>

      <section className="panel-card">
        <div className="panel-title">
          <h3>♡ Love Letter Management</h3>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span></span>
          </label>
        </div>

        <div className="letter-preview">
          <div>
            <p>My Dearest Love,</p>
            <p>
              Every day with you feels like a beautiful dream come true. Thank
              you for being my everything.
            </p>
            <b>Forever yours, ❤ Always</b>
          </div>
          <div className="envelope-preview">💌</div>
        </div>

        <div className="panel-actions">
          <button className="outline-button">👁 Preview Letter</button>
          <button className="primary-button small">Save Letter</button>
        </div>
      </section>

      <section className="panel-card final-panel">
        <div className="panel-title">
          <h3>🎁 Final Surprise Management</h3>
          <span className="ready">Ready</span>
        </div>

        <label>
          Title
          <input defaultValue="A Special Surprise Just for You" />
        </label>

        <label>
          Message
          <input defaultValue="Get ready for something magical!" />
        </label>

        <label>
          Button Text
          <input defaultValue="Reveal My Surprise" />
        </label>

        <div className="gift-preview">🎁</div>
      </section>

      <section className="panel-card settings-card">
        <div className="panel-title">
          <h3>⚙ Settings</h3>
          <span>⌄</span>
        </div>

        <label>
          Website Title
          <input defaultValue="For My Love" />
        </label>

        <button className="primary-button small">Save Changes</button>
      </section>
    </aside>
  );
}