import { createWebHistory, createRouter } from "vue-router";
import MainContainer from "@/components/MainContainer.vue"
import LoginContainer from "@/components/login-container/LoginContainer.vue";
import RegisterView from "@/components/login-container/register/RegisterView.vue"
import LoginView from "@/components/login-container/login/LoginView.vue"

const routes = [
    { path: "/", name: "main", component: MainContainer },
    { path: '/login-container', name: "loginContainer", component: LoginContainer, redirect: '/login-container/register',
        children: [
            { path: 'register', name: 'register', component: RegisterView },
            { path: 'login', name: 'login', component: LoginView }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;