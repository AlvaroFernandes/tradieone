import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StatsCards from "@/components/StatsCards";
import ModalComponent from "@/components/ModalComponent";
import ContractorForm from "@/components/ContractorForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, MapPin, MoreVertical, Phone, Search, Wrench } from "lucide-react";
import { deleteContractor, getContractors } from "@/services/ContractorsService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type ContractorTableRow = {
  id?: string | number;
  contractorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  trade?: string;
  status?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  totalJobs?: number;
  [key: string]: unknown;
};

const ContractorsPage = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerms, 300);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<ContractorTableRow | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contractorToDelete, setContractorToDelete] = useState<ContractorTableRow | null>(null);

  const contractorsQuery = useQuery({
    queryKey: ["contractors", debouncedSearch],
    queryFn: async () => {
      const res = await getContractors({ pageNumber: 1, pageSize: 50, keyword: debouncedSearch });
      return (Array.isArray(res) ? res : res?.items ?? []) as ContractorTableRow[];
    },
    placeholderData: (previousData) => previousData,
  });

  const deleteContractorMutation = useMutation({
    mutationFn: (id: string | number) => deleteContractor(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["contractors"] });
    },
  });

  const contractors = contractorsQuery.data ?? [];
  const loading = contractorsQuery.isFetching;
  const pageLoading = contractorsQuery.isPending && !contractorsQuery.data;

  const filteredContractors = contractors.filter((c) => {
    const term = searchTerms.toLowerCase().trim();
    if (!term) return true;
    return (c.contractorName || "").toLowerCase().includes(term);
  });

  const totalContractors = filteredContractors.length;
  const activeContractors = filteredContractors.filter((c) => (c.status || "").toLowerCase() === "active").length;
  const inactiveContractors = filteredContractors.filter((c) => (c.status || "").toLowerCase() === "inactive").length;
  const totalJobs = filteredContractors.reduce((sum, c) => sum + (Number(c.totalJobs ?? 0) || 0), 0);

  const statsData = [
    { title: "Total Contractors", stats: totalContractors, type: "number" as const },
    { title: "Active", stats: activeContractors, style: "text-green-700", type: "number" as const },
    { title: "Inactive", stats: inactiveContractors, style: "text-gray-700", type: "number" as const },
    { title: "Total Jobs", stats: totalJobs, style: "text-blue-700", type: "number" as const },
  ];

  function getInitials(name: string): string {
    const parts = (name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    const initials = parts.length === 1 ? parts[0].slice(0, 2) : `${parts[0][0] || ""}${parts[1][0] || ""}`;
    return initials.toUpperCase();
  }

  const tableRows = loading ? (
    <TableRow>
      <TableCell colSpan={7} className="text-center text-gray-500 py-6">
        Loading contractors...
      </TableCell>
    </TableRow>
  ) : filteredContractors.length === 0 ? (
    <TableRow>
      <TableCell colSpan={7} className="text-center text-gray-500 py-6">
        No contractors found.
      </TableCell>
    </TableRow>
  ) : (
    filteredContractors.map((c, idx) => (
      <TableRow
        key={c.id ?? idx}
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => {
          setSelectedContractor(c);
          setViewModalOpen(true);
        }}
      >
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 bg-blue-600 text-white">
              <AvatarFallback className="text-white bg-blue-600">{getInitials(c.contractorName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-gray-900">{c.contractorName || "-"}</div>
              <div className="text-sm text-gray-500">{c.contactPerson || "-"}</div>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-gray-600">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-gray-400" /> {c.email || "-"}
          </div>
        </TableCell>
        <TableCell className="text-gray-600">
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} className="text-gray-400" /> {c.phone || "-"}
          </div>
        </TableCell>
        <TableCell className="text-gray-600">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-gray-400" />
            {(c.city || c.state) ? `${c.city || ""}${c.city && c.state ? ", " : ""}${c.state || ""}` : "-"}
          </div>
        </TableCell>
        <TableCell className="text-gray-600">
          <div className="flex items-center gap-2 text-sm">
            <Wrench size={14} className="text-gray-400" /> {c.trade || "-"}
          </div>
        </TableCell>
        <TableCell>
          <Badge
            className={
              (c.status || "").toLowerCase() === "active"
                ? "bg-green-50 text-green-700 border-0"
                : "bg-gray-100 text-gray-700 border-0"
            }
          >
            {c.status || "-"}
          </Badge>
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
                  setSelectedContractor(c);
                  setViewModalOpen(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedContractor(c);
                  setEditModalOpen(true);
                }}
              >
                Edit Contractor
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setContractorToDelete(c);
                  setDeleteModalOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
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
            <CardTitle className="text-gray-900">All Contractors</CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setModalOpen(true)}>
              New Contractor
            </Button>
            <ModalComponent open={modalOpen} onOpenChange={setModalOpen} title="Add New Contractor" site="Contractors" size="w80" type="add">
              <ContractorForm
                onCancel={() => setModalOpen(false)}
                onSaved={() => queryClient.invalidateQueries({ queryKey: ["contractors"] })}
              />
            </ModalComponent>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search contractors by name..."
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table className="border border-gray-200 rounded-lg overflow-hidden">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-100">
                  <TableHead>Contractor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Trade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{tableRows}</TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ModalComponent
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        title="Contractor Details"
        description="View complete information about this contractor."
        size="w80"
        type="view"
      >
        {selectedContractor && (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-blue-600 text-white text-xl">{getInitials(selectedContractor.contractorName)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl text-gray-900">{selectedContractor.contractorName || "-"}</h3>
                <p className="text-sm text-gray-500">{selectedContractor.contactPerson || "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wrench size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Trade</Label>
                </div>
                <p className="text-gray-900">{selectedContractor.trade || "-"}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    className={
                      (selectedContractor.status || "").toLowerCase() === "active"
                        ? "bg-green-50 text-green-700 border-0"
                        : "bg-gray-100 text-gray-700 border-0"
                    }
                  >
                    {selectedContractor.status || "-"}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Email</Label>
                </div>
                <p className="text-gray-900">{selectedContractor.email || "-"}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Phone</Label>
                </div>
                <p className="text-gray-900">{selectedContractor.phone || "-"}</p>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Address</Label>
                </div>
                <p className="text-gray-900">
                  {selectedContractor.addressLine1 || (selectedContractor as any).address1 || "-"}
                  {(selectedContractor.addressLine2 || (selectedContractor as any).address2) && (
                    <>, {selectedContractor.addressLine2 || (selectedContractor as any).address2}</>
                  )}
                  <br />
                  {(selectedContractor.city || (selectedContractor as any).city) && (
                    <>
                      {selectedContractor.city || (selectedContractor as any).city}, {selectedContractor.state || (selectedContractor as any).state}{" "}
                      {selectedContractor.postcode || (selectedContractor as any).postcode}
                    </>
                  )}
                </p>
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
                Edit Contractor
              </Button>
            </div>
          </div>
        )}
      </ModalComponent>

      <ModalComponent
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Contractor"
        description="Are you sure you want to delete this contractor? This action cannot be undone."
        size="sm"
        type="delete"
      >
        <div className="space-y-4 py-2">
          <p className="text-gray-900">
            Contractor: <strong>{contractorToDelete?.contractorName}</strong>
          </p>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (contractorToDelete?.id) {
                  try {
                    await deleteContractorMutation.mutateAsync(contractorToDelete.id);
                  } catch (err) {
                    console.error("Failed to delete contractor", err);
                  }
                }
                setDeleteModalOpen(false);
                setContractorToDelete(null);
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
        title={selectedContractor ? `Edit Contractor: ${selectedContractor.contractorName}` : "Edit Contractor"}
        site="Contractors"
        size="w80"
        type="edit"
      >
        {selectedContractor && (
          <ContractorForm
            type="edit"
            contractorId={selectedContractor.id}
            initialValues={selectedContractor as any}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["contractors"] })}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </ModalComponent>
    </div>
  );
};

export default ContractorsPage;
