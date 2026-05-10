import type { PublicFullSiteResponse } from "../services/publicSiteService";

type HeroSectionProps = {
  site: PublicFullSiteResponse["site"];
  hero: PublicFullSiteResponse["hero"];
};

export default function HeroSection({ site, hero }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="hero"
      style={
        hero?.imageUrl
          ? {
              backgroundImage: `linear-gradient(rgba(255, 245, 250, 0.58), rgba(255, 238, 245, 0.68)), url(${hero.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="hero-content">
        <span className="eyebrow">
          {site?.subtitle || "A little surprise made just for you"}
        </span>

        <h1>{hero?.headline || "I have something special for you ♡"}</h1>

        <p>
          {hero?.subtitle ||
            "A soft, sweet, and tiny corner of the internet made with love."}
        </p>

        <a href={hero?.ctaUrl || "#surprise"} className="primary-button">
          {hero?.ctaText || "Open Your Surprise ♡"}
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
  );
}