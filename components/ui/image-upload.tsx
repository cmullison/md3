"use client";

import { ChangeEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { Input } from "./input";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      const uniqueFileName = `${uuidv4()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`public/${uniqueFileName}`, file);

      if (error) {
        console.error("Error uploading file:", error);
      } else {
        const imageUrl = supabase.storage
          .from("images")
          .getPublicUrl(`public/${uniqueFileName}`).data.publicUrl;
        onChange(imageUrl);
      }
    }
  };

  return (
    <div className="p-4">
      <Input
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={handleFileChange}
        className="relative w-auto h-auto rounded-md overflow-x-auto whitespace-nowrap text-ellipsis"
      />
      <div className="mt-4 grid grid-cols-3 gap-4">
        {value.map((imgSrc, index) => (
          <div
            key={imgSrc}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(imgSrc)}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              src={imgSrc}
              alt={`Uploaded ${index}`}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
