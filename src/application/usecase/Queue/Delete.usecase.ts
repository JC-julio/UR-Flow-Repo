import QueueRepositoryInterface from "../../repository/QueueRepositoryInterface";

export default class DeleteQueue {
    constructor(readonly repo: QueueRepositoryInterface) {}
    async execute(props: Input): Promise<void>{
       await this.repo.delete(props.id)
    }
}

export type Input = {
    id: String,
}
