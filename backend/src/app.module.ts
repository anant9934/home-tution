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

@Module({
  imports: [AuthModule, UsersModule, StudentsModule, TutorsModule, CoursesModule, BookingsModule, QuizzesModule, AssignmentsModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
