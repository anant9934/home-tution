import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as bcrypt from 'bcrypt';

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('student123', 10);
  
  // Create or Update Student User
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

  // Create Student Profile
  const student = await prisma.studentProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      class: '12th',
      board: 'CBSE',
    },
  });

  // Create or Update Tutor User
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

  // Create Admin User
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

  // Create Parent User and Profile
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

  // Link Student to Parent
  await prisma.studentProfile.update({
    where: { id: student.id },
    data: { parentId: parent.id }
  });

  // Create Pending Tutor User
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

  // Create Course
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

  // Create Bookings (Classes)
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
        scheduledAt: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
        duration: 120, // 2 hours
        status: 'COMPLETED',
        meetingLink: 'https://zoom.us/j/1122334455'
      },
      {
        studentId: student.id,
        tutorId: tutor.id,
        bookingType: 'ONE_ON_ONE',
        scheduledAt: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 days ago
        duration: 60, // 1 hour
        status: 'COMPLETED',
        meetingLink: 'https://zoom.us/j/5544332211'
      }
    ],
    skipDuplicates: true
  });

  // Create XP
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
