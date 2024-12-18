import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { AsyncWrapper, autoBind } from "../decorators";
import { ImageService } from "../services";
import { BadRequestError } from "../errors";

@injectable()
@autoBind
@AsyncWrapper
export default class ImageController {
    constructor(
        @inject(ImageService) private imageService: ImageService
    ) {}

    async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        const [file, fileName] = [req.file, req.body.fileName];

        if (!(file && fileName)) {
            throw new BadRequestError('File and Filename is required');
        }
        const filePath = await this.imageService.uploadImage(file, fileName);
        
        res.json({
            title: fileName || 'Untitled',
            imageUrl: `/uploads/${filePath}`,
        });
    }
}