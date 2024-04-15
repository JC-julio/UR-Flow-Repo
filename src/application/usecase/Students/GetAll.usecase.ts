import StudentRepositoryInterface from "src/application/repository/StudentsRepositoryInterface";

export default class GetAllUseCaseStudent {
    constructor(readonly repo: StudentRepositoryInterface){} 
    async execute(organizationId: Input): Promise<Output> {
        const students = (await this.repo.GetAll(organizationId)).map((data) => {
            return {
                name: data.name,
                className: data.className,
                type: data.type,
                organizationId: data.organizationId,
                registration: data.registration,
                id: data.id,
            }
        })
        return students
    }
}
export type Input = string

export type Output = {
    name: string,
    className: string,
    type: boolean,
    organizationId: string,
    registration: string,
    id?: string,
}[];