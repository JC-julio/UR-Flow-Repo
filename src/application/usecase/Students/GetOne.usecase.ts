import StudentRepositoryInterface from "../../repository/StudentsRepositoryInterface";

export default class GetOneUseCaseStudent {
    constructor(readonly repo: StudentRepositoryInterface) {}
        async execute(registration: Input, idOrganization: Input): Promise<Output> {
        const student = await this.repo.GetOne(registration, idOrganization);
        return {
            name: student.name,
            className: student.className,
            type: student.type,
            organizationId: student.organizationId,
            registration: student.registration,
            id: student.id,
        }
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
}