import { ImageSourcePropType } from "react-native";

export interface Challenge {
  id: number;
  title: string;
  endDate: string;
  image: ImageSourcePropType;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  points: number;
  image: ImageSourcePropType;
  sponsor: Sponsor;
}

export interface Sponsor {
  name: string;
  logo: ImageSourcePropType;
  address: string;
  contact: string;
}

export interface Post {
  id: number;
  media: ImageSourcePropType;
  mediaType: "image" | "video";
  user: string;
  time: string;
}

export interface WorkoutStat {
  icon: ImageSourcePropType;
  label: string;
  value: string;
  subtitle: string;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  avatar: ImageSourcePropType;
  rank: number;
  points: number;
}
