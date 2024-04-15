import { Injectable } from '@nestjs/common';
import StudentRepositoryInterface from 'src/application/repository/StudentsRepositoryInterface';
import crypto from "crypto";
import { StartOfWeek } from 'mongoose';

@Injectable()

export default class StudentsMemoryRepository implements StudentRepositoryInterface {
    private studentDatabase: Array<any> = []

    async save(student): Promise<any> {
            await this.studentDatabase.push({
            name: student.name,
            className: student.className,
            type: student.type,
            organizationId: student.organizationId,
            registration: student.registration,
            id: crypto.randomUUID(),
        })
    }

     async GetOne(registration: string): Promise<any> {
        const student = await this.studentDatabase.find(
            (dataBase) => dataBase.registration == registration)
        if (!student)
            throw new Error("Aluno não encontrado")
        const returnStudent = {
            name: student.name,
            className: student.className,
            type: student.type,
            organizationId: student.organizationId,
            registration: student.registration,
            id: student.registration,
        }
        return returnStudent;
    }

    async GetAll(organizationId: string): Promise<any[]> {
        const students = await this.studentDatabase; // Supondo que studentDatabase é uma Promise que retorna um array de estudantes
        if (!students || students.length === 0) {
            throw new Error("Nenhum aluno encontrado");
        }
        const studentsFromSameOrganization = students.filter(student => student.organizationId === organizationId)
        if (!studentsFromSameOrganization || studentsFromSameOrganization.length === 0) {
            throw new Error("Nenhum aluno encontrado para a organização fornecida");
        }
        return studentsFromSameOrganization.map(student => ({
            name: student.name,
            className: student.className,
            type: student.type,
            organizationId: student.organizationId,
            registration: student.registration,
            id: student.id,
        }));
    }
}