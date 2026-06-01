"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { BookOpen, ArrowLeft, Plus, X, Video, FileText, ChevronDown, ChevronRight, GripVertical, Settings2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import * as React from "react";

export default function CourseBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState("");
  const [activeChapterId, setActiveChapterId] = useState("");
  
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonNotesUrl, setLessonNotesUrl] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");

  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  async function loadCourse() {
    try {
      const data = await fetchApi(`/admin/courses/${courseId}`);
      if (!data) throw new Error("Course not found");
      setCourse(data);
      
      // Auto expand all chapters initially
      const expandState: Record<string, boolean> = {};
      data.chapters?.forEach((c: any) => {
        expandState[c.id] = true;
      });
      setExpandedChapters(expandState);
    } catch (err: any) {
      setError(err.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  }

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- CHAPTER ACTIONS ---

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingChapterId) {
        await fetchApi(`/admin/chapters/${editingChapterId}`, {
          method: "PATCH",
          body: JSON.stringify({ title: chapterTitle })
        });
        toast.success("Module updated");
      } else {
        await fetchApi(`/admin/courses/${courseId}/chapters`, {
          method: "POST",
          body: JSON.stringify({ title: chapterTitle, order: course.chapters?.length || 0 })
        });
        toast.success("Module created");
      }
      setShowChapterModal(false);
      resetChapterForm();
      loadCourse();
    } catch (err: any) {
      toast.error(err.message || "Failed to save module");
    }
  };

  const handleDeleteChapter = async (id: string) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    try {
      await fetchApi(`/admin/chapters/${id}`, { method: 'DELETE' });
      toast.success("Module deleted");
      loadCourse();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete module");
    }
  };

  const resetChapterForm = () => {
    setEditingChapterId("");
    setChapterTitle("");
  };

  const openEditChapter = (chapter: any) => {
    setEditingChapterId(chapter.id);
    setChapterTitle(chapter.title);
    setShowChapterModal(true);
  };

  // --- LESSON ACTIONS ---

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLessonId) {
        await fetchApi(`/admin/lessons/${editingLessonId}`, {
          method: "PATCH",
          body: JSON.stringify({ 
            title: lessonTitle,
            videoUrl: lessonVideoUrl || undefined,
            notesUrl: lessonNotesUrl || undefined,
            duration: parseInt(lessonDuration) || 0
          })
        });
        toast.success("Lesson updated");
      } else {
        const chapter = course.chapters.find((c: any) => c.id === activeChapterId);
        await fetchApi(`/admin/chapters/${activeChapterId}/lessons`, {
          method: "POST",
          body: JSON.stringify({ 
            title: lessonTitle,
            videoUrl: lessonVideoUrl || undefined,
            notesUrl: lessonNotesUrl || undefined,
            duration: parseInt(lessonDuration) || 0,
            order: chapter?.lessons?.length || 0
          })
        });
        toast.success("Lesson added");
      }
      setShowLessonModal(false);
      resetLessonForm();
      loadCourse();
    } catch (err: any) {
      toast.error(err.message || "Failed to save lesson");
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await fetchApi(`/admin/lessons/${id}`, { method: 'DELETE' });
      toast.success("Lesson deleted");
      loadCourse();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete lesson");
    }
  };

  const resetLessonForm = () => {
    setEditingLessonId("");
    setActiveChapterId("");
    setLessonTitle("");
    setLessonVideoUrl("");
    setLessonNotesUrl("");
    setLessonDuration("");
  };

  const openAddLesson = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setShowLessonModal(true);
  };

  const openEditLesson = (lesson: any, chapterId: string) => {
    setActiveChapterId(chapterId);
    setEditingLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setLessonVideoUrl(lesson.videoUrl || "");
    setLessonNotesUrl(lesson.notesUrl || "");
    setLessonDuration(lesson.duration.toString());
    setShowLessonModal(true);
  };

  if (loading) return (
    <div className="space-y-6 animate-in fade-in">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-[400px] w-full rounded-2xl" />
    </div>
  );

  if (error || !course) return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="text-destructive font-semibold text-xl">{error || "Course not found"}</div>
      <Button variant="outline" onClick={() => router.push('/admin/courses')}>Go Back</Button>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
        <div>
          <button 
            onClick={() => router.push('/admin/courses')}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold font-heading">{course.title}</h1>
             <Badge variant={course.isPublished ? 'default' : 'secondary'} className={course.isPublished ? 'bg-success hover:bg-success/90 text-white' : ''}>
               {course.isPublished ? 'Live' : 'Draft'}
             </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 font-medium">
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{course.subject}</span>
            <span>•</span>
            <span>{course.class} | {course.board}</span>
          </div>
        </div>
        <Button onClick={() => { resetChapterForm(); setShowChapterModal(true); }} className="rounded-full font-bold shadow-sm gap-2 shrink-0 h-11 px-6">
           <Plus className="w-4 h-4" /> Add Module
        </Button>
      </div>

      <div className="bg-white border rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="font-bold font-heading text-xl mb-6">Course Modules ({course.chapters?.length || 0})</h3>
        
        {(!course.chapters || course.chapters.length === 0) ? (
          <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-slate-50 text-slate-500">
             <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
             <p className="font-medium text-lg">No modules yet</p>
             <p className="text-sm mt-1 mb-4">Get started by creating your first course module.</p>
             <Button variant="outline" onClick={() => { resetChapterForm(); setShowChapterModal(true); }}>
               <Plus className="w-4 h-4 mr-2" /> Create Module
             </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {course.chapters.map((chapter: any, index: number) => (
              <div key={chapter.id} className="border rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:border-slate-300">
                <div className="flex items-center justify-between p-4 bg-slate-50 border-b">
                  <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleChapter(chapter.id)}>
                    <GripVertical className="w-5 h-5 text-slate-400 cursor-grab active:cursor-grabbing hover:text-slate-600" />
                    <button className="p-1 hover:bg-slate-200 rounded text-slate-500">
                      {expandedChapters[chapter.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <div>
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        Module {index + 1}: {chapter.title}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">{chapter.lessons?.length || 0} Lessons</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditChapter(chapter)} className="h-8 text-slate-600">
                      <Settings2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteChapter(chapter.id)} className="h-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {expandedChapters[chapter.id] && (
                  <div className="p-4 bg-white">
                    <div className="space-y-2">
                      {chapter.lessons?.map((lesson: any, lIndex: number) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0 group-hover:bg-white group-hover:text-primary transition-colors">
                              {lIndex + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{lesson.title}</p>
                              <div className="flex items-center gap-3 mt-1">
                                {lesson.videoUrl && <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1"><Video className="w-3 h-3" /> Video</span>}
                                {lesson.notesUrl && <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1"><FileText className="w-3 h-3" /> Notes</span>}
                                {lesson.duration > 0 && <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{lesson.duration} min</span>}
                              </div>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditLesson(lesson, chapter.id)}>
                              <Settings2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteLesson(lesson.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openAddLesson(chapter.id)} 
                      className="mt-4 w-full border-dashed text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Lesson to Module {index + 1}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chapter Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                 <h3 className="font-bold font-heading text-lg">{editingChapterId ? "Edit Module" : "Add New Module"}</h3>
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setShowChapterModal(false); resetChapterForm(); }}>
                    <X className="w-5 h-5" />
                 </Button>
              </div>
              <form onSubmit={handleSaveChapter} className="p-6 space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Module Title *</label>
                    <Input 
                       required 
                       placeholder="e.g. Introduction to React" 
                       value={chapterTitle} 
                       onChange={e => setChapterTitle(e.target.value)} 
                    />
                 </div>
                 <Button type="submit" className="w-full font-bold mt-4">{editingChapterId ? "Save Changes" : "Create Module"}</Button>
              </form>
           </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                 <h3 className="font-bold font-heading text-lg">{editingLessonId ? "Edit Lesson" : "Add New Lesson"}</h3>
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setShowLessonModal(false); resetLessonForm(); }}>
                    <X className="w-5 h-5" />
                 </Button>
              </div>
              <form onSubmit={handleSaveLesson} className="p-6 space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Lesson Title *</label>
                    <Input 
                       required 
                       placeholder="e.g. Component Lifecycle" 
                       value={lessonTitle} 
                       onChange={e => setLessonTitle(e.target.value)} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2"><Video className="w-4 h-4 text-slate-400" /> Video URL (Optional)</label>
                    <Input 
                       placeholder="e.g. https://youtube.com/..." 
                       value={lessonVideoUrl} 
                       onChange={e => setLessonVideoUrl(e.target.value)} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /> Notes/PDF URL (Optional)</label>
                    <Input 
                       placeholder="e.g. https://drive.google.com/..." 
                       value={lessonNotesUrl} 
                       onChange={e => setLessonNotesUrl(e.target.value)} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold">Duration (minutes)</label>
                    <Input 
                       type="number"
                       min="0"
                       placeholder="e.g. 15" 
                       value={lessonDuration} 
                       onChange={e => setLessonDuration(e.target.value)} 
                    />
                 </div>
                 <Button type="submit" className="w-full font-bold mt-4">{editingLessonId ? "Save Changes" : "Create Lesson"}</Button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
