"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const tsyringe_1 = require("tsyringe");
const node_cache_1 = __importDefault(require("node-cache"));
const uuid_1 = require("uuid");
const decorators_1 = require("../decorators");
const services_1 = require("../services");
const errors_1 = require("../errors");
let ImageController = class ImageController {
    constructor(imageService) {
        this.imageService = imageService;
        this.CACHE_DURATION = 10 * 60; // 10분
        this.imageCache = new node_cache_1.default({
            stdTTL: this.CACHE_DURATION, // 캐시 항목 기본 만료 시간
            checkperiod: this.CACHE_DURATION + 10, // 캐시 만료 검사 주기
        });
    }
    // 임시 이미지 업로드
    uploadImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const [file, fileName] = [req.file, req.body.fileName];
            if (!(file && fileName)) { // 파일 업로드 검증
                throw new errors_1.BadRequestError('File and Filename is required');
            }
            const imageId = (0, uuid_1.v4)(); // 고유 임시 id, 고유 URL
            const dataUrl = yield this.imageService.generateBase64Image(file);
            this.imageCache.set(imageId, {
                buffer: file.buffer, // 원본 이미지
                fileName: fileName, // 파일명
                mimetype: file.mimetype, // 파일 형식
            });
            res.json({
                success: true,
                imageId: imageId,
                imageUrl: dataUrl,
            });
        });
    }
    // 최종 이미지 업로드
    saveImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { imageId } = req.body;
            if (imageId) {
                const cachedImage = this.imageCache.get(imageId);
                if (!cachedImage) {
                    throw new errors_1.BadRequestError('임시 이미지를 찾을 수 없음.');
                }
                const filePath = yield this.imageService.saveImage({
                    buffer: cachedImage.buffer, // 실제 이미지 파일
                    fileName: cachedImage.fileName,
                    mimetype: cachedImage.mimetype,
                });
                this.imageCache.del(imageId);
                req.body.imagePath = filePath;
            }
            next();
        });
    }
};
ImageController = __decorate([
    (0, tsyringe_1.injectable)(),
    decorators_1.autoBind,
    decorators_1.AsyncWrapper,
    __param(0, (0, tsyringe_1.inject)(services_1.ImageService)),
    __metadata("design:paramtypes", [services_1.ImageService])
], ImageController);
exports.default = ImageController;
/**
 * uuid: universally unique identifier
 * 범용 고유 식별자
 *
 *
 *
 *
 */ 
