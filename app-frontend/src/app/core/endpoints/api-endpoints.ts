export const API_ENDPOINTS = {

  auth: {
    login: '/login/login',
    register: '/users/register',
    profile: '/users/profile',
    changePassword: '/auth/change-password'
  },
  
  users: {
    getAll: '/admin/users',
    create: '/admin/users',
    delete: (id: number) => `/admin/users/${id}`
  },

  routes: {
    search: (origin:number, dest:number, date:string) => `/routes/search?origin_node_id=${origin}&destination_node_id=${dest}&departure_date=${date}`,
    getAll: '/routes',
    updateCapacity: (id: number) => `/routes/${id}/capacity`,
    updateBasePrice: (id: number) => `/routes/${id}/base-price`,
    DETAIL: (routeId: number | string) => `/routes/detail/${routeId}`,
  },

  reservations: {
    create: '/reservations',
    user: '/reservations/user',
    delete: (id: number) => `/reservations/${id}`,
  },

  nodes: {
    getAll: '/nodes',
    getMain: '/nodes/main',
    getSubnodes: '/nodes/subnodes',
    createSubnode: '/nodes/subnode',
    deleteSubnode: (id: number) => `/nodes/subnode/${id}`,
    reassignSubnode: (id: number) => `/nodes/subnode/${id}/reassign`,
    availableDestinations: (id:number) => `/nodes/available-destinations/${id}`,
  },

  comments: {
    create: '/comments',
    getByRoute: (routeId: number) => `/comments/${routeId}`,
    delete: (id: number) => `/comments/${id}`
  },

  ratings: {
    create: '/ratings',
    getByRoute: (routeId: number) => `/ratings/${routeId}`
  },

  bans: {
    create: '/bans',
    getAll: '/bans',
    delete: (id: number) => `/bans/${id}`
  }
};
