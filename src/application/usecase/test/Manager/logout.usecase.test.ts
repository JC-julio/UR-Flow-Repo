import axios from "axios";
import mongoose from "mongoose";
import { config } from 'dotenv';
import UsecaseLogoutManager from "../../Manager/logout.usecase";
import LogoutMongooseRepository from "../../../../infra/repository/mongoDB/repositories/LogoutMongooseRepository";
import UsecaseLoginManager from "../../Manager/login.usecase";
import ManagerMongooseRepository from "../../../../infra/repository/mongoDB/repositories/ManagerMongooseRepository";
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

test("deve testar o logout do caso de uso da entidade Manager", async() => {
    await mongoose.connect(process.env.connectionString as string);
    const newLogin = await login()
    const validInput = {
        name: newLogin.manager.name,
        password: newLogin.manager.password,
    }
    const newLoginInMicroservice = new UsecaseLoginManager(new ManagerMongooseRepository(), new LogoutMongooseRepository)
    const returnManager = await newLoginInMicroservice.execute(validInput)
    const token = returnManager.token
    const newLogout = new UsecaseLogoutManager(new LogoutMongooseRepository)
    expect(async () => newLogout.execute(token)).toBeTruthy()
}, 15000)