"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EducationValues, UserData } from "@/typings/user";
import { EducationSchema } from "@/schemas/user";
import { Textarea } from "@/components/ui/textarea";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useUpdateEducationMutation } from "@/mutations/users";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/providers/UserProvider";
import LoadingButton from "@/components/LoadingButton";

export default function EducationForm({ user }: { user: UserData }) {
  const { user: loggedInUser } = useUser();

  const form = useForm<EducationValues>({
    resolver: zodResolver(EducationSchema),
    mode: "onBlur",
    defaultValues: {
      education: user.education ?? [
        { degree: "", institution: "", description: "", from: "", to: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "education",
    control: form.control,
  });

  const mutation = useUpdateEducationMutation();

  async function onSubmit(values: EducationValues) {
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
        <h3 className="text-xl font-bold">Education</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="mt-5 w-full">
            <div className="mt-3 mb-2 flex items-center gap-2">
              <h4 className="text-lg font-bold">Education {index + 1}</h4>
              <button title="remove" onClick={() => remove(index)}>
                <MinusCircle color="red" size={24} />
              </button>
            </div>
            <div className="flex gap-x-3">
              <FormField
                name={`education.${index}.degree`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="degree" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`education.${index}.institution`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="institution" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-x-3 mt-3">
              <FormField
                name={`education.${index}.description`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Description</FormLabel>
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
                name={`education.${index}.from`}
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
                name={`education.${index}.to`}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input
                        max={new Date().toISOString()}
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
              degree: "",
              institution: "",
              description: "",
              from: "",
              to: "",
            })
          }
          className="text-primary flex gap-2 items-center"
        >
          <PlusCircle size={24} />
          <span>Add Education</span>
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
