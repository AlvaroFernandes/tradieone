import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StatsCards from "@/components/StatsCards";
import ModalComponent from "@/components/ModalComponent";
import ClientForm from "@/components/ClientForm";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Search, MoreVertical, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteClient, getClients } from '@/services/ClientsService';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface Project {
  status?: string;
  isActive?: boolean;
  // allow dynamic fields that might contain revenue/date values coming from API
  [key: string]: string | number | boolean | undefined | null | Date;
}

type ClientTableRow = {
  id?: string;
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country?: string;
  postcode: string;
  activeProjects: number;
  totalJobs: number;
  // optional projects array if provided by API
  projects?: Project[];
  // optional per-client revenue fallbacks
  revenueThisMonth?: number;
  monthlyRevenue?: number;
};

// Client data is loaded from the API; removed local dummy data

// tableColumns removed (not used) — table columns are defined directly in JSX

const ClientsPage = () => {
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientTableRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerms, 300);
  // Modal for viewing client details
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientTableRow | null>(null);
  // Modal for editing client from view modal
  const [editModalOpen, setEditModalOpen] = useState(false);

  const clientsQuery = useQuery({
    queryKey: ["clients", debouncedSearch],
    queryFn: async () => {
      const res = await getClients({ pageNumber: 1, pageSize: 50, keyword: debouncedSearch });
      return Array.isArray(res) ? res : res?.items ?? [];
    },
    placeholderData: (previousData) => previousData,
  });

  const deleteClientMutation = useMutation({
    mutationFn: (id: string | number) => deleteClient(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const clients = (clientsQuery.data ?? []) as ClientTableRow[];
  const loading = clientsQuery.isFetching;
  const pageLoading = clientsQuery.isPending && !clientsQuery.data;

  // Filter clients client-side as a fallback (name-based search)
  const filteredClients = clients.filter((client) => {
    const term = searchTerms.toLowerCase().trim();
    if (!term) return true;
    return (client.clientName || "").toLowerCase().includes(term);
  });

  // Stats data, with dynamic total clients
  // compute aggregated stats from clients and their projects (if present)
  const now = new Date();
  const isSameMonth = (d?: Date | null) => {
    if (!d) return false;
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };

  const revenueFieldNames = [
    "revenue",
    "amount",
    "total",
    "value",
    "price",
    "budget",
    "invoiceAmount",
    "projectRevenue",
    "invoice_value",
  ];

  const dateFieldNames = [
    "date",
    "startDate",
    "endDate",
    "createdAt",
    "updatedAt",
    "dueDate",
    "invoiceDate",
    "projectDate",
  ];

  let totalActiveProjects = 0;
  let totalRevenueThisMonth = 0;

  for (const client of filteredClients) {
    // count active projects: prefer explicit projects array, otherwise use activeProjects field
    if (Array.isArray(client.projects)) {
      const projects = client.projects as Project[];
      // count projects with status = active or truthy isActive, otherwise count all
      const activeCount = projects.filter((p) => {
        if (p == null) return false;
        const status = (p.status || "").toString().toLowerCase();
        if (status) return ["active", "in-progress", "ongoing"].includes(status);
        if (typeof p.isActive === "boolean") return p.isActive;
        return true;
      }).length;
      totalActiveProjects += activeCount;

      // sum revenue for projects that have a date in current month
      for (const p of projects) {
        // find a date on the project
        let pd: Date | null = null;
        for (const df of dateFieldNames) {
          const raw = p[df];
          if (raw instanceof Date) {
            pd = raw;
            break;
          }
          if (typeof raw === "string" || typeof raw === "number") {
            const parsed = new Date(raw as string | number);
            if (!isNaN(parsed.getTime())) {
              pd = parsed;
              break;
            }
          }
        }

        // find revenue value
        let rv = 0;
        for (const rf of revenueFieldNames) {
          const val = p[rf];
          if (val != null) {
            if (typeof val === "number" && !isNaN(val)) {
              rv = val;
              break;
            }
            if (typeof val === "string" && val.trim() !== "" && !isNaN(Number(val))) {
              rv = Number(val);
              break;
            }
          }
        }

        if (pd && isSameMonth(pd)) {
          totalRevenueThisMonth += rv;
        }
      }
    } else {
      totalActiveProjects += Number(client.activeProjects ?? 0);
      // try per-client revenue field fallback
      const clientRevenueThisMonth = Number(client.revenueThisMonth ?? client.monthlyRevenue ?? 0) || 0;
      totalRevenueThisMonth += clientRevenueThisMonth;
    }
  }

  const statsData = [
    { title: "Total Clients", stats: filteredClients.length, type: "number" as const },
    { title: "Active Projects", stats: totalActiveProjects || 0, style: "text-green-700", type: "number" as const },
    { title: "Total Revenue (This Month)", stats: totalRevenueThisMonth || 0, style: "text-gray-700", type: "currency" as const },
    { title: "New This Month", stats: 0, style: "text-blue-700", type: "currency" as const },
  ];

  function getInitials(clientName: string): import("react").ReactNode {
    if (!clientName) return "";
    const parts = clientName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) return "";

    // If only one word, take up to first two characters, otherwise take first char of first two words
    const initials =
      parts.length === 1
        ? parts[0].slice(0, 2)
        : `${parts[0][0] || ""}${parts[1][0] || ""}`;

    return initials.toUpperCase();
  }
  // Prepare table rows (loading / empty / data)
  const tableRows = loading ? (
    <TableRow>
      <TableCell colSpan={8} className="text-center text-gray-500 py-6">Loading clients...</TableCell>
    </TableRow>
  ) : filteredClients.length === 0 ? (
    <TableRow>
      <TableCell colSpan={8} className="text-center text-gray-500 py-6">No clients found.</TableCell>
    </TableRow>
  ) : (
    filteredClients.map((client, idx) => (
      <TableRow
        key={idx}
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => {
          setSelectedClient(client);
          setViewModalOpen(true);
        }}
      >
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 bg-blue-600 text-white">
              <AvatarFallback className="text-white bg-blue-600">
                {getInitials(client.clientName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-900">{client.clientName}</span>
          </div>
        </TableCell>
        <TableCell className="text-gray-600">{client.contactPerson}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} className="text-gray-400" /> {client.city}, {client.state}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} className="text-gray-400" /> {client.phone}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} className="text-gray-400" /> {client.city}, {client.state}
          </div>
        </TableCell>
        <TableCell>
          <Badge className={client.activeProjects > 0 ? "bg-green-50 text-green-700 border-0" : "bg-gray-100 text-gray-700 border-0"}>
            {client.activeProjects}
          </Badge>
        </TableCell>
        <TableCell className="text-gray-600">{client.totalJobs}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center h-8 w-8 p-0 rounded-md hover:bg-accent hover:text-accent-foreground" onClick={(e) => e.stopPropagation()}>
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setViewModalOpen(true); }}>View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setEditModalOpen(true); }}>Edit Client</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={(e) => {
                e.stopPropagation();
                setClientToDelete(client);
                setDeleteModalOpen(true);
              }}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))
  );
  if (pageLoading) {
    return (
      <div className="p-6">
        <div className="w-full max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <StatsCards items={statsData} />

      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">All Clients</CardTitle>
            <Button
              variant="default"
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              New Client
            </Button>
            <ModalComponent
              open={modalOpen}
              onOpenChange={setModalOpen}
              title="Add New Client"
              site="Clients"
              size="w80"
              type="add"
            >
              <ClientForm
                onCancel={() => setModalOpen(false)}
                onSaved={() => queryClient.invalidateQueries({ queryKey: ["clients"] })}
              />
            </ModalComponent>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search clients by name..."
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table className="border border-gray-200 rounded-lg overflow-hidden">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-100">
                  <TableHead>Client</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Active Projects</TableHead>
                  <TableHead>Total Jobs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{tableRows}</TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal for viewing client details (custom layout) */}
      <ModalComponent
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        title="Client Details"
        description="View complete information about this client."
        size="w80"
        type="view"
      >
        {selectedClient && (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {getInitials(selectedClient.clientName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl text-gray-900">{selectedClient.clientName}</h3>
                <p className="text-sm text-gray-500">{selectedClient.contactPerson}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Address</Label>
                </div>
                <p className="text-gray-900">
                  {selectedClient.addressLine1}
                  {selectedClient.addressLine2 && <>, {selectedClient.addressLine2}</>}
                  <br />
                  {selectedClient.city}, {selectedClient.state} {selectedClient.postcode}
                  {selectedClient.country && <>, {selectedClient.country}</>}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Contact Person</Label>
                </div>
                <p className="text-gray-900">{selectedClient.contactPerson}</p>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Address</Label>
                </div>
                <p className="text-gray-900">
                  {selectedClient.addressLine1}
                  {selectedClient.addressLine2 && <>, {selectedClient.addressLine2}</>}
                  <br />
                  {selectedClient.city}, {selectedClient.state} {selectedClient.postcode}
                  {selectedClient.country && <>, {selectedClient.country}</>}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Contact Person</Label>
                </div>
                <p className="text-gray-900">{selectedClient.contactPerson}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm text-gray-700 mb-4">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Active Projects</p>
                  <p className="text-2xl text-green-700">{selectedClient.activeProjects}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Jobs</p>
                  <p className="text-2xl text-blue-700">{selectedClient.totalJobs}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={() => {
                  setViewModalOpen(false);
                  setEditModalOpen(true);
                }}
              >
                Edit Client
              </Button>
            </div>
          </div>
        )}
      </ModalComponent>

      {/* Delete confirmation modal */}
      <ModalComponent
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
        size="sm"
        type="delete"
      >
        <div className="space-y-4 py-2">
          <p className="text-gray-900">Client: <strong>{clientToDelete?.clientName}</strong></p>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (clientToDelete?.id) {
                  try {
                    await deleteClientMutation.mutateAsync(clientToDelete.id);
                  } catch (err) {
                    // TODO: show error toast
                    console.error("Failed to delete client", err);
                  }
                }
                setDeleteModalOpen(false);
                setClientToDelete(null);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </ModalComponent>
      <ModalComponent
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title={selectedClient ? `Edit Client: ${selectedClient.clientName}` : "Edit Client"}
        site="Clients"
        size="w80"
        type="edit"
      >
        {selectedClient && (
          <ClientForm
            type="edit"
            clientId={selectedClient.id}
            initialValues={selectedClient}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["clients"] })}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </ModalComponent>
    </div>
  );
};

export default ClientsPage;
