import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { Post } from "@/types/post";
import { PostFormDialog } from "./post-form-dialog";
import { ImageViewerModal } from "./image-viewer-modal";
import { useState } from "react";

interface PostCardProps {
  post: Post;
  onDelete: () => void;
  onEdit: (data: { title: string; content: string; images: File[] }) => void;
  onDeleteImage?: (imageId: number) => void;
}

export function PostCard({
  post,
  onDelete,
  onEdit,
  onDeleteImage,
}: PostCardProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const handleEdit = (data: {
    title: string;
    content: string;
    images: File[];
  }) => {
    // On passe directement les nouvelles images au parent
    onEdit({
      title: data.title,
      content: data.content,
      images: data.images
    });
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-xl break-words">{post.title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <PostFormDialog
            onSubmit={handleEdit}
            initialData={{
              title: post.title,
              content: post.content,
              images: post.images || [],
            }}
            isEdit
          />
          <Button variant="destructive" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {post.images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={image.imageUrl}
                  alt={`Image ${index + 1} du post`}
                  className="absolute inset-0 w-full h-full object-cover rounded-md cursor-pointer"
                  onClick={() => setSelectedImageIndex(index)}
                />
                {onDeleteImage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteImage(image.id);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {selectedImageIndex !== null && (
          <ImageViewerModal
            images={post.images.map((img) => img.imageUrl)}
            initialIndex={selectedImageIndex}
            open={selectedImageIndex !== null}
            onOpenChange={(open) => !open && setSelectedImageIndex(null)}
          />
        )}
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600 break-words">{post.content}</p>
          <p className="text-sm text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
