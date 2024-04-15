import StudentsMemoryRepository from "../StudentMemoryRepository"
import crypto from "crypto";


test("deve testar o save e o GetOne da implementação do banco de dados falso", async() => {
    const validInput = {
        name: 'Thiciane Fernanda Frata Borges',
        className: '2°B TI',
        type: true,
        registration: '2022108060016'
    }
    const repo = new StudentsMemoryRepository()
    await repo.save(validInput)
    const getStudent = await repo.GetOne(validInput.registration)
    expect(getStudent).toBeDefined()
}, 15000)

test("Deve testar o GetAll da implementação do banco de dados falso", async() => {
    const organizationId = crypto.randomUUID()
    const validInput = {
        name: 'Thiciane Frata',
        className: '2°A TI',
        type: false,
        registration: '2022108060032',
        organizationId: organizationId
    }
    const validInput1 = {
        name: 'Julio Cesar',
        className: '2°A TI',
        type: false,
        registration: '2022108060016',
        organizationId: organizationId
    }
    const validInput2 = {
        name: 'isso não deve ser retornado',
        className: 'XXXX',
        type: false,
        registration: 'XXXXXXXXXXXXX',
        organizationId: 'XXXXXXX'
    }
    const repo = new StudentsMemoryRepository()
    await repo.save(validInput)
    await repo.save(validInput2)
    await repo.save(validInput1)
    const getStudents = await repo.GetAll(validInput.organizationId)
    expect(getStudents).toBeDefined()       
}, 15000)   