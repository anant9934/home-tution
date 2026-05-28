"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorsService = void 0;
const common_1 = require("@nestjs/common");
let TutorsService = class TutorsService {
    create(createTutorDto) {
        return 'This action adds a new tutor';
    }
    findAll() {
        return `This action returns all tutors`;
    }
    findOne(id) {
        return `This action returns a #${id} tutor`;
    }
    update(id, updateTutorDto) {
        return `This action updates a #${id} tutor`;
    }
    remove(id) {
        return `This action removes a #${id} tutor`;
    }
};
exports.TutorsService = TutorsService;
exports.TutorsService = TutorsService = __decorate([
    (0, common_1.Injectable)()
], TutorsService);
//# sourceMappingURL=tutors.service.js.map