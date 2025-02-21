import { login, logout, getInfo } from '@/api/user'
// import { login } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// domain:window.location.hostname+":8700"
// domain:"172.27.83.131:8700"
// domain:"172.27.38.163"
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  domain: window.location.hostname + ':8700',
  domainExport: window.location.hostname
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, { userInfo, message }) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          if (response.status === 'F') {
            message.error('登录失败，请检查用户名或密码');
            reject(new Error('登录失败，请检查用户名或密码'));
          } else if (response.status === 'S') {
            commit('SET_TOKEN', response.api_token);
            setToken(response.api_token);
            resolve(response.show_screen); // 👈 这里返回 isadmin
            // resolve();
          } else {
            message.warning('未知登录状态');
            reject(new Error('未知登录状态'));
          }
        })
        .catch(error => {
          message.error('网络错误，请稍后重试');
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { permissionsList, username } = data

          // roles must be a non-empty array
          if (!permissionsList || permissionsList.length <= 0) {
            reject('getInfo: permissionsList must be a non-null array!')
          }

          commit('SET_ROLES', permissionsList)
          commit('SET_NAME', username)
          commit(
            'SET_AVATAR',
            'http://www.ziycw.com/static/img/login-logo.54144107.png'
          )
          // commit('SET_INTRODUCTION', introduction)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
