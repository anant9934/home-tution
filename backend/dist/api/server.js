"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
exports.default = handler;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const app_module_1 = require("../src/app.module");
const common_1 = require("@nestjs/common");
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
let cachedApp;
const bootstrap = async (expressInstance) => {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressInstance));
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }));
        app.enableCors();
        await app.init();
        cachedApp = app;
    }
    return cachedApp;
};
exports.bootstrap = bootstrap;
async function handler(req, res) {
    await (0, exports.bootstrap)(server);
    server(req, res);
}
//# sourceMappingURL=server.js.map