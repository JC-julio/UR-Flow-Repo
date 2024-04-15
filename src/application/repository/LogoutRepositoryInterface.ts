export default interface LogoutRepositoryInterface {
    logout(token: string): Promise<void>
}