const routes = [{
  path: '/',
  redirect: '/login'
},
  {
    path: '/login',
    component: () => import('../../views/login/login'),
  },
  {
    path: '/home',
    component: () => import('../../views/home/home'),
    children: [{
      path: '/',
      redirect: '/welcome'
    },
      {
        path: '/welcome',
        component: () => import('../../views/welcome/welcome')
      },
      {
        path: '/users',
        component: () => import('../../views/user/users')
      },
      {
        path: '/Rights',
        component: () => import('../../views/power/Rights')
      },
      {
        path: '/Roles',
        component: () => import('../../views/power/Roles')
      },
      {
        path: '/categories',
        component: () => import('../../views/goods/Cate')
      },
      {
        path: '/params',
        component: () => import('../../views/goods/Params')
      },
      {
        path: '/goods',
        component: () => import('../../views/goods/List')
      },
      {
        path: '/goods/add',
        component: () => import('../../views/goods/Add')
      },
      {
        path: '/orders',
        component: () => import('../../views/order/Order')
      },
      {
        path: '/reports',
        component: () => import('../../views/report/Report')
      }
    ]
  }
]
export default routes