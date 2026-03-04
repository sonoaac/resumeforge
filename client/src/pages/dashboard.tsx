import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Resume } from "@shared/schema";
import type { ResumeData } from "@shared/schema";
import {
  Plus,
  FileText,
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
  Clock,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

function ResumeCard({ resume, onRename, onDuplicate, onDelete }: { 
  resume: Resume; 
  onRename: (id: string, title: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const formattedDate = resume.lastSaved
    ? new Date(resume.lastSaved).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Never saved';

  const resumeData = resume.resumeData as ResumeData;
  const isCV = resumeData?.documentType === "cv";
  const builderBase = isCV ? "/cv-builder" : "/builder";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <Link href={`${builderBase}/${resume.id}`} data-testid={`card-resume-${resume.id}`}>
          <div className="aspect-[3/4] bg-gradient-to-b from-slate-50 to-slate-100 p-4 relative">
            <div className="h-full bg-white rounded shadow-sm p-3 text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full" />
                <div>
                  <div className="h-2.5 w-20 bg-slate-800 rounded" />
                  <div className="h-1.5 w-16 bg-slate-300 rounded mt-1" />
                </div>
              </div>
              <div className="space-y-1.5 mt-3">
                <div className="h-1.5 w-full bg-slate-200 rounded" />
                <div className="h-1.5 w-5/6 bg-slate-200 rounded" />
                <div className="h-1.5 w-4/5 bg-slate-200 rounded" />
              </div>
              <div className="h-1.5 w-16 bg-primary/30 rounded mt-3" />
              <div className="space-y-1 mt-2">
                <div className="h-1 w-full bg-slate-100 rounded" />
                <div className="h-1 w-3/4 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
        </Link>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="font-medium text-slate-800 truncate">{resume.title}</h3>
                <Badge variant={isCV ? "default" : "secondary"} className="text-xs shrink-0 py-0">
                  {isCV ? "CV" : "Resume"}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0" data-testid={`menu-resume-${resume.id}`}>
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRename(resume.id, resume.title)} data-testid={`button-rename-${resume.id}`}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(resume.id)} data-testid={`button-duplicate-${resume.id}`}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(resume.id)} 
                  className="text-destructive"
                  data-testid={`button-delete-${resume.id}`}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function CreateResumeCard() {
  return (
    <Link href="/builder" data-testid="button-create-resume">
      <Card className="h-full min-h-[300px] border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-medium text-slate-800 mb-1">Create New Resume</h3>
          <p className="text-sm text-slate-500">Start fresh with a new resume</p>
        </div>
      </Card>
    </Link>
  );
}

function CreateCVCard() {
  return (
    <Link href="/cv-builder" data-testid="button-create-cv">
      <Card className="h-full min-h-[300px] border-dashed border-2 border-primary/40 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-medium text-slate-800 mb-1">Create New CV</h3>
          <p className="text-sm text-slate-500">Academic / research curriculum vitae</p>
        </div>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<{ id: string; title: string } | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const { data: resumes, isLoading: resumesLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
  });

  const renameMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      return apiRequest("PATCH", `/api/resumes/${id}`, { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({ title: "Resume renamed successfully" });
      setRenameDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to rename resume", variant: "destructive" });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/resumes/${id}/duplicate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({ title: "Resume duplicated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to duplicate resume", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/resumes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({ title: "Resume deleted successfully" });
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to delete resume", variant: "destructive" });
    },
  });

  const handleRename = (id: string, currentTitle: string) => {
    setSelectedResume({ id, title: currentTitle });
    setNewTitle(currentTitle);
    setRenameDialogOpen(true);
  };

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    const resume = resumes?.find(r => r.id === id);
    if (resume) {
      setSelectedResume({ id, title: resume.title });
      setDeleteDialogOpen(true);
    }
  };

  const confirmRename = () => {
    if (selectedResume && newTitle.trim()) {
      renameMutation.mutate({ id: selectedResume.id, title: newTitle.trim() });
    }
  };

  const confirmDelete = () => {
    if (selectedResume) {
      deleteMutation.mutate(selectedResume.id);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                Welcome back, {user?.firstName || "there"}!
              </h1>
              <p className="text-slate-600 mt-1">Manage your resumes and track your progress</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">Free</Badge>
            </div>
          </div>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                My Documents
              </h2>
              <div className="flex items-center gap-2">
                <Link href="/builder" data-testid="button-new-resume">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Resume
                  </Button>
                </Link>
                <Link href="/cv-builder" data-testid="button-new-cv">
                  <Button size="sm" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    New CV
                  </Button>
                </Link>
              </div>
            </div>

            {resumesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
                ))}
              </div>
            ) : resumes && resumes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <CreateResumeCard />
                <CreateCVCard />
                {resumes.map((resume) => (
                  <ResumeCard
                    key={resume.id}
                    resume={resume}
                    onRename={handleRename}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <CreateResumeCard />
                <CreateCVCard />
              </div>
            )}
          </section>


        </div>
      </main>

      <Footer />

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
            <DialogDescription>
              Enter a new name for your resume.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="resume-title">Resume Title</Label>
            <Input
              id="resume-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="My Resume"
              className="mt-2"
              data-testid="input-rename-title"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRename} disabled={renameMutation.isPending} data-testid="button-confirm-rename">
              {renameMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedResume?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete} 
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
