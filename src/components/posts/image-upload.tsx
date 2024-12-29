import { cn } from "@/lib/utils";
import { Image, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
}

export function ImageUpload({ onImagesChange }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    onImagesChange([...previews, ...newPreviews]);
  }, [previews, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 3
  });

  const removeImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onImagesChange(newPreviews);
  };

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
            {isDragActive ? "Déposez les images ici" : "Glissez-déposez des images ou cliquez pour sélectionner"}
          </p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {previews.map((preview, index) => (
            <div key={preview} className="relative aspect-square">
              <img
                src={preview}
                alt={`Preview ${index}`}
                className="absolute inset-0 w-full h-full object-cover rounded-md"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
