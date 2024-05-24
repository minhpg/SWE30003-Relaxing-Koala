"use client";

import { InfiniteMovingCards } from "@/components/acernity/infinite-moving-cards";

export function Testimonials() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-md bg-background antialiased">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Walking into Relaxing Koala Cafe is like stepping into a tranquil oasis. The serene music and the scent of fresh coffee are the perfect escape from the city's hustle.",
    name: "David Kim",
    title: "Musician",
  },
  {
    quote:
      "The vegan options at Relaxing Koala are incredible! They’ve really outdone themselves with creative, delicious meals that cater to all diets.",
    name: "Lisa Marie",
    title: "Vegan Lifestyle Blogger",
  },
  {
    quote:
      "It's not just the food that brings me back to Relaxing Koala, but the sense of community. It's a place where everyone knows your name and treats you like family.",
    name: "Robert Johnson",
    title: "Community Organizer",
  },
  {
    quote:
      "I had the best latte of my life at Relaxing Koala! Their barista is a true artist.",
    name: "Sophia Park",
    title: "Coffee Enthusiast",
  },
  {
    quote:
      "Relaxing Koala's outdoor seating area is my favorite spot. It's perfect for reading a book or just enjoying the weather, surrounded by beautiful greenery.",
    name: "James Franco",
    title: "Novelist",
  },
  {
    quote:
      "The staff at Relaxing Koala always make sure my dietary restrictions are accommodated with a smile. It’s refreshing to dine where your needs are taken seriously.",
    name: "Emily Watson",
    title: "Nutritionist",
  },
  {
    quote:
      "Their seasonal menu keeps me coming back! The ingredients are always fresh, and the dishes are bursting with flavor.",
    name: "Marco Gonzalez",
    title: "Chef",
  },
  {
    quote:
      "Every time I visit Relaxing Koala, I try a new pastry, and I'm never disappointed. They have the best sweets in town!",
    name: "Anna Brown",
    title: "Pastry Chef",
  },
  {
    quote:
      "Relaxing Koala Cafe is the perfect place for a first date—cozy and intimate, with food that impresses.",
    name: "Oliver Stone",
    title: "Relationship Coach",
  },
  {
    quote:
      "As a freelancer, finding a comfortable place to work is key, and Relaxing Koala is just that. Great Wi-Fi, great coffee, great vibes.",
    name: "Sarah Morton",
    title: "Freelance Graphic Designer",
  },
  {
    quote:
      "The tea selection is exquisite! Each blend has its own unique story that the knowledgeable staff is always eager to share.",
    name: "Grace Choi",
    title: "Tea Connoisseur",
  },
  {
    quote:
      "I held a small workshop at Relaxing Koala, and the accommodating space coupled with attentive service made it a seamless experience.",
    name: "Henry Tate",
    title: "Corporate Trainer",
  },
];
