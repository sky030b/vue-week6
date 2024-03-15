import { defineStore } from 'pinia';
import axios from "axios";

export default defineStore('memberData', {
    state: () => ({
        userData: {},
        token: '',
    }),
    actions: {
        setToken(token, expired) {
            document.cookie = `token=${token}; expires=${new Date(expired)};`;
            this.getToken();
        },
        getToken() {
            this.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
            axios.defaults.headers.common.Authorization = this.token;
        },
        logout() {
            let token = "";
            let expired = "";
            this.setToken(token, expired);
        },
    },
})