<template>
    <v-layout :class="$style['profile-view']">
        <v-card :class="$style['profile-view__card']" >
            <v-layout :class="$style['profile-view__card__layout']">
                <div style="text-align: right; width: 100%;" v-if="!username">
                    <v-btn @click="clickLoginPageBtnHandler"  variant="text"  :style="`${fontStyle}; font-size: 13px`">
                        <v-icon
                            icon="mdi-login-variant"
                            color="#684AFF"
                            size="large"
                            class="mr-1"
                        ></v-icon>
                        <span>로그인</span>
                    </v-btn>
                </div>
                <div style="text-align: right; width: 100%;" v-else>
                    <v-btn @click="clickMyPageBtnHandler"  variant="text" :style="`${fontStyle}; font-size: 13px`">
                        <v-icon
                            icon="mdi-home-account"
                            color="#FD3A84"
                            size="large"
                            class="mr-1"
                        ></v-icon>
                        <span>마이페이지</span>
                    </v-btn>
                </div>
                <div :class="$style['profile-view__card__layout-contents-box']">
                    <v-img alt="userImage" :src="url" :max-height="100" :max-width="100" contain></v-img>
                </div>
                <div v-if="username" :style="`${fontStyle}`"><span style="color: #684AFF;">{{ props.username }}</span><span>님</span></div>
                <div v-else><span :style="fontStyle" style="color: #FF8C06;">로그인 후 이용 바랍니다.</span></div>
            </v-layout>
        </v-card>
    </v-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, ref, watch } from "vue";
import router from "@/router";
import { useStore } from "@/store";
import { getUserImgAPI } from "@/api/loginAPI";

const props = defineProps({
    username : {
        type : [String, null] as PropType<string | null>, // 선택된 존 정보
        required: true
    },
});

const store = useStore();
const url = ref<any>(null);

const fontStyle = computed(() => {
    return "font-family: 'NanumEb' , sans-serif"
});

onMounted(() => {
    getUserImg();
})

watch(()=> props.username, () => {
    getUserImg();
});

const clickLoginPageBtnHandler = () => {
    router.push('/user-container/login')
};

const clickMyPageBtnHandler = () => {
    router.push('/user-container/my-page')
};

const getUserImg = async () => {
    if(store.getUserInfo.id){
        const imgUrl = await getUserImgAPI(store.getUserInfo.id);
        url.value = imgUrl.data !== 'err' ? `data:image/png;base64,${imgUrl.data}` : require('@/assets/img/common/user.png');
    }else {
        url.value = require('@/assets/img/common/user.png')
    }
};
</script>

<style lang="scss" module>
@import 'ProfileView';
</style>