<template>
    <v-layout :class="$style['login-container']">
        <v-layout :class="$style['login-container__layout']" @click="clickLogo">
            <img alt="Vue logo" src="@/assets/img/logo.png" height="100" width="120">
            <span :class="$style['login-container__layout-title']">Hamzzol-World</span>
        </v-layout>
        <router-view></router-view>
    </v-layout>
</template>
<script lang="ts" setup>
import router from "@/router";

const clickLogo = () => {
    router.push({ path: `/` });
};
</script>
<style lang="scss" module>
@import 'LoginContainer';
</style>