import { NavLink } from "react-router-dom";

type NavbarProps = {
  title?: string;
};

export default function Navbar({ title }: NavbarProps) {
  return (
    <header className="navbar">
      <NavLink className="brand" to="/">
        {title || "For My Love"} ♡
      </NavLink>

      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>

        <a href="/#story">Our Story</a>
        <a href="/#memories">Memories</a>
        <a href="/#gallery">Gallery</a>

        <NavLink to="/polaroid">Polaroid</NavLink>

        <a href="/#surprise">Surprise</a>
      </nav>

      <NavLink className="heart-button polaroid-nav-button" to="/polaroid">
        📸
      </NavLink>
    </header>
  );
}