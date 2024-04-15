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

test("Deve testar o GetOne", async () => {
    const newLogin = await login()
    const newLoginInApi = await loginInApi()
    const getOne = await axios.get(linkAPI + "/manager" + '/' + newLogin.manager.name,
    {
      headers: {authorization: newLoginInApi.token}
    })
    expect(getOne.data).toBeDefined()
}, 15000)

test("Deve testar o Login", async() => {
    const newLogin = await login()
    const inputLogin = {
        name: newLogin.manager.name,
        password: newLogin.manager.password,
    }
    const getToken = await axios.post(linkAPI + "/manager/login", inputLogin)
    expect(getToken.data.manager.token).toBeDefined()
}, 15000)

test("Deve retornar um erro caso a senha errada seja inserida", async() => {
  const newLogin = await login()
  const inputLogin = {
    name: newLogin.manager.name,
    password: '123456789',
  }
  const getToken = await axios.post(linkAPI + "/manager/login", inputLogin)
  expect(getToken.data.msg).toBe("Senha incorreta!")
}, 15000)

test("Deve retornar um erro caso o usuário não seja encontrado", async() => {
  const newLogin = await login()
  const inputLogin = {
    name: "shhhh",
    password: '12345678',
  }
  const getToken = await axios.post(linkAPI + "/manager/login", inputLogin)
  expect(getToken.data.msg).toBe("Nenhum administrador encontrado!")
}, 15000)