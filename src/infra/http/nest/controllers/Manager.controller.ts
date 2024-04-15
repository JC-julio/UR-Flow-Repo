import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Res,
  } from '@nestjs/common';

import ManagerMongooseRepository from '../../../repository/mongoDB/repositories/ManagerMongooseRepository';
import GetOneUseCaseManager from '../../../../application/usecase/Manager/GetOne.usecase';
import LoginUsecaseManager from '../../../../application/usecase/Manager/login.usecase';
import LogoutMongooseRepository from '../../../repository/mongoDB/repositories/LogoutMongooseRepository';
import { input as loginInput } from '../../../../application/usecase/Manager/login.usecase';
import { Response } from 'express';
@Controller('manager')
export default class ManagerController {
    constructor (readonly repoManager: ManagerMongooseRepository, readonly repoLogout: LogoutMongooseRepository) {}
    
    @Get(':name')
    async findOne(@Param('name') name:string, @Res() res: Response) {
        try {
            const usecase = new GetOneUseCaseManager(this.repoManager)
            const manager = await usecase.execute(name);
            return res.status(200).json({manager: manager})
        } catch (error) {
            let errorNumber: number;
            switch(error.message) {
                case "Administrador não encontrado":
                    errorNumber = 404
                    break
                default: {
                    errorNumber = 500
                    break
                }}
            return res.status(errorNumber).json({msg: error.message})
        }
    }

    @Post('login')
    async login(@Body() loginData: loginInput, @Res() res: Response) {
        try {
            const usecase = new LoginUsecaseManager(this.repoManager, this.repoLogout)
            const newLoginData = await usecase.execute(loginData)
            const returnData = {
                token: newLoginData.token,
                manager: {
                    name: newLoginData.name,
                    type: newLoginData.type,
                    id: newLoginData.id,
                    organizationId: newLoginData.organizationId
                }
            }
            return res.status(200).send(returnData)
        } catch (error) {
            let errorNumber: number;
            switch(error.message){
            case "Nenhum administrador encontrado!":
                errorNumber = 400
                break
            case "Senha incorreta!":
                errorNumber = 400
                break
            default: 
                errorNumber = 500
                break
        }
    return res.status(errorNumber).send({msg: error.message})
    }}
}