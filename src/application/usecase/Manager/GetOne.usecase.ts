import ManagerRepositoryInterface from "../../../application/repository/ManagerRepositoryInterface";
export default class GetOneUseCaseManager {
    constructor(readonly repo: ManagerRepositoryInterface) {}
    async execute(name: Input): Promise<Output> {
        const manager = await this.repo.GetOne(name);
        return {
            name: manager.name,
            password: manager.password,
            type: manager.type,
            id: manager.id,
            organizationId: manager.organizationId,
        }
    }
}

export type Input = string

export type Output = {
    name: string,
    password: string,
    type: string,
    id:string,
    organizationId: string,
}