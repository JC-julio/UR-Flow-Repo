import { Injectable } from "@nestjs/common";
import QueueRepositoryInterface from "../../../../application/repository/QueueRepositoryInterface";
import Queue from "../../../../domain/queue";
import queueModel from "../models/MongooseModelQueue";

@Injectable()
export default class QueueMongooseRepository implements QueueRepositoryInterface {
    model = queueModel
    async save(queue: Queue): Promise<Queue> {
        const postQueu = await this.model.create({
            sequence: queue.sequence,
            organizationId: queue.organizationId,
        });
        const post = {
            ...postQueu['_doc'],
            id: postQueu.id,
            _id: undefined,
        }
        return post
    }

    async GetByOrganizationQueue(organizationId: String): Promise<any> {
        const queues = await this.model.findOne({organizationId: organizationId})
        if(!queues)
            return undefined
        const returnQueue = {
            sequence: queues.sequence,
            organizationId: queues.organizationId,
            id: queues.id,
        }
        return returnQueue
    }

    async getOne(id: String): Promise<Queue> {
        const queue = await this.model.findById(id)
        if(!queue)
            throw new Error("nenhuma fila encontrada")
        const returnQueue = {
            sequence: queue.sequence,
            organizationId: queue.organizationId,
            id: queue.id,
        }
        return returnQueue
    }

    async updateAll(sequence: String[], id: String): Promise<void> {
        return this.model.findByIdAndUpdate(id, {
            sequence: sequence
        })
    }

    async delete(id: String): Promise<void> {
        return this.model.findByIdAndDelete(id)
    }
} 