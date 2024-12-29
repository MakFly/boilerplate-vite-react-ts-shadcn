import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { ImageUpload } from "./image-upload"

interface CreatePostDialogProps {
  onSubmit: (data: { title: string; content: string; images: string[] }) => void
}

export function CreatePostDialog({ onSubmit }: CreatePostDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, content, images })
    setTitle("")
    setContent("")
    setImages([])
    setOpen(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Réinitialiser le formulaire quand la modal se ferme
      setTitle("");
      setContent("");
      setImages([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Nouveau post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus // Ajout de l'autoFocus ici
          />
          <Textarea
            placeholder="Contenu"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <ImageUpload onImagesChange={setImages} />
          <Button type="submit">Publier</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
