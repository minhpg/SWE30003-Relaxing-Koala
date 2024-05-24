"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Ratings } from "@/components/ui/ratings";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { feedbackSchema } from "@/lib/schemas/feedbacks";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export default function FeedbackPage() {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {},
    values: {
      email: session?.user.email || "",
      name: session?.user.name || "",
      phone: "",
      message: "",
      rating: 5,
    },
    reValidateMode: "onChange",
  });

  const mutation = api.feedbacks.createFeedback.useMutation({
    onMutate: () => {
      setIsOpen(false);
    },
    onSuccess: (data) => {
      console.log(data);
      if (!data) {
        toast.toast({
          title: "Failed to create feedback",
          description: `Failed to create feedback`,
          variant: "destructive",
        });
        return;
      }
      toast.toast({
        title: `Feedback created successfully`,
        description: `Feedback created`,
      });
      form.reset();
    },
    onError: () => {
      toast.toast({
        title: "Failed to create feedback",
        description: `Failed to create feedback`,
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof feedbackSchema>> = (values) =>
    mutation.mutate(values);

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Leave us a feedback</CardTitle>
          <CardDescription>
            We would love to hear from you. Please let us know how we can
            improve our service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="rating"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Ratings
                        rating={field.value || 5}
                        totalStars={5}
                        showText={false}
                        size={30}
                        onRatingChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="message"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button>Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
