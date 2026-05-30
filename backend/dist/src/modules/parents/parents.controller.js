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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentsController = void 0;
const common_1 = require("@nestjs/common");
const parents_service_1 = require("./parents.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const parent_message_dto_1 = require("./dto/parent-message.dto");
const update_parent_profile_dto_1 = require("./dto/update-parent-profile.dto");
let ParentsController = class ParentsController {
    parentsService;
    constructor(parentsService) {
        this.parentsService = parentsService;
    }
    getDashboard(req) {
        return this.parentsService.getDashboard(req.user.userId);
    }
    getChildren(req) {
        return this.parentsService.getChildren(req.user.userId);
    }
    getAttendance(req, childId) {
        return this.parentsService.getAttendance(req.user.userId, childId);
    }
    getFees(req, childId) {
        return this.parentsService.getFees(req.user.userId, childId);
    }
    payFee(req, feeId) {
        return this.parentsService.payFee(req.user.userId, feeId);
    }
    getPerformance(req, childId) {
        return this.parentsService.getPerformance(req.user.userId, childId);
    }
    getMessages(req) {
        return this.parentsService.getMessages(req.user.userId);
    }
    sendMessage(req, dto) {
        return this.parentsService.sendMessage(req.user.userId, dto);
    }
    getProfile(req) {
        return this.parentsService.getProfile(req.user.userId);
    }
    updateProfile(req, dto) {
        return this.parentsService.updateProfile(req.user.userId, dto);
    }
};
exports.ParentsController = ParentsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('children'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "getChildren", null);
__decorate([
    (0, common_1.Get)('attendance'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Get)('fees'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "getFees", null);
__decorate([
    (0, common_1.Post)('fees/:feeId/pay'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('feeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "payFee", null);
__decorate([
    (0, common_1.Get)('performance'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "getPerformance", null);
__decorate([
    (0, common_1.Get)('messages'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('messages'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, parent_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_parent_profile_dto_1.UpdateParentProfileDto]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "updateProfile", null);
exports.ParentsController = ParentsController = __decorate([
    (0, common_1.Controller)('parents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [parents_service_1.ParentsService])
], ParentsController);
//# sourceMappingURL=parents.controller.js.map