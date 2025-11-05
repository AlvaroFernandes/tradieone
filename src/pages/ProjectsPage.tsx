import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Calendar,
  Users,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  X,
  Check,
} from "lucide-react";

interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  startDate: string;
  endDate: string;
  location: string;
  teamSize: number;
  jobsCount: number;
}

interface ProjectsPageProps {
  onViewProject?: (project: Project) => void;
}

const mockProjects = [
  {
    id: 1,
    name: "Commercial Building Renovation",
    client: "ABC Corp",
    status: "active",
    startDate: "2024-09-01",
    endDate: "2024-12-31",
    location: "Sydney, NSW",
    teamSize: 8,
    jobsCount: 12,
  },
  {
    id: 2,
    name: "Residential Complex Plumbing",
    client: "Green Valley Estates",
    status: "active",
    startDate: "2024-10-01",
    endDate: "2024-11-30",
    location: "Melbourne, VIC",
    teamSize: 5,
    jobsCount: 8,
  },
  {
    id: 3,
    name: "Office HVAC Installation",
    client: "TechStart Inc",
    status: "planned",
    startDate: "2024-11-15",
    endDate: "2025-01-15",
    location: "Brisbane, QLD",
    teamSize: 0,
    jobsCount: 0,
  },
];

const mockEmployees = [
  { id: 1, name: "John Smith", role: "Electrician", email: "john@example.com" },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "HVAC Specialist",
    email: "sarah@example.com",
  },
  { id: 3, name: "Mike Wilson", role: "Plumber", email: "mike@example.com" },
  { id: 4, name: "Emma Brown", role: "Carpenter", email: "emma@example.com" },
  {
    id: 5,
    name: "David Lee",
    role: "General Labourer",
    email: "david@example.com",
  },
  {
    id: 6,
    name: "Lisa Chen",
    role: "Project Manager",
    email: "lisa@example.com",
  },
  {
    id: 7,
    name: "James Taylor",
    role: "Electrician",
    email: "james@example.com",
  },
  { id: 8, name: "Maria Garcia", role: "Plumber", email: "maria@example.com" },
];

const australianStates = [
  "New South Wales",
  "Victoria",
  "Queensland",
  "South Australia",
  "Western Australia",
  "Tasmania",
  "Northern Territory",
  "Australian Capital Territory",
];

const australianCities = [
  "Sydney",
  "Melbourne",
  "Brisbane",
  "Perth",
  "Adelaide",
  "Gold Coast",
  "Newcastle",
  "Canberra",
  "Wollongong",
  "Logan City",
  "Geelong",
  "Hobart",
  "Townsville",
  "Cairns",
  "Darwin",
];

export function ProjectsPage({ onViewProject }: ProjectsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [employeeSearchOpen, setEmployeeSearchOpen] = useState(false);

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewProject = (project: (typeof mockProjects)[0]) => {
    if (onViewProject) {
      onViewProject(project);
    }
  };

  const toggleEmployee = (employeeId: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const removeEmployee = (employeeId: number) => {
    setSelectedEmployees((prev) => prev.filter((id) => id !== employeeId));
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; text: string }> = {
      planned: { color: "bg-blue-50 text-blue-700", text: "Planned" },
      active: { color: "bg-green-50 text-green-700", text: "Active" },
      on_hold: { color: "bg-yellow-50 text-yellow-700", text: "On Hold" },
      completed: { color: "bg-gray-100 text-gray-700", text: "Completed" },
    };
    const variant = variants[status] || variants.planned;
    return (
      <Badge className={`${variant.color} border-0`}>{variant.text}</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Projects</p>
            <p className="text-3xl text-gray-900">24</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-3xl text-green-600">12</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Planned</p>
            <p className="text-3xl text-blue-600">8</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl text-gray-600">4</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">All Projects</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-6xl max-h-[90vh] overflow-y-auto"
                aria-describedby="create-project-description"
              >
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription id="create-project-description">
                    Create a new project with client, timeline, location, and
                    team assignments.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div>
                      <Label>Project Name *</Label>
                      <Input
                        placeholder="Enter project name"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Client *</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">ABC Corp</SelectItem>
                          <SelectItem value="2">
                            Green Valley Estates
                          </SelectItem>
                          <SelectItem value="3">TechStart Inc</SelectItem>
                          <SelectItem value="4">Logistics Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Status</Label>
                      <Select defaultValue="planned">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input type="date" className="mt-2" />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input type="date" className="mt-2" />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Project description"
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <div>
                      <Label>Location Name</Label>
                      <Input
                        placeholder="e.g., Main Office, Building A"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Address Line 1</Label>
                      <Input placeholder="Street address" className="mt-2" />
                    </div>

                    <div>
                      <Label>Address Line 2</Label>
                      <Input
                        placeholder="Apartment, suite, etc."
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>City</Label>
                        <Select>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="City" />
                          </SelectTrigger>
                          <SelectContent>
                            {australianCities.map((city) => (
                              <SelectItem key={city} value={city.toLowerCase()}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>State</Label>
                        <Select>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                          <SelectContent>
                            {australianStates.map((state) => (
                              <SelectItem
                                key={state}
                                value={state.toLowerCase()}
                              >
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Postcode</Label>
                        <Input placeholder="Postcode" className="mt-2" />
                      </div>
                    </div>

                    <div>
                      <Label>Assign Team Members</Label>
                      <Popover
                        open={employeeSearchOpen}
                        onOpenChange={setEmployeeSearchOpen}
                      >
                        <PopoverTrigger asChild className="w-full mt-2">
                          <Button
                            variant="outline"
                            type="button"
                            className="w-full justify-start text-left font-normal"
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            {selectedEmployees.length === 0
                              ? "Select team members..."
                              : `${selectedEmployees.length} member${
                                  selectedEmployees.length > 1 ? "s" : ""
                                } selected`}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search employees..." />
                            <CommandList>
                              <CommandEmpty>No employees found.</CommandEmpty>
                              <CommandGroup>
                                {mockEmployees.map((employee) => (
                                  <CommandItem
                                    key={employee.id}
                                    value={employee.name}
                                    onSelect={() => toggleEmployee(employee.id)}
                                  >
                                    <div className="flex items-center w-full">
                                      <div
                                        className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                                          selectedEmployees.includes(
                                            employee.id
                                          )
                                            ? "bg-blue-600 border-blue-600"
                                            : "border-gray-300"
                                        }`}
                                      >
                                        {selectedEmployees.includes(
                                          employee.id
                                        ) && (
                                          <Check className="h-3 w-3 text-white" />
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="text-sm">
                                          {employee.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {employee.role} • {employee.email}
                                        </div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {selectedEmployees.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedEmployees.map((empId) => {
                            const emp = mockEmployees.find(
                              (e) => e.id === empId
                            );
                            return emp ? (
                              <Badge
                                key={empId}
                                variant="outline"
                                className="bg-blue-50 text-blue-700 pr-1"
                              >
                                {emp.name}
                                <button
                                  onClick={() => removeEmployee(empId)}
                                  className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-gray-700">Project Name</TableHead>
                  <TableHead className="text-gray-700">Client</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                  <TableHead className="text-gray-700">Timeline</TableHead>
                  <TableHead className="text-gray-700">Location</TableHead>
                  <TableHead className="text-gray-700">Team</TableHead>
                  <TableHead className="text-gray-700">Jobs</TableHead>
                  <TableHead className="text-gray-700 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewProject(project)}
                  >
                    <TableCell className="text-gray-900">
                      {project.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {project.client}
                    </TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>
                          {new Date(project.startDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}{" "}
                          -{" "}
                          {new Date(project.endDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {project.location}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-gray-900">
                          {project.teamSize}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {project.jobsCount}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                          <button className="inline-flex items-center justify-center h-8 w-8 p-0 rounded-md hover:bg-accent hover:text-accent-foreground">
                            <MoreVertical size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProject(project);
                            }}
                          >
                            <Eye size={16} className="mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Edit size={16} className="mr-2" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => e.stopPropagation()}
                          >
                            <UserPlus size={16} className="mr-2" />
                            Manage Team
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete Project
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
}
