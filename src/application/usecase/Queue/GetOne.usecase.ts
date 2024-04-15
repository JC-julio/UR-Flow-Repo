import QueueRepositoryInterface from "../../repository/QueueRepositoryInterface";

export default class GetOneQueue {
    constructor(readonly repo: QueueRepositoryInterface) {}
    async execute(props: Input): Promise<Output>{
        const queue = await this.repo.getOne(props.id)
        return {
            sequence: queue.sequence,
            id: queue.id,
            organizationId: queue.organizationId
        }
    }
}

export type Input = {
    id: String,
}

export type Output = {
    sequence: Array<String>,
    id: String,
    organizationId: String,
}