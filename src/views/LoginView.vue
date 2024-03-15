<template>
    <div class="container h-100">
        <div>
            <div class="row justify-content-center">
                <h1 class="h3 mb-3 font-weight-normal text-center p-3">
                    請先登入
                </h1>
                <div class="col">
                    <form id="form" class="form-signin" @submit.prevent="login">
                        <div class="form-floating mb-3">
                            <input type="email" class="form-control" id="username" placeholder="name@example.com"
                                   v-model="loginData.username" required autofocus>
                            <label for="username">Email address</label>
                        </div>
                        <div class="form-floating">
                            <input type="password" class="form-control" id="password" placeholder="Password"
                                   v-model="loginData.password" required>
                            <label for="password">Password</label>
                        </div>
                        <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
                            登入
                        </button>
                    </form>
                </div>
            </div>
            <p class="mt-5 mb-3 text-muted text-center">
                &copy; 2021~∞ - 六角學院
            </p>
        </div>
    </div>
</template>

<script>

import { mapActions } from 'pinia'
import memberStore from '@/stores/memberData'
import { toast } from 'vue3-toastify';
const delay = 1500;

export default {
    data() {
        return {
            api: {
                url: "https://ec-course-api.hexschool.io/v2",
                path: "sky030b"
            },
            loginData: {
                username: "",
                password: ""
            },
        }
    },
    methods: {
        async login() {
            try {
                toast.success('登入成功。', {
                    autoClose: delay,
                })
                const { data } = await this.axios.post(`${this.api.url}/admin/signin`, this.loginData);
                const { token, expired } = data;
                setTimeout(() => {
                    this.setToken(token, expired);
                    this.$router.push("/backstage");
                }, delay + 500);
            } catch (error) {
                alert(error.response.data.error.message);
            }
        },
        ...mapActions(memberStore, ['setToken'])
    },
    mounted() {
        const emailInput = document.querySelector("#username");
        emailInput.focus();
    }
}
</script>

<style scoped>
html,
body {
    height: 100%;
    text-align: center;
}

body {
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-signin {
    width: 100%;
    max-width: 500px;
    padding: 15px;
    margin: auto;
}
</style>