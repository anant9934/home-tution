"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_1 = require("../src/generated/prisma");
const adapter_neon_1 = require("@prisma/adapter-neon");
const serverless_1 = require("@neondatabase/serverless");
const ws_1 = __importDefault(require("ws"));
const bcrypt = __importStar(require("bcrypt"));
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
const adapter = new adapter_neon_1.PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new prisma_1.PrismaClient({ adapter });
async function main() {
    console.log('Seeding database...');
    const passwordHash = await bcrypt.hash('student123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'student@edtech.com' },
        update: {},
        create: {
            email: 'student@edtech.com',
            passwordHash,
            name: 'Rahul Verma',
            role: 'STUDENT',
        },
    });
    const student = await prisma.studentProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            class: '12th',
            board: 'CBSE',
        },
    });
    const tutorUser = await prisma.user.upsert({
        where: { email: 'tutor@edtech.com' },
        update: {},
        create: {
            email: 'tutor@edtech.com',
            passwordHash,
            name: 'Dr. Sarah Jenkins',
            role: 'TUTOR',
        },
    });
    await prisma.user.upsert({
        where: { email: 'admin@edtech.com' },
        update: {},
        create: {
            email: 'admin@edtech.com',
            passwordHash,
            name: 'System Admin',
            role: 'ADMIN',
        },
    });
    const parentUser = await prisma.user.upsert({
        where: { email: 'parent@edtech.com' },
        update: {},
        create: {
            email: 'parent@edtech.com',
            passwordHash,
            name: 'Mr. Verma',
            role: 'PARENT',
        },
    });
    const parent = await prisma.parentProfile.upsert({
        where: { userId: parentUser.id },
        update: {},
        create: {
            userId: parentUser.id,
            occupation: 'Engineer',
        },
    });
    await prisma.studentProfile.update({
        where: { id: student.id },
        data: { parentId: parent.id }
    });
    const pendingTutorUser = await prisma.user.upsert({
        where: { email: 'pending@edtech.com' },
        update: {},
        create: {
            email: 'pending@edtech.com',
            passwordHash,
            name: 'Priya Singh',
            role: 'TUTOR',
        },
    });
    await prisma.tutorProfile.upsert({
        where: { userId: pendingTutorUser.id },
        update: {},
        create: {
            userId: pendingTutorUser.id,
            qualification: 'M.Sc. Chemistry',
            experienceYears: 3,
            hourlyRate: 500,
            verificationStatus: 'PENDING'
        },
    });
    const tutor = await prisma.tutorProfile.upsert({
        where: { userId: tutorUser.id },
        update: { verificationStatus: 'VERIFIED' },
        create: {
            userId: tutorUser.id,
            qualification: 'Ph.D. in Mathematics',
            experienceYears: 10,
            hourlyRate: 800,
            verificationStatus: 'VERIFIED'
        },
    });
    await prisma.course.createMany({
        data: [
            {
                title: 'Mastering Advanced Calculus',
                description: 'A complete guide to Integration and Differentiation for Class 12.',
                subject: 'Mathematics',
                class: '12th',
                board: 'CBSE',
                createdBy: tutor.id,
                isPublished: true,
            },
            {
                title: 'Organic Chemistry Basics',
                description: 'Understand the foundations of Organic Chemistry.',
                subject: 'Chemistry',
                class: '11th',
                board: 'CBSE',
                createdBy: tutor.id,
                isPublished: true,
            }
        ],
        skipDuplicates: true
    });
    const today = new Date();
    await prisma.booking.createMany({
        data: [
            {
                studentId: student.id,
                tutorId: tutor.id,
                bookingType: 'LIVE_CLASS',
                scheduledAt: new Date(today.setHours(today.getHours() + 2)),
                duration: 60,
                status: 'PENDING',
                meetingLink: 'https://zoom.us/j/123456789'
            },
            {
                studentId: student.id,
                tutorId: tutor.id,
                bookingType: 'ONE_ON_ONE',
                scheduledAt: new Date(today.setHours(today.getHours() + 24)),
                duration: 60,
                status: 'PENDING',
                meetingLink: 'https://zoom.us/j/987654321'
            },
            {
                studentId: student.id,
                tutorId: tutor.id,
                bookingType: 'LIVE_CLASS',
                scheduledAt: new Date(new Date().setDate(new Date().getDate() - 2)),
                duration: 120,
                status: 'COMPLETED',
                meetingLink: 'https://zoom.us/j/1122334455'
            },
            {
                studentId: student.id,
                tutorId: tutor.id,
                bookingType: 'ONE_ON_ONE',
                scheduledAt: new Date(new Date().setDate(new Date().getDate() - 5)),
                duration: 60,
                status: 'COMPLETED',
                meetingLink: 'https://zoom.us/j/5544332211'
            }
        ],
        skipDuplicates: true
    });
    await prisma.xP.create({
        data: {
            studentId: student.id,
            points: 150,
            source: 'QUIZ',
        }
    });
    console.log('Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map