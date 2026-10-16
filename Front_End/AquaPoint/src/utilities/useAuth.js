import { defineStore } from "pinia";

export const useAuth = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null
    }),

    getters: {
        isLoggedIn: (state) => state.token !== null && state.token !== undefined,
        isAdmin: (state) => state.user?.isAdmin === 1,
    },

    actions: {
        login(user, token) {
            this.user = user
            this.token = token
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('token', token)
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }
    }
})