export type StatTone = "pink" | "purple" | "blue" | "green" | "orange";

export type StatItem = {
  label: string;
  value: number | string;
  change: string;
  helper: string;
  icon: string;
  tone: StatTone;
};

export type PhotoItem = {
  id: string;
  image: string;
  title: string;
  date: string;
  favorite: boolean;
  hidden: boolean;
  selected: boolean;
  tags: string[];
  sortOrder?: number;
};