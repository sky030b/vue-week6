<template>
    <div class="container-fluid bg-dark fixed-bottom">
        <header class="container d-flex justify-content-end">
            <nav class="d-flex gap-5">
                <template v-if="!token">
                    <RouterLink class="link-light" to="/login">Admin-Login</RouterLink>
                </template>
                <template v-else>
                    <RouterLink class="link-light" to="/backstage">Products-Backstage</RouterLink>
                    <a class="link-light" href="javascript:;" @click="logoutHandle">
                        Admin-Logout
                    </a>
                </template>
            </nav>
        </header>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import memberStore from '@/stores/memberData'
import { toast } from 'vue3-toastify';
const delay = 1500;

export default {
    data() {
        return {
        }
    },
    methods: {
        logoutHandle() {
            toast.success('登出成功。', {
                autoClose: delay,
            })
            setTimeout(() => {
                this.logout();
                this.$router.push("/login");
            }, delay + 500)
        },
        ...mapActions(memberStore, ['logout', 'getToken'])
    },
    computed: {
        ...mapState(memberStore, ['token'])
    },
    mounted() {
        this.getToken();
    }
}

</script>

<style scoped>
nav a {
    /* color: rgb(183, 190, 216); */
    text-decoration: none;
    line-height: 2.5;
}

nav a.active {
    text-decoration: underline;
}

nav a:hover {
    background-color: rgba(183, 190, 216, 0.2);
}
</style>