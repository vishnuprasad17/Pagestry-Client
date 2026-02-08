import { useState } from "react";
import axios, { AxiosProgressEvent } from "axios";
import toast from "react-hot-toast";
import { useGetCloudinarySignatureMutation } from "../redux/features/admin/adminApi";
import { useGetCloudinarySignatureMutation as useGetUserCloudinarySignatureMutation } from "../redux/features/user/userApi";

interface UseCloudinaryUploadProps {
  folder: string;
  context?: "adminSide" | "userSide";
}

interface CloudinarySignatureResponse {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  url: string;
  width: number;
  height: number;
  format: string;
}

export const useCloudinaryUpload = ({ folder, context = "adminSide" }: UseCloudinaryUploadProps) => {
  const [getAdminSignature] = useGetCloudinarySignatureMutation();
  const [getUserSignature] = useGetUserCloudinarySignatureMutation();
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  const uploadImage = async (file: File): Promise<CloudinaryUploadResponse> => {
    try {
      setUploading(true);
      setProgress(0);

      let sigRes: CloudinarySignatureResponse;
      if (context === "adminSide") {
        sigRes = await getAdminSignature({ folder }).unwrap();
      } else {
        sigRes = await getUserSignature({ folder }).unwrap();
      }
      const { signature, timestamp, apiKey, cloudName } = sigRes;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      const res = await axios.post<CloudinaryUploadResponse>(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          onUploadProgress: (e: AxiosProgressEvent) => {
            if (e.total) {
              setProgress(Math.round((e.loaded * 100) / e.total));
            }
          },
        }
      );

      return res.data; // secure_url, public_id, etc
    } catch (err) {
      toast.error("Image upload failed");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    progress,
    uploading,
  };
};