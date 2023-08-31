<template>
    <v-app :class="$style['main-container']">
        <v-toolbar
            :class="$style['main-container__toolbar']"
            color="#FFFFFF"
        >
            <v-toolbar-title :class="$style['main-container__toolbar-title']">
                <v-layout :class="$style['main-container__toolbar-title__layout']">
                    <img :class="$style['main-container__toolbar-title__layout-img']" alt="Vue logo" src="../../assets/img/logo.png" :height="60" :width="80">
                    <div :class="$style['main-container__toolbar-title__layout-title']">Hamzzol-World</div>
                </v-layout>
            </v-toolbar-title>
            <v-spacer />
            <div :class="$style['main-container__toolbar-items']">
                <v-btn class="pr-0 pl-0" @click="clickRegisterBtnHandler">
                    <v-icon
                        icon="mdi-account-circle-outline"
                        color="#FF8C06"
                        size="large"
                        class="mr-1"
                    ></v-icon>
                    <span class="mr-5" :class="$style['main-container__toolbar-items-text']">회원가입</span>
                </v-btn>
                <v-btn class="pr-0 pl-0" @click="clickLoginBtnHandler">
                    <v-icon
                        icon="mdi-login-variant"
                        color="#684AFF"
                        size="large"
                        class="mr-1"
                    ></v-icon>
                    <span :class="$style['main-container__toolbar-items-text']">{{ `${!username ? '로그인' : '로그아웃'}` }}</span>
                </v-btn>
            </div>
        </v-toolbar>
        <v-layout :class="$style['main-container__layout']">
            <profile-view :username="username"></profile-view>
        </v-layout>
    </v-app>
</template>

<script lang="ts" setup>
import router from "@/router";
import { useStore } from "@/store";
import { onMounted, ref } from "vue";
import ProfileView from "@/components/main/profile/ProfileView.vue";

const store = useStore();
const username = ref<string | null>('');

onMounted (() => {
    username.value = store.getUserInfo.name;
});

const clickRegisterBtnHandler = () => {
    router.push({ path: `/user-container` });
};

const clickLoginBtnHandler = () => {
    if(!username.value){
        router.push({ path: `/user-container/login` });
    }else {
        store.setUserInfo({
            id: '',
            name: '',
        });
        username.value = store.getUserInfo.name;
    }
};
</script>
<style lang="scss" module>
@import 'MainContainer';
</style>