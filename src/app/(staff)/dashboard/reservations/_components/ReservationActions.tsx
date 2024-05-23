"use client";

import { Button } from "@/components/ui/button";
import { TimePickerDemo } from "@/components/ui/date-time-picker";
import { add, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { editReservationSchema } from "@/lib/schemas/reservations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ReservationActions({ id }: { id: number }) {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { data: reservation, isLoading } =
    api.reservations.getReservationById.useQuery(id);
  const utils = api.useUtils();
  const deleteMutation = api.reservations.deleteReservationById.useMutation({
    onMutate: (data) => {
      setIsOpen(false);
    },
    onSuccess: () => {
      toast.toast({
        title: `Reservation removed successfully`,
        description: `Reservation removed for ${reservation?.name}`,
      });
      utils.reservations.getReservationsPaginated.invalidate();
    },
    onError: () => {
      toast.toast({
        title: "Failed to edited reservation",
        description: `Failed to edited reservation for ${form.getValues().name}`,
        variant: "destructive",
      });
    },
  });
  const mutation = api.reservations.editReservation.useMutation({
    onMutate: (data) => {
      setIsOpen(false);
    },
    onSuccess: (data) => {
      console.log(data);
      if (!data) {
        toast.toast({
          title: "Failed to edit reservation",
          description: `Failed to edit reservation for ${form.getValues().name}`,
          variant: "destructive",
        });
        return;
      }
      toast.toast({
        title: `Reservation edited successfully`,
        description: `Reservation edited for ${data.name} at ${format(data.time, "PPP HH:mm:ss")}`,
      });
      utils.reservations.getReservationsPaginated.invalidate();
    },
    onError: () => {
      toast.toast({
        title: "Failed to edited reservation",
        description: `Failed to edited reservation for ${form.getValues().name}`,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof editReservationSchema>>({
    resolver: zodResolver(editReservationSchema),
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (reservation) {
      form.setValue("name", reservation.name);
      form.setValue("email", reservation.email);
      form.setValue("phone", reservation.phone);
      form.setValue("time", reservation.time);
      form.setValue("noOfGuests", reservation.noOfGuests);
      form.setValue("message", reservation.message);
    }
  }, [reservation]);

  const onSubmit: SubmitHandler<z.infer<typeof editReservationSchema>> = (
    values,
  ) => {
    console.log(values);
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

        {!reservation && !isLoading && <div>Reservation not found</div>}

        {!reservation && isLoading && <div>Loading...</div>}

        {reservation && (
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
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="time"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP HH:mm:ss")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            fromDate={add(new Date(Date.now()), {
                              days: 1,
                            })}
                            toDate={add(new Date(Date.now()), {
                              days: 8,
                            })}
                            mode="single"
                            showOutsideDays={false}
                            selected={field.value}
                            onSelect={(d) => field.onChange(d)}
                            initialFocus
                          />
                          <div className="border-t border-border p-3">
                            <TimePickerDemo
                              setDate={field.onChange}
                              date={field.value}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="noOfGuests"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of guests</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="No. of guests"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="message"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
        )}
      </DialogContent>
    </Dialog>
  );
}
