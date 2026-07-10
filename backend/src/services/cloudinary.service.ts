import { v2 as cloudinary } from 'cloudinary';
import { UPLOAD } from '../constants';
import ApiError from '../utils/apiError';
import fs from 'fs';

class CloudinaryService {
  async uploadImage(
    filePath: string,
    folder: string = UPLOAD.CLOUDINARY_FOLDERS.MESSAGES
  ): Promise<{ url: string; publicId: string }> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, crop: 'limit' },
        ],
      });

      // Remove local file after upload
      this.removeLocalFile(filePath);

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      this.removeLocalFile(filePath);
      throw ApiError.internal('Failed to upload image');
    }
  }

  async uploadFile(
    filePath: string,
    folder: string = UPLOAD.CLOUDINARY_FOLDERS.FILES
  ): Promise<{ url: string; publicId: string }> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'raw',
      });

      this.removeLocalFile(filePath);

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      this.removeLocalFile(filePath);
      throw ApiError.internal('Failed to upload file');
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete file from Cloudinary:', error);
    }
  }

  private removeLocalFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Failed to remove local file:', error);
    }
  }
}

export default new CloudinaryService();
