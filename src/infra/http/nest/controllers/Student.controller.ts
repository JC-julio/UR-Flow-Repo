import {
    Body,
    Controller,
    Get,
    Param,
    Res,
  } from '@nestjs/common';
import { Response } from 'express';

import GetOneUseCaseStudent from '../../../../application/usecase/Students/GetOne.usecase';
import GetAllUseCaseStudent from '../../../../application/usecase/Students/GetAll.usecase';
import StudentsMongooseRepository from '../../../repository/mongoDB/repositories/StudentMongooseRepository';

  @Controller('student')
  export default class StudentController {
      constructor (readonly repoStudent: StudentsMongooseRepository) {}
      
      @Get(':registration/:organizationId')
      async GetOne(
        @Param('registration') registration:string,
        @Param('organizationId') organizationId: string,
        @Res() res: Response) {
          try {
            const usecase = new GetOneUseCaseStudent(this.repoStudent)
            const student = await usecase.execute(registration, organizationId);
            res.status(200).send(student)
          } catch (error) {
            let errorNumber: number;
            switch(error.message) {
              case "Aluno não encontrado":
                errorNumber = 404
                break
              default:
                errorNumber = 500
                break
            }
            res.status(errorNumber).json({msg: error.message})
          }
        }
  
      @Get(':organizationId')
      async getAll(@Param('organizationId') organizationId: string, @Res() res: Response) {
          try {
            const usecase = new GetAllUseCaseStudent(this.repoStudent)
            const students = await usecase.execute(organizationId)
<<<<<<< HEAD
            res.status(200).send(students)
=======
            res.status(200).json({students: students})
>>>>>>> 9e3d0c7b7b5aea9cb3601663206a25153cdc334f
          } catch (error) {
            res.status(500).json({msg: error.message})
          }
      }
}