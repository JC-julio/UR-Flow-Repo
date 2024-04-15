    export default interface ManagerRepositoryInterface {
        GetOne(name: string): Promise<any>;
    }