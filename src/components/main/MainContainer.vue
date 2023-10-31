<template>
    <v-app :class="$style['main-container']">
        <v-toolbar
            :class="$style['main-container__toolbar']"
            color="#FFFFFF"
        >
            <v-toolbar-title :class="$style['main-container__toolbar-title']">
                <v-layout :class="$style['main-container__toolbar-title__layout']" @click="clickLogoHandler">
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
        <base-tab :items="tabItems" @clickTabItem="clickTabItem"></base-tab>
        <v-layout v-if="isSelectedTabItem" :class="$style['main-container__layout']">
            <planner-view v-if="selectedTabItem[0].id === 1"></planner-view>
        </v-layout>
        <v-layout v-else :class="$style['main-container__layout']">
            <profile-view :class="$style['main-container__layout__profile-view']" :style="`${screenWidth < 2560 ? 'width: 15%' : 'width: 10%'}`" :username="username"></profile-view>
            <weather-forecast :class="$style['main-container__layout__weather-forecast']" :style="`${screenWidth < 2560 ? 'width: 65%' : 'width: 70%'}`"></weather-forecast>
            <v-layout style="display: flex; width: 20%;">
                <v-card width="100%" style="background: rgba(255, 255, 255, 0.5); border-radius: 20px;"></v-card>
            </v-layout>
        </v-layout>
    </v-app>
</template>

<script lang="ts" setup>
import router from "@/router";
import { useStore } from "@/store";
import { computed, onMounted, ref } from "vue";
import { ITabsItemType } from "../../interface/common/common";
import ProfileView from "@/components/main/profile/ProfileView.vue";
import WeatherForecast from "@/components/main/weather/WeatherForecast.vue";
import BaseTab from "@/components/common/basetab/BaseTab.vue";
import PlannerView from "@/components/planner/PlannerView.vue";

const store = useStore();
const username = ref<string | null>('');
const tabItems = ref<ITabsItemType[]>([
    { id: 0, title: 'Board', icon: 'mdi-table-heart', selected: false } ,
    { id: 1, title: 'Planner', icon: 'mdi-calendar-clock-outline', selected: false },
]);
const selectedTabItem = ref<ITabsItemType[]>([]);

onMounted (() => {
    username.value = store.getUserInfo.name;
});

const clickRegisterBtnHandler = () => {
    router.push({ path: `/user-container` });
};

const screenWidth = computed(() => {
    return window.screen.width
});

const isSelectedTabItem = computed(() => {
    return tabItems.value.some(tabItem => tabItem.selected)
});

const clickLogoHandler = async () => {
    tabItems.value.forEach(tabItem => tabItem.selected = false);
    await router.push('/');
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

const clickTabItem = (selectedItem: ITabsItemType) => {
    selectedTabItem.value = [selectedItem]
    tabItems.value.forEach(tabItem => {
        const isEqual = JSON.stringify(selectedItem.id) === JSON.stringify(tabItem.id);
        tabItem.selected = isEqual;
    })
};
</script>

<style lang="scss" module>
@import 'MainContainer';
</style>