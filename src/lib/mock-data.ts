export const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "History"
];

export const MOCK_TUTORS = [
  {
    id: "dr-sarah-jenkins",
    name: "Dr. Sarah Jenkins",
    subjects: ["Mathematics", "Physics"],
    qualification: "Ph.D. in Mathematics • IIT Delhi Alumnus",
    experience: "10+ Years Exp",
    hourlyRate: 800,
    rating: 4.9,
    reviews: 124,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    isVerified: true,
    about: "Hello! I'm Dr. Sarah, a passionate mathematics educator with over a decade of experience helping students crack competitive exams like IIT JEE and excel in their board exams. My teaching philosophy revolves around building a strong foundational understanding rather than rote memorization.",
    location: "Mumbai / Online"
  },
  {
    id: "arjun-mehta",
    name: "Arjun Mehta",
    subjects: ["Computer Science", "Mathematics"],
    qualification: "B.Tech Computer Science",
    experience: "4 Years Exp",
    hourlyRate: 500,
    rating: 4.7,
    reviews: 89,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    isVerified: true,
    about: "I specialize in making programming easy to understand for beginners. Whether it's Python, Java, or basic web development, I guide students step-by-step.",
    location: "Delhi / Online"
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    subjects: ["Chemistry", "Biology"],
    qualification: "M.Sc. Biochemistry",
    experience: "7 Years Exp",
    hourlyRate: 600,
    rating: 4.8,
    reviews: 210,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    isVerified: true,
    about: "Biology and Chemistry don't have to be boring! I use 3D visual aids and practical examples to make Science fascinating for high school students.",
    location: "Bangalore / Online"
  },
  {
    id: "david-miller",
    name: "David Miller",
    subjects: ["English", "History"],
    qualification: "M.A. English Literature",
    experience: "12 Years Exp",
    hourlyRate: 750,
    rating: 4.9,
    reviews: 156,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    isVerified: false,
    about: "Improve your spoken English, essay writing, and comprehension skills. I've taught students from over 15 different countries.",
    location: "Online"
  },
  {
    id: "rohit-verma",
    name: "Rohit Verma",
    subjects: ["Physics"],
    qualification: "M.Tech Mechanical Engineering",
    experience: "5 Years Exp",
    hourlyRate: 550,
    rating: 4.6,
    reviews: 67,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit",
    isVerified: true,
    about: "Physics is everywhere! I help students understand the laws of nature through real-life examples and rigorous problem-solving.",
    location: "Pune / Online"
  },
  {
    id: "neha-gupta",
    name: "Neha Gupta",
    subjects: ["Mathematics"],
    qualification: "B.Sc. Mathematics",
    experience: "3 Years Exp",
    hourlyRate: 400,
    rating: 4.5,
    reviews: 42,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
    isVerified: false,
    about: "Friendly and patient math tutor for middle school students. I focus on removing the fear of math.",
    location: "Online"
  }
];

export const MOCK_COURSES = [
  {
    id: "calc-101",
    title: "Mastering Advanced Calculus",
    subject: "Mathematics",
    description: "A complete guide to Integration and Differentiation for Class 12 and competitive exams.",
    instructor: "Dr. Sarah Jenkins",
    rating: 4.8,
    students: 1240,
    price: 1500,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80",
    duration: "8 weeks",
    level: "Advanced"
  },
  {
    id: "py-intro",
    title: "Python for Beginners",
    subject: "Computer Science",
    description: "Learn Python programming from scratch. Build your first game and automate simple tasks.",
    instructor: "Arjun Mehta",
    rating: 4.9,
    students: 3420,
    price: 999,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?w=500&q=80",
    duration: "6 weeks",
    level: "Beginner"
  },
  {
    id: "org-chem",
    title: "Organic Chemistry Foundations",
    subject: "Chemistry",
    description: "Master reaction mechanisms, IUPAC nomenclature, and stereochemistry.",
    instructor: "Priya Sharma",
    rating: 4.7,
    students: 890,
    price: 1200,
    image: "https://images.unsplash.com/photo-1603126857599-f6e15782fa15?w=500&q=80",
    duration: "10 weeks",
    level: "Intermediate"
  },
  {
    id: "eng-speak",
    title: "Fluent English Communication",
    subject: "English",
    description: "Build confidence in spoken English for interviews, presentations, and daily life.",
    instructor: "David Miller",
    rating: 4.8,
    students: 5600,
    price: 1800,
    image: "https://images.unsplash.com/photo-1546410531-ea4cea477149?w=500&q=80",
    duration: "4 weeks",
    level: "Beginner"
  },
  {
    id: "phy-mechanics",
    title: "Newtonian Mechanics",
    subject: "Physics",
    description: "Deep dive into kinematics, dynamics, work, energy, and rotational motion.",
    instructor: "Rohit Verma",
    rating: 4.6,
    students: 650,
    price: 1100,
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500&q=80",
    duration: "8 weeks",
    level: "Intermediate"
  },
  {
    id: "bio-genetics",
    title: "Genetics and Evolution",
    subject: "Biology",
    description: "Understand DNA, Mendelian genetics, and the theory of evolution.",
    instructor: "Priya Sharma",
    rating: 4.9,
    students: 1120,
    price: 1300,
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=500&q=80",
    duration: "6 weeks",
    level: "Advanced"
  }
];

// --- DASHBOARD MOCK DATA ---

export const MOCK_STUDENT_DASHBOARD = {
  studentName: "Alex Carter",
  xp: 1450,
  streak: 12,
  enrolledCourses: [
    { id: "calc-101", title: "Mastering Advanced Calculus", progress: 65, nextLesson: "Derivatives Practice", instructor: "Dr. Sarah Jenkins" },
    { id: "py-intro", title: "Python for Beginners", progress: 30, nextLesson: "Loops and Conditions", instructor: "Arjun Mehta" }
  ],
  upcomingClasses: [
    { id: 1, title: "1-on-1 Math Session", time: "Tomorrow, 4:00 PM", tutor: "Dr. Sarah Jenkins", joinLink: "#" },
    { id: 2, title: "Group Physics Doubt Clearing", time: "Friday, 6:00 PM", tutor: "Rohit Verma", joinLink: "#" }
  ],
  recentAchievements: ["Calculus Quiz Master", "7-Day Streak", "First Code Written"]
};

export const MOCK_PARENT_DASHBOARD = {
  childName: "Alex Carter",
  stats: { attendance: "94%", overallGrade: "A-", pendingFees: "₹4,500", teacherNotesCount: 2 },
  performance: [
    { title: "Mathematics", score: 92, color: "success" },
    { title: "Physics", score: 85, color: "primary" },
    { title: "Computer Science", score: 96, color: "success" }
  ],
  homework: [
    { title: "Calculus Worksheet 4", subject: "Math", status: "Submitted", isWarning: false },
    { title: "Python Loops Assignment", subject: "CS", status: "Pending", isWarning: true }
  ],
  feedback: [
    { tutorName: "Dr. Sarah Jenkins", subject: "Math", date: "2026-05-25", note: "Alex has shown great improvement in integration concepts. Keep up the good work!" },
    { tutorName: "Rohit Verma", subject: "Physics", date: "2026-05-20", note: "Needs a bit more focus during the mechanics problem-solving sessions." }
  ]
};

export const MOCK_TEACHER_DASHBOARD = {
  teacherName: "Dr. Sarah Jenkins",
  stats: { activeStudents: 45, hoursTaughtThisMonth: 82, earningsThisMonth: "₹65,600", rating: 4.9 },
  upcomingSchedule: [
    { id: 101, student: "Alex Carter", subject: "Calculus 1-on-1", time: "Today, 4:00 PM" },
    { id: 102, student: "Batch A", subject: "JEE Advanced Prep", time: "Today, 6:00 PM" }
  ],
  pendingDemoRequests: [
    { id: 201, student: "Priya Patel", requestedTime: "Tomorrow, 5:00 PM", subject: "Math" },
    { id: 202, student: "Rahul Sharma", requestedTime: "Thursday, 4:00 PM", subject: "Physics" }
  ],
  recentReviews: [
    { student: "Alex C.", rating: 5, comment: "Best math teacher ever! Complex topics feel so easy now." },
    { student: "Sneha M.", rating: 5, comment: "Helped me score 95 in my boards." }
  ]
};

export const MOCK_ADMIN_DASHBOARD = {
  stats: { totalRevenue: "₹14.5M", activeStudents: 12450, totalTutors: 850, activeCourses: 120 },
  pendingTutors: [
    { id: "pending-1", name: "Ananya Roy", subject: "Biology", appliedDate: "2 Days ago" },
    { id: "pending-2", name: "Vikram Singh", subject: "Chemistry", appliedDate: "1 Day ago" }
  ],
  recentTransactions: [
    { id: "txn-901", user: "Parent of Alex", amount: "₹4,500", date: "Today", status: "Completed" },
    { id: "txn-902", user: "Student John", amount: "₹1,500", date: "Yesterday", status: "Completed" }
  ]
};
