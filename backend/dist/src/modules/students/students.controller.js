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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("./students.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StudentsController = class StudentsController {
    studentsService;
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    getDashboard(req) {
        return this.studentsService.getDashboard(req.user.userId);
    }
    getCourses(req) {
        return this.studentsService.getCourses(req.user.userId);
    }
    getCourseCurriculum(req, courseId) {
        return this.studentsService.getCourseCurriculum(req.user.userId, courseId);
    }
    markLessonComplete(req, lessonId) {
        return this.studentsService.markLessonComplete(req.user.userId, lessonId);
    }
    getAttendance(req) {
        return this.studentsService.getAttendance(req.user.userId);
    }
    getAssignments(req) {
        return this.studentsService.getAssignments(req.user.userId);
    }
    submitAssignment(req, id, body) {
        return this.studentsService.submitAssignment(req.user.userId, id, body.submissionUrl);
    }
    getQuizzes(req) {
        return this.studentsService.getQuizzes(req.user.userId);
    }
    submitQuiz(req, id, score) {
        return this.studentsService.submitQuiz(req.user.userId, id, score);
    }
    getLeaderboard(req) {
        return this.studentsService.getLeaderboard(req.user.userId);
    }
    getMessages(req) {
        return this.studentsService.getMessages(req.user.userId);
    }
    getProfile(req) {
        return this.studentsService.getProfile(req.user.userId);
    }
    updateProfile(req, body) {
        return this.studentsService.updateProfile(req.user.userId, body);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('courses'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getCourses", null);
__decorate([
    (0, common_1.Get)('courses/:id/curriculum'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getCourseCurriculum", null);
__decorate([
    (0, common_1.Post)('courses/lessons/:lessonId/complete'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "markLessonComplete", null);
__decorate([
    (0, common_1.Get)('attendance'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Get)('assignments'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getAssignments", null);
__decorate([
    (0, common_1.Post)('assignments/:id/submit'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "submitAssignment", null);
__decorate([
    (0, common_1.Get)('quizzes'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getQuizzes", null);
__decorate([
    (0, common_1.Post)('quizzes/:id/submit'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('score')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "submitQuiz", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)('messages'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "updateProfile", null);
exports.StudentsController = StudentsController = __decorate([
    (0, common_1.Controller)('students'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map