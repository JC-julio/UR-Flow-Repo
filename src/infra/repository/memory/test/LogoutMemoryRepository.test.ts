import Manager from "../../../../domain/Manager";
import logoutMemoryRepository from "../LogoutMemoryRepository"
import ManagerMemoryRepository from "../ManagerMemoryRepository";

test("Deve testar o logout e o GetOne da implementação de banco de dados falso(orientado a arrays)", async () => {
    const validInput = {
        name: 'Júlio César Aguiar',
        password: '123456789',
        type: true
    }
    const manager = Manager.create(validInput)
    const repo = new ManagerMemoryRepository();
    await repo.save(validInput)
    const getManager = await repo.GetOne(validInput.name)
    const token = await manager.generateToken(getManager.id)
    const repoLogout = new logoutMemoryRepository();
    await repoLogout.logout(token)
    const isBlackListed = await repoLogout.GetOne(token)
    expect(token).toBeDefined()
    expect(isBlackListed).toBeDefined()
}, 15000)