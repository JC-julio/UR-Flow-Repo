import Queue from "src/domain/queue";
import QueueRepositoryInterface from "../../repository/QueueRepositoryInterface";

export default class GetByOrganizationQueue {
    constructor(readonly repo: QueueRepositoryInterface) {}
    async execute(props: Input): Promise<Output> {
        const getByOrganizationQueue = await this.repo.GetByOrganizationQueue(props.OrganizationId)
             return {
                sequence: getByOrganizationQueue.sequence,
                organizationId: getByOrganizationQueue.organizationId,
                id: getByOrganizationQueue.id,
            }
    }
}

export type Input = {
    OrganizationId: String,
}

export type Output = {
    sequence: Array<String>,
    id: String,
    organizationId: String,
}