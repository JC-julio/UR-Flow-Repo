import axios from "axios";
import GetOneUseCaseManager from "../../Manager/GetOne.usecase";
import mongoose from "mongoose";
import ManagerMongooseRepository from "../../../../infra/repository/mongoDB/repositories/ManagerMongooseRepository";
import { config } from 'dotenv';
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

test("deve testar o GetOne do caso de uso da entidade Manager", async() => {
    await mongoose.connect(process.env.connectionString as string);
    const newLogin = await login()
    const nameManager = newLogin.manager.name
    const newManager = new GetOneUseCaseManager(new ManagerMongooseRepository())
    const getManager = await newManager.execute(nameManager)
    expect(getManager).toBeDefined()
},15000)