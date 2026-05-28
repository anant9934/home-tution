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

async function seedXPAndBadges(studentIds) {
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

  // Give each student some XP
  for (const sid of studentIds) {
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

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 Starting database seed...\n');
  
  try {
    await seedAdmins();
    const studentIds = await seedStudents();
    const tutorIds = await seedTutors();
    const parentIds = await seedParents();
    await seedXPAndBadges(studentIds);
    await seedNotifications(studentIds, tutorIds);
    
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
        (SELECT COUNT(*) FROM "XP") as xp_records
    `;
    console.log('\nProfile counts:', profiles[0]);
    
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

main();
