<template>
    <v-layout :class="$style['login-view']">
        <div :class="$style['login-view__container']">
            <v-card :class="$style['login-view__container__card']">
                <v-card-title :class="$style['login-view__container__card-title']"> Login </v-card-title>
                <v-card-text :class="$style['login-view__container__card-text-container']">
                    <v-text-field
                            prepend-inner-icon="mdi-card-account-details-outline"
                            :class="$style['login-view__container__card-text-container-text-field']"
                            variant="outlined"
                            label="ID"
                            placeholder="id를 입력해주세요"
                            :model-value="id"
                            @update:modelValue="id=$event"
                    ></v-text-field>
                    <v-text-field
                            class="pt-7"
                            prepend-inner-icon="mdi-lock"
                            :class="$style['login-view__container__card-text-container-text-field']"
                            type="password"
                            variant="outlined"
                            label="Password"
                            placeholder="비밀번호를 입력해주세요"
                            :model-value="password"
                            @update:modelValue="password=$event"
                    ></v-text-field>
                    <v-layout style="justify-content: right; padding-top: 50px" >
                        <v-btn
                            :class="$style['login-view__container__card-text-container-btn']"
                            style="color: #684AFF; background-color: #FFFFFF"
                            variant="text"
                            @click="clickRegisterBtnHandler"
                        >
                            Register
                        </v-btn>
                        <v-btn
                            :class="$style['login-view__container__card-text-container-btn']"
                            style="color: #FFFFFF; background-color: #684AFF"
                            variant="text"
                            @click="clickLoginBtnHandler"
                        >
                            Login
                        </v-btn>
                    </v-layout>
                </v-card-text>
            </v-card>
        </div>
    </v-layout>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import router from "@/router";
import { getCompareUserAPI } from "@/api/loginAPI";

const id = ref<null | string>(null);
const password = ref<null | string>(null);

const clickLoginBtnHandler = async () => {
    const compareUserInfo = await getCompareUserAPI({
        id: id.value !== null ? id.value : '',
        password: password.value !== null ? password.value : ''
    });
    console.log(compareUserInfo)
};

const clickRegisterBtnHandler = () => {
    router.push({ path: `/login-container/register` });
}


</script>
<style lang="scss" module>
@import 'LoginView';
</style>