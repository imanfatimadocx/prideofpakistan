import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const CATEGORIES = [
  "Property",
  "Importers and Exporters",
  "Hospitality",
  "Furniture & Furnishings",
  "Cash & Carries and Wholesale",
  "Accountants",
  "IT / Computing",
  "Electrical Goods",
  "Travel and Tourism",
  "Jobs",
  "Hajj & Umrah Operators",
  "Photography & Videography",
  "Restaurants / Take Aways",
  "Charities",
  "Driving Schools",
  "Education",
  "Hospitals",
];

for (const name of CATEGORIES) {
  await prisma.businessCategory.upsert({
    where: { id: CATEGORIES.indexOf(name) + 1 },
    update: {},
    create: { name, status: 1 },
  });
  console.log(`Created: ${name}`);
}

await prisma.$disconnect();
console.log("Done");
