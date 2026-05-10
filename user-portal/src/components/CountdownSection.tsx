import type { CountdownValue } from "../types/site";
import { padTime } from "../utils/date";

type CountdownSectionProps = {
  title?: string;
  countdown: CountdownValue;
};

export default function CountdownSection({
  title,
  countdown,
}: CountdownSectionProps) {
  return (
    <section className="countdown">
      <h2>{title || "Something special is coming in ♡"}</h2>

      <div className="timer-card">
        <div className="time-box">
          <strong>{padTime(countdown.days)}</strong>
          <span>Days</span>
        </div>
        <b>:</b>
        <div className="time-box">
          <strong>{padTime(countdown.hours)}</strong>
          <span>Hours</span>
        </div>
        <b>:</b>
        <div className="time-box">
          <strong>{padTime(countdown.minutes)}</strong>
          <span>Minutes</span>
        </div>
        <b>:</b>
        <div className="time-box">
          <strong>{padTime(countdown.seconds)}</strong>
          <span>Seconds</span>
        </div>
      </div>
    </section>
  );
}