import { useEffect, useState } from "react";
import { PostCard } from "@/components/posts/post-card";
import { PostFormDialog } from "@/components/posts/post-form-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useApi } from "@/lib/useApi";
import { Post } from "@/types/post";
import { PostSkeleton } from "@/components/posts/post-skeleton";

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPostId, setLoadingPostId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const api = useApi();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Post[]>("/api/posts");
      setPosts(data);
    } catch (err) {
      setError("Erreur lors du chargement des posts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (data: {
    title: string;
    content: string;
    images: File[];
  }) => {
    try {
      setIsCreating(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);

      // Ajout des images
      data.images.forEach((file) => {
        formData.append("images[]", file);
      });

      const newPost = await api.post<Post>("/api/posts", formData, true);
      setPosts((prev) => [newPost, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création du post");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditPost = async (
    id: number,
    data: {
      title: string;
      content: string;
      images: File[];
    }
  ) => {
    try {
      setLoadingPostId(id);

      // 1. Mise à jour des données textuelles avec PUT JSON
      const updatedPost = await api.put<Post>("/api/posts", id, {
        title: data.title,
        content: data.content,
      });

      // 2. Upload des images séparément si présentes
      if (data.images && data.images.length > 0) {
        const postWithImages = await api.uploadImages<Post>(
          "/api/posts",
          id,
          data.images
        );
        setPosts((prev) =>
          prev.map((post) => (post.id === id ? postWithImages : post))
        );
      } else {
        setPosts((prev) =>
          prev.map((post) => (post.id === id ? updatedPost : post))
        );
      }
    } catch (err) {
      console.error("Erreur d'édition:", err);
      setError("Erreur lors de la modification du post");
    } finally {
      setLoadingPostId(null);
    }
  };

  const handleDeleteImage = async (postId: number, imageId: number) => {
    try {
      await api.delete(`/api/posts/${postId}/images`, imageId);
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              images: post.images.filter((img) => img.id !== imageId),
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression de l'image");
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await api.delete("/api/posts", id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression du post");
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 w-full max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Posts</h1>
        <PostFormDialog onSubmit={handleCreatePost} />
      </div>

      {isLoading ? (
        <div className="grid gap-6 auto-rows-fr">
          {[1, 2, 3].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 auto-rows-fr">
          {isCreating && <PostSkeleton />}
          {posts.length === 0 && !isCreating ? (
            <p className="text-center text-gray-500">Aucun post disponible</p>
          ) : (
            posts.map((post) =>
              loadingPostId === post.id ? (
                <PostSkeleton key={post.id} />
              ) : (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={() => handleDeletePost(post.id)}
                  onEdit={(data) => handleEditPost(post.id, data)}
                  onDeleteImage={(imageId) =>
                    handleDeleteImage(post.id, imageId)
                  }
                />
              )
            )
          )}
        </div>
      )}
    </div>
  );
}
