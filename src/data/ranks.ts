export type Rank = {
  name: string;
  short: string;
  image: string;
  tone: string;
};

export const ranks: Rank[] = [
  { name: "Bronze", short: "BR", image: "/ranks/bronze.webp", tone: "bronze" },
  { name: "Silver", short: "SI", image: "/ranks/silver.webp", tone: "silver" },
  { name: "Gold", short: "GO", image: "/ranks/gold.webp", tone: "gold" },
  { name: "Platinum", short: "PL", image: "/ranks/platinum.webp", tone: "platinum" },
  { name: "Diamond", short: "DI", image: "/ranks/diamond.webp", tone: "diamond" },
  { name: "Champion", short: "CH", image: "/ranks/champion.webp", tone: "champion" },
  {
    name: "Grand Champion",
    short: "GC",
    image: "/ranks/grand-champion.webp",
    tone: "grand-champion",
  },
  {
    name: "Supersonic Legend",
    short: "SSL",
    image: "/ranks/ssl.webp",
    tone: "ssl",
  },
];
