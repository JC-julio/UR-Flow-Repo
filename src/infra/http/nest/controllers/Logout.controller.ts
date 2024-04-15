import {
    Controller,
    Param,
    Post,
    Res,
  } from '@nestjs/common';
import { Response } from 'express';

import LogoutUsecaseManager from '../../../../application/usecase/Manager/logout.usecase';
import LogoutMongooseRepository from '../../../repository/mongoDB/repositories/LogoutMongooseRepository';
@Controller('logout')
export default class LogoutController {
    constructor (readonly repoLogout: LogoutMongooseRepository) {}
    @Post(':token')
    async Logout(@Param('token') token: string, @Res() res: Response) {
        try{
        const usecase = new LogoutUsecaseManager(this.repoLogout)
        await usecase.execute(token)
        return res.status(200).end()
    }catch(error) {
        let errorNumber: number;
        switch(error.message) {
            case "Token inválido":
                errorNumber = 400
                break
            default: {
                errorNumber = 500
                break
            }
        }
        return res.status(errorNumber).json({msg: error.message})
    }}
}