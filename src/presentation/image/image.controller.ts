import { Response } from 'express';
import * as mime from 'mime-types';
import { Controller, Get, Param, Res, HttpStatus, Inject, UseGuards, Query } from '@nestjs/common';

import { Inversify } from '@src/inversify/investify';
import { CustomAuthGuard } from '@presentation/guard/custom.auth.guard';

@Controller('image')
export class ImageController {
  constructor(
    @Inject('Inversify')
    private inversify: Inversify,
  ) {}

  getContentType(filename: string): string {
    // Détermine le type MIME basé sur l'extension du fichier
    const contentType = mime.lookup(filename);
    return contentType || 'application/octet-stream'; // Valeur par défaut
  }

  @Get(':filename')
  @UseGuards(CustomAuthGuard)
  async getImage(
    @Param('filename') filename: string, 
    @Res() res: Response,
    @Query('width') width?: number,
    @Query('height') height?: number,
  ): Promise<void> {
    try {
      const image = await this.inversify.imageService.getImage(filename, width?parseInt(width as unknown as string):null, height?parseInt(height as unknown as string):null);
      res.writeHead(HttpStatus.OK, { 'Content-Type': 'image/jpeg' });
      res.end(image);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Image not found' });
    }
  }
}
