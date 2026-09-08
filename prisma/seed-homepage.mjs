import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const DEFAULTS = [
  {
    section: "hero",
    content: {
      eyebrow: "Celebrating Pakistan",
      heading: "Pride of Pakistan",
      subtext:
        "Showcasing the best of Pakistan — its people, products, businesses, and stories — to the world.",
      image: null,
    },
  },
  {
    section: "page_whoiswho",
    content: {
      eyebrow: "Hall of Fame",
      heading: "Who Is Who",
      subtext:
        "Discover remarkable Pakistanis who have made their mark on the world.",
    },
  },
  {
    section: "page_products",
    content: {
      eyebrow: "Made in Pakistan",
      heading: "Pakistani Products",
      subtext:
        "Discover the finest products Pakistan has to offer — from agriculture to technology.",
    },
  },
  {
    section: "page_businesses",
    content: {
      eyebrow: "Business Directory",
      heading: "Pakistani Businesses",
      subtext:
        "Join Pakistan's premier business directory and connect with customers across the country and abroad.",
    },
  },
  {
    section: "page_news",
    content: {
      eyebrow: "Latest News",
      heading: "Latest News",
      subtext:
        "Stay up to date with the latest news and updates from Pride of Pakistan.",
    },
  },
  {
    section: "page_stories",
    content: {
      eyebrow: "Community",
      heading: "Your Stories",
      subtext: "Stories shared by Pakistanis from around the world.",
    },
  },
  {
    section: "page_contact",
    content: {
      eyebrow: "Get in Touch",
      heading: "Contact Us",
      subtext:
        "Whether you want to share your story, explore partnership opportunities, or learn more about the movement — we'd love to hear from you.",
    },
  },
  {
    section: "page_submitprofile",
    content: {
      eyebrow: "Join the Hall of Fame",
      heading: "Submit Your Profile",
      subtext:
        "Share your story with Pakistan. Submissions are reviewed by our team before appearing on the site.",
    },
  },
  {
    section: "page_listbusiness",
    content: {
      eyebrow: "Grow Your Reach",
      heading: "List Your Business",
      subtext:
        "Join Pakistan's premier Pakistani Businesses and connect with customers across the country and abroad.",
    },
  },
  {
    section: "page_pridetv",
    content: {
      eyebrow: "Watch",
      heading: "Pride TV",
      subtext: "Watch videos celebrating the best of Pakistan.",
    },
  },
];

for (const item of DEFAULTS) {
  await prisma.homepageContent.upsert({
    where: { section: item.section },
    update: {},
    create: item,
  });
  console.log(`Seeded: ${item.section}`);
}

await prisma.$disconnect();
console.log("Done");
