// components/TempImageDisplay.tsx
import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface TempImageDisplayProps {
  imageUrl: string;
  onDelete: () => void;
  alt?: string;
  width?: number;
  height?: number;
}

const TempImageDisplay: React.FC<TempImageDisplayProps> = ({
  imageUrl,
  onDelete,
  alt = "Uploaded image",
  width = 200,
  height = 200,
}) => {
  return (
    <div className="relative justify-end inline-block">
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className="rounded-lg"
      />
      <button
        onClick={onDelete}
        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default TempImageDisplay;
