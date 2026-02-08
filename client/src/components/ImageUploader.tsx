import React, { useState } from "react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  label?: string;
  onSelect: (file: File | null) => void;
}

const ImageUploader = ({ label, onSelect }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string>("");

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only images allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max 5MB allowed");
      return;
    }

    onSelect(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    onSelect(null);
    setPreview("");
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-2">{label}</label>

      {!preview ? (
        <label className="cursor-pointer border-2 border-dashed p-6 block text-center rounded-lg hover:border-blue-500 transition-colors">
          <input
            type="file"
            hidden
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <span className="text-gray-600">Click to upload image</span>
        </label>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-contain rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      {!preview && label !== "" && (
        <p className="text-red-500 text-xs italic mt-1">{`*${label} is required`}</p>
      )}
    </div>
  );
};

export default ImageUploader;
