import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Post } from "@/types/post";
import { PostFormDialog } from "./post-form-dialog";
import { ImageViewerModal } from "./image-viewer-modal";
import { useState } from "react";

interface PostCardProps {
  post: Post;
  onDelete: () => void;
  onEdit: (data: { title: string; content: string; images: string[] }) => void;
}

export function PostCard({ post, onDelete, onEdit }: PostCardProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-xl break-words">{post.title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <PostFormDialog
            onSubmit={onEdit}
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
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`Image ${index + 1} du post`}
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>

            {selectedImageIndex !== null && (
              <ImageViewerModal
                images={post.images}
                initialIndex={selectedImageIndex}
                open={selectedImageIndex !== null}
                onOpenChange={(open) => !open && setSelectedImageIndex(null)}
              />
            )}
          </>
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
