import type { Metadata } from "next";
import ListBusinessClient from "./ListBusinessClient";

export const metadata: Metadata = {
  title: "List Your Business",
  description: "Add your business to Pakistan's premier business directory.",
};

export default function ListBusinessPage() {
  return <ListBusinessClient />;
}
