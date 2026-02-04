import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadResult {
  url: string;
  path: string;
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File): Promise<UploadResult | null> => {
    if (!file) return null;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Le fichier doit être une image");
      return null;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("article-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("article-images")
        .getPublicUrl(data.path);

      setProgress(100);
      toast.success("Image uploadée");

      return {
        url: publicUrl,
        path: data.path,
      };
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Erreur upload: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from("article-images")
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Erreur suppression: " + error.message);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    progress,
  };
}
