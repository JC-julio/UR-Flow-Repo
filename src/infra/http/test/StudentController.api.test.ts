import axios from 'axios';
const linkAPI = 'https://ur-flow-repo-dev.vercel.app'
const linkSOSA = 'https://sosa-repo-dev.vercel.app'
axios.defaults.validateStatus = function () {
  return true;
};

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

async function postTwoStudent() {
    const randomUser1 = Math.random().toString(36).slice(-15);
    const randomUser2 = Math.random().toString(36).slice(-15);
    const newLogin = await login()
    const organizationId = newLogin.manager.organizationId
    const postParam1 = {
        name: 'Julio César Aguiar',
        className: '2022 A TI',
        type: false,
        registration: randomUser1,
    }
    const AxiosPost1 = await axios.post(linkSOSA + '/Student/' + organizationId ,
    postParam1,
    {
      headers: {authorization: newLogin.token}
    },
    );
    const postParam2 = {
      name: 'Thiciane Fernanda Frata Borges',
      className: '2022 B TI',
      type: false,
      registration: randomUser2,
    }
    const AxiosPost2 = await axios.post(linkSOSA + '/Student/' + organizationId ,
    postParam2,
    {
      headers: {authorization: newLogin.token}
    },
    );
    const objectReturn = {
      registration1: AxiosPost1.data.registration,
      registration2: AxiosPost2.data.registration,
      organizationId: organizationId,
    }
    return objectReturn
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

async function loginInApi() {
  const newLogin = await login()
  const inputLogin = {
      name: newLogin.manager.name,
      password: newLogin.manager.password,
  }
  const getToken = await axios.post(linkAPI + "/manager/login", inputLogin)
  const objectLogin = {
    name: inputLogin.name,
    password: inputLogin.password,
    token: getToken.data.manager.token
  }
  return objectLogin
}

test("Deve testar o GetOne da entidade Student", async() => {
    const newStudent = await postStudent()
    const newLoginInApi = await loginInApi()
    const getStudent = await axios.get(linkAPI + '/student' + '/' + newStudent.registration + '/' + newStudent.organizationId,
    {
      headers: {authorization: newLoginInApi.token}
    })
    expect(getStudent.data).toBeDefined()
}, 15000)

test("Deve retornar um erro caso um aluno não seja encontrado no GetOne", async() => {
  const newStudent = await postStudent()
  const newLogininAPI = await loginInApi()
  const newLogin = await login()
  await axios.delete(linkSOSA + '/Student/' + newStudent.organizationId + '/' + newStudent.id,
  {
    headers: {authorization: newLogin.token}
  }
  )
  const getStudent = await axios.get(linkAPI + '/student' + '/' + newStudent.registration + '/' + newStudent.organizationId,
  {
    headers: {authorization: newLogininAPI.token}
  })
  expect(getStudent.data.msg).toBe("Aluno não encontrado")
}, 15000)

test("Deve testar o GetAll da entidade Student", async() => {
  const students = await postTwoStudent()
  const newLoginInApi = await loginInApi()
  const getStudent = await axios.get(linkAPI + '/student' + '/' + students.organizationId,
  {
    headers: {authorization: newLoginInApi.token}
  })
  const getRegistration1 = getStudent.data.students.find((element) => element.registration == students.registration1)
  expect(getRegistration1).toBeDefined()
  const getRegistration2 = getStudent.data.students.find((element) => element.registration == students.registration2)
  expect(getRegistration2).toBeDefined()
}, 15000)