import React, { useRef } from "react";
import { Button } from "../ui/button";
import { ImageIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      const uniqueFileName = `${uuidv4()}_${file.name}`;
      const supabase = createClient();

      const { data, error } = await supabase.storage
        .from("images")
        .upload(`public/${uniqueFileName}`, file);

      if (error) {
        console.error("Error uploading file:", error);
      } else {
        const imageUrl = supabase.storage
          .from("images")
          .getPublicUrl(`public/${uniqueFileName}`).data.publicUrl;
        onImageUpload(imageUrl);
      }
      // Reset the file input's value after upload
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            onClick={handleButtonClick}
            variant="outline"
            size="icon"
            className="hover:bg-accent"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Upload an image</p>
        </TooltipContent>
      </Tooltip>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </TooltipProvider>
  );
};

export default ImageUpload;
