import { Injectable } from '@nestjs/common';
import StudentRepositoryInterface from 'src/application/repository/StudentsRepositoryInterface';
import studentsModel from '../models/MongooseModelStudents';

@Injectable()

export default class StudentsMongooseRepository implements StudentRepositoryInterface {
model = studentsModel

     async GetOne(registration: string, idOrganization: string): Promise<any> {
        const registrationStudentsEqual = await studentsModel.findOne({
            $and: [
                { registration: registration },
                { organizationId: idOrganization },
            ]
        });
        if (!registrationStudentsEqual)
            throw new Error("Aluno não encontrado")
        const returnStudent = {
            name: registrationStudentsEqual.name,
            className: registrationStudentsEqual.className,
            type: registrationStudentsEqual.type,
            organizationId: registrationStudentsEqual.organizationId,
            registration: registrationStudentsEqual.registration,
            id: registrationStudentsEqual.registration,
        }
        return returnStudent;
    }

     async GetAll(organizationId: string): Promise<any[]> {
        const students = await this.model.find({organizationId: organizationId})
        return students.map((data) => ({
            name: data.name,
            className: data.className,
            type: data.type,
            organizationId: data.organizationId,
            registration: data.registration,
            id: data.id,
            }));
    }
}