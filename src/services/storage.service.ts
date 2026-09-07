import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, posix } from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Local-disk file storage.
 *
 * Files are written under `<cwd>/uploads/<relativePath>` and served statically
 * by Nest (see `main.ts`) under the `/uploads/` prefix. The public URL base is
 * taken from `API_PUBLIC_URL`, falling back to `http://localhost:<PORT>`.
 */
@Injectable()
export class StorageService {
  private readonly rootDir = join(process.cwd(), 'uploads');

  private get baseUrl(): string {
    const explicit = process.env.API_PUBLIC_URL;
    if (explicit) {
      return explicit.replace(/\/$/, '');
    }
    return `http://localhost:${process.env.PORT ?? 5000}`;
  }

  private publicUrl(relativePath: string): string {
    return `${this.baseUrl}/uploads/${relativePath}`;
  }

  private async write(
    relativePath: string,
    fileBuffer: Buffer,
  ): Promise<string> {
    const absolutePath = join(this.rootDir, relativePath);
    await fs.mkdir(join(absolutePath, '..'), { recursive: true });
    await fs.writeFile(absolutePath, fileBuffer);
    return this.publicUrl(relativePath);
  }

  private async clearFolder(relativeFolder: string): Promise<void> {
    const absoluteFolder = join(this.rootDir, relativeFolder);
    await fs.rm(absoluteFolder, { recursive: true, force: true });
  }

  getFileUrl(relativePath: string): string {
    return this.publicUrl(relativePath);
  }

  async getFilesUrl(relativeFolder: string): Promise<string[]> {
    const absoluteFolder = join(this.rootDir, relativeFolder);

    let entries: string[];
    try {
      entries = await fs.readdir(absoluteFolder);
    } catch {
      throw new NotFoundException(
        `Nenhum arquivo encontrado na pasta: ${relativeFolder}`,
      );
    }

    if (entries.length === 0) {
      throw new NotFoundException(
        `Nenhum arquivo encontrado na pasta: ${relativeFolder}`,
      );
    }

    return entries
      .sort()
      .map(name => this.publicUrl(posix.join(relativeFolder, name)));
  }

  async uploadAvatar(
    userId: string,
    fileBuffer: Buffer,
    extension: string,
  ): Promise<string> {
    const folder = `avatar/${userId}`;
    await this.clearFolder(folder);
    return this.write(`${folder}/${uuidv4()}.${extension}`, fileBuffer);
  }

  async uploadRequestDocument(
    userId: string,
    fileBuffer: Buffer,
    extension: string,
  ): Promise<string> {
    return this.write(
      `request-documents/${userId}/docs.${extension}`,
      fileBuffer,
    );
  }

  async uploadCourseCover(
    courseId: string,
    fileBuffer: Buffer,
    extension: string,
  ): Promise<string> {
    return this.write(`courses/${courseId}/cover.${extension}`, fileBuffer);
  }

  async uploadLessonVideo(
    lessonId: string,
    moduleId: string,
    courseId: string,
    fileBuffer: Buffer,
    extension: string,
  ): Promise<string> {
    return this.write(
      `courses/${courseId}/modules/${moduleId}/lessons/${lessonId}.${extension}`,
      fileBuffer,
    );
  }
}
