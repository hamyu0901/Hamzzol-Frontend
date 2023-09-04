<template>
    <v-layout :class="$style['profile-view']">
        <v-card :class="$style['profile-view__card']" >
            <v-layout :class="$style['profile-view__card__layout']">
                <div style="text-align: right; width: 100%;" v-if="username"><v-btn variant="text" color="#FF8C06" :style="fontStyle" @click="clickMyPageBtnHandler">마이페이지</v-btn></div>
                <img alt="userImage" :src="url" style="width:128px; height:128px" class="mt-3 mb-3"/>
                <div v-if="username" :style="`${fontStyle}`"><span style="color: #684AFF;">{{ props.username }}</span><span>님</span></div>
                <div v-else><span :style="`${fontStyle}`">로그인 후 이용 바랍니다.</span></div>
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
    return "font-family: 'NanumBd' , sans-serif"
});

onMounted(() => {
    getUserImg();
})

watch(()=> props.username, () => {
    getUserImg();
});

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