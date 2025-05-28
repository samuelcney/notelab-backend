import { Injectable } from '@nestjs/common';
import { supabaseAdmin } from 'src/database/supabase';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupabaseStorageService {
  async uploadAvatar(userId: string, fileBuffer: Buffer, extension: string) {
    const folderPath = `avatar/${userId}`;
    const uniqueFileName = `${uuidv4()}.${extension}`;
    const filePath = `${folderPath}/${uniqueFileName}`;

    const { data: listData, error: listError } = await supabaseAdmin.storage
      .from('notelab-medias')
      .list(folderPath);

    if (listError) {
      throw new Error(
        `Erro ao listar arquivos anteriores: ${listError.message}`,
      );
    }

    if (listData && listData.length > 0) {
      const filesToDelete = listData.map(file => `${folderPath}/${file.name}`);
      const { error: deleteError } = await supabaseAdmin.storage
        .from('notelab-medias')
        .remove(filesToDelete);

      if (deleteError) {
        throw new Error(
          `Erro ao remover arquivos antigos: ${deleteError.message}`,
        );
      }
    }

    const { error: uploadError } = await supabaseAdmin.storage
      .from('notelab-medias')
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: this.getMimeType(extension),
      });

    if (uploadError) {
      throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
    }

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
        mp4: 'video/mp4',
        mov: 'video/quicktime',
        webm: 'video/webm',
      }[ext.toLowerCase()] || 'application/octet-stream'
    );
  }

  async uploadCourseCover(
    courseId: string,
    fileBuffer: Buffer,
    extension: string,
  ) {
    const filePath = `courses/${courseId}/cover.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('notelab-medias')
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: this.getMimeType(extension),
      });

    if (uploadError)
      throw new Error(`Erro ao enviar capa: ${uploadError.message}`);

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('notelab-medias').getPublicUrl(filePath);

    return publicUrl;
  }

  async uploadLessonVideo(
    lessonId: string,
    moduleId: string,
    courseId: string,
    fileBuffer: Buffer,
    extension: string,
  ) {
    const filePath = `courses/${courseId}/modules/${moduleId}/lessons/${lessonId}.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('notelab-medias')
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: this.getMimeType(extension),
      });

    if (uploadError)
      throw new Error(`Erro ao enviar vídeo: ${uploadError.message}`);

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('notelab-medias').getPublicUrl(filePath);

    return publicUrl;
  }
}
