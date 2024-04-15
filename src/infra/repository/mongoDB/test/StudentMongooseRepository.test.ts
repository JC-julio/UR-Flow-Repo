import axios from "axios";
import mongoose from "mongoose";
import { config } from 'dotenv';
import StudentsMongooseRepository from "../repositories/StudentMongooseRepository";
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

async function postStudent() {
    const randomUser1 = Math.random().toString(36).slice(-15);
    const newLogin = await login()
    const organizationId = newLogin.manager.organizationId
    const postParam = {
        name: 'Julio César Aguiar',
        className: '2022 A TI',
        type: false,
        registration: randomUser1,
    }
    const AxiosPost = await axios.post(linkSOSA + '/Student/' + organizationId ,
    postParam,
    {
      headers: {authorization: newLogin.token}
    },
    );
    const AxiosGetOne = await axios.get(
        linkSOSA + '/Student/'+ organizationId + '/' + AxiosPost.data.id,
        {
            headers: {authorization: newLogin.token}
        },
      );
    const studentObject = {
      name: AxiosGetOne.data.props.name,
      className: AxiosGetOne.data.props.className,
      registration: AxiosGetOne.data.props.registration,
      type: AxiosGetOne.data.props.type,
      id: AxiosPost.data.id,
      organizationId: organizationId,
    }
    return studentObject;
}

test("Deve testar o GetOne para verificar um aluno que já existe", async() => {
    await mongoose.connect(process.env.connectionString as string);
    const newStudent = await postStudent()
    const repo = new StudentsMongooseRepository()
    await repo.GetOne(newStudent.registration, newStudent.organizationId)
    await mongoose.connection.close();
}, 15000)

test("Deve testar o GetAll para verificar um aluno que já existe", async() => {
    await mongoose.connect(process.env.connectionString as string);
    const randomUser1 = Math.random().toString(36).slice(-15);
    const newLogin = await login()
    const organizationId = newLogin.manager.organizationId
    const postParam = {
        name: 'Julio César Aguiar',
        className: '2022 A TI',
        type: false,
        registration: randomUser1,
    }
    const AxiosPost = await axios.post(linkSOSA + '/Student/' + organizationId ,
    postParam,
    {
      headers: {authorization: newLogin.token}
    },
    );
    const randomUser2 = Math.random().toString(36).slice(-15);
    const postParam1 = {
        name: 'Thiciane Fernanda Frata Borges',
        className: '2022 B TI',
        type: false,
        registration: randomUser2,
    }
    const AxiosPost1 = await axios.post(linkSOSA + '/Student/' + organizationId ,
    postParam1,
    {
      headers: {authorization: newLogin.token}
    },
    );
    const repo = new StudentsMongooseRepository()
    const getStudents = await repo.GetAll(organizationId)
    const retrievedStudentByRegistration =  getStudents.find(
        (student) => student.registration == postParam.registration
    )
    const retrievedStudentById = getStudents.find((student) => student.id === AxiosPost1.data.id)
    expect(retrievedStudentById.id).toBe(AxiosPost1.data.id)
    expect(retrievedStudentByRegistration.registration).toBe(postParam.registration)
    await mongoose.connection.close();
}, 15000)