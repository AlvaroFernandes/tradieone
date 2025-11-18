import { useState } from "react";
import StatsCards from "@/components/StatsCards";
import ModalComponent from "@/components/ModalComponent";
import ClientForm from "@/components/ClientForm";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, Search, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const statsData: { title: string; stats: number; style?: string; type?: "number" | "currency" }[] = [
  { title: "Total Clients", stats: 42, type: "number"},
  { title: "Active Projects", stats: 18, style: "text-green-700", type: "number" },
  { title: "Total Revenue", stats: 1200000, style: "text-gray-700", type: "currency" },
  { title: "New This Month", stats: 89000, style: "text-blue-700", type: "currency" },
];

type ClientTableRow = {
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  activeProjects: number;
  totalJobs: number;
};

const mockClients: ClientTableRow[] = [
  {
    clientName: "Acme Corp",
    contactPerson: "John Doe",
    email: "john@acme.com",
    phone: "0412 345 678",
    location: "Sydney, NSW",
    activeProjects: 3,
    totalJobs: 12,
  },
  {
    clientName: "Beta Ltd",
    contactPerson: "Jane Smith",
    email: "jane@beta.com",
    phone: "0412 987 654",
    location: "Melbourne, VIC",
    activeProjects: 1,
    totalJobs: 5,
  },
  {
    clientName: "Gamma Pty",
    contactPerson: "Alice Brown",
    email: "alice@gamma.com",
    phone: "0412 111 222",
    location: "Brisbane, QLD",
    activeProjects: 2,
    totalJobs: 8,
  },
];

const tableColumns = [
  { key: "clientName", label: "Client" },
  { key: "contactPerson", label: "Contact Person" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "activeProjects", label: "Active Projects" },
  { key: "totalJobs", label: "Total Jobs" },
];

const ClientsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState("");
  const [sortKey, setSortKey] = useState<keyof ClientTableRow>("clientName");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  // Add missing state for dropdown menu actions
  const [selectedClient, setSelectedClient] = useState<ClientTableRow | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  function handleSort(key: keyof ClientTableRow) {
    if (sortKey === key) {
      setSortAsc((asc) => !asc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  // Filter and sort clients
  const filteredClients = mockClients
    .filter((client) => {
      const term = searchTerms.toLowerCase();
      return (
        client.clientName.toLowerCase().includes(term) ||
        client.contactPerson.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.phone.toLowerCase().includes(term) ||
        client.location.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

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
              size="lg"
              type="add"
            >
              <ClientForm onCancel={() => setModalOpen(false)} />
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
              placeholder="Search Clients..."
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table className="border border-gray-200 rounded-lg overflow-hidden">
              <TableHead>
                <TableRow className="bg-gray-50 hover:bg-gray-100">
                  <TableHead className="text-gray-700">Client</TableHead>
                  <TableHead className="text-gray-700">
                    Contact Person
                  </TableHead>
                  <TableHead className="text-gray-700">Email</TableHead>
                  <TableHead className="text-gray-700">Phone</TableHead>
                  <TableHead className="text-gray-700">Location</TableHead>
                  <TableHead className="text-gray-700">
                    Active Projects
                  </TableHead>
                  <TableHead className="text-gray-700">Total Jobs</TableHead>
                  <TableHead className="text-gray-700 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHead>
              {/* Table body */}
              <TableBody>
                {filteredClients.map((client, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 bg-blue-600 text-white">
                          <AvatarFallback className="text-white bg-blue-600">
                            {getInitials(client.clientName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-gray-900">
                          {client.clientName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {client.contactPerson}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />{" "}
                        {client.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />{" "}
                        {client.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-gray-400" />{" "}
                        {client.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          client.activeProjects > 0
                            ? "bg-green-50 text-green-700 border-0"
                            : "bg-gray-100 text-gray-700 border-0"
                        }
                      >
                        {client.activeProjects}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {client.totalJobs}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="inline-flex items-center justify-center h-8 w-8 p-0 rounded-md hover:bg-accent hover:text-accent-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClient(client);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClient(client);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClient(client);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsPage;