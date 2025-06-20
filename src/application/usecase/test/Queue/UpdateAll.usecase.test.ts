import axios from "axios";
import mongoose from "mongoose";
import SaveQueue from "../../Queue/Save.usecase";
import { config } from 'dotenv';
import QueueMongooseRepository from "../../../../infra/repository/mongoDB/repositories/QueueMongooseRepository";
import UpdateAllQueue from "../../Queue/UpdateAll.usecase";
import GetOneQueue from "../../Queue/GetOne.usecase";
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

test("Deve testar o caso de uso, updateAll", async() => {
    await mongoose.connect(process.env.connectionString as string);
    const newLogin = await login()
    const validInput = {
        sequence: ['shhh', 'shhh', 'shhhh'],
        organizationId: newLogin.manager.organizationId
    }
    const queue = new SaveQueue(new QueueMongooseRepository())
    const saveQueue = await queue.execute(validInput)
    const putQueue = new UpdateAllQueue(new QueueMongooseRepository())
    const newValidInput = {
        sequence: ['EusouUnico', 'souEuDeNovo', 'souEuDeNovo'],
        organizationId: newLogin.manager.organizationId
    }
    await putQueue.execute({sequence: newValidInput.sequence, id: saveQueue.id})
    const getOneQueue = new GetOneQueue(new QueueMongooseRepository())
    const getQueue = await getOneQueue.execute({id: saveQueue.id})
    expect(getQueue.sequence[0]).toBe(newValidInput.sequence[0])
}, 15000)