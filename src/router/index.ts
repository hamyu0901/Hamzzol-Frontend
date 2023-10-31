import { createWebHistory, createRouter } from "vue-router";
import MainContainer from "@/components/main/MainContainer.vue"
import UserContainer from "@/components/user-container/UserContainer.vue";
import RegisterView from "@/components/user-container/register/RegisterView.vue"
import LoginView from "@/components/user-container/login/LoginView.vue"
import MyPage from "@/components/user-container/mypage/MyPage.vue";
import PlannerView from "@/components/planner/PlannerView.vue";

const routes = [
    { path: "/", name: "main", component: MainContainer },
    { path: '/user-container', name: "userContainer", component: UserContainer, redirect: '/user-container/register',
        children: [
            { path: 'register', name: 'register', component: RegisterView },
            { path: 'login', name: 'login', component: LoginView },
            { path: 'my-page', name: "myPage", component: MyPage,}
        ]
    },
    { path: "/planner", name: "planner", component: PlannerView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;