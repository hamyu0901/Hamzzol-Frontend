<template>
    <v-layout :class="$style['user-container']">
        <v-layout :class="$style['user-container__layout']" @click="clickLogo">
            <img alt="Vue logo" src="@/assets/img/logo.png" height="100" width="120">
            <span :class="$style['user-container__layout-title']">Hamzzol-World</span>
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
@import 'UserContainer';
</style>