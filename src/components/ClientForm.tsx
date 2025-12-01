import React from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const states = [
  "New South Wales",
  "Victoria",
  "Queensland",
  "South Australia",
  "Western Australia",
  "Tasmania",
  "Northern Territory",
  "Australian Capital Territory",
];

const stateMap: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "Northern Territory",
  ACT: "Australian Capital Territory",
};

function normalizeState(value?: string) {
  if (!value) return value;
  const up = value.toUpperCase();
  if (stateMap[up]) return stateMap[up];
  const found = states.find((s) => s.toLowerCase() === value.toLowerCase());
  if (found) return found;
  return value;
}

const clientFormSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .min(6, "Phone must be at least 6 characters")
    .max(20, "Phone too long"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional().or(z.literal("")),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(3, "Postcode is required"),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

const defaultValues: ClientFormValues = {
  clientName: "",
  contactPerson: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postcode: "",
};

import { createClient, updateClient } from "@/services/ClientsService";
import type { Client } from "@/services/ClientsService";

interface ClientFormProps {
  onCancel?: () => void;
  type?: "add" | "edit";
  clientId?: string | number;
  initialValues?: Partial<ClientFormValues>;
}

const ClientForm: React.FC<ClientFormProps> = ({ onCancel, type = "add", clientId, initialValues }) => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: defaultValues,
  });

  const { reset } = form;

  // Populate fields if editing and initialValues are provided
  React.useEffect(() => {
    if (type === "edit" && initialValues) {
      console.log("ClientForm: initialValues received:", initialValues);
      // Support both shapes: { address1, address2 } and { addressLine1, addressLine2 }
      const iv = initialValues as Partial<ClientFormValues> & {
        address1?: string;
        address2?: string;
        state?: string;
      };

      const mapped: Partial<ClientFormValues> = {
        ...defaultValues,
        ...initialValues,
        addressLine1: iv.addressLine1 ?? iv.address1 ?? defaultValues.addressLine1,
        addressLine2: iv.addressLine2 ?? iv.address2 ?? defaultValues.addressLine2,
        state: normalizeState(iv.state ?? (initialValues as any).stateName),
      };

      console.log("ClientForm: mapped values:", mapped);
      reset(mapped as ClientFormValues);
    }
  }, [type, initialValues, reset]);

  async function onSubmit(values: ClientFormValues) {
    try {
      // Ensure optional fields match the API shape (address2 should be string)
      const payload: Client = {
        ...values,
        addressLine2: values.addressLine2 ?? "",
      } as unknown as Client;

      if (type === "edit" && clientId) {
        await updateClient(payload);
      } else {
        await createClient(payload);
      }
      form.reset();
      if (onCancel) onCancel();
    } catch (err) {
      // TODO: handle error (show toast, etc)
       console.error(err);
    }
  }

  function handleCancel() {
    form.reset();
    if (onCancel) onCancel();
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Row 1: Client Name & Contact Person */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact person" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Row 2: Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Address Line 1 */}
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input placeholder="Street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Address Line 2 */}
        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2 <span className="text-sm text-gray-400">(optional)</span></FormLabel>
              <FormControl>
                <Input placeholder="Apartment, suite, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Row 3: City, State, PostCode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PostCode</FormLabel>
                <FormControl>
                  <Input placeholder="Postcode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel} className="w-32">Cancel</Button>
          <Button type="submit" className="w-32 bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
