import FlowersPage from "./ui/FlowerAnimation";

type FlowerIntroProps = {
  onEnter: () => void;
};

export default function FlowerIntro({ onEnter }: FlowerIntroProps) {
  return (
    <div className="flower-intro-page">
      <FlowersPage
        flowerColor="#ff6fae"
        nightColor="#ffe1ec"
        scale={0.8}
      />

      <div className="flower-intro-overlay">
        <p className="flower-intro-eyebrow">For my love</p>

        <h1>Welcome to our little universe</h1>

        <p className="flower-intro-message">
          A tiny garden of memories is waiting for you.
        </p>

        <button
          type="button"
          className="flower-intro-button"
          onClick={onEnter}
        >
          Enter Website 💗
        </button>
      </div>
    </div>
  );
}