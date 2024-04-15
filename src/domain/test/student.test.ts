import Student from "../student"


const validInput = {
    registration: '2022108060016'
}

test('Deve testar o método create da entidade Students', () => {
    const student = Student.create(validInput)
    expect(student).toBeDefined()
})