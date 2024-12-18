import fs from 'fs/promises';
import path from 'path';
import { injectable } from "tsyringe";
import { withDB } from "../decorators";

@injectable()
@withDB
export default class ImageService {
    
    async uploadImage(file: Express.Multer.File, fileName: string): Promise<string> {

        const newfileName = `${fileName}${path.extname(file.originalname)}`;
        const rndName = Date.now();

        const result = rndName + '_' + newfileName;

        await fs.rename(
            file.path, 
            `${path.dirname(file.path)}/${result}`
        );

        return result;
    }
} 