import axios from 'axios';
axios.defaults.validateStatus = function () {
    return true;
};

const linkAPI = 'http://Localhost:4000'
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

test("deve fazer um post em uma fila nova", async() => {
    const newLogin = await login()
    const newLoginInApi = await loginInApi()
    const validInput = {
        sequence: ['1°A AGRO', "1°B AGRO", "2°A AGRO", "2°B AGROPEC"],
        organizationId: newLogin.manager.organizationId,
    }
    const saveQueue = await axios.post(linkAPI + "/queue", validInput,
    {
        headers: {authorization: newLoginInApi.token}
    })
    expect(saveQueue.data.queue.id).toBeDefined()
}, 15000)

test.only("deve fazer o GetByOrganizationId das filas", async()=> {
    const newLogin = await login()
    const newLoginInApi = await loginInApi()
    const validInput = {
        sequence: ['1°A AGRO', "1°B AGRO", "2°A AGRO", "2°B AGROPEC"],
        organizationId: newLogin.manager.organizationId,
    }
    const saveQueue = await axios.post(linkAPI + "/queue", validInput,
    {
        headers: {authorization: newLoginInApi.token}
    })    
    const getQueue = await axios.get(linkAPI + "/queue/" + newLogin.manager.organizationId,
    {
        headers: {authorization: newLoginInApi.token}
    })
    console.log(getQueue.data)
    expect(getQueue.data).toBeDefined()
}, 15000)

test("Deve testar o GetOne das filas", async() => {
    const newLogin = await login()
    const newLoginInApi = await loginInApi()
    const validInput = {
        sequence: ['1°A AGRO', "1°B AGRO", "2°A AGRO", "2°B AGROPEC"],
        organizationId: newLogin.manager.organizationId,
    }
    const saveQueue = await axios.post(linkAPI + "/queue", validInput,
    {
        headers: {authorization: newLoginInApi.token}
    })
    const getOneQueue = await axios.get(linkAPI + "/queue/getOne/" + saveQueue.data.queue.id,
    {
        headers: {authorization: newLoginInApi.token}
    });
    expect(getOneQueue.data.queue).toBeDefined()
    expect(getOneQueue.data.queue.organizationId).toBeDefined()
}, 15000)

test("Deve retornar um erro caso o GetOne não encontre nada", async()=> {
    const newLogin = await login()
    const newLoginInApi = await loginInApi()
    const validInput = {
        sequence: ['1°A AGRO', "1°B AGRO", "2°A AGRO", "2°B AGROPEC"],
        organizationId: newLogin.manager.organizationId,
    }
    const saveQueue = await axios.post(linkAPI + "/queue", validInput,
    {
        headers: {authorization: newLoginInApi.token}
    })
    const queue = await axios.delete(linkAPI + '/queue/' + saveQueue.data.queue.id,
    {
        headers: {authorization: newLoginInApi.token}
    })
    const getOneQueue = await axios.get(linkAPI + "/queue/getOne/" + saveQueue.data.queue.id,
    {
        headers: {authorization: newLoginInApi.token}
    });
    expect(getOneQueue.data.msg).toBe("nenhuma fila encontrada")
}, 15000)

test("Deve testar o delete das filas", async() => {
    const newLogin = await login()
    const newLoginInApi = await loginInApi()
    const validInput = {
        sequence: ['1°A AGRO', "1°B AGRO", "2°A AGRO", "2°B AGROPEC"],
        organizationId: newLogin.manager.organizationId,
    }
    const saveQueue = await axios.post(linkAPI + "/queue", validInput,
    {
        headers: {authorization: newLoginInApi.token}
    })
    await axios.delete(linkAPI + "/queue/"
    + saveQueue.data.id,
    {
        headers: {authorization: newLoginInApi.token}
    })
}, 15000)

test("Deve testar o update", async() => {
    const newLogin = await login()
    const newLoginInApi = await loginInApi()
    const validInput = {
        sequence: ['1°A AGRO', "1°B AGRO", "2°A AGRO", "2°B AGROPEC"],
        organizationId: newLogin.manager.organizationId,
    }
    const saveQueue = await axios.post(linkAPI + "/queue", validInput,
    {
        headers: {authorization: newLoginInApi.token}
    })
    const newValidInput = {
        sequence: ['1°A TI', "1°B TI", "2°A TI", "2°B TI"],
    }
    await axios.put(linkAPI + "/queue/" + saveQueue.data.queue.id, newValidInput,
    {
        headers: {authorization: newLoginInApi.token}
    })
    const getOneQueue = await axios.get(linkAPI + "/queue/getOne/" + saveQueue.data.queue.id,
    {
        headers: {authorization: newLoginInApi.token}
    });
    expect(getOneQueue.data.queue.id).toBe(saveQueue.data.queue.id)
    expect(getOneQueue.data.queue.organizationId).toBe(saveQueue.data.queue.organizationId)
    expect(getOneQueue.data.queue.sequence[0])
}, 15000)