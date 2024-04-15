import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import ManagerController from './../../http/nest/controllers/Manager.controller';
import ManagerMongooseRepository from '../../repository/mongoDB/repositories/ManagerMongooseRepository';
import LogoutMongooseRepository from '../../repository/mongoDB/repositories/LogoutMongooseRepository';
import StudentController from './controllers/Student.controller';
import StudentsMongooseRepository from '../../repository/mongoDB/repositories/StudentMongooseRepository';
import { loginRequired } from './middleware/middlewareDeLogin';
import LogoutController from './controllers/Logout.controller';
import { databaseProviders as connectDatabase } from './mongodbProvider';
import QueueController from './controllers/Queue.controller';
import QueueMongooseRepository from '../../../infra/repository/mongoDB/repositories/QueueMongooseRepository';
@Module({
    controllers: [
        ManagerController,
        StudentController,
        LogoutController,
        QueueController,
    ],
    providers: [
        connectDatabase,
        ManagerMongooseRepository,
        StudentsMongooseRepository,
        LogoutMongooseRepository,
        QueueMongooseRepository,
    ],
    exports: [connectDatabase]
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(loginRequired)
        .exclude({path: '/manager/login', method: RequestMethod.POST})
        .forRoutes('*')
    }
}