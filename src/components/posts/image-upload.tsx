import { cn } from "@/lib/utils";
import { Image, X } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  initialImages?: Array<{ id: number; imageUrl: string }>;
}

export function ImageUpload({
  onImagesChange,
  initialImages = [],
}: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    // Convert initial images to Files if they exist
    const loadInitialImages = async () => {
      try {
        const imageFiles = await Promise.all(
          initialImages.map(async (img) => {
            const response = await fetch(img.imageUrl);
            const blob = await response.blob();
            return new File([blob], `image-${img.id}`, { type: blob.type });
          })
        );
        setFiles(imageFiles);
      } catch (error) {
        console.error("Error loading initial images:", error);
      }
    };

    if (initialImages.length > 0) {
      loadInitialImages();
    }
  }, [initialImages]);

  useEffect(() => {
    onImagesChange(files);
  }, [files, onImagesChange]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 3,
  });

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 sm:p-6 cursor-pointer text-center w-full",
          isDragActive ? "border-primary bg-secondary/20" : "border-gray-300"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Image className="w-8 h-8 mb-2 text-gray-500" />
          <p className="text-sm text-gray-500">
            {isDragActive
              ? "Déposez les images ici"
              : "Glissez-déposez des images ou cliquez pour sélectionner"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {files.map((file, index) => (
          <div key={`file-${index}`} className="relative aspect-square">
            <img
              src={URL.createObjectURL(file)}
              alt={`New ${index}`}
              className="absolute inset-0 w-full h-full object-cover rounded-md"
            />
            <button
              onClick={() => removeFile(index)}
              className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
