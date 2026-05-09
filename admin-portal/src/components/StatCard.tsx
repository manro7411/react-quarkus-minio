import type { StatItem } from "../types/admin";

type Props = {
  stat: StatItem;
};

export default function StatCard({ stat }: Props) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${stat.tone}`}>{stat.icon}</div>
      <div>
        <p>{stat.label}</p>
        <h3>{stat.value}</h3>
        <span>{stat.helper}</span>
      </div>
    </article>
  );
}