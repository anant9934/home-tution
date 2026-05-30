import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aura_edu_uploads',
    allowed_formats: ['jpg', 'png', 'pdf', 'mp4'],
  } as any,
});

@Controller('uploads')
export class UploadsController {
  
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    // Cloudinary URL is returned in the file object path property
    return {
      url: file.path,
      format: file.mimetype,
      size: file.size,
    };
  }
}
