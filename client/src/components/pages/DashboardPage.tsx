import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import apiClient from "@/api/axios";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface DashboardPageProps {
  onLogout: () => void;
}

export function DashboardPage({ onLogout }: DashboardPageProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const fetchNotes = async () => {
    try {
      const response = await apiClient.get("/api/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async () => {
    if (!newNoteTitle) return;
    try {
      await apiClient.post("/api/notes", {
        title: newNoteTitle,
        content: newNoteContent,
      });
      setNewNoteTitle("");
      setNewNoteContent("");
      setIsDialogOpen(false);
      fetchNotes();
    } catch (error: any) {
      if (error.response?.status === 403) {
        setShowUpgrade(true);
        setIsDialogOpen(false);
      }
      console.error("Failed to create note:", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await apiClient.delete(`/api/notes/${noteId}`);
      fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleUpgrade = async () => {
    try {
      await apiClient.post("/api/tenants/any-slug/upgrade");
      setShowUpgrade(false);
      alert("Upgrade successful! You can now create unlimited notes.");
    } catch (error) {
      alert("Upgrade failed. Only admins can upgrade.");
      console.error("Failed to upgrade:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <div className="flex items-center space-x-4">
            {showUpgrade && (
              <Button onClick={handleUpgrade}>Upgrade to Pro</Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer border-1">Create Note</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] backdrop-blur-md bg-white/80">
                <DialogHeader>
                  <DialogTitle>Create a New Note</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Note Title"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Note Content"
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateNote}>Save Note</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              onClick={onLogout}
              className="border-1 cursor-pointer"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.length > 0 ? (
            notes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                  <CardDescription>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{note.content}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="destructive"
                    size="sm"
                    className=" bg-gray-800 cursor-pointer hover:bg-gray-600"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p>No notes yet. Create one!</p>
          )}
        </div>
      </div>
    </div>
  );
}
