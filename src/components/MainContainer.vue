<template>
    <v-app :class="$style['main-container']">
        <v-toolbar
            :class="$style['main-container__toolbar']"
            color="#FFFFFF"
        >
            <v-toolbar-title :class="$style['main-container__toolbar-title']">
                <v-layout :class="$style['main-container__toolbar-title__layout']">
                    <img :class="$style['main-container__toolbar-title__layout-img']" alt="Vue logo" src="@/assets/logo.png" :height="60" :width="80">
                    <div :class="$style['main-container__toolbar-title__layout-title']">HamzzolWorld</div>
                </v-layout>
            </v-toolbar-title>
            <v-spacer />
            <div :class="$style['main-container__toolbar-items']">
                <v-btn class="pr-0 pl-0" @click="clickUserInfo">
                    <v-icon
                        icon="mdi-account-circle-outline"
                        color="#FF8C06"
                        size="large"
                        class="mr-1"
                    ></v-icon>
                    <span class="mr-5" :class="$style['main-container__toolbar-items-text']">회원가입</span>
                </v-btn>
                <v-btn class="pr-0 pl-0">
                    <v-icon
                        icon="mdi-login-variant"
                        color="#684AFF"
                        size="large"
                        class="mr-1"
                    ></v-icon>
                    <span :class="$style['main-container__toolbar-items-text']">로그인</span>
                </v-btn>
            </div>
        </v-toolbar>
    </v-app>

</template>

<script lang="ts" setup>
import { axios } from '@/main'
const clickUserInfo = async () => {
    try {
        console.log('clickButton');
        const response = await axios.get('/'); // 서버의 루트 엔드포인트에 요청
        console.log(response.data); // 서버에서 받은 데이터 콘솔에 출력 (선택 사항)
        // TODO: 서버에서 받은 데 이터를 화면에 표시하거나 처리하는 코드를 추가하세요.
    } catch (error) {
        console.error('Error:', error);
        // TODO: 에러 처리 코드를 추가하세요.
    }
}
</script>
<style lang="scss" module>
@import './MainContainer';
</style>