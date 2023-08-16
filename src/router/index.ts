import { createWebHistory, createRouter } from "vue-router";
import MainContainer from "@/components/MainContainer.vue"

const routes = [
    {
        path: "/",
        name: "main",
        component: MainContainer,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;