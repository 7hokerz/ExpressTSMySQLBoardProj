"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const tsyringe_1 = require("tsyringe");
const decorators_1 = require("../decorators");
let ImageService = class ImageService {
    // 버퍼에 있는 이미지를 base64로 변환 후 임시 URL 반환
    generateBase64Image(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            return dataUrl;
        });
    }
    // 최종 파일 경로 설정 및 파일 시스템 저장
    saveImage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ buffer, fileName, mimetype }) {
            let extArray = mimetype.split("/");
            let extension = extArray[extArray.length - 1]; // 최종 확장자
            const newfileName = `${fileName}.${extension}`;
            const rndName = Date.now();
            const filePath = rndName + '_' + newfileName;
            yield promises_1.default.writeFile(path_1.default.join(process.cwd(), `uploads/${filePath}`), buffer);
            return filePath;
        });
    }
};
ImageService = __decorate([
    (0, tsyringe_1.injectable)(),
    decorators_1.withDB
], ImageService);
exports.default = ImageService;
/**
 *
 *
 *
 */ 
