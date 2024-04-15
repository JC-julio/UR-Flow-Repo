
export default interface StudentRepositoryInterface {
    GetOne(registration: string, idOrganization: string): Promise<any>;
    GetAll(organizationId: string): Promise<Array<any>>
}