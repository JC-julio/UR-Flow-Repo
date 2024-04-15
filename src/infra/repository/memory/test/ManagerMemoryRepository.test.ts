import ManagerMemoryRepository from '../ManagerMemoryRepository'

test("Deve criar um novo manager temporário na classe e verificar se ele existe", async() => {
    const validInput = {
        name: 'Júlio César',
        password: '123456789',
        type: true,
    }
    const repo = new ManagerMemoryRepository();
    await repo.save(validInput)
    const getManager = await repo.GetOne(validInput.name)
    expect(getManager).toBeDefined()
}, 15000)

