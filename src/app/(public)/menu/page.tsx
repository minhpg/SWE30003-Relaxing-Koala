import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/trpc/server";

export default async function MenuPage() {
  const menus = await api.menus.getLandingMenu();
  console.log(menus);
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Our menus</h1>
          <p className="text-muted-foreground">View our menus for 2024</p>
        </div>
      </div>
      <Separator />
      {menus.map((menu) => {
        return (
          <Card key={menu.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {menu.name} {menu.recommended && <Badge>Featured</Badge>}
              </CardTitle>
              <CardDescription>{menu.description}</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
              <div className="mt-5 flex w-full flex-col gap-5">
                {menu.menuItemsToMenu.map((menuItem) => {
                  return (
                    <div
                      key={menuItem.menuItem.id}
                      className="flex w-full items-center justify-between gap-2"
                    >
                      <div>
                        {" "}
                        <div className="text-md flex gap-3">
                          {menuItem.menuItem.name}
                          <div className="flex gap-2">
                            {menuItem.menuItem.vegan && <Badge>Vegan</Badge>}
                            {menuItem.menuItem.seafood && (
                              <Badge>Seafood</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-muted-foreground">
                          {menuItem.menuItem.description}
                        </div>
                      </div>
                      <div>{formatCurrency(menuItem.menuItem.price)}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
