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

test("Deve testar o Logout", async() => {
    const newLogin = await login()
    const newLoginInApi = await loginInApi()
    const inputLogin = {
        name: newLogin.manager.name,
        password: newLogin.manager.password,
    }
    const getToken = await axios.post( linkAPI + "/manager/login", inputLogin)
    expect(getToken.data.manager.token).toBeDefined()
    const logout = await axios.post(linkAPI + "/logout" + '/' + getToken.data.manager.token,
    {},
    {
      headers: {authorization: newLoginInApi.token}
    },)    
    //expect?
}, 15000)

test("Deve testar o logout com um token falso", async() => {
  const newLogin = await login()
  const newLoginInApi = await loginInApi()
  const inputLogin = {
      name: newLogin.manager.name,
      password: newLogin.manager.password,
  }
  const falseToken = 'shhhhh'
  const getToken = await axios.post( linkAPI + "/manager/login", inputLogin)
  expect(getToken.data.manager.token).toBeDefined()
  const logout = await axios.post(linkAPI + "/logout" + '/' + falseToken,
  {},
  {
    headers: {authorization: newLoginInApi.token}
  })
  expect(logout.data.msg).toBe("Token inválido")
}, 15000)