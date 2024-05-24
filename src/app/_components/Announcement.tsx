import { Separator } from "@/components/ui/separator";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Vegan } from "lucide-react";
import Link from "next/link";

export function Announcement() {
  return (
    <Link
      href="/menu"
      className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
    >
      <Vegan className="h-4 w-4" />{" "}
      <Separator className="mx-2 h-4" orientation="vertical" />{" "}
      <span>Introducing Our Vegan-friendly Menu</span>
      <ArrowRightIcon className="ml-1 h-4 w-4" />
    </Link>
  );
}
