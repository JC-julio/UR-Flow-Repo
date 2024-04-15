import QueueRepositoryInterface from "../../repository/QueueRepositoryInterface";
import Queue from "../../../domain/queue";


export default class SaveQueue {
    constructor(readonly repo: QueueRepositoryInterface) {}
    async execute(props: Input): Promise<Output> {
    if(await this.repo.GetByOrganizationQueue(props.organizationId))
            throw new Error("Uma fila de turmas já existe!")
    const queue = new Queue(props.sequence, props.organizationId)
    const repoQueue = await this.repo.save(queue)        
    return {
        sequence: repoQueue.sequence,
        organizationId: repoQueue.organizationId,
        id: repoQueue.id
    }
    }
}

export type Input = {
    sequence: Array<String>,
    organizationId: String,
}

export type Output = {
    sequence: Array<String>,
    organizationId: String,
    id: String,
}