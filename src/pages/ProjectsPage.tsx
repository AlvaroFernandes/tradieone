import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import ModalComponent from "@/components/ModalComponent";
import ProjectForm from "@/components/ProjectForm";
import { getProjects, deleteProject } from "@/services/ProjectsService";

export type ProjectItem = {
  id: number;
  companyId?: number;
  clientId?: number;
  name: string;
  description?: string;
  startDate: string;
  status: string;
  endDate: string;
  createdBy?: number;
  createdOnUtc?: string;
  lastUpdatedUtc?: string;
  // Additional fields expected by route handler
  client: string;
  location: string;
  teamSize: number;
  jobsCount: number;
};

export function ProjectsPage({ onViewProject }: { onViewProject?: (project: ProjectItem) => void }) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      (async () => {
        setLoading(true);
        try {
          const res = await getProjects({ pageNumber: 1, pageSize: 200, keyword: search });
          const items = Array.isArray(res) ? res : res?.items ?? [];
          if (!mounted) return;
          setProjects(items);
        } catch (err) {
          console.error("Failed to load projects", err);
        } finally {
          if (mounted) setLoading(false);
          if (pageLoading) setPageLoading(false);
        }
      })();
    }, 200);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [search]);

  const filtered = projects.filter((p) => {
    const t = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(t) ||
      (p.description || "").toLowerCase().includes(t) ||
      String(p.clientId || "").includes(t) ||
      String(p.id || "").includes(t)
    );
  });

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
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">Projects</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input className="pl-9" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setModalOpen(true)}>New Project</Button>
              <ModalComponent open={modalOpen} onOpenChange={setModalOpen} title="Add Project" size="w80" type="add">
                <ProjectForm onCancel={() => setModalOpen(false)} />
              </ModalComponent>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Project</TableHead>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">Loading projects...</TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">No projects found.</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow key={p.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 bg-slate-200 text-slate-700">
                            <AvatarFallback>{(p.name || "").slice(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-gray-900">{p.name}</div>
                            <div className="text-sm text-gray-500">{p.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{p.clientId}</TableCell>
                      <TableCell>
                        <Badge className={p.status?.toLowerCase() === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"}>{p.status || "-"}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{p.startDate ? new Date(p.startDate).toLocaleDateString() : "-"}</TableCell>
                      <TableCell className="text-gray-600">{p.endDate ? new Date(p.endDate).toLocaleDateString() : "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center">
                          <button className="p-1 rounded hover:bg-gray-100" onClick={() => { setSelectedProject(p); setViewOpen(true); if (onViewProject) onViewProject(p as ProjectItem); }}>
                            View
                          </button>
                          <button className="p-1 rounded ml-2 hover:bg-gray-100" onClick={() => { setSelectedProject(p); setEditOpen(true); }}>
                            Edit
                          </button>
                          <button className="p-1 rounded ml-2 text-red-600 hover:bg-red-50" onClick={() => { setProjectToDelete(p); setDeleteOpen(true); }}>
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ModalComponent open={viewOpen} onOpenChange={setViewOpen} title="Project Details" size="w80" type="view">
        {selectedProject && (
          <div className="space-y-4 py-4">
            <h3 className="text-xl text-gray-900">{selectedProject.name}</h3>
            <p className="text-gray-700">{selectedProject.description}</p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <div className="text-sm text-gray-500">Client ID</div>
                <div className="text-gray-900">{selectedProject.clientId}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="text-gray-900">{selectedProject.status}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Start Date</div>
                <div className="text-gray-900">{selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleString() : "-"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">End Date</div>
                <div className="text-gray-900">{selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleString() : "-"}</div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setViewOpen(false); setEditOpen(true); }}>Edit</Button>
            </div>
          </div>
        )}
      </ModalComponent>

      <ModalComponent open={editOpen} onOpenChange={setEditOpen} title={selectedProject ? `Edit: ${selectedProject.name}` : "Edit Project"} size="w80" type="edit">
        {selectedProject && (
          <ProjectForm type="edit" projectId={selectedProject.id} initialValues={selectedProject as any} onCancel={() => setEditOpen(false)} />
        )}
      </ModalComponent>

      <ModalComponent open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Project" description="Confirm deletion" size="sm" type="delete">
        <div className="space-y-4 py-2">
          <p className="text-gray-900">Project: <strong>{projectToDelete?.name}</strong></p>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={async () => {
              if (projectToDelete?.id) {
                try {
                  await deleteProject(projectToDelete.id);
                  setProjects((prev) => prev.filter((x) => x.id !== projectToDelete.id));
                } catch (err) {
                  console.error("Failed to delete project", err);
                }
              }
              setDeleteOpen(false);
              setProjectToDelete(null);
            }}>Delete</Button>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}
