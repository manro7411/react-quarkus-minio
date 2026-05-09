export type PhotoItem = {
  id: number;
  title: string;
  date: string;
  image: string;
  favorite: boolean;
  hidden: boolean;
  selected: boolean;
  tags: string[];
};

export type StatItem = {
  label: string;
  value: string;
  helper: string;
  icon: string;
  tone: "pink" | "purple" | "orange" | "green" | "yellow";
};