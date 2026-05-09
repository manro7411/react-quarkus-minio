import "./App.css";

const memories = [
  {
    title: "First Date",
    date: "May 14, 2022",
    text: "The day our story began, nervous smiles and endless conversations.",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Favorite Moment",
    date: "Aug 20, 2022",
    text: "That magical moment when everything felt perfect.",
    image:
      "https://images.unsplash.com/photo-1519669417670-68775a50919c?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Best Trip",
    date: "Jul 10, 2023",
    text: "Adventures together, memories that last forever.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  },
];

const polaroids = [
  {
    title: "Sunset Dates",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Lazy Mornings",
    image:
      "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Sparkle Nights",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Mountain Views",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=500&q=80",
  },
];

function App() {
  return (
    <div className="page">
      <header className="navbar">
        <a className="brand" href="#home">
          For My Love ♡
        </a>

        <nav className="nav-links">
          <a className="active" href="#home">
            Home
          </a>
          <a href="#story">Our Story</a>
          <a href="#memories">Memories</a>
          <a href="#gallery">Gallery</a>
          <a href="#surprise">Surprise</a>
        </nav>

        <button className="heart-button">♡</button>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <span className="eyebrow">A little surprise made just for you</span>
            <h1>
              I have something <br />
              special for you ♡
            </h1>
            <p>
              A soft, sweet, and tiny corner of the internet made with love.
            </p>

            <a href="#surprise" className="primary-button">
              Open Your Surprise ♡
            </a>
          </div>

          <div className="hero-art">
            <div className="gift-box">
              <div className="gift-lid"></div>
              <div className="gift-body"></div>
              <div className="gift-ribbon-x"></div>
              <div className="gift-ribbon-y"></div>
              <div className="gift-bow left"></div>
              <div className="gift-bow right"></div>
            </div>
            <div className="big-heart">♥</div>
          </div>

          <div className="scroll-cue">⌄</div>
        </section>

        <section className="countdown">
          <h2>Something special is coming in ♡</h2>

          <div className="timer-card">
            <div className="time-box">
              <strong>12</strong>
              <span>Days</span>
            </div>
            <b>:</b>
            <div className="time-box">
              <strong>08</strong>
              <span>Hours</span>
            </div>
            <b>:</b>
            <div className="time-box">
              <strong>34</strong>
              <span>Minutes</span>
            </div>
            <b>:</b>
            <div className="time-box">
              <strong>56</strong>
              <span>Seconds</span>
            </div>
          </div>
        </section>

        <section id="memories" className="memories-section">
          <h2>♡ Our Beautiful Memories ♡</h2>

          <div className="memory-grid">
            {memories.map((memory) => (
              <article className="memory-card" key={memory.title}>
                <div className="heart-badge">♥</div>
                <img src={memory.image} alt={memory.title} />
                <div className="memory-body">
                  <h3>{memory.title}</h3>
                  <p>{memory.text}</p>
                  <span>▣ {memory.date}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="story" className="letter-section">
          <div className="envelope">
            <div className="envelope-flap"></div>
            <div className="envelope-heart">♥</div>
          </div>

          <div className="letter-card">
            <h2>A Letter For You ♡</h2>
            <p className="script">My Dearest Love,</p>
            <p>
              From the moment we met, my world became brighter. You are my
              today and all of my tomorrows. Thank you for being you, for
              loving me, for us.
            </p>
            <p className="signature">Forever yours, ♡</p>
            <button className="primary-button small">Read My Letter ✉</button>
          </div>
        </section>

        <section id="gallery" className="gallery-section">
          <h2>♡ Moments We’ll Never Forget ♡</h2>

          <div className="polaroid-row">
            {polaroids.map((item, index) => (
              <div
                className={`polaroid rotate-${index + 1}`}
                key={item.title}
              >
                <img src={item.image} alt={item.title} />
                <span>{item.title} ♡</span>
              </div>
            ))}
          </div>
        </section>

        <section id="surprise" className="final-section">
          <div>
            <h2>Are you ready for your final surprise?</h2>
            <p>The best is yet to come...</p>
            <button className="primary-button">Reveal Final Surprise 🎁</button>
          </div>

          <div className="mini-gift">
            <div className="mini-gift-box"></div>
            <div className="mini-gift-lid"></div>
            <div className="mini-ribbon-x"></div>
            <div className="mini-ribbon-y"></div>
          </div>
        </section>
      </main>

      <footer>
        <p>Made with ♥ just for you</p>
        <small>© 2026 For My Love. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default App;