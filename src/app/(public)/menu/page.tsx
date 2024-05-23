import { Separator } from "@/components/ui/separator";

export default function MenuPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Our menus</h2>
          <p className="text-muted-foreground">View our menus for 2024</p>
        </div>
      </div>
      <Separator />
      <h2 className="text-2xl font-bold tracking-tight">Breakfast</h2>
      <Separator />
    </>
  );
}
