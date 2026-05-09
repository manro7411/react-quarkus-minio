import type { PhotoItem, StatItem } from "../types/admin";

export const stats: StatItem[] = [
  {
    label: "Total Memories",
    value: "24",
    helper: "+4 this week",
    icon: "💗",
    tone: "pink",
  },
  {
    label: "Total Photos",
    value: "128",
    helper: "+12 this week",
    icon: "🖼️",
    tone: "purple",
  },
  {
    label: "Countdown Status",
    value: "Active",
    helper: "23 days left",
    icon: "🕒",
    tone: "orange",
  },
  {
    label: "Final Surprise Status",
    value: "Ready",
    helper: "All set to go",
    icon: "🎁",
    tone: "green",
  },
  {
    label: "Last Updated",
    value: "May 12, 2025",
    helper: "2:30 PM",
    icon: "✉️",
    tone: "yellow",
  },
];

export const photos: PhotoItem[] = [
  {
    id: 1,
    title: "Sunset by the beach",
    date: "May 10, 2025",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80",
    favorite: true,
    hidden: false,
    selected: true,
    tags: ["sunset", "beach", "love"],
  },
  {
    id: 2,
    title: "Sparkling moments ✨",
    date: "May 9, 2025",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80",
    favorite: false,
    hidden: false,
    selected: false,
    tags: ["night", "sparkle"],
  },
  {
    id: 3,
    title: "Picnic in the park",
    date: "May 8, 2025",
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
    favorite: true,
    hidden: false,
    selected: true,
    tags: ["picnic", "park"],
  },
  {
    id: 4,
    title: "You & me forever 💕",
    date: "May 7, 2025",
    image:
      "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=600&q=80",
    favorite: false,
    hidden: false,
    selected: false,
    tags: ["couple", "love"],
  },
  {
    id: 5,
    title: "Lakeside sunset",
    date: "May 6, 2025",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    favorite: true,
    hidden: false,
    selected: true,
    tags: ["lake", "sunset"],
  },
];