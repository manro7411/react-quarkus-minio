type NavbarProps = {
  title?: string;
};

export default function Navbar({ title }: NavbarProps) {
  return (
    <header className="navbar">
      <a className="brand" href="#home">
        {title || "For My Love"} ♡
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

      <button className="heart-button" type="button">
        ♡
      </button>
    </header>
  );
}