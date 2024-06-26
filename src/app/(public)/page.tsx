import { buttonVariants } from "@/components/ui/button";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import { Announcement } from "../_components/Announcement";
import { MenuBentoGrid } from "../_components/MenuBentoGrid";
import { Testimonials } from "../_components/Testimonials";

export default async function Home() {
  const session = await getServerAuthSession();
  console.log(session);
  return (
    <div>
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>Relaxing Koala Cafe & Restaurant</PageHeaderHeading>
        <PageHeaderDescription>
          For lovers of great coffee, food & wine & prides itself on friendly &
          helpful service. We want you to leave feeling you have been genuinely
          looked after.
        </PageHeaderDescription>
        <PageActions>
          <Link
            href={session ? "/reservations" : "/sign-in"}
            className={cn(buttonVariants())}
          >
            Book now
          </Link>
          <Link
            target="_blank"
            rel="noreferrer"
            href={"/menu"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            View our menu
          </Link>
        </PageActions>
      </PageHeader>
      <div className="space-y-24">
        <Testimonials />
        <MenuBentoGrid />
      </div>
    </div>
  );
}
