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
import { useStore } from "@/store";

const store = useStore();
const id = ref<null | string>(null);
const password = ref<null | string>(null);

const clickLoginBtnHandler = async () => {
    const compareUserInfo = await getCompareUserAPI({
        id: id.value !== null ? id.value : '',
        password: password.value !== null ? password.value : ''
    });
    if(compareUserInfo.data){
        if(compareUserInfo.data !== 'Not User' && compareUserInfo.data !== 'err' && compareUserInfo.data !== 'Incorrect password'){
            store.setUserInfo({
                id: compareUserInfo.data.user_id,
                name: compareUserInfo.data.user_name
            });
            sessionStorage.setItem('username', compareUserInfo.data.user_name)
            await router.push('/')
        }
        else {
            if(compareUserInfo.data === 'Not User'){
                window.alert('등록된 사용자가 없습니다.')
            }
            else if(compareUserInfo.data === 'Incorrect password'){
                window.alert('비밀번호가 일치하지 않습니다.')
            }
            else {
                window.alert('사용자 정보를 다시 확인해주세요')
            }
        }
    }else {
        window.alert('사용자 정보를 다시 확인해주세요')
    }
};

const clickRegisterBtnHandler = () => {
    router.push({ path: `/login-container/register` });
}


</script>
<style lang="scss" module>
@import 'LoginView';
</style>