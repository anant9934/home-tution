import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { TutorsModule } from './modules/tutors/tutors.module';
import { CoursesModule } from './modules/courses/courses.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './modules/admin/admin.module';
import { ParentsModule } from './modules/parents/parents.module';
import { MailModule } from './modules/mail/mail.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SupportModule } from './modules/support/support.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    StudentsModule, 
    TutorsModule, 
    CoursesModule, 
    BookingsModule, 
    QuizzesModule, 
    AssignmentsModule, 
    PaymentsModule, 
    PrismaModule,
    AdminModule,
    ParentsModule,
    MailModule,
    UploadsModule,
    SupportModule,
    NotificationsModule,
    MessagesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
