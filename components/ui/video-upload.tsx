// components/ui/video-upload.tsx
"use client";
import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "./button";
import { createClient } from "@/utils/supabase/client";

interface VideoUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: () => void;
  value: string;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const storage = useMemo(() => supabase.storage, [supabase.storage]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setLoading(true);
      const file = acceptedFiles[0];
      if (file) {
        try {
          const fileName = `${Date.now()}-${file.name}`;

          const { data, error } = await supabase.storage
            .from("videos")
            .upload(fileName, file);

          if (error) {
            console.error("Supabase storage error:", error);
            throw error;
          }

          const { data: publicUrlData } = storage
            .from("videos")
            .getPublicUrl(fileName);

          if (publicUrlData) {
            onChange(publicUrlData.publicUrl);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          // You might want to set an error state here and display it to the user
        }
      }
      setLoading(false);
    },
    [onChange, storage, supabase.storage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    multiple: false,
    disabled: disabled,
  });

  return (
    <div className="mb-6">
      <div
        {...getRootProps()}
        className={`
      border-3 border-dashed rounded-lg p-6
      transition-all duration-300 ease-in-out
      ${
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-gray-300 hover:border-primary/50 hover:bg-green-600"
      }
    `}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative group">
            <video
              src={value}
              className="w-full rounded-md shadow-lg"
              controls
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                variant="destructive"
                size="icon"
                className="rounded-full shadow-md"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Upload className="h-16 w-16 text-primary/60 mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Drag and drop your video here
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Or click to browse your files
            </p>
          </div>
        )}
      </div>
      {loading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="ml-3 text-sm font-medium text-gray-700">Uploading...</p>
        </div>
      )}
    </div>
  );
};
