"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// loaders/Container.ts
require("reflect-metadata"); // 꼭 import해야 typedi 작동
const typedi_1 = require("typedi");
const shared_modules_1 = require("../utils/shared-modules");
typedi_1.Container.set(typeof shared_modules_1.db, shared_modules_1.db);
