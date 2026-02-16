import { useEffect, useRef, useState } from "react";
import StatsCards from "@/components/StatsCards";
import ModalComponent from "@/components/ModalComponent";
import JobForm from "@/components/JobForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MapPin, MoreVertical, Search, Flag } from "lucide-react";
import { getJobs } from "@/services/JobsService";
import type { Job } from "@/services/JobsService";

type JobTableRow = Job & {
  // allow API to return additional fields
  [key: string]: unknown;
};

const JobsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState("");
  const [jobs, setJobs] = useState<JobTableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const initialLoadRef = useRef(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobTableRow | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobTableRow | null>(null);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      (async () => {
        setLoading(true);
        try {
          const res = await getJobs({ pageNumber: 1, pageSize: 100, keyword: searchTerms });
          const items = Array.isArray(res) ? res : res?.items ?? [];
          if (!mounted) return;
          setJobs(items as JobTableRow[]);
        } catch (err) {
          console.error("Failed to load jobs", err);
        } finally {
          if (mounted) setLoading(false);
          if (initialLoadRef.current) {
            initialLoadRef.current = false;
            setPageLoading(false);
          }
        }
      })();
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [searchTerms, refreshKey]);

  // name-based search (job title)
  const filteredJobs = jobs.filter((j) => {
    const term = searchTerms.toLowerCase().trim();
    if (!term) return true;
    return String(j.title || "").toLowerCase().includes(term);
  });

  const totalJobs = filteredJobs.length;
  const openJobs = filteredJobs.filter((j) => String(j.status || "").toLowerCase() === "open").length;
  const inProgressJobs = filteredJobs.filter((j) => String(j.status || "").toLowerCase() === "in progress").length;
  const completedJobs = filteredJobs.filter((j) => String(j.status || "").toLowerCase() === "completed").length;

  const statsData = [
    { title: "Total Jobs", stats: totalJobs, type: "number" as const },
    { title: "Open", stats: openJobs, style: "text-blue-700", type: "number" as const },
    { title: "In Progress", stats: inProgressJobs, style: "text-amber-700", type: "number" as const },
    { title: "Completed", stats: completedJobs, style: "text-green-700", type: "number" as const },
  ];

  const tableRows = loading ? (
    <TableRow>
      <TableCell colSpan={7} className="text-center text-gray-500 py-6">
        Loading jobs...
      </TableCell>
    </TableRow>
  ) : filteredJobs.length === 0 ? (
    <TableRow>
      <TableCell colSpan={7} className="text-center text-gray-500 py-6">
        No jobs found.
      </TableCell>
    </TableRow>
  ) : (
    filteredJobs.map((j, idx) => (
      <TableRow
        key={String(j.id ?? idx)}
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => {
          setSelectedJob(j);
          setViewModalOpen(true);
        }}
      >
        <TableCell>
          <div className="text-gray-900">{j.title || "-"}</div>
          <div className="text-sm text-gray-500">{j.locationName || "-"}</div>
        </TableCell>
        <TableCell className="text-gray-600">{j.clientId ?? "-"}</TableCell>
        <TableCell className="text-gray-600">{j.projectId ? j.projectId : "-"}</TableCell>
        <TableCell>
          <Badge className={(String(j.status || "").toLowerCase() === "completed") ? "bg-green-50 text-green-700 border-0" : "bg-gray-100 text-gray-700 border-0"}>
            {j.status || "-"}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge className={String(j.priority || "").toLowerCase() === "high" ? "bg-red-50 text-red-700 border-0" : "bg-blue-50 text-blue-700 border-0"}>
            {j.priority || "-"}
          </Badge>
        </TableCell>
        <TableCell className="text-gray-600">{j.startDate ? new Date(j.startDate).toLocaleDateString() : "-"}</TableCell>
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
                  setSelectedJob(j);
                  setViewModalOpen(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedJob(j);
                  setEditModalOpen(true);
                }}
              >
                Edit Job
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setJobToDelete(j);
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
            <CardTitle className="text-gray-900">All Jobs</CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setModalOpen(true)}>
              New Job
            </Button>
            <ModalComponent open={modalOpen} onOpenChange={setModalOpen} title="Add New Job" site="Jobs" size="w80" type="add">
              <JobForm
                onCancel={() => setModalOpen(false)}
                onSaved={() => setRefreshKey((k) => k + 1)}
              />
            </ModalComponent>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search jobs by title..."
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table className="border border-gray-200 rounded-lg overflow-hidden">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-100">
                  <TableHead>Job</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Start</TableHead>
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
        title="Job Details"
        description="View complete information about this job."
        size="w80"
        type="view"
      >
        {selectedJob && (
          <div className="space-y-6 py-4">
            <div className="pb-4 border-b">
              <h3 className="text-xl text-gray-900">{selectedJob.title}</h3>
              <p className="text-sm text-gray-500">{selectedJob.description || ""}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Location</Label>
                </div>
                <p className="text-gray-900">{selectedJob.locationName || "-"}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Flag size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Priority</Label>
                </div>
                <p className="text-gray-900">{selectedJob.priority || "-"}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Start</Label>
                </div>
                <p className="text-gray-900">
                  {selectedJob.startDate || "-"} {selectedJob.startTime ? `(${selectedJob.startTime})` : ""}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-gray-400" />
                  <Label className="text-gray-700">End</Label>
                </div>
                <p className="text-gray-900">
                  {selectedJob.endDate || "-"} {selectedJob.finishTime ? `(${selectedJob.finishTime})` : ""}
                </p>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-gray-400" />
                  <Label className="text-gray-700">Address</Label>
                </div>
                <p className="text-gray-900">
                  {selectedJob.addressLine1 || "-"}
                  {selectedJob.addressLine2 ? <>, {selectedJob.addressLine2}</> : null}
                  <br />
                  {selectedJob.city}, {selectedJob.state} {selectedJob.postcode}
                  {selectedJob.country ? <>, {selectedJob.country}</> : null}
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
                Edit Job
              </Button>
            </div>
          </div>
        )}
      </ModalComponent>

      <ModalComponent
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone."
        size="sm"
        type="delete"
      >
        <div className="space-y-4 py-2">
          <p className="text-gray-900">
            Job: <strong>{jobToDelete?.title}</strong>
          </p>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (jobToDelete?.id != null) {
                  try {
                    await import("@/services/JobsService").then(({ deleteJob }) => deleteJob(jobToDelete.id));
                    setJobs((prev) => prev.filter((x) => x.id !== jobToDelete.id));
                  } catch (err) {
                    console.error("Failed to delete job", err);
                  }
                }
                setDeleteModalOpen(false);
                setJobToDelete(null);
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
        title={selectedJob ? `Edit Job: ${selectedJob.title}` : "Edit Job"}
        site="Jobs"
        size="w80"
        type="edit"
      >
        {selectedJob && (
          <JobForm
            type="edit"
            jobId={Number(selectedJob.id)}
            initialValues={selectedJob}
            onSaved={() => setRefreshKey((k) => k + 1)}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </ModalComponent>
    </div>
  );
};

export default JobsPage;