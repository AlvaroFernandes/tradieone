import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StatsCards from "@/components/StatsCards";
import ModalComponent from "@/components/ModalComponent";
import EmployeeForm from "@/components/EmployeeForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, Phone, Search, MoreVertical, Mail, Briefcase } from "lucide-react";
import { deleteEmployee, getEmployees } from "@/services/EmployeesService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type EmployeeTableRow = {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
  status?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  totalJobs?: number;
  // allow extra API fields without breaking the UI
  [key: string]: unknown;
};

const EmployeesPage = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerms, 300);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeTableRow | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeTableRow | null>(null);

  const employeesQuery = useQuery({
    queryKey: ["employees", debouncedSearch],
    queryFn: async () => {
      const res = await getEmployees({ pageNumber: 1, pageSize: 50, keyword: debouncedSearch });
      return (Array.isArray(res) ? res : res?.items ?? []) as EmployeeTableRow[];
    },
    placeholderData: (previousData) => previousData,
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: (id: string | number) => deleteEmployee(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const employees = employeesQuery.data ?? [];
  const loading = employeesQuery.isFetching;
  const pageLoading = employeesQuery.isPending && !employeesQuery.data;

  const filteredEmployees = employees.filter((employee) => {
    const term = searchTerms.toLowerCase().trim();
    if (!term) return true;

    const apiName = String((employee as any).name ?? "").trim();
    const fullName = `${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim();
    const nameToSearch = (apiName || fullName).toLowerCase();

    return nameToSearch.includes(term);
  });

  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter((e) => (e.status || "").toLowerCase() === "active").length;
  const inactiveEmployees = filteredEmployees.filter((e) => (e.status || "").toLowerCase() === "inactive").length;
  const totalJobs = filteredEmployees.reduce((sum, e) => sum + (Number(e.totalJobs ?? 0) || 0), 0);

  const statsData = [
    { title: "Total Employees", stats: totalEmployees, type: "number" as const },
    { title: "Active", stats: activeEmployees, style: "text-green-700", type: "number" as const },
    { title: "Inactive", stats: inactiveEmployees, style: "text-gray-700", type: "number" as const },
    { title: "Total Jobs", stats: totalJobs, style: "text-blue-700", type: "number" as const },
  ];

  function getInitials(firstName: string, lastName: string): string {
    const a = (firstName || "").trim();
    const b = (lastName || "").trim();
    return `${a[0] || ""}${b[0] || ""}`.toUpperCase() || (a.slice(0, 2).toUpperCase() || "");
  }

  const tableRows = loading ? (
    <TableRow>
      <TableCell colSpan={7} className="text-center text-gray-500 py-6">
        Loading employees...
      </TableCell>
    </TableRow>
  ) : filteredEmployees.length === 0 ? (
    <TableRow>
      <TableCell colSpan={7} className="text-center text-gray-500 py-6">
        No employees found.
      </TableCell>
    </TableRow>
  ) : (
    filteredEmployees.map((employee, idx) => {
      const fullName = `${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim();
      return (
        <TableRow
          key={employee.id ?? idx}
          className="hover:bg-gray-50 cursor-pointer"
          onClick={() => {
            setSelectedEmployee(employee);
            setViewModalOpen(true);
          }}
        >
          <TableCell>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 bg-blue-600 text-white">
                <AvatarFallback className="text-white bg-blue-600">
                  {getInitials(employee.firstName, employee.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-gray-900">{fullName || "-"}</div>
                <div className="text-sm text-gray-500">{employee.role || "-"}</div>
              </div>
            </div>
          </TableCell>
          <TableCell className="text-gray-600">
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-gray-400" /> {employee.email || "-"}
            </div>
          </TableCell>
          <TableCell className="text-gray-600">
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-gray-400" /> {employee.phone || "-"}
            </div>
          </TableCell>
          <TableCell className="text-gray-600">
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-gray-400" />
              {(employee.city || employee.state) ? `${employee.city || ""}${employee.city && employee.state ? ", " : ""}${employee.state || ""}` : "-"}
            </div>
          </TableCell>
          <TableCell>
            <Badge
              className={
                (employee.status || "").toLowerCase() === "active"
                  ? "bg-green-50 text-green-700 border-0"
                  : "bg-gray-100 text-gray-700 border-0"
              }
            >
              {employee.status || "-"}
            </Badge>
          </TableCell>
          <TableCell className="text-gray-600">{Number(employee.totalJobs ?? 0) || 0}</TableCell>
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
                    setSelectedEmployee(employee);
                    setViewModalOpen(true);
                  }}
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEmployee(employee);
                    setEditModalOpen(true);
                  }}
                >
                  Edit Employee
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEmployeeToDelete(employee);
                    setDeleteModalOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      );
    })
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
            <CardTitle className="text-gray-900">All Employees</CardTitle>
            <Button variant="default" onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              New Employee
            </Button>
            <ModalComponent open={modalOpen} onOpenChange={setModalOpen} title="Add New Employee" site="Employees" size="w80" type="add">
              <EmployeeForm
                onCancel={() => setModalOpen(false)}
                onSaved={() => queryClient.invalidateQueries({ queryKey: ["employees"] })}
              />
            </ModalComponent>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search employees by name..."
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table className="border border-gray-200 rounded-lg overflow-hidden">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-100">
                  <TableHead>Employee</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Jobs</TableHead>
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
        title="Employee Details"
        description="View complete information about this employee."
        size="w80"
        type="view"
      >
        {selectedEmployee && (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl text-gray-900">
                  {`${selectedEmployee.firstName ?? ""} ${selectedEmployee.lastName ?? ""}`.trim() || "-"}
                </h3>
                <p className="text-sm text-gray-500">{selectedEmployee.role || "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Role</Label>
                </div>
                <p className="text-gray-900">{selectedEmployee.role || "-"}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    className={
                      (selectedEmployee.status || "").toLowerCase() === "active"
                        ? "bg-green-50 text-green-700 border-0"
                        : "bg-gray-100 text-gray-700 border-0"
                    }
                  >
                    {selectedEmployee.status || "-"}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Email</Label>
                </div>
                <p className="text-gray-900">{selectedEmployee.email || "-"}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Phone</Label>
                </div>
                <p className="text-gray-900">{selectedEmployee.phone || "-"}</p>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Address</Label>
                </div>
                <p className="text-gray-900">
                  {selectedEmployee.addressLine1 || (selectedEmployee as any).address1 || "-"}
                  {(selectedEmployee.addressLine2 || (selectedEmployee as any).address2) && (
                    <>, {selectedEmployee.addressLine2 || (selectedEmployee as any).address2}</>
                  )}
                  <br />
                  {(selectedEmployee.city || (selectedEmployee as any).city) && (
                    <>
                      {selectedEmployee.city || (selectedEmployee as any).city}, {selectedEmployee.state || (selectedEmployee as any).state}{" "}
                      {selectedEmployee.postcode || (selectedEmployee as any).postcode}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm text-gray-700 mb-4">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Jobs</p>
                  <p className="text-2xl text-blue-700">{Number(selectedEmployee.totalJobs ?? 0) || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="text-2xl text-green-700">
                    {(selectedEmployee.status || "").toLowerCase() === "active" ? "Active" : "Inactive"}
                  </p>
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
                Edit Employee
              </Button>
            </div>
          </div>
        )}
      </ModalComponent>

      <ModalComponent
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Employee"
        description="Are you sure you want to delete this employee? This action cannot be undone."
        size="sm"
        type="delete"
      >
        <div className="space-y-4 py-2">
          <p className="text-gray-900">
            Employee:{" "}
            <strong>
              {employeeToDelete ? `${employeeToDelete.firstName} ${employeeToDelete.lastName}`.trim() : ""}
            </strong>
          </p>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (employeeToDelete?.id) {
                  try {
                    await deleteEmployeeMutation.mutateAsync(employeeToDelete.id);
                  } catch (err) {
                    console.error("Failed to delete employee", err);
                  }
                }
                setDeleteModalOpen(false);
                setEmployeeToDelete(null);
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
        title={
          selectedEmployee
            ? `Edit Employee: ${`${selectedEmployee.firstName ?? ""} ${selectedEmployee.lastName ?? ""}`.trim()}`
            : "Edit Employee"
        }
        site="Employees"
        size="w80"
        type="edit"
      >
        {selectedEmployee && (
          <EmployeeForm
            type="edit"
            employeeId={selectedEmployee.id}
            initialValues={selectedEmployee as any}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["employees"] })}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </ModalComponent>
    </div>
  );
};

export default EmployeesPage;
