import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import SobreNos from '../views/SobreNos.vue'
import Mapa from '../views/Mapa.vue'
import Contacto from '../views/Contacto.vue'
import Register from '../views/Register.vue'


// Protected views (only for admins)
import Dashboard from '../views/admin/Dashboard.vue'
import AdminUsers from '../views/admin/DashboardUsers.vue'
import AdminBebedouros from '../views/admin/DashboardBebedouros.vue'
import AreaPessoal from '../views/AreaPessoal.vue'
import { useAuth } from '../utilities/useAuth'

const routes = [
    { path: '/', component: Home, meta: { requiresNoLogin: true } },
    { path: '/sobre-nos', component: SobreNos },
    { path: '/mapa', component: Mapa },
    { path: '/contacto', component: Contacto },
    { path: '/register', component: Register },
    { 
        path: '/admin/dashboard', 
        component: Dashboard,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    { 
        path: '/admin/dashboard-users', 
        component: AdminUsers,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    { 
        path: '/admin/dashboard-bebedouros', 
        component: AdminBebedouros,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    { 
        path: '/user/personal-area', 
        component: AreaPessoal,
        meta: { requiresAuth: true }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
    const Auth = useAuth()

    if(to.meta.requiresNoLogin && Auth.isLoggedIn){
        return { path: '/mapa' }
    }
    if (to.meta.requiresAuth && !Auth.isLoggedIn) {
       return { path: '/' }
    } 

    if(to.meta.requiresAdmin && !Auth.isAdmin){
        return { path: '/', query: { error: 'acesso-negado' } }
    }

    return true
})

export default router