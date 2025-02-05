import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterServeAsyncRoutes(routes, permissionsList) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasServePermission(permissionsList, tmp)) {
      if (tmp.children) {
        tmp.children = filterServeAsyncRoutes(tmp.children, permissionsList)
      }
      res.push(tmp)
    }
  })

  return res
}
function hasServePermission(permissionsList, route) {
  if (route.hidden) {
    return true
  } else if (route.name) {
    return permissionsList.includes(route.name)
  } else {
    return true
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, data) {
    return new Promise(resolve => {
      const { roles } = data
      // const { routesMap } = data
      const { permissionsList } = data
      let accessedRoutes
      if (roles == '超级管理员') {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterServeAsyncRoutes(asyncRoutes, permissionsList)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
