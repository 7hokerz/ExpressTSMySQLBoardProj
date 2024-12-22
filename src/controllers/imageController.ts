import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import NodeCache from "node-cache";
import { v4 as uuidv4 } from 'uuid';
import { AsyncWrapper, autoBind } from "../decorators";
import { ImageService } from "../services";
import { BadRequestError } from "../errors";
import { ImageCacheData } from "../interfaces";

@injectable()
@autoBind
@AsyncWrapper
export default class ImageController {
    private readonly imageCache: NodeCache;
    private readonly CACHE_DURATION = 10 * 60; // 10분

    constructor(
        @inject(ImageService) private imageService: ImageService
    ) {
        this.imageCache = new NodeCache({
            stdTTL: this.CACHE_DURATION, // 캐시 항목 기본 만료 시간
            checkperiod: this.CACHE_DURATION + 10, // 캐시 만료 검사 주기
        });
    }

    // 임시 이미지 업로드
    async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        const [file, fileName] = [req.file, req.body.fileName];

        if (!(file && fileName)) { // 파일 업로드 검증
            throw new BadRequestError('File and Filename is required');
        }
        const imageId = uuidv4(); // 고유 임시 id, 고유 URL

        const dataUrl = await this.imageService.generateBase64Image(file);

        this.imageCache.set<ImageCacheData>(imageId, {
            buffer: file.buffer, // 원본 이미지
            fileName: fileName, // 파일명
            mimetype: file.mimetype, // 파일 형식
        });

        res.json({ // 클라이언트에는 고유 ID와 임시 URL만 전달
            success: true,
            imageId: imageId,
            imageUrl: dataUrl,
        });
    }

    // 최종 이미지 업로드
    async saveImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { imageId } = req.body;

        if(imageId) {
            const cachedImage = this.imageCache.get<ImageCacheData>(imageId);

            if(!cachedImage) {
                throw new BadRequestError('임시 이미지를 찾을 수 없음.');
            }
            
            const filePath = await this.imageService.saveImage({
                buffer: cachedImage.buffer, // 실제 이미지 파일
                fileName: cachedImage.fileName,
                mimetype: cachedImage.mimetype,
            });

            this.imageCache.del(imageId);
            
            req.body.imagePath = filePath;
        }
        next();
    }
}
/**
 * uuid: universally unique identifier
 * 범용 고유 식별자
 * 
 * 
 * 
 * 
 */