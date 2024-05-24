"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { updateMenuSchema } from "@/lib/schemas/menus";
import { api } from "@/trpc/react";
import { ChevronDown } from "lucide-react";

export default function ReservationActions({ id }: { id: number }) {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { data: menuItem, isLoading } = api.menus.getMenuById.useQuery(id);
  const utils = api.useUtils();
  const deleteMutation = api.menus.deleteMenuById.useMutation({
    onMutate: (data) => {
      setIsOpen(false);
    },
    onSuccess: () => {
      toast.toast({
        title: `Menu item removed successfully`,
        description: `Menu item removed`,
      });
      utils.menus.getMenusPaginated.invalidate();
    },
    onError: () => {
      toast.toast({
        title: "Failed to remove menu item",
        description: `Failed to remove menu item for ${form.getValues().name}`,
        variant: "destructive",
      });
    },
  });
  const mutation = api.menus.updateMenuById.useMutation({
    onMutate: (data) => {
      setIsOpen(false);
    },
    onSuccess: (data) => {
      console.log(data);
      if (!data) {
        toast.toast({
          title: "Failed to edit menu item",
          description: `Failed to edit menu item - ${form.getValues().name}`,
          variant: "destructive",
        });
        return;
      }
      toast.toast({
        title: `Menu item edited successfully`,
        description: `Menu item edited for ${data.name}`,
      });
      utils.menus.getMenusPaginated.invalidate();
    },
    onError: () => {
      toast.toast({
        title: "Failed to edited menu item",
        description: `Failed to edited menu item - ${form.getValues().name}`,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof updateMenuSchema>>({
    resolver: zodResolver(updateMenuSchema),
    values: menuItem,
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<z.infer<typeof updateMenuSchema>> = (
    values,
  ) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Actions <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem>Update</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={() => deleteMutation.mutate(id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update reservation</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                name="recommended"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel className="mt-2">Vegan</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogFooter className="gap-y-2">
                <Button type="submit">Submit</Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
