"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTutorDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_tutor_dto_1 = require("./create-tutor.dto");
class UpdateTutorDto extends (0, mapped_types_1.PartialType)(create_tutor_dto_1.CreateTutorDto) {
}
exports.UpdateTutorDto = UpdateTutorDto;
//# sourceMappingURL=update-tutor.dto.js.map