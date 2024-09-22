"use client";
import { useForm, useFieldArray } from "react-hook-form";
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
import { jobExperienceValues, UserData } from "@/typings/user";
import { jobExperienceSchema } from "@/schemas/user";
import { Textarea } from "@/components/ui/textarea";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useUser } from "@/providers/UserProvider";
import { useUpdateExperienceMutation } from "@/mutations/users";
import { toast } from "@/hooks/use-toast";
import LoadingButton from "@/components/LoadingButton";

export default function JobExperienceForm({ user }: { user: UserData }) {
  const { user: loggedInUser } = useUser();

  console.log(user.experiences, "experiences");

  const form = useForm<jobExperienceValues>({
    resolver: zodResolver(jobExperienceSchema),
    mode: "onBlur",
    defaultValues: {
      experiences: user.experiences ?? [
        { jobTitle: "", company: "", description: "", from: "", to: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "experiences",
    control: form.control,
  });

  const mutation = useUpdateExperienceMutation();

  async function onSubmit(values: jobExperienceValues) {
    if (!loggedInUser?.$id) {
      return toast({
        variant: "destructive",
        description: "Whoops! We can't tell who you are.",
      });
    }

    try {
      await mutation.mutateAsync({
        ...values,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm"
      >
        <h3 className="text-xl font-bold">Job Experience</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="mt-5 w-full">
            <div className="mt-3 mb-2 flex items-center gap-2">
              <h4 className="text-lg font-bold">Experience {index + 1}</h4>
              <button title="remove" onClick={() => remove(index)}>
                <MinusCircle color="red" size={24} />
              </button>
            </div>
            <div className="flex gap-x-3">
              <FormField
                name={`experiences.${index}.company`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`experiences.${index}.jobTitle`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-x-3 mt-3">
              <FormField
                name={`experiences.${index}.description`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Job description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-x-3 mt-3">
              <FormField
                name={`experiences.${index}.from`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Start date"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`experiences.${index}.to`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="End date"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              company: "",
              jobTitle: "",
              description: "",
              from: "",
              to: "",
            })
          }
          className="text-primary flex gap-2 items-center"
        >
          <PlusCircle size={24} />
          <span>Add Experience</span>
        </button>

        <LoadingButton
          type="submit"
          loading={mutation.isPending}
          className="w-full"
        >
          Save
        </LoadingButton>
      </form>
    </Form>
  );
}
