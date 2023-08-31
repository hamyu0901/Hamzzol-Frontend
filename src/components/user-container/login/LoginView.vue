<template>
    <v-layout :class="$style['login-view']">
        <v-layout :class="$style['login-view__container']">
            <base-card title="Login" :width="500" :height="350">
                <base-text-field :value="id" icon="mdi-card-account-details-outline" label="ID" place-holder="id를 입력해주세요" @updateValue="id=$event"></base-text-field>
                <base-text-field class="pt-7" :value="password" icon="mdi-lock" type="password" label="Password" place-holder="비밀번호를 입력해주세요" @updateValue="password=$event"></base-text-field>
                <v-layout style="justify-content: right; padding-top: 50px" >
                    <v-btn
                        :class="$style['login-view__container-btn']"
                        style="color: #684AFF; background-color: #FFFFFF"
                        variant="text"
                        @click="clickRegisterBtnHandler"
                    >
                        Register
                    </v-btn>
                    <v-btn
                         :class="$style['login-view__container-btn']"
                         style="color: #FFFFFF; background-color: #684AFF"
                         variant="text"
                         @click="clickLoginBtnHandler"
                    >
                        Login
                    </v-btn>
                </v-layout>
            </base-card>
        </v-layout>
    </v-layout>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import router from "@/router";
import { getCompareUserAPI } from "@/api/loginAPI";
import { useStore } from "@/store";
import BaseTextField from "@/components/common/basetextfield/BaseTextField.vue";
import BaseCard from "@/components/common/basecard/BaseCard.vue";

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
                name: compareUserInfo.data.user_name,
            });
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
    router.push({ path: `/user-container/register` });
}


</script>
<style lang="scss" module>
@import 'LoginView';
</style>