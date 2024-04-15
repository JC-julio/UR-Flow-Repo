import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Res,
  } from '@nestjs/common';
import { Response } from 'express';

import SaveQueue from '../../../../application/usecase/Queue/Save.usecase';
import { Input as QueueInput} from '../../../../application/usecase/Queue/Save.usecase';
import GetOneQueue from '../../../../application/usecase/Queue/GetOne.usecase';
import DeleteQueue from '../../../../application/usecase/Queue/Delete.usecase';
import UpdateAllQueue from '../../../../application/usecase/Queue/UpdateAll.usecase';
import QueueMongooseRepository from '../../../../infra/repository/mongoDB/repositories/QueueMongooseRepository';
import GetByOrganizationQueue from '../../../../application/usecase/Queue/GetByOrganizationId.usecase';

@Controller('queue')
export default class QueueController {
    constructor(readonly repoQueue: QueueMongooseRepository) {}
    @Post()
    async save(@Body() queueData: QueueInput, @Res() res: Response) {
        try {
            const usecase = new SaveQueue(this.repoQueue)
            const newQueueResponse = await usecase.execute(queueData)
            res.status(201).json({queue: newQueueResponse})
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    }

    @Get(':organizationId')
    async getByOrganizationId(@Param('organizationId') organizationId: String, @Res() res: Response) {
        try {
            const usecase = new GetByOrganizationQueue(this.repoQueue)
            const queue = await usecase.execute({OrganizationId: organizationId})
            res.status(200).send(queue)
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

    @Get('/getOne/:id')
    async getOne(@Param('id') id: String, @Res() res: Response) {
        try {
            const usecase = new GetOneQueue(this.repoQueue)
            const queue = await usecase.execute({id: id})
            res.status(200).send(queue)
        } catch (error) {
            let errorNumber: number;
            switch(error.message){
                case "nenhuma fila encontrada":
                    errorNumber = 404
                    break
                default:
                    errorNumber = 500
                    break
            }
            res.status(errorNumber).json({msg: error.message})
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: String, @Res() res: Response) {
        try {
            const usecase = new DeleteQueue(this.repoQueue)
            await usecase.execute({id: id})
            res.status(200).end()
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    }

    @Put(':id')
    async updateAll(@Body()sequence: Array<String>, @Param('id') id: String, @Res() res: Response) {
        try {
            const usecase = new UpdateAllQueue(this.repoQueue)
            await usecase.execute({sequence: sequence, id: id})
            res.status(202).end()
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    }
}