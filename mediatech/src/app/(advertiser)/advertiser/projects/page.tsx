import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderOpenIcon, PlusIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

export const metadata = { title: "My Projects - MediaHub" };

interface SearchParams { action?: string; projectId?: string; }

export default async function AdvertiserProjectsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;

  // Server actions
  async function createProject(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    if (!name) return;
    const { db } = await import("@/lib/db");
    await db.project.create({
      data: { advertiserId: s.user.id, name, description: description || null }
    });
    redirect("/advertiser/projects");
  }

  async function deleteProject(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const projectId = formData.get("projectId") as string;
    const { db } = await import("@/lib/db");
    await db.project.delete({ where: { id: projectId, advertiserId: s.user.id } });
    redirect("/advertiser/projects");
  }

  const projects = await db.project.findMany({
    where: { advertiserId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { tasks: true } },
      tasks: {
        select: { status: true },
        take: 100,
      },
    },
  });

  const showForm = params.action === "new";

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-xs text-muted font-inter">Home &gt; My Projects</span>
          <h1 className="text-2xl font-bold font-space text-dark mt-1">My Projects</h1>
          <p className="text-sm text-muted font-inter mt-1">Group your tasks into campaigns for easy tracking</p>
        </div>
        <Link href="/advertiser/projects?action=new" className="btn btn-primary font-space font-semibold flex items-center gap-2" style={{ borderRadius: "8px", padding: "10px 20px" }}>
          <PlusIcon className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* New Project Form */}
      {showForm && (
        <div className="card bg-card border-base rounded-xl p-6 mb-6">
          <h2 className="font-space font-semibold text-dark text-lg mb-5">Create New Project</h2>
          <form action={createProject} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Project Name *</label>
              <input name="name" required placeholder="e.g. Q4 Link Building Campaign" className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Description (optional)</label>
              <textarea name="description" rows={3} placeholder="Brief description of this project..." className="input" style={{ resize: "vertical" }} />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary font-space font-semibold" style={{ borderRadius: "8px", padding: "10px 24px" }}>Create Project</button>
              <Link href="/advertiser/projects" className="btn btn-outline font-space font-semibold" style={{ borderRadius: "8px", padding: "10px 24px" }}>Cancel</Link>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="card bg-card border-base rounded-xl p-16 flex flex-col items-center text-center">
          <FolderOpenIcon className="w-14 h-14 text-muted mb-4" />
          <p className="font-space font-semibold text-dark text-xl mb-2">No projects yet</p>
          <p className="text-muted font-inter text-sm mb-6 max-w-sm">Create your first project to group related tasks and track campaigns in one place.</p>
          <Link href="/advertiser/projects?action=new" className="btn btn-primary font-space font-semibold" style={{ borderRadius: "8px", padding: "10px 24px" }}>
            Create First Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {projects.map((proj: any) => {
            const completed = proj.tasks.filter((t: any) => t.status === "COMPLETED").length;
            const active = proj.tasks.filter((t: any) => ["IN_PROGRESS", "YOUR_APPROVAL", "IMPROVEMENT"].includes(t.status)).length;
            const total = proj._count.tasks;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div key={proj.id} className="card bg-card border-base rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#EEF0FD] flex-shrink-0">
                      <FolderOpenIcon className="w-5 h-5 text-primary" />
                    </div>
                    <form action={deleteProject}>
                      <input type="hidden" name="projectId" value={proj.id} />
                      <button type="submit" className="text-xs text-muted hover:text-danger font-inter transition-colors">Delete</button>
                    </form>
                  </div>
                  <h3 className="font-space font-bold text-dark text-base mt-3 mb-1">{proj.name}</h3>
                  {proj.description && <p className="text-xs text-muted font-inter line-clamp-2">{proj.description}</p>}
                </div>

                {/* Stats */}
                <div className="flex gap-3 mb-4 text-center">
                  {[["Total", total], ["Active", active], ["Done", completed]].map(([label, val]: any) => (
                    <div key={label as string} className="flex-1 bg-app rounded-lg py-2">
                      <p className="text-sm font-bold font-space text-dark">{val}</p>
                      <p className="text-xs text-muted font-inter">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                {total > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-inter text-muted mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted font-inter">{new Date(proj.createdAt).toLocaleDateString()}</p>
                  <Link href={`/advertiser/tasks?projectId=${proj.id}`} className="text-xs text-primary font-semibold font-inter flex items-center gap-1 hover:underline">
                    <ClipboardDocumentListIcon className="w-3 h-3" />
                    View tasks
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
