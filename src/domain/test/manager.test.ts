import Manager from "../Manager"
import ManagerMemoryRepository from '../../infra/repository/memory/ManagerMemoryRepository'


test('Deve testar o método create da entidade Manager', () => {
    const validInput = {
        name: 'Júlio',
        password: '123456789'
    }
    const manager = Manager.create(validInput)
    expect(manager).toBeDefined()
})

test('deve validar uma senha que está correta a partir de um manager temporário', async () => {
    const validInput = {
        name: 'Júlio César Aguiar',
        password: '123456789',
        type: true
    }
    const manager = Manager.create(validInput)
    const repo = new ManagerMemoryRepository();
    await repo.save(validInput)
    const getManager = await repo.GetOne(validInput.name)
    const IsPasswordValid = await manager.validPassword(getManager.password)
    expect(IsPasswordValid).toBe(true)
}, 15000)

test('deve lançar um erro caso a senha seja incorreta', async () => {
    const validInput = {
      name: 'Júlio César Aguiar',
      password: '123456789',
    };
    const wrongPassword = '12345678';
    const manager = Manager.create(validInput);
    await expect(() => manager.validPassword(wrongPassword)).rejects.toThrow('Senha incorreta!');
  }, 15000);

test('deve gerar um token', async() => {
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
    expect(token).toBeDefined()  
}, 15000)

test('deve validar um token', async() => {
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
    const isTokenValid = await Manager.validToken(token)
    expect(isTokenValid).toBe(true)
}, 15000)

test('deve lançar um erro caso um token seja inválido', async() => {
    const token = 'JGFVSDJHKALJYSDGAKJDHSGAKJDHGAKJDHSAKJDHSA'
    await expect(() => Manager.validToken(token)).rejects.toThrow("Token inválido");
}, 15000)