import QueueMongooseRepository from "../repositories/QueueMongooseRepository";
import mongoose from "mongoose";
import { config } from 'dotenv';
config();
import axios from "axios";


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

test("Deve testar a função save do repositório da entidade Queue", async() => {
    await mongoose.connect(process.env.connectionString as string);
    const newLogin = await login()
    const validInput = {
        sequence: ['oi', 'oi', 'oi', 'oi'],
        organizationId: newLogin.manager.organizationId
    }
    const queue = new QueueMongooseRepository
    const saveQueue = await queue.save(validInput)
    expect(saveQueue.id).toBeDefined()
}, 15000)

test.only("Deve testar o GetBYRepository do repositório da entidade Queue", async() => {
    await mongoose.connect(process.env.connectionString as string);
    const newLogin = await login()
    const validInput = {
        sequence: ['oi', 'oi', 'oi', 'oi'],
        organizationId: newLogin.manager.organizationId
    }
    const queue = new QueueMongooseRepository
    const idQueue = (await queue.save(validInput)).id
    const getQueue = await queue.GetByOrganizationQueue(newLogin.manager.organizationId)
    expect(getQueue.id).toBe(idQueue)
}, 15000)

test("Deve testar o GetOne do repositório da entidade Queue", async() => {
    await mongoose.connect(process.env.connectionString as string);
    const newLogin = await login()
    const validInput = {
        sequence: ['oi', 'oi', 'oi', 'oi'],
        organizationId: newLogin.manager.organizationId
    }
    const queue = new QueueMongooseRepository
    const idQueue = (await queue.save(validInput)).id
    const oneQueue = await queue.getOne(idQueue)
    expect(oneQueue.id).toBe(idQueue)
}, 15000)

test("Deve testar o updateAll do repositório da entidade Queue", async() => {
    await mongoose.connect(process.env.connectionString as string);
    const newLogin = await login()
    const validInput = {
        sequence: ['oi', 'oi', 'oi', 'oi'],
        organizationId: newLogin.manager.organizationId
    }
    const queue = new QueueMongooseRepository
    const idQueue = (await queue.save(validInput)).id
    const newInput = {
        sequence: ['euProgramoEmJS', 'euProgramoEmJS', 'euProgramoEmJS', 'euProgramoEmJS'],        
    }
    await queue.updateAll(newInput.sequence, idQueue)
    const oneQueue = await queue.getOne(idQueue)
    expect(oneQueue.sequence[0]).toBe(newInput.sequence[0])
}, 15000)

test("Deve testar o delete do repositório da entidade Queue", async() => {
    await mongoose.connect(process.env.connectionString as string);
    const newLogin = await login()
    const validInput = {
        sequence: ['oi', 'oi', 'oi', 'oi'],
        organizationId: newLogin.manager.organizationId
    }
    const queue = new QueueMongooseRepository
    const idQueue = (await queue.save(validInput)).id
    expect(async() => queue.delete(idQueue)).resolves
}, 15000)