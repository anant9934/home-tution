const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');
require('dotenv/config');

const sql = neon(process.env.DATABASE_URL);

// ─── Helpers ────────────────────────────────────────────────────────────────
const uid = () => require('crypto').randomUUID();
const now = () => new Date().toISOString();
const hash = (p) => bcrypt.hashSync(p, 10);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── Seed Data ───────────────────────────────────────────────────────────────
const STUDENTS = [
  { first: 'Aarav', last: 'Sharma' },
  { first: 'Ananya', last: 'Singh' },
  { first: 'Arjun', last: 'Patel' },
  { first: 'Diya', last: 'Verma' },
  { first: 'Ishaan', last: 'Gupta' },
  { first: 'Kavya', last: 'Mehta' },
  { first: 'Lakshmi', last: 'Reddy' },
  { first: 'Manav', last: 'Kumar' },
  { first: 'Naina', last: 'Joshi' },
  { first: 'Om', last: 'Tiwari' },
  { first: 'Priya', last: 'Agarwal' },
  { first: 'Rohan', last: 'Malhotra' },
  { first: 'Sanya', last: 'Kapoor' },
  { first: 'Tanvi', last: 'Desai' },
  { first: 'Udit', last: 'Saxena' },
  { first: 'Vanya', last: 'Bose' },
  { first: 'Vivaan', last: 'Choudhury' },
  { first: 'Yashi', last: 'Pandey' },
  { first: 'Zara', last: 'Khan' },
  { first: 'Kabir', last: 'Nair' },
];

const TUTORS = [
  { first: 'Amit', last: 'Sharma', subjects: ['Mathematics', 'Physics'], hourlyRate: 800, bio: 'IIT Delhi graduate with 8 years experience in competitive exam coaching. Specialized in JEE and NEET preparation.' },
  { first: 'Deepika', last: 'Iyer', subjects: ['Chemistry', 'Biology'], hourlyRate: 750, bio: 'MSc Chemistry from DU, 5 years tutoring experience. Passionate about making science fun and accessible.' },
  { first: 'Rajesh', last: 'Verma', subjects: ['Mathematics', 'Computer Science'], hourlyRate: 900, bio: 'BTech from NIT, working professional with 10 years tutoring. Expert in Python, Data Structures, and Calculus.' },
  { first: 'Sunita', last: 'Gupta', subjects: ['English', 'History'], hourlyRate: 600, bio: 'MA English Literature from JNU. Specializes in essay writing, grammar, and CBSE board preparation.' },
  { first: 'Vikram', last: 'Reddy', subjects: ['Physics', 'Mathematics'], hourlyRate: 1000, bio: 'PhD Physics from IISc. Exceptional track record for IIT-JEE advanced coaching.' },
  { first: 'Meera', last: 'Nair', subjects: ['Biology', 'Science'], hourlyRate: 700, bio: 'MBBS graduate turned educator. 6 years helping students ace NEET with conceptual clarity.' },
  { first: 'Sanjay', last: 'Patel', subjects: ['Accountancy', 'Economics'], hourlyRate: 650, bio: 'CA professional with expertise in Commerce. Guided 200+ students to distinction in board exams.' },
  { first: 'Priya', last: 'Mishra', subjects: ['Hindi', 'Sanskrit'], hourlyRate: 500, bio: 'MA Sanskrit, passionate about vernacular languages. Makes Hindi and Sanskrit enjoyable and scoring.' },
  { first: 'Arun', last: 'Kumar', subjects: ['Mathematics', 'Science'], hourlyRate: 850, bio: 'IIM Ahmedabad alumni turned teacher. Unique approach to problem solving that works across subjects.' },
  { first: 'Kavitha', last: 'Rao', subjects: ['English', 'Social Science'], hourlyRate: 600, bio: 'Former school principal with 15 years teaching experience. Specializes in primary and middle school.' },
];

const PARENTS = [
  { first: 'Rohit', last: 'Sharma', occupation: 'Engineer' },
  { first: 'Neha', last: 'Singh', occupation: 'Doctor' },
  { first: 'Suresh', last: 'Patel', occupation: 'Businessman' },
  { first: 'Anita', last: 'Verma', occupation: 'Teacher' },
  { first: 'Manoj', last: 'Gupta', occupation: 'Accountant' },
  { first: 'Rekha', last: 'Mehta', occupation: 'Homemaker' },
  { first: 'Vijay', last: 'Reddy', occupation: 'Government Officer' },
  { first: 'Sunita', last: 'Kumar', occupation: 'Nurse' },
  { first: 'Anil', last: 'Joshi', occupation: 'Lawyer' },
  { first: 'Pooja', last: 'Tiwari', occupation: 'HR Manager' },
  { first: 'Dinesh', last: 'Agarwal', occupation: 'Retailer' },
  { first: 'Mamta', last: 'Malhotra', occupation: 'Homemaker' },
  { first: 'Sanjiv', last: 'Kapoor', occupation: 'Architect' },
  { first: 'Urmila', last: 'Desai', occupation: 'Software Professional' },
  { first: 'Harish', last: 'Saxena', occupation: 'Banker' },
];

const CLASSES = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB'];
const SCHOOLS = [
  'Delhi Public School', 'Kendriya Vidyalaya', 'Ryan International',
  'DAV Public School', 'St. Xavier\'s School', 'Army Public School',
  'Vidya Mandir', 'Holy Cross School', 'Modern School', 'Lotus Valley School'
];
const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Jaipur'];

// ─── Seed Functions ──────────────────────────────────────────────────────────
async function createUser(id, name, email, role, phone) {
  const passwordHash = hash('password@123');
  // Use upsert so we always get back the real row ID
  const result = await sql.query(`
    INSERT INTO "User" (id, name, email, phone, "passwordHash", role, "isVerified", status, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET "updatedAt" = NOW()
    RETURNING id
  `, [id, name, email, phone, passwordHash, role, true, 'ACTIVE']);
  return result[0].id;
}

async function seedAdmins() {
  console.log('🔴 Seeding Admins...');
  const admins = [
    { name: 'Super Admin', email: 'superadmin@edtech.com', role: 'SUPER_ADMIN' },
    { name: 'Admin One', email: 'admin@edtech.com', role: 'ADMIN' },
    { name: 'Operations Admin', email: 'ops@edtech.com', role: 'ADMIN' },
  ];
  for (const a of admins) {
    await createUser(uid(), a.name, a.email, a.role, `+9198765${randInt(10000, 99999)}`);
  }
  console.log(`  ✅ ${admins.length} admins created`);
}

async function seedStudents() {
  console.log('🟢 Seeding Students...');
  const studentIds = [];
  for (let i = 0; i < STUDENTS.length; i++) {
    const s = STUDENTS[i];
    const name = `${s.first} ${s.last}`;
    const email = `${s.first.toLowerCase()}.${s.last.toLowerCase()}${i + 1}@student.com`;
    const phone = `+9199${randInt(10000000, 99999999)}`;
    
    // Use actual DB id (may differ if email already existed)
    const realId = await createUser(uid(), name, email, 'STUDENT', phone);
    
    // Create StudentProfile
    await sql.query(`
      INSERT INTO "StudentProfile" (id, "userId", class, board, "schoolName", "joiningDate", address)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6)
      ON CONFLICT ("userId") DO NOTHING
    `, [uid(), realId, pick(CLASSES), pick(BOARDS), pick(SCHOOLS), pick(CITIES)]);

    studentIds.push(realId);
  }
  console.log(`  ✅ ${STUDENTS.length} students created`);
  return studentIds;
}

async function seedTutors() {
  console.log('🟡 Seeding Tutors...');
  const tutorIds = [];
  for (let i = 0; i < TUTORS.length; i++) {
    const t = TUTORS[i];
    const name = `${t.first} ${t.last}`;
    const email = `${t.first.toLowerCase()}.${t.last.toLowerCase()}@tutor.com`;
    const phone = `+9197${randInt(10000000, 99999999)}`;
    const rating = parseFloat((3.5 + Math.random() * 1.5).toFixed(1));
    
    const realId = await createUser(uid(), name, email, 'TUTOR', phone);
    
    // Create TutorProfile
    await sql.query(`
      INSERT INTO "TutorProfile" (id, "userId", bio, "experienceYears", qualification, "hourlyRate", languages, subjects, "teachingMode", rating, "totalReviews", "isVerified")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT ("userId") DO NOTHING
    `, [
      uid(), realId, t.bio,
      randInt(3, 15),
      pick(['B.Tech', 'M.Sc', 'MA', 'MBA', 'B.Ed', 'PhD']),
      t.hourlyRate,
      `{Hindi,English}`,
      `{${t.subjects.join(',')}}`,
      pick(['ONLINE', 'HOME', 'BOTH']),
      rating,
      randInt(5, 120),
      true
    ]);

    tutorIds.push(realId);
  }
  console.log(`  ✅ ${TUTORS.length} tutors created`);
  return tutorIds;
}

async function seedParents() {
  console.log('🔵 Seeding Parents...');
  const parentIds = [];
  for (let i = 0; i < PARENTS.length; i++) {
    const p = PARENTS[i];
    const name = `${p.first} ${p.last}`;
    const email = `${p.first.toLowerCase()}.${p.last.toLowerCase()}${i + 1}@parent.com`;
    const phone = `+9196${randInt(10000000, 99999999)}`;
    
    const realId = await createUser(uid(), name, email, 'PARENT', phone);
    
    // Create ParentProfile
    await sql.query(`
      INSERT INTO "ParentProfile" (id, "userId", occupation, address)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT ("userId") DO NOTHING
    `, [uid(), realId, p.occupation, pick(CITIES)]);

    parentIds.push(realId);
  }
  console.log(`  ✅ ${PARENTS.length} parents created`);
  return parentIds;
}

async function seedXPAndBadges(studentUserIds) {
  console.log('⭐ Seeding XP and Gamification...');
  
  // Create some badges
  const badges = [
    { id: uid(), name: 'First Login', icon: '🎯', description: 'Logged in for the first time' },
    { id: uid(), name: 'Quiz Master', icon: '🏆', description: 'Scored 100% on a quiz' },
    { id: uid(), name: 'Attendance Hero', icon: '📅', description: '30 days perfect attendance' },
    { id: uid(), name: 'Assignment Star', icon: '⭐', description: 'Submitted 10 assignments on time' },
    { id: uid(), name: 'Top Performer', icon: '🥇', description: 'Ranked #1 on leaderboard' },
  ];

  for (const b of badges) {
    await sql.query(`
      INSERT INTO "Badge" (id, name, icon, description)
      VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING
    `, [b.id, b.name, b.icon, b.description]);
  }

  // Get studentProfile IDs
  const studentProfiles = [];
  for (const sId of studentUserIds) {
    const sp = await sql.query(`SELECT id FROM "StudentProfile" WHERE "userId" = $1`, [sId]);
    if (sp.length > 0) studentProfiles.push(sp[0].id);
  }

  // Give each student some XP
  for (const sid of studentProfiles) {
    const xpPoints = randInt(50, 2500);
    await sql.query(`
      INSERT INTO "XP" (id, "studentId", points, source, "createdAt")
      VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT DO NOTHING
    `, [uid(), sid, xpPoints, pick(['QUIZ', 'ATTENDANCE', 'ASSIGNMENT'])]);

    // Leaderboard entry
    await sql.query(`
      INSERT INTO "Leaderboard" (id, "studentId", week, month, points, rank)
      VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING
    `, [uid(), sid, 22, 5, xpPoints, randInt(1, 20)]);

    // Give a random badge to some students
    if (Math.random() > 0.4) {
      const badge = pick(badges);
      await sql.query(`
        INSERT INTO "StudentBadge" (id, "studentId", "badgeId", "earnedAt")
        VALUES ($1, $2, $3, NOW()) ON CONFLICT DO NOTHING
      `, [uid(), sid, badge.id]);
    }
  }
  console.log(`  ✅ XP, Leaderboard, and Badges seeded`);
}

async function seedNotifications(studentIds, tutorIds) {
  console.log('🔔 Seeding Notifications...');
  const messages = [
    { title: 'Class Reminder', message: 'Your class with Rahul Sir starts in 30 minutes!', type: 'CLASS' },
    { title: 'Fee Due', message: 'Monthly fee of ₹2000 is due by 31st May 2026.', type: 'FEE' },
    { title: 'New Assignment', message: 'Mathematics Chapter 5 assignment has been posted.', type: 'ASSIGNMENT' },
    { title: 'Quiz Starting Soon', message: 'Physics Mock Test begins in 1 hour. Be prepared!', type: 'QUIZ' },
    { title: 'Welcome to EduTrack!', message: 'Your account has been verified. Start your learning journey.', type: 'ANNOUNCEMENT' },
  ];

  const allIds = [...studentIds, ...tutorIds];
  for (const uid_ of allIds) {
    const msg = pick(messages);
    await sql.query(`
      INSERT INTO "Notification" (id, "userId", title, message, type, "isRead", "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW()) ON CONFLICT DO NOTHING
    `, [uid(), uid_, msg.title, msg.message, msg.type, Math.random() > 0.5]);
  }
  console.log(`  ✅ Notifications seeded`);
}

// ─── Link Parents to Students ────────────────────────────────────────────────
async function linkParentsToStudents(studentIds, parentIds) {
  console.log('🔗 Linking Parents to Students...');
  // Get parentProfile IDs from the user IDs
  const limit = Math.min(studentIds.length, parentIds.length);
  for (let i = 0; i < limit; i++) {
    const parentProfile = await sql.query(`
      SELECT id FROM "ParentProfile" WHERE "userId" = $1
    `, [parentIds[i]]);
    if (parentProfile.length > 0) {
      await sql.query(`
        UPDATE "StudentProfile" SET "parentId" = $1 WHERE "userId" = $2
      `, [parentProfile[0].id, studentIds[i]]);
    }
  }
  console.log(`  ✅ ${limit} students linked to parents`);
}

// ─── Seed Bookings, Class Sessions & Attendance ─────────────────────────────
async function seedAttendance(studentIds, tutorIds) {
  console.log('📅 Seeding Bookings, Sessions & Attendance...');
  
  // Get tutorProfile IDs
  const tutorProfiles = [];
  for (const tId of tutorIds) {
    const tp = await sql.query(`SELECT id FROM "TutorProfile" WHERE "userId" = $1`, [tId]);
    if (tp.length > 0) tutorProfiles.push(tp[0].id);
  }
  if (tutorProfiles.length === 0) {
    console.log('  ⚠️ No tutor profiles found, skipping attendance');
    return;
  }

  // Get studentProfile IDs
  const studentProfiles = [];
  for (const sId of studentIds) {
    const sp = await sql.query(`SELECT id FROM "StudentProfile" WHERE "userId" = $1`, [sId]);
    if (sp.length > 0) studentProfiles.push(sp[0].id);
  }

  let bookingCount = 0;
  for (const spId of studentProfiles) {
    const tpId = pick(tutorProfiles);
    // Create 15 completed bookings spread over the last 30 days
    for (let d = 1; d <= 15; d++) {
      const daysAgo = d * 2;
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() - daysAgo);
      scheduledDate.setHours(10 + (d % 8), 0, 0, 0);

      const bookingId = uid();
      await sql.query(`
        INSERT INTO "Booking" (id, "studentId", "tutorId", "bookingType", "scheduledAt", duration, status, "paymentStatus")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING
      `, [bookingId, spId, tpId, pick(['ONE_ON_ONE', 'LIVE_CLASS']), scheduledDate.toISOString(), 60, 'COMPLETED', 'SUCCESS']);

      // Create ClassSession
      const sessionId = uid();
      const endedAt = new Date(scheduledDate);
      endedAt.setMinutes(endedAt.getMinutes() + 60);
      await sql.query(`
        INSERT INTO "ClassSession" (id, "bookingId", "startedAt", "endedAt", "attendanceStatus")
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [sessionId, bookingId, scheduledDate.toISOString(), endedAt.toISOString(), 'COMPLETED']);

      // Create Attendance record
      const status = Math.random() > 0.15 ? 'PRESENT' : (Math.random() > 0.5 ? 'ABSENT' : 'LATE');
      await sql.query(`
        INSERT INTO "Attendance" (id, "studentId", "classSessionId", status, "markedBy", "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [uid(), spId, sessionId, status, tpId, scheduledDate.toISOString()]);

      bookingCount++;
    }

    // Create 2 upcoming bookings
    for (let f = 1; f <= 2; f++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + f * 2);
      futureDate.setHours(16, 0, 0, 0);
      await sql.query(`
        INSERT INTO "Booking" (id, "studentId", "tutorId", "bookingType", "scheduledAt", duration, status, "meetingLink", "paymentStatus")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT DO NOTHING
      `, [uid(), spId, tpId, 'ONE_ON_ONE', futureDate.toISOString(), 60, 'CONFIRMED', `https://meet.aura.edu/${uid().slice(0,8)}`, 'SUCCESS']);
    }
  }
  console.log(`  ✅ ${bookingCount} bookings + sessions + attendance records created`);
}

// ─── Seed Fees ──────────────────────────────────────────────────────────────
async function seedFees(studentIds) {
  console.log('💰 Seeding Fees...');
  
  const studentProfiles = [];
  for (const sId of studentIds) {
    const sp = await sql.query(`SELECT id FROM "StudentProfile" WHERE "userId" = $1`, [sId]);
    if (sp.length > 0) studentProfiles.push(sp[0].id);
  }

  let feeCount = 0;
  for (const spId of studentProfiles) {
    // Create fees for the last 4 months + current month
    for (let m = 0; m < 5; m++) {
      const feeDate = new Date();
      feeDate.setMonth(feeDate.getMonth() - m);
      const dueDate = new Date(feeDate.getFullYear(), feeDate.getMonth(), 10);
      const amount = pick([3000, 3500, 4000, 4500, 5000]);
      const isPaid = m > 0 ? (Math.random() > 0.2 ? 'PAID' : 'PENDING') : 'PENDING'; // Current month mostly pending

      const feeId = uid();
      await sql.query(`
        INSERT INTO "Fee" (id, "studentId", amount, "dueDate", status, month, year)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [feeId, spId, amount, dueDate.toISOString(), isPaid, feeDate.getMonth() + 1, feeDate.getFullYear()]);

      // Create payment record for paid fees
      if (isPaid === 'PAID') {
        const paidAt = new Date(dueDate);
        paidAt.setDate(paidAt.getDate() - randInt(0, 5));
        await sql.query(`
          INSERT INTO "Payment" (id, "feeId", "paymentGateway", "transactionId", amount, status, "paidAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT DO NOTHING
        `, [uid(), feeId, 'RAZORPAY', `txn_${uid().replace(/-/g, '').slice(0, 16)}`, amount, 'SUCCESS', paidAt.toISOString()]);
      }
      feeCount++;
    }
  }
  console.log(`  ✅ ${feeCount} fee records created`);
}

// ─── Seed Quiz Attempts & Submissions ───────────────────────────────────────
async function seedQuizAttemptsAndSubmissions(studentIds) {
  console.log('📝 Seeding Quiz Attempts & Submissions...');

  const studentProfiles = [];
  for (const sId of studentIds) {
    const sp = await sql.query(`SELECT id FROM "StudentProfile" WHERE "userId" = $1`, [sId]);
    if (sp.length > 0) studentProfiles.push(sp[0].id);
  }

  // Get existing quizzes and assignments
  const quizzes = await sql`SELECT id, "totalMarks" FROM "Quiz" LIMIT 10`;
  const assignments = await sql`SELECT id, "maxMarks" FROM "Assignment" LIMIT 10`;

  for (const spId of studentProfiles) {
    // Quiz attempts
    for (const quiz of quizzes) {
      const score = randInt(Math.floor(quiz.totalMarks * 0.4), quiz.totalMarks);
      await sql.query(`
        INSERT INTO "QuizAttempt" (id, "quizId", "studentId", score, "startedAt", "submittedAt", "timeTaken")
        VALUES ($1, $2, $3, $4, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '30 minutes', $5)
        ON CONFLICT DO NOTHING
      `, [uid(), quiz.id, spId, score, randInt(600, 1800)]);
    }

    // Assignment submissions
    for (const assignment of assignments) {
      const marks = randInt(Math.floor(assignment.maxMarks * 0.5), assignment.maxMarks);
      await sql.query(`
        INSERT INTO "Submission" (id, "assignmentId", "studentId", "submissionUrl", "submittedAt", marks, feedback)
        VALUES ($1, $2, $3, $4, NOW() - INTERVAL '3 days', $5, $6)
        ON CONFLICT DO NOTHING
      `, [uid(), assignment.id, spId, `https://storage.aura.edu/submissions/${uid()}.pdf`, marks, pick(['Good work!', 'Needs improvement in section 2.', 'Excellent understanding of concepts.', 'Review the last question.', null])]);
    }
  }
  console.log(`  ✅ Quiz attempts and submissions seeded`);
}

// ─── Seed Courses, Chapters, Assignments, Quizzes ───────────────────────────
async function seedCoursesAndContent(tutorIds) {
  console.log('📚 Seeding Courses & Content...');

  const tutorProfiles = [];
  for (const tId of tutorIds) {
    const tp = await sql.query(`SELECT id FROM "TutorProfile" WHERE "userId" = $1`, [tId]);
    if (tp.length > 0) tutorProfiles.push(tp[0].id);
  }
  if (tutorProfiles.length === 0) return;

  const courses = [
    { title: 'Mastering Advanced Calculus', subject: 'Mathematics', class: '12th', board: 'CBSE' },
    { title: 'Organic Chemistry Foundations', subject: 'Chemistry', class: '11th', board: 'CBSE' },
    { title: 'Newtonian Mechanics', subject: 'Physics', class: '12th', board: 'CBSE' },
    { title: 'Python Programming', subject: 'Computer Science', class: '10th', board: 'CBSE' },
    { title: 'English Literature', subject: 'English', class: '10th', board: 'ICSE' },
  ];

  for (const c of courses) {
    const courseId = uid();
    const tutorId = pick(tutorProfiles);
    await sql.query(`
      INSERT INTO "Course" (id, title, description, subject, class, board, "createdBy", "isPublished", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [courseId, c.title, `A comprehensive course on ${c.subject}`, c.subject, c.class, c.board, tutorId]);

    // Create chapters
    for (let ch = 1; ch <= 3; ch++) {
      const chapterId = uid();
      await sql.query(`
        INSERT INTO "Chapter" (id, "courseId", title, "order")
        VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING
      `, [chapterId, courseId, `Chapter ${ch}: ${c.subject} Fundamentals Part ${ch}`, ch]);

      // Create lessons
      for (let l = 1; l <= 2; l++) {
        await sql.query(`
          INSERT INTO "Lesson" (id, "chapterId", title, duration, "order")
          VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING
        `, [uid(), chapterId, `Lesson ${l}: Topic ${l}`, randInt(20, 60), l]);
      }
    }

    // Create assignment
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + randInt(3, 14));
    await sql.query(`
      INSERT INTO "Assignment" (id, title, description, "courseId", "createdBy", deadline, "maxMarks")
      VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING
    `, [uid(), `${c.subject} Assignment`, `Complete the ${c.subject} worksheet`, courseId, tutorId, deadline.toISOString(), pick([50, 100])]);

    // Create quiz with questions
    const quizId = uid();
    const totalMarks = 20;
    await sql.query(`
      INSERT INTO "Quiz" (id, title, "courseId", duration, "totalMarks", "createdBy")
      VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING
    `, [quizId, `${c.subject} Quiz`, courseId, 30, totalMarks, tutorId]);

    // Create questions for the quiz
    for (let q = 1; q <= 4; q++) {
      await sql.query(`
        INSERT INTO "Question" (id, "quizId", "questionText", type, options, "correctAnswer", marks)
        VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING
      `, [uid(), quizId, `${c.subject} question ${q}?`, 'MCQ', JSON.stringify(['Option A', 'Option B', 'Option C', 'Option D']), 'Option A', 5]);
    }
  }
  console.log(`  ✅ ${courses.length} courses with chapters, lessons, assignments, and quizzes created`);
}

// ─── Seed Conversations & Messages ──────────────────────────────────────────
async function seedMessages(parentIds, tutorIds) {
  console.log('💬 Seeding Conversations & Messages...');

  const tutorMessages = [
    'Your child has shown great improvement this week.',
    'Please ensure homework is submitted on time.',
    'Excellent performance in the last test!',
    'We should discuss the upcoming exam preparation strategy.',
    'Your child needs to focus more on problem-solving skills.',
  ];
  const parentReplies = [
    'Thank you for the update!',
    'We will make sure of that.',
    'That is great to hear!',
    'Yes, let us schedule a call to discuss.',
    'We are working on it at home as well.',
  ];

  let msgCount = 0;
  const limit = Math.min(parentIds.length, tutorIds.length);
  for (let i = 0; i < limit; i++) {
    const convId = uid();
    await sql.query(`
      INSERT INTO "Conversation" (id, type, "createdAt")
      VALUES ($1, 'DIRECT', NOW()) ON CONFLICT DO NOTHING
    `, [convId]);

    // Tutor sends a message
    const daysAgo = randInt(1, 7);
    const msgDate = new Date();
    msgDate.setDate(msgDate.getDate() - daysAgo);
    await sql.query(`
      INSERT INTO "Message" (id, "conversationId", "senderId", "messageText", seen, "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING
    `, [uid(), convId, tutorIds[i], pick(tutorMessages), true, msgDate.toISOString()]);

    // Parent replies
    const replyDate = new Date(msgDate);
    replyDate.setHours(replyDate.getHours() + randInt(1, 12));
    await sql.query(`
      INSERT INTO "Message" (id, "conversationId", "senderId", "messageText", seen, "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING
    `, [uid(), convId, parentIds[i], pick(parentReplies), false, replyDate.toISOString()]);

    msgCount += 2;
  }
  console.log(`  ✅ ${msgCount} messages in ${limit} conversations created`);
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 Starting database seed...\n');
  
  try {
    await seedAdmins();
    const studentIds = await seedStudents();
    const tutorIds = await seedTutors();
    const parentIds = await seedParents();
    await linkParentsToStudents(studentIds, parentIds);
    await seedCoursesAndContent(tutorIds);
    await seedAttendance(studentIds, tutorIds);
    await seedFees(studentIds);
    await seedQuizAttemptsAndSubmissions(studentIds);
    await seedXPAndBadges(studentIds);
    await seedNotifications(studentIds, tutorIds);
    await seedMessages(parentIds, tutorIds);
    
    // Print summary
    console.log('\n🎉 Seed complete! Summary:');
    const counts = await sql`
      SELECT role, COUNT(*) as count 
      FROM "User" 
      GROUP BY role 
      ORDER BY role
    `;
    console.table(counts);
    
    const profiles = await sql`
      SELECT 
        (SELECT COUNT(*) FROM "StudentProfile") as students,
        (SELECT COUNT(*) FROM "TutorProfile") as tutors,
        (SELECT COUNT(*) FROM "ParentProfile") as parents,
        (SELECT COUNT(*) FROM "Badge") as badges,
        (SELECT COUNT(*) FROM "XP") as xp_records,
        (SELECT COUNT(*) FROM "Fee") as fees,
        (SELECT COUNT(*) FROM "Attendance") as attendance,
        (SELECT COUNT(*) FROM "Conversation") as conversations
    `;
    console.log('\nProfile counts:', profiles[0]);
    
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

main();
