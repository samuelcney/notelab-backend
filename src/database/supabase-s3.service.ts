import { Injectable } from '@nestjs/common';
import { supabaseAdmin } from 'src/database/supabase';

@Injectable()
export class SupabaseStorageService {
  async uploadAvatar(userId: string, fileBuffer: Buffer, extension: string) {
    const filePath = `avatar/${userId}/image.${extension}`;

    const { error } = await supabaseAdmin.storage
      .from('notelab-medias')
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: this.getMimeType(extension),
      });

    if (error) throw new Error(`Erro ao fazer upload: ${error.message}`);

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('notelab-medias').getPublicUrl(filePath);

    return publicUrl;
  }

  private getMimeType(ext: string) {
    return (
      {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
      }[ext] || 'application/octet-stream'
    );
  }
}
