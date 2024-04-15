import axios from "axios";
import mongoose from "mongoose";
import { config } from 'dotenv';
import GetOneUseCaseStudent from "../../Students/GetOne.usecase";
import StudentsMongooseRepository from "../../../../infra/repository/mongoDB/repositories/StudentMongooseRepository";
config();

const linkSOSA = 'https://sosa-repo-dev.vercel.app'

async function login(organizationId?) {
    const randomUser = Math.random().toString(36).slice(-10);
    const randomUser1 = Math.random().toString(36).slice(-10);
    const dataPostOrganization = {
      organization: {
          name: 'CAED Cacoal'
      },
      manager: {
          name: randomUser,
          password: '12345678',
          type: 'Servidor da CAED',
      }
  }
    const inputLogin = {
      user : dataPostOrganization.manager.name,
      password: dataPostOrganization.manager.password
    }
    const inputPostManager = {
      name: randomUser1,
      password: dataPostOrganization.manager.password,
      type: dataPostOrganization.manager.type
    }
    const organizationPost = await axios.post(linkSOSA + '/Organization',
    dataPostOrganization);
    const AxiosOutput = await axios.post(
      linkSOSA + '/Admin',
      inputLogin
    );
    const managerPost = await axios.post(
      linkSOSA + '/Admin/' + organizationId, inputPostManager,
      {
        headers: {authorization: AxiosOutput.data.token}
      },
    )
    const ObjectLogin = {
      manager: {
        name: organizationPost.data.name,
        password: dataPostOrganization.manager.password,
        type: organizationPost.data.type,
        id: organizationPost.data.id,
        organizationId: organizationPost.data.organizationId
      },
      token : AxiosOutput.data.token
    }
    return ObjectLogin
}

test("Deve testar o caso de uso, GetOne da entidadade Students", async() => {
    await mongoose.connect(process.env.connectionString as string);
    const randomUser = Math.random().toString(36).slice(-15);
    const newLogin = await login()
    const postParam = {
        name: 'Julio César Aguiar',
        className: '2022 A TI',
        type: false,
        registration: randomUser
    }
    await axios.post(linkSOSA + '/Student/' + newLogin.manager.organizationId ,
    postParam,
    {
        headers: {authorization: newLogin.token}
    },
    );
    const newStudents = new GetOneUseCaseStudent(new StudentsMongooseRepository())
    const getStudent = await newStudents.execute(postParam.registration, newLogin.manager.organizationId)
    expect(getStudent).toBeDefined()
}, 15000)