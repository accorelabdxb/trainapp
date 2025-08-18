import { Challenge, Post, Product, WorkoutStat } from "../types";

export const challenges: Challenge[] = [
  {
    id: 1,
    title: "Attendance Challenge",
    endDate: "Ends in 3 Days",
    image: require("../assets/images/challenge1.png"),
  },
  {
    id: 2,
    title: "Strength Challenge",
    endDate: "Ends in 5 Days",
    image: require("../assets/images/challenge2.png"),
  },
  {
    id: 3,
    title: "Cardio Challenge",
    endDate: "Ends in 1 Week",
    image: require("../assets/images/challenge1.png"),
  },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Protein Powder",
    description:
      "Premium whey protein supplement with 25g of protein per serving. Perfect for post-workout recovery and muscle building. Contains all essential amino acids.",
    points: 200,
    image: require("../assets/images/ad1.jpg"),
    sponsor: {
      name: "NutriFit Supplements",
      logo: require("../assets/images/logo.png"),
      address: "123 Fitness Street, Dubai Marina, UAE",
      contact: "+971 50 123 4567",
    },
  },
  {
    id: 2,
    name: "Gym Towel",
    description:
      "Premium microfiber gym towel that's super absorbent and quick-drying. Perfect size for gym sessions and workouts.",
    points: 100,
    image: require("../assets/images/ad2.png"),
    sponsor: {
      name: "FitGear Pro",
      logo: require("../assets/images/logo.png"),
      address: "456 Sports Avenue, JLT, Dubai, UAE",
      contact: "+971 50 987 6543",
    },
  },
  {
    id: 3,
    name: "Water Bottle",
    description:
      "Insulated sports water bottle that keeps drinks cold for 24 hours. BPA-free and perfect for intense workout sessions.",
    points: 150,
    image: require("../assets/images/ad3.jpg"),
    sponsor: {
      name: "HydroMax Sports",
      logo: require("../assets/images/logo.png"),
      address: "789 Health Boulevard, Business Bay, UAE",
      contact: "+971 50 456 7890",
    },
  },
];

export const posts: Post[] = [
  {
    id: 1,
    media: require("../assets/images/soc5.jpg"),
    mediaType: "image",
    user: "Nihas",
    time: "3 sec ago",
  },
  {
    id: 2,
    media: require("../assets/images/soc2.jpg"),
    mediaType: "image",
    user: "Sharath",
    time: "1 min ago",
  },
  {
    id: 3,
    media: require("../assets/images/soc3.jpg"),
    mediaType: "image",
    user: "Appu",
    time: "5 min ago",
  },
  {
    id: 4,
    media: require("../assets/videos/sample.mp4"),
    mediaType: "video",
    user: "Amal",
    time: "1 hr ago",
  },
  {
    id: 5,
    media: require("../assets/images/soc6.jpg"),
    mediaType: "image",
    user: "Pattu",
    time: "10 min ago",
  },
  {
    id: 6,
    media: require("../assets/images/soc2.jpg"),
    mediaType: "image",
    user: "Rahul",
    time: "20 min ago",
  },
  {
    id: 7,
    media: require("../assets/images/soc3.jpg"),
    mediaType: "image",
    user: "Amal",
    time: "1 hr ago",
  },
  {
    id: 8,
    media: require("../assets/videos/sample2.mp4"),
    mediaType: "video",
    user: "Amal",
    time: "1 hr ago",
  },
  {
    id: 9,
    media: require("../assets/images/soc4.jpg"),
    mediaType: "image",
    user: "Amal",
    time: "1 hr ago",
  },
];

export const workoutStats: WorkoutStat[] = [
  {
    icon: require("../assets/images/Muscle.png"),
    label: "Heights Weight lifted",
    value: "65 lbs",
    subtitle: "Bench Press",
  },
  {
    icon: require("../assets/images/clock.png"),
    label: "Longest Duration",
    value: "1hr 07mns",
    subtitle: "23 Jun 2025",
  },
  {
    icon: require("../assets/images/challenge.png"),
    label: "Challenges Won",
    value: "05",
    subtitle: "10 Participated",
  },
  {
    icon: require("../assets/images/cal.png"),
    label: "5 days streak",
    value: "02 Times",
    subtitle: "4th Rank",
  },
];

export const chartData = {
  labels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
  datasets: [
    {
      data: [0.2, 6.8, 8.2, 6.2, 9.6, 5.8, 2.2],
    },
  ],
};
