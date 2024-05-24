"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { updateOrderSchema } from "@/lib/schemas/orders";
import { paymentSchema } from "@/lib/schemas/payments";
import { cn, formatCurrency } from "@/lib/utils";
import { paymentMethod } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { ChevronDown } from "lucide-react";

enum Dialogs {
  CreatePaymentDialog = "CreatePaymentDialog",
  UpdateOrderDialog = "UpdateOrderDialog",
}

export default function OrderActions({ id }: { id: number }) {
  const toast = useToast();
  const { data: order } = api.orders.getOrderById.useQuery(id);

  const [selectedDialog, setSelectedDialog] = useState<Dialogs | null>(null);
  const utils = api.useUtils();
  const deleteMutation = api.orders.deleteOrderById.useMutation({
    onSuccess: () => {
      toast.toast({
        title: `Order removed successfully`,
        description: `Order removed`,
      });
      utils.orders.getOrdersPaginated.invalidate();
    },
    onError: () => {
      toast.toast({
        title: "Failed to remove order",
        description: `Failed to remove order`,
        variant: "destructive",
      });
    },
  });

  const setOrderStatusMutation = api.orders.setOrderStatus.useMutation({
    onSuccess: () => {
      toast.toast({
        title: `Order status updated successfully`,
        description: `Order status updated`,
      });
      utils.orders.getOrdersPaginated.invalidate();
      utils.orders.getOrderById.invalidate();
    },
    onError: () => {
      toast.toast({
        title: "Failed to update order status",
        description: `Failed to update order status`,
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog
      open={!!selectedDialog}
      onOpenChange={(open) => {
        !open && setSelectedDialog(null);
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-auto"
            disabled={
              order?.status === "COMPLETED" || order?.status === "CANCELLED"
            }
          >
            Actions <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setSelectedDialog(Dialogs.UpdateOrderDialog)}
          >
            Update
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setSelectedDialog(Dialogs.CreatePaymentDialog)}
          >
            Create payment
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setOrderStatusMutation.mutate({ id, status: "CANCELLED" })
            }
          >
            Cancel order
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteMutation.mutate(id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedDialog === Dialogs.UpdateOrderDialog && (
        <UpdateOrderDialog id={id} setSelectedDialog={setSelectedDialog} />
      )}
      {selectedDialog === Dialogs.CreatePaymentDialog && (
        <CreatePaymentDialog id={id} setSelectedDialog={setSelectedDialog} />
      )}
    </Dialog>
  );
}

function UpdateOrderDialog({
  id,
  setSelectedDialog,
}: {
  id: number;
  setSelectedDialog: (params: Dialogs | null) => void;
}) {
  const utils = api.useUtils();
  const toast = useToast();
  const mutation = api.orders.updateOrderById.useMutation({
    onMutate: (data) => {
      setSelectedDialog(null);
    },
    onSuccess: (data) => {
      console.log(data);
      if (!data) {
        toast.toast({
          title: "Failed to edit order",
          description: `Failed to edit order`,
          variant: "destructive",
        });
        return;
      }
      toast.toast({
        title: `Order updated successfully`,
        description: `Order updated`,
      });
      utils.orders.getOrdersPaginated.invalidate();
    },
    onError: () => {
      toast.toast({
        title: "Failed to update order",
        description: `Failed to update order`,
        variant: "destructive",
      });
    },
  });
  const { data: menuItems } = api.menuItems.getAllMenuItems.useQuery();
  const { data: order } = api.orders.getOrderById.useQuery(id);

  const form = useForm<z.infer<typeof updateOrderSchema>>({
    resolver: zodResolver(updateOrderSchema),
    values: {
      id,
      tableNumber: order?.tableNumber || 0,
      items:
        order?.menuItemsToOrder.map((item) => ({
          id: item.menuItem.id,
          quantity: item.quantity,
        })) || [],
      notes: order?.notes,
    },
    reValidateMode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const onSubmit: SubmitHandler<z.infer<typeof updateOrderSchema>> = (
    values,
  ) => {
    mutation.mutate(values);
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update order</DialogTitle>
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
                          value={field.value.id.toString()}
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
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSelectedDialog(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

function CreatePaymentDialog({
  id,
  setSelectedDialog,
}: {
  id: number;
  setSelectedDialog: (params: Dialogs | null) => void;
}) {
  const utils = api.useUtils();
  const toast = useToast();
  const setOrderStatusMutation = api.orders.setOrderStatus.useMutation({});

  const mutation = api.payments.createPayment.useMutation({
    onMutate: (data) => {
      setSelectedDialog(null);
    },
    onSuccess: async (data) => {
      console.log(data);
      if (!data) {
        toast.toast({
          title: "Failed to create payment",
          description: `Failed to create payment`,
          variant: "destructive",
        });
        return;
      }
      toast.toast({
        title: `Payment created successfully`,
        description: `Payment created`,
      });
      await setOrderStatusMutation.mutateAsync({ id, status: "COMPLETED" });
      utils.orders.getOrdersPaginated.invalidate();
      utils.orders.getOrderById.invalidate();
    },
    onError: () => {
      toast.toast({
        title: "Failed to create payment",
        description: `Failed to create payment`,
        variant: "destructive",
      });
    },
  });
  const { data: order } = api.orders.getOrderById.useQuery(id);

  const amount =
    order?.menuItemsToOrder.reduce((acc, curr) => {
      return acc + curr.quantity * curr.menuItem.price;
    }, 0) || 0;

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "CASH",
      orderId: id,
    },
    reValidateMode: "onChange",
  });

  useEffect(() => {
    console.log(amount);
    form.setValue("amount", amount);
  }, [amount]);

  const onSubmit: SubmitHandler<z.infer<typeof paymentSchema>> = (values) => {
    mutation.mutate(values);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create payment</DialogTitle>
        <DialogDescription>Order #{id}</DialogDescription>
      </DialogHeader>
      <div>
        <div className="flex flex-col gap-2">
          {order?.menuItemsToOrder.map((item) => (
            <>
              <div className="flex items-center justify-between text-sm">
                <p>{item.menuItem.name}</p>
                <p>
                  {item.quantity} x {formatCurrency(item.menuItem.price)}
                </p>
              </div>
              <Separator />
            </>
          ))}
        </div>
        <p className="my-4 text-sm">
          Notes: <span className="text-muted-foreground">{order?.notes}</span>
        </p>

        <Separator />
        <div className="flex items-center justify-between py-3 text-sm">
          <p className="font-semibold">Total</p>
          <p>{formatCurrency(amount)}</p>
        </div>
      </div>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit, (message) =>
            console.log(message),
          )}
        >
          <FormField
            name="paymentMethod"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger>
                      <SelectValue></SelectValue>
                      <SelectContent>
                        {paymentMethod.map((method) => (
                          <SelectItem value={method} key={method}>
                            <span className="capitalize">
                              {method.toLowerCase()}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="invoiceName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormDescription>Optional - Invoice</FormDescription>
                <FormControl>
                  <Input
                    placeholder="Name"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="invoiceAddress"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormDescription>Optional - Invoice</FormDescription>
                <FormControl>
                  <Input
                    placeholder="Address"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="invoiceEmailAddress"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormDescription>Optional - Invoice</FormDescription>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="gap-y-2">
            <Button type="submit">Submit</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSelectedDialog(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
