import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const CATEGORIES = [
  { id: 1, name: "Food & Agriculture" },
  { id: 2, name: "Textiles & Clothing" },
  { id: 3, name: "Handicrafts" },
  { id: 4, name: "Sports Goods" },
  { id: 5, name: "Leather Goods" },
  { id: 6, name: "Jewellery & Gems" },
  { id: 7, name: "Surgical Instruments" },
  { id: 8, name: "Ceramics & Pottery" },
  { id: 9, name: "Rugs & Carpets" },
  { id: 10, name: "Technology" },
  { id: 11, name: "Cotton" },
  { id: 12, name: "Electric Fans" },
  { id: 13, name: "Sports Goods" },
  { id: 14, name: "Textile" },
];

for (const cat of CATEGORIES) {
  await prisma.productCategory.upsert({
    where: { id: cat.id },
    update: {},
    create: { id: cat.id, name: cat.name, status: 1 },
  });
  console.log(`Created: ${cat.name}`);
}

await prisma.$disconnect();
console.log("Done");
