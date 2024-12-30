import { useEffect, useState } from "react";
import { PostCard } from "@/components/posts/post-card";
import { PostFormDialog } from "@/components/posts/post-form-dialog";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Post {
  id: number;
  title: string;
  content: string;
  images?: string[];
  createdAt: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    title: "Premier post",
    content: "Contenu du premier post",
    images: [
      "https://picsum.photos/seed/1/800/600",
      "https://picsum.photos/seed/2/800/600"
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Deuxième post",
    content: "Contenu du deuxième post",
    createdAt: new Date().toISOString(),
  },
];

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Simuler le chargement des posts
    setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreatePost = (data: { title: string; content: string; images: string[] }) => {
    const newPost: Post = {
      id: posts.length + 1,
      title: data.title,
      content: data.content,
      images: data.images,
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
  };

  const handleEditPost = (id: number, data: { title: string; content: string; images: string[] }) => {
    setPosts(posts.map(post => post.id === id ? { ...post, ...data } : post));
  };

  const handleDeletePost = (id: number) => {
    console.log("Deleting post:", id);
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

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

      <div className="grid gap-6 auto-rows-fr">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">Aucun post disponible</p>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onDelete={() => handleDeletePost(post.id)} 
              onEdit={(data) => handleEditPost(post.id, data)}
            />
          ))
        )}
      </div>
    </div>
  );
}
