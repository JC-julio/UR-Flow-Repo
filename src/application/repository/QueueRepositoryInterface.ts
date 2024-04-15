import Queue from "../../domain/queue";

export default interface QueueRepositoryInterface {
    save(queue: Omit<Queue, 'id'>): Promise<Queue>,
    GetByOrganizationQueue(organizationId: String): Promise<Queue>,
    getOne(id: String): Promise<Queue>,
    updateAll(sequence: Array<String>, id: String): Promise<void>,
    delete(id: String): Promise<void>,
}