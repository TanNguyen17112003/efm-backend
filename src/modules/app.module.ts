import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from 'src/controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { User, UserSchema } from 'src/models/user.model';
import { Sample, SampleSchema } from 'src/models/sample.model';
import { SampleService } from 'src/services/sample.service';
import { SampleController } from 'src/controllers/sample.controller';
import { GoogleService } from 'src/services/google.service';
import { GoogleStrategy } from 'src/auth/google.strategy';
import { GoogleController } from 'src/controllers/google.controller';
import { Goal, GoalSchema } from 'src/models/goal.model';
import { GoalController } from 'src/controllers/goal.controller';
import { GoalService } from 'src/services/goal.service';
import { Activity, ActivitySchema } from 'src/models/activity.model';
import { ActivityService } from 'src/services/activity.service';
import { ActivityController } from 'src/controllers/activity.controller';
import { Challenge, ChallengeSchema } from 'src/models/challenge.model';
import { ChallengeService } from 'src/services/challenge.service';
import { ChallengeController } from 'src/controllers/challenge.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '10h' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Sample.name, schema: SampleSchema }]),
    MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }]),
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
  ],
  controllers: [
    AppController,
    UserController,
    SampleController,
    GoogleController,
    GoalController,
    ActivityController,
    ChallengeController,
  ],
  providers: [
    AppService,
    UserService,
    SampleService,
    GoogleService,
    GoalService,
    ActivityService,
    ChallengeService,
    GoogleStrategy,
  ],
  exports: [ConfigModule],
})
export class AppModule {}
