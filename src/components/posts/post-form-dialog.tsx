import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./image-upload";

interface PostFormDialogProps {
  onSubmit: (data: { title: string; content: string; images: string[] }) => void;
  initialData?: { title: string; content: string; images: string[] };
  isEdit?: boolean;
}

export function PostFormDialog({
  onSubmit,
  initialData = { title: "", content: "", images: [] },
  isEdit = false,
}: PostFormDialogProps) {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [images, setImages] = useState<string[]>(initialData.images);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && isEdit) {
      // Ne mettre à jour les champs que lors de l'édition
      setTitle(initialData.title);
      setContent(initialData.content);
      setImages(initialData.images);
    }
  }, [open, isEdit, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, images });
    setOpen(false);
    if (!isEdit) {
      // Réinitialiser uniquement après création, pas après modification
      setTitle("");
      setContent("");
      setImages([]);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && !isEdit) {
      // Réinitialiser uniquement à la fermeture en mode création
      setTitle("");
      setContent("");
      setImages([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>{isEdit ? "Modifier" : "Nouveau post"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le post" : "Créer un nouveau post"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <Textarea
            placeholder="Contenu"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <ImageUpload onImagesChange={setImages} />
          <Button type="submit">{isEdit ? "Modifier" : "Publier"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
