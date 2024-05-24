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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createOrderSchema } from "@/lib/schemas/orders";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

export default function NewOrderDialog() {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof createOrderSchema>>({
    resolver: zodResolver(createOrderSchema),
    reValidateMode: "onChange",
  });

  const { data: menuItems } = api.menuItems.getAllMenuItems.useQuery();

  const utils = api.useUtils();

  const mutation = api.orders.createOrder.useMutation({
    onMutate: () => {
      setIsOpen(false);
    },
    onSuccess: (data) => {
      if (!data) {
        toast.toast({
          title: "Failed to create order",
          description: `Failed to create order`,
          variant: "destructive",
        });
        return;
      }
      toast.toast({
        title: `Order created successfully`,
        description: `Order created`,
      });
      utils.orders.getOrdersPaginated.invalidate();
      form.reset();
    },
    onError: () => {
      toast.toast({
        title: "Failed to create order",
        description: `Failed to create order`,
        variant: "destructive",
      });
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const onSubmit: SubmitHandler<z.infer<typeof createOrderSchema>> = (
    values,
  ) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>New Order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new order</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit, (message) =>
              console.log(message),
            )}
          >
            <FormField
              name="tableNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table</FormLabel>
                  <FormControl>
                    <Input placeholder="Table" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  name={`items.${index}`}
                  key={field.id}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Items
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(value) =>
                              field.onChange({
                                id: parseInt(value),
                                quantity: field.value.quantity,
                              })
                            }
                            value={field.value?.id?.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {menuItems?.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.id.toString()}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            onChange={(e) =>
                              field.onChange({
                                id: field.value.id,
                                quantity: parseInt(e.target.value),
                              })
                            }
                            type="number"
                            value={field.value.quantity}
                          />
                          <Button
                            onClick={() => remove(index)}
                            variant={"destructive"}
                          >
                            <Cross1Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ id: 1, quantity: 1 })}
              >
                Add Item
              </Button>
            </div>
            <FormField
              name="notes"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-y-2">
              <Button type="submit">Submit</Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
