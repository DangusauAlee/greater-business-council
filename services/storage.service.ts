import { supabase } from './supabase';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const storageService = {
  async uploadImage(bucket: string, path: string, file: Blob) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  },

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      if (!image.base64String) throw new Error('No image data');

      const response = await fetch(`data:image/jpeg;base64,${image.base64String}`);
      const blob = await response.blob();

      return blob;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  },

  async pickImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      if (!image.base64String) throw new Error('No image data');

      const response = await fetch(`data:image/jpeg;base64,${image.base64String}`);
      const blob = await response.blob();

      return blob;
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  }
};