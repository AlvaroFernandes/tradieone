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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { createProject, updateProject } from "@/services/ProjectsService";
import { getClients } from "@/services/ClientsService";
import type { Client } from "@/services/ClientsService";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional().or(z.literal("")),
  clientId: z.union([z.string(), z.number()]).optional(),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  status: z.string().optional().or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const defaultValues: ProjectFormValues = {
  name: "",
  description: "",
  clientId: undefined,
  startDate: "",
  endDate: "",
  status: "",
};

interface ProjectFormProps {
  onCancel?: () => void;
  type?: "add" | "edit";
  projectId?: string | number;
  initialValues?: Partial<ProjectFormValues> & { id?: string | number };
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onCancel, type = "add", projectId, initialValues }) => {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  const { reset } = form;

  const [clients, setClients] = React.useState<Client[]>([]);

  // load clients for client selector
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getClients({ pageNumber: 1, pageSize: 500 });
        const items = Array.isArray(res) ? res : res?.items ?? [];
        if (!mounted) return;
        setClients(items as Client[]);
      } catch (err) {
        console.error("Failed to load clients for project form", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  React.useEffect(() => {
    if (type === "edit" && initialValues) {
      const mapped: Partial<ProjectFormValues> = {
        ...defaultValues,
        ...initialValues,
        clientId: initialValues.clientId ?? initialValues.clientId,
      };
      reset(mapped as ProjectFormValues);
    }
  }, [type, initialValues, reset]);

  async function onSubmit(values: ProjectFormValues) {
    try {
      if (type === "edit" && projectId) {
        await updateProject(projectId, values);
      } else {
        await createProject(values as any);
      }
      form.reset();
      if (onCancel) onCancel();
    } catch (err) {
      console.error("ProjectForm submit error:", err);
    }
  }

  function handleCancel() {
    form.reset();
    if (onCancel) onCancel();
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Short description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={String(c.id)} value={String(c.id)}>
                          {((c as any).clientName) || (c as any).client || String(c.id)}
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
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input placeholder="Status (e.g. active)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel} className="w-32">Cancel</Button>
          <Button type="submit" className="w-32 bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
