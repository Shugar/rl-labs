export type MemberReview = {
  id: string;
  name: string;
  initials: string;
  source: "Whop" | "Discord";
  quote: string;
  result: string;
  avatar?: string;
};

export const memberReviews: MemberReview[] = [
  {
    id: "buxter",
    name: "Buxter",
    initials: "BU",
    source: "Whop",
    quote: "RL Labs is by far one of the most beneficial Rocket League communities I've been a part of, for both RL connections and real-life connections. Getting to play with and against players significantly better than myself has led to insane improvement, on top of getting coaching from the goat himself, Kinseh. When I first joined, I was barely a 1500 player, and as of last week I entered GC3 thanks to the help I've gotten from this insane community of great players and people.",
    result: "1500 → GC3",
    avatar: "/proof/avatars/buxter.png",
  },
  {
    id: "sanju",
    name: "Sanju",
    initials: "SC",
    source: "Whop",
    quote: "I've been in this server for over a year now, and I cannot express how cool and motivated the majority of the RL Labs community is. Through several coaching sessions with Kinseh, special guests, and other members, we were able to get hands-on experience with the best of the best, allowing me to gain 300+ MMR since joining. Kinseh is super consistent and never fails to go out of his way to help those looking to improve. The VODs and community notes have also given me consistent value even when I couldn't make the daily sessions. This guy is locked in, and the system he has is really good.",
    result: "+300 MMR",
    avatar: "/proof/avatars/sanju.png",
  },
  {
    id: "sojh",
    name: "sojh",
    initials: "SJ",
    source: "Whop",
    quote: "Kinseh is pioneering the coaching scene through RL Labs, fostering a community of players all pushing each other to be the best versions of themselves. I've seen countless people improve well past what they thought was possible thanks to Kinseh's easy-to-follow lessons and easygoing gameplay conversations. Within just a week or two of joining Premium, I was able to finally push into SSL after being in GC3 for multiple years and feeling stuck. RL Labs is by far the best way to invest in yourself if you want to improve in Rocket League.",
    result: "GC3 → SSL",
    avatar: "/proof/avatars/sojh.gif",
  },
  {
    id: "fahided",
    name: "fahided",
    initials: "FA",
    source: "Whop",
    quote: "I have never paid for something like this in the years I have been playing RL, and boy was it worth it! I went from struggling to be consistent with my mechanics and being hardstuck in low GC2 to now being able to keep up with some low SSLs in six-mans. You should try this out, and the bonus is that you make friends along the way.",
    result: "GC2 → SSL lobbies",
    avatar: "/proof/avatars/fahided.png",
  },
  {
    id: "likewisse",
    name: "LikeWisse",
    initials: "LW",
    source: "Whop",
    quote: "The first coaching I've ever actually gone out for took me from a straight hardstuck high 1700 to hitting 1900 easily after about three months. The push to 2K has never been closer.",
    result: "1700 → 1900",
    avatar: "/proof/avatars/likewisse.png",
  },
  {
    id: "othniel",
    name: "Othniel Agbayor",
    initials: "OA",
    source: "Whop",
    quote: "Best investment I've made. I've been here since day one—1435 to 1745. All-around great community; love the guys in here.",
    result: "1435 → 1745",
  },
  {
    id: "nath-fan",
    name: "No. 1 Nath Fan",
    initials: "NF",
    source: "Discord",
    quote: "Went from stuck in 1630, low–mid GC2, to SSL in one season. The RL Labs method stays king again.",
    result: "1630 / GC2 → SSL · 1 season",
  },
  {
    id: "moons",
    name: "moons",
    initials: "MO",
    source: "Discord",
    quote: "One month from 1350 to 1500.",
    result: "1350 → 1500 / GC1 · 1 month",
  },
  {
    id: "arthurdxsf",
    name: "arthurdxsf",
    initials: "AR",
    source: "Discord",
    quote: "My old account peaked at C1 in 1s, and I was hardstuck D2–D3 for so long. Three days after signing up for RL Labs Premium, watching previous lessons, and using Kinseh's training packs, I queued 1s on a new account and was beating C2s easily. I'm currently C2 Div 3 and honestly think I can peak higher. The Nwpo vs. Azapatos lesson really helped, so thank you so much.",
    result: "Peak C1 in 1s → C2 Div 3 · 3 days",
  },
];
