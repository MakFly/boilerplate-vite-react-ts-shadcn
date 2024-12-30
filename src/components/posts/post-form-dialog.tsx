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
  onSubmit: (data: { title: string; content: string; images: File[] }) => void;
  initialData?: {
    title: string;
    content: string;
    images: Array<{ id: number; imageUrl: string }>;
  };
  isEdit?: boolean;
  isLoading?: boolean;
}

export function PostFormDialog({
  onSubmit,
  initialData,
  isEdit = false,
  isLoading = false,
}: PostFormDialogProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [images, setImages] = useState<File[]>([]);
  const [open, setOpen] = useState(false);

  // On réinitialise les valeurs quand le dialog s'ouvre ou que initialData change
  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setImages([]);
    }
  }, [isEdit, initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      images,
    });
    setOpen(false);
    // Réinitialiser uniquement si ce n'est pas une édition
    if (!isEdit) {
      setTitle("");
      setContent("");
      setImages([]);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    // Réinitialiser les champs quand on ferme le dialogue (seulement en mode création)
    if (!isOpen && !isEdit) {
      setTitle("");
      setContent("");
      setImages([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEdit ? "Modification..." : "Création..."}
            </div>
          ) : (
            isEdit ? "Modifier" : "Nouveau post"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier le post" : "Créer un nouveau post"}
          </DialogTitle>
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
          <ImageUpload
            onImagesChange={setImages}
            initialImages={isEdit ? [] : (initialData?.images || [])}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEdit ? "Modification..." : "Publication..."}
              </div>
            ) : (
              isEdit ? "Modifier" : "Publier"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
