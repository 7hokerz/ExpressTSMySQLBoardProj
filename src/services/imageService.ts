import fs from 'fs/promises';
import path from 'path';
import { injectable } from "tsyringe";
import { withDB } from "../decorators";
import { ImageCacheData } from '../interfaces';

@injectable()
@withDB
export default class ImageService {
    // 버퍼에 있는 이미지를 base64로 변환 후 임시 URL 반환
    async generateBase64Image(file: Express.Multer.File): Promise<string> {
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return dataUrl;
    }

    // 최종 파일 경로 설정 및 파일 시스템 저장
    async saveImage({ buffer, fileName, mimetype }: ImageCacheData): Promise<string> {
        let extArray = mimetype.split("/");
        let extension = extArray[extArray.length - 1]; // 최종 확장자
        
        const newfileName = `${fileName}.${extension}`;
        const rndName = Date.now();

        const filePath = rndName + '_' + newfileName;

        await fs.writeFile(path.join(process.cwd(), `uploads/${filePath}`), buffer);

        return filePath;
    } 
}
/**
 * 
 * 
 * 
 */