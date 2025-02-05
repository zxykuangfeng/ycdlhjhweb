import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
import BigScreen from '@/views/bigScreen/BigScreen'
import BigScreen2 from '@/views/bigScreen/BigScreen2'
import BigScreen3 from '@/views/bigScreen/BigScreen3'
import BigScreen4 from '@/views/bigScreen/BigScreen4'
import BigScreen5 from '@/views/bigScreen/BigScreen5'
export const constantRoutes = [
  {
    path: '/big-screen',
    component: BigScreen,
    hidden: true
  },
  {
    path: '/big-screen2',
    component: BigScreen2,
    hidden: true
  },
  {
    path: '/big-screen3',
    component: BigScreen3,
    hidden: true
  },
  {
    path: '/big-screen4',
    component: BigScreen4,
    hidden: true
  },
  {
    path: '/big-screen5',
    component: BigScreen5,
    hidden: true
  },
  {
    path: '/public-page', 
    component: () => import('@/views/mobile/index'), // 确保正确路径
    hidden: true, 
    meta: {
      requiresAuth: false, // 确保不需要登录
    }
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 系统管理
  {
    path: '/systemManage',
    component: Layout,
    redirect: '/systemManage/user',
    alwaysShow: true, // will always show the root menu
    name: 'systemManage',
    meta: {
      title: '系统管理',
      icon: 'component',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/systemManage/user'),
        name: 'User',
        meta: {
          title: '用户管理'
          // roles: ["admin"] // or you can only set roles in sub nav
        }
      },
      {
        path: 'role',
        component: () => import('@/views/systemManage/role'),
        name: 'Role',
        meta: {
          title: '角色管理',
          roles: ['admin']
        }
      }
    ]
  },
  // 道路管理
  {
    path: '/roadManage',
    component: Layout,
    redirect: '/roadManage/district',
    alwaysShow: true, // will always show the root menu
    name: 'RoadManage',
    meta: {
      title: '道路管理',
      icon: 'table',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'district',
        component: () => import('@/views/roadManage/district'),
        name: 'District',
        meta: {
          title: '行政区划管理',
          roles: ['admin']
        }
      },
      {
        path: 'road',
        component: () => import('@/views/roadManage/road'),
        name: 'Road',
        meta: {
          title: '道路管理',
          roles: ['admin']
        }
      },
      {
        path: 'segment',
        component: () => import('@/views/roadManage/segment'),
        name: 'Segment',
        meta: {
          title: '路段管理',
          roles: ['admin']
        }
      },
      {
        path: 'intersection',
        component: () => import('@/views/roadManage/intersection'),
        name: 'Intersection',
        meta: {
          title: '路口管理',
          roles: ['admin']
        }
      }
    ]
  },
  // 道路管理
  {
    path: '/patrolManage',
    component: Layout,
    redirect: '/patrolManage/district',
    alwaysShow: true, // will always show the root menu
    name: 'PatrolManage',
    meta: {
      title: '巡查管理',
      icon: 'table',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'car',
        component: () => import('@/views/patrolManage/car'),
        name: 'District',
        meta: {
          title: '巡检车管理',
          roles: ['admin']
        }
      },
      {
        path: 'strategy',
        component: () => import('@/views/patrolManage/strategy'),
        name: 'strategy',
        meta: {
          title: '巡查策略',
          roles: ['admin']
        }
      },
      {
        path: 'planning',
        component: () => import('@/views/patrolManage/planning'),
        name: 'planning',
        meta: {
          title: '巡查规划',
          roles: ['admin']
        }
      }
    ]
  },
  // 隐患管理
  {
    path: '/hazardManage',
    component: Layout,
    redirect: '/hazardManage/type',
    alwaysShow: true, // will always show the root menu
    name: 'HazardManage',
    meta: {
      title: '隐患管理',
      icon: 'international',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'hazard',
        component: () => import('@/views/hazardManage/hazard'),
        name: 'Hazard',
        meta: {
          title: '隐患库',
          roles: ['admin']
        }
      },
      {
        path: 'hazardtype',
        component: () => import('@/views/hazardManage/type'),
        name: 'HazardType',
        meta: {
          title: '隐患类型管理',
          roles: ['admin']
        }
      },  
      {
        path: 'hazardreport',
        component: () => import('@/views/hazardManage/report'),
        name: 'HazardReport',
        meta: {
          title: '隐患报告编制',
          roles: ['admin']
        }
      },  
      {
        path: '/hazardManage/libraryDetail',
        component: () => import('@/views/hazardManage/libraryDetail'),
        name: 'libraryDetail',
        meta: {
          title: '隐患详情',
          // roles: ['admin']
        },
        hidden: true
      },
      {
        path: 'repairRequest',
        component: () => import('@/views/hazardManage/repairRequest'),
        name: 'RepairRequest',
        meta: {
          title: '隐患修复申请',
          roles: ['admin']
        },
        hidden: true
      }
      // ,
      // {
      //   path: 'repair',
      //   component: () => import('@/views/hazardManage/repair'),
      //   name: 'Repair',
      //   meta: {
      //     title: '隐患修复',
      //     roles: ['admin']
      //   }
      // }
    ]
  },
  // 安全评分
  {
    path: '/safetyScore',
    component: Layout,
    redirect: '/safetyScore/manage',
    alwaysShow: true, // will always show the root menu
    name: 'SafetyScore',
    meta: {
      title: '安全评分',
      icon: 'guide',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'manage',
        component: () => import('@/views/safetyScore/manage'),
        name: 'Manage',
        meta: {
          title: '安全评分管理',
          roles: ['admin']
        }
      }
    ]
  },
  // 占道施工
  {
    path: '/roadConstruction',
    component: Layout,
    redirect: '/roadConstruction/audit',
    alwaysShow: true, // will always show the root menu
    name: 'RoadConstruction',
    meta: {
      title: '占道施工',
      icon: 'clipboard',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'audit',
        component: () => import('@/views/roadConstruction/audit'),
        name: 'Audit',
        meta: {
          title: '占道施工审核',
          roles: ['admin']
        }
      },
      {
        path: 'repair',
        component: () => import('@/views/roadConstruction/repair'),
        name: 'Repair',
        meta: {
          title: '占道施工修复审核(交警)',
          roles: ['admin']
        }
      },
      {
        path: 'auditUnit',
        component: () => import('@/views/roadConstruction/auditUnit'),
        name: 'AuditUnit',
        meta: {
          title: '占道施工(施工单位)',
          roles: ['admin']
        }
      },
      {
        path: 'libraryDetail',
        component: () => import('@/views/roadConstruction/repairDetail'),
        name: 'libraryDetail',
        meta: {
          title: '占道施工详情',
          // roles: ['admin']
        },
        hidden: true
      },
    ]
  },
  // // 隐患修复
  // {
  //   path: '/hazardRepair',
  //   component: Layout,
  //   redirect: '/hazardRepair/request',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'HazardRepair',
  //   meta: {
  //     title: '隐患修复',
  //     icon: 'skill',
  //     roles: ['admin'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'request',
  //       component: () => import('@/views/hazardRepair/request'),
  //       name: 'Request',
  //       meta: {
  //         title: '修复申请',
  //         roles: ['admin']
  //       }
  //     },
  //     {
  //       path: 'result',
  //       component: () => import('@/views/hazardRepair/result'),
  //       name: 'Result',
  //       meta: {
  //         title: '修复结果',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
