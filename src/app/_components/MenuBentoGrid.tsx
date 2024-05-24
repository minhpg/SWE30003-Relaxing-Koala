import { BentoGrid, BentoGridItem } from "@/components/acernity/bento-grid";
import Image from "next/image";

export function MenuBentoGrid() {
  return (
    <BentoGrid>
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          //   icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton = () => (
  <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"></div>
);
const items = [
  {
    title: "Culinary Innovations",
    description:
      "Explore groundbreaking ideas in cuisine that blend traditional flavors with modern twists.",
    header: (
      <Image
        className="h-[18rem] rounded-xl object-cover"
        src="/images/tomas-jasovsky-d5SZqLkpIrY-unsplash.jpg"
        width={1000}
        height={1000}
        alt=""
      />
    ),
  },
  {
    title: "Digital Gastronomy",
    description:
      "Dive into how technology enhances our dining experience, from farm to table.",
    header: (
      <Image
        className="h-[18rem] rounded-xl object-cover"
        src="/images/keghan-crossland-ZZxmc66SjfM-unsplash.jpg"
        width={1000}
        height={1000}
        alt=""
      />
    ),
  },
  {
    title: "The Art of Plating",
    description:
      "Discover the beauty of thoughtful and functional culinary design in each dish served.",
    header: (
      <Image
        className="h-[18rem] rounded-xl object-cover"
        src="/images/sincerely-media-VNsdEl1gORk-unsplash.jpg"
        width={1000}
        height={1000}
        alt=""
      />
    ),
  },
  {
    title: "Conversations at the Cafe",
    description:
      "Understand the impact of effective communication over a cup of coffee in our lives.",
    header: (
      <Image
        className="h-[18rem] rounded-xl object-cover"
        src="/images/rr-abrot-pNIgH0y3upM-unsplash.jpg"
        width={1000}
        height={1000}
        alt=""
      />
    ),
  },
  {
    title: "A Taste of Knowledge",
    description:
      "Join the quest for culinary understanding and enlightenment through diverse flavors.",
    header: (
      <Image
        className="h-[18rem] rounded-xl object-cover"
        src="/images/mihai-moisa-Djtc1T38-GY-unsplash.jpg"
        width={1000}
        height={1000}
        alt=""
      />
    ),
  },
  {
    title: "The Joy of Culinary Creations",
    description:
      "Experience the thrill of creating and tasting innovative dishes at our cafe.",
    header: (
      <Image
        className="h-[18rem] rounded-xl object-cover"
        src="/images/breakslow-E6RTpqvOasU-unsplash.jpg"
        width={1000}
        height={1000}
        alt=""
      />
    ),
  },
  {
    title: "Adventures in Flavor",
    description:
      "Embark on exciting journeys and thrilling discoveries in every meal.",
    header: (
      <Image
        className="h-[18rem] rounded-xl object-cover"
        src="/images/nathan-dumlao-6VhPY27jdps-unsplash.jpg"
        width={1000}
        height={1000}
        alt=""
      />
    ),
  },
];
