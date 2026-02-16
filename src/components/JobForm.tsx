import React from "react";

import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import ModalComponent from "@/components/ModalComponent";

import { getClients } from "@/services/ClientsService";
import type { Client } from "@/services/ClientsService";
import { getProjects } from "@/services/ProjectsService";
import type { Project } from "@/services/ProjectsService";
import { getEmployees } from "@/services/EmployeesService";
import type { Employee } from "@/services/EmployeesService";
import { getContractors } from "@/services/ContractorsService";
import type { Contractor } from "@/services/ContractorsService";

import { createJob, updateJob } from "@/services/JobsService";
import type { Job } from "@/services/JobsService";

const australianStates = [
  "New South Wales",
  "Victoria",
  "Queensland",
  "South Australia",
  "Western Australia",
  "Tasmania",
  "Northern Territory",
  "Australian Capital Territory",
] as const;

const stateAbbrMap: Record<string, string> = {
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
  if (stateAbbrMap[up]) return stateAbbrMap[up];
  const found = australianStates.find((s) => s.toLowerCase() === value.toLowerCase());
  return found || value;
}

// Small, non-exhaustive city lists (major cities only) + Other.
const citiesByState: Record<string, string[]> = {
  "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Other"],
  Victoria: ["Melbourne", "Geelong", "Ballarat", "Other"],
  Queensland: ["Brisbane", "Gold Coast", "Sunshine Coast", "Cairns", "Other"],
  "South Australia": ["Adelaide", "Mount Gambier", "Whyalla", "Other"],
  "Western Australia": ["Perth", "Fremantle", "Bunbury", "Other"],
  Tasmania: ["Hobart", "Launceston", "Devonport", "Other"],
  "Northern Territory": ["Darwin", "Alice Springs", "Other"],
  "Australian Capital Territory": ["Canberra", "Other"],
};

const jobFormSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  locationName: z.string().min(1, "Location is required"),
  clientId: z.union([z.string(), z.number()]).refine((v) => String(v).trim() !== "", "Client is required"),
  projectId: z.union([z.string(), z.number()]).optional(),
  addressLine1: z.string().min(1, "Address 1 is required"),
  addressLine2: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  cityOther: z.string().optional().or(z.literal("")),
  postcode: z.string().min(3, "Postcode is required"),
  country: z.string().optional().or(z.literal("")),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  startTime: z.string().min(1, "Start hour is required"),
  finishTime: z.string().min(1, "End hour is required"),
  priority: z.string().min(1, "Priority is required"),
  status: z.string().optional().or(z.literal("")),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

const defaultValues: JobFormValues = {
  title: "",
  locationName: "",
  clientId: "",
  projectId: "",
  addressLine1: "",
  addressLine2: "",
  description: "",
  state: "",
  city: "",
  cityOther: "",
  postcode: "",
  country: "Australia",
  startDate: "",
  endDate: "",
  startTime: "",
  finishTime: "",
  priority: "Normal",
  status: "Open",
};

interface JobFormProps {
  onCancel?: () => void;
  onSaved?: () => void;
  type?: "add" | "edit";
  jobId?: number;
  initialValues?: Partial<Job>;
}

function toNumberOr0(value: unknown) {
  const n = typeof value === "number" ? value : Number(String(value || ""));
  return Number.isFinite(n) ? n : 0;
}

const JobForm: React.FC<JobFormProps> = ({ onCancel, onSaved, type = "add", jobId, initialValues }) => {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  const { reset, watch, setValue } = form;

  const [clients, setClients] = React.useState<Client[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);

  const selectedState = watch("state");
  const selectedClientId = watch("clientId");
  const selectedCity = watch("city");

  // Assign workers modal state
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [contractors, setContractors] = React.useState<Contractor[]>([]);
  const [workerSearch, setWorkerSearch] = React.useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = React.useState<Array<string | number>>([]);
  const [selectedContractorIds, setSelectedContractorIds] = React.useState<Array<string | number>>([]);

  const cityOptions = React.useMemo(() => {
    const s = normalizeState(selectedState) || "";
    return citiesByState[s] || ["Other"];
  }, [selectedState]);

  const filteredProjects = React.useMemo(() => {
    const cid = toNumberOr0(selectedClientId);
    if (!cid) return projects;
    return projects.filter((p) => {
      const pid = p.clientId;
      return !pid || toNumberOr0(pid) === cid;
    });
  }, [projects, selectedClientId]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getClients({ pageNumber: 1, pageSize: 500 });
        const items = Array.isArray(res) ? res : res?.items ?? [];
        if (!mounted) return;
        setClients(items as Client[]);
      } catch (err) {
        console.error("Failed to load clients for job form", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getProjects({ pageNumber: 1, pageSize: 500 });
        const items = Array.isArray(res) ? res : res?.items ?? [];
        if (!mounted) return;
        setProjects(items as Project[]);
      } catch (err) {
        console.error("Failed to load projects for job form", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (type === "edit" && initialValues) {
      const mapped: Partial<JobFormValues> = {
        ...defaultValues,
        title: String(initialValues.title ?? ""),
        locationName: String(initialValues.locationName ?? ""),
        clientId: String(initialValues.clientId ?? ""),
        projectId: String(initialValues.projectId ?? ""),
        addressLine1: String(initialValues.addressLine1 ?? ""),
        addressLine2: String(initialValues.addressLine2 ?? ""),
        description: String(initialValues.description ?? ""),
        state: normalizeState(String(initialValues.state ?? "")) || "",
        city: String(initialValues.city ?? ""),
        postcode: String(initialValues.postcode ?? ""),
        country: String(initialValues.country ?? "Australia"),
        startDate: String(initialValues.startDate ?? ""),
        endDate: String(initialValues.endDate ?? ""),
        startTime: String(initialValues.startTime ?? ""),
        finishTime: String(initialValues.finishTime ?? ""),
        priority: String(initialValues.priority ?? "Normal"),
        status: String(initialValues.status ?? "Open"),
      };

      reset(mapped as JobFormValues);
    }
  }, [type, initialValues, reset]);

  React.useEffect(() => {
    // when state changes, reset city if not in options
    if (!selectedState) return;
    const normalized = normalizeState(selectedState) || selectedState;
    if (!citiesByState[normalized]) return;

    if (selectedCity && !citiesByState[normalized].includes(selectedCity)) {
      setValue("city", "");
      setValue("cityOther", "");
    }
  }, [selectedState, selectedCity, setValue]);

  React.useEffect(() => {
    // if user selects Other, clear cityOther
    if (selectedCity !== "Other") {
      setValue("cityOther", "");
    }
  }, [selectedCity, setValue]);

  async function openAssignWorkers() {
    setAssignOpen(true);

    // lazy-load lists
    if (employees.length === 0) {
      try {
        const res = await getEmployees({ pageNumber: 1, pageSize: 500 });
        const items = Array.isArray(res) ? res : res?.items ?? [];
        setEmployees(items as Employee[]);
      } catch (err) {
        console.error("Failed to load employees for assignment", err);
      }
    }

    if (contractors.length === 0) {
      try {
        const res = await getContractors({ pageNumber: 1, pageSize: 500 });
        const items = Array.isArray(res) ? res : res?.items ?? [];
        setContractors(items as Contractor[]);
      } catch (err) {
        console.error("Failed to load contractors for assignment", err);
      }
    }
  }

  async function onSubmit(values: JobFormValues) {
    try {
      const nowIso = new Date().toISOString();
      const cityFinal = values.city === "Other" ? (values.cityOther || "").trim() : values.city;

      const payload: Job = {
        id: type === "edit" ? toNumberOr0(jobId ?? initialValues?.id) : 0,
        companyId: toNumberOr0(initialValues?.companyId ?? 0),
        projectId: toNumberOr0(values.projectId),
        clientId: toNumberOr0(values.clientId),
        title: values.title,
        description: values.description || "",
        status: values.status || "Open",
        priority: values.priority,
        startDate: values.startDate,
        endDate: values.endDate,
        startTime: values.startTime,
        finishTime: values.finishTime,
        locationName: values.locationName,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2 || "",
        city: cityFinal,
        state: values.state,
        postcode: values.postcode,
        country: values.country || "Australia",
        createdBy: toNumberOr0(initialValues?.createdBy ?? 0),
        createdOnUtc: String(initialValues?.createdOnUtc ?? nowIso),
        lastUpdatedUtc: nowIso,

        // NOTE: worker assignment is implemented in the UI, but API field names
        // are unknown. Kept as extra fields so it doesn't block UI usage.
        assignedEmployeeIds: selectedEmployeeIds,
        assignedContractorIds: selectedContractorIds,
      } as unknown as Job;

      if (type === "edit") {
        await updateJob(payload);
      } else {
        await createJob(payload);
      }

      form.reset();
      onSaved?.();
      onCancel?.();
    } catch (err) {
      console.error("JobForm submit error:", err);
    }
  }

  function handleCancel() {
    form.reset();
    onCancel?.();
  }

  const workerTerm = workerSearch.toLowerCase().trim();
  const filteredEmployees = employees.filter((e) => {
    if (!workerTerm) return true;
    const fallbackName = (e as unknown as { name?: string }).name;
    const name = `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim() || String(fallbackName ?? "");
    return String(name).toLowerCase().includes(workerTerm);
  });
  const filteredContractors = contractors.filter((c) => {
    if (!workerTerm) return true;
    const fallbackName = (c as unknown as { name?: string }).name;
    return String(c.contractorName ?? fallbackName ?? "").toLowerCase().includes(workerTerm);
  });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter job title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="locationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={String(field.value ?? "") || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c, idx) => (
                        <SelectItem key={String(c.id ?? idx)} value={String(c.id ?? "")}>
                          {String(c.clientName ?? "(Unnamed client)")}
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
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Project <span className="text-sm text-gray-400">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={String(field.value ?? "") || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No project</SelectItem>
                      {filteredProjects.map((p, idx) => (
                        <SelectItem key={String(p.id ?? idx)} value={String(p.id ?? "")}>
                          {String(p.name ?? "(Unnamed project)")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 1</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Address 2 <span className="text-sm text-gray-400">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Unit, suite, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the job..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State / Territory</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {australianStates.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {cityOptions.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
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
                <FormLabel>Postcode</FormLabel>
                <FormControl>
                  <Input placeholder="Postcode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {selectedCity === "Other" && (
          <FormField
            control={form.control}
            name="cityOther"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City (Other)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Hour (24h)</FormLabel>
                <FormControl>
                  <Input type="time" step={60} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="finishTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Hour (24h)</FormLabel>
                <FormControl>
                  <Input type="time" step={60} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value || "Normal"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value || "Open"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={openAssignWorkers}>
              Assign Workers
            </Button>
            <div className="text-sm text-gray-500">
              {selectedEmployeeIds.length + selectedContractorIds.length} selected
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {type === "edit" ? "Update Job" : "Add Job"}
            </Button>
          </div>
        </div>

        <ModalComponent
          open={assignOpen}
          onOpenChange={setAssignOpen}
          title="Assign Workers"
          description="Select employees and contractors to assign."
          size="w80"
          type="edit"
        >
          <div className="space-y-4 py-2">
            <Input
              placeholder="Search workers by name..."
              value={workerSearch}
              onChange={(e) => setWorkerSearch(e.target.value)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-sm text-gray-700">Employees</div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-10"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                            No employees found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEmployees.map((e, idx) => {
                          const id = e.id ?? idx;
                          const checked = selectedEmployeeIds.includes(id);
                          const fallbackName = (e as unknown as { name?: string }).name;
                          const name = `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim() || String(fallbackName ?? "-");
                          return (
                            <TableRow key={String(id)} className="hover:bg-gray-50">
                              <TableCell>
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(v) => {
                                    const on = v === true;
                                    setSelectedEmployeeIds((prev) => {
                                      if (on) return prev.includes(id) ? prev : [...prev, id];
                                      return prev.filter((x) => x !== id);
                                    });
                                  }}
                                />
                              </TableCell>
                              <TableCell className="text-gray-900">{name}</TableCell>
                              <TableCell className="text-gray-600">{String(e.role ?? "-")}</TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-700">Contractors</div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-10"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Trade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContractors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                            No contractors found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredContractors.map((c, idx) => {
                          const id = c.id ?? idx;
                          const checked = selectedContractorIds.includes(id);
                          const fallbackName = (c as unknown as { name?: string }).name;
                          const name = String(c.contractorName ?? fallbackName ?? "-");
                          return (
                            <TableRow key={String(id)} className="hover:bg-gray-50">
                              <TableCell>
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(v) => {
                                    const on = v === true;
                                    setSelectedContractorIds((prev) => {
                                      if (on) return prev.includes(id) ? prev : [...prev, id];
                                      return prev.filter((x) => x !== id);
                                    });
                                  }}
                                />
                              </TableCell>
                              <TableCell className="text-gray-900">{name}</TableCell>
                              <TableCell className="text-gray-600">{String(c.trade ?? "-")}</TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setAssignOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </ModalComponent>
      </form>
    </Form>
  );
};

export default JobForm;
