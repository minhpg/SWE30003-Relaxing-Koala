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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { menuSchema } from "@/lib/schemas/menus";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export default function NewMenuItemDialog() {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof menuSchema>>({
    resolver: zodResolver(menuSchema),
    reValidateMode: "onChange",
  });

  const utils = api.useUtils();

  const mutation = api.menus.createMenu.useMutation({
    onMutate: () => {
      setIsOpen(false);
    },
    onSuccess: (data) => {
      if (!data) {
        toast.toast({
          title: "Failed to create menu",
          description: `Failed to create menu`,
          variant: "destructive",
        });
        return;
      }
      toast.toast({
        title: `Menu created successfully`,
        description: `Menu created`,
      });
      utils.menus.getMenusPaginated.invalidate();
      form.reset();
    },
    onError: () => {
      toast.toast({
        title: "Failed to create menu",
        description: `Failed to create menu`,
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof menuSchema>> = (values) =>
    mutation.mutate(values);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>New menu</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new menu</DialogTitle>
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
                    <FormLabel className="mt-2">Recommended</FormLabel>
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
