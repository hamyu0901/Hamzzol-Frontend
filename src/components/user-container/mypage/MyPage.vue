<template>
  <v-layout :class="$style['my-page']">
      <base-modal :is-open="isOpen" :title="'회원 정보 확인'" :width="600" :height="280"  @onCloseModal="clickCloseBtnHandler">
          <base-text-field :value="id" icon="mdi-card-account-details-outline" label="ID" placeholder="id를 입력해주세요" @updateValue="id=$event"></base-text-field>
          <base-text-field class="pt-7" :value="password" icon="mdi-lock" :type="'password'" label="Password" placeholder="비밀번호를 입력해주세요" @updateValue="password=$event"></base-text-field>
          <v-layout style="width: 100%; justify-content: right; padding-top: 15px">
              <v-btn
                  :style="`${fontStyle}; color: #FFFFFF; background-color: #684AFF`"
                  variant="text"
                  @click="clickCheckBtnHandler"
              >확인</v-btn>
          </v-layout>
      </base-modal>
      <v-layout style="justify-content: center">
          <base-card title="마이페이지" v-if="!isOpen" :height="700" class="ma-2">
              <base-text-field :value="id" icon="mdi-card-account-details-outline" :disabled="true"></base-text-field>
              <base-text-field class="pt-7" :value="newPassword" :type="'password'" label="비밀번호 변경" placeholder="비밀번호를 입력해주세요" icon="mdi-lock" @updateValue="updatePassword($event)"></base-text-field>
              <base-text-field class="pt-7" :value="newSubPassword" :type="'password'" label="비밀번호 변경 확인" placeholder="비밀번호를 입력해주세요" icon="mdi-lock-check" @updateValue="updateCheckPassword($event)"></base-text-field>
              <span :style="`color:${passwordOptions.color}`">{{passwordOptions.text}}</span>
              <v-layout :class="$style['my-page__img-layout']" class="pt-7">
                  <span :class="$style['my-page__img-layout-title']">프로필 이미지 등록</span>
                  <span :class="$style['my-page__img-layout-sub-title']">이미지 크기는 128px × 128px 이상 권장 드립니다.</span>
                  <v-layout style="width: 100%; height: 100%; display: flex; justify-content: center">
                      <div :class="$style['my-page__img-layout-contents-box']">
                          <v-img
                              :src="url"
                              aspect-ratio="1.0"
                              :max-height="128"
                              :max-width="128"
                              contain
                          >
                          </v-img>
                      </div>
                  </v-layout>
                  <input type="file" id="imgUpload" @change="uploadImageData" ref="fileInput" accept="image/*" style="display:none;"/>
                  <div style="text-align: center">
                      <v-btn @click="openFileInput" :style="`${fontStyle}; width: 200px; height: 50px;`" :class="$style['my-page-btn']" flat>이미지 선택 + </v-btn>
                  </div>
              </v-layout>
              <v-layout style="width: 100%; justify-content: right; padding-top: 15px">
                  <v-btn :style="`${fontStyle}; color: #FFFFFF; background-color: #684AFF`" variant="text" @click="clickUpdateUserInfo">수정</v-btn>
                  <v-btn :style="`${fontStyle}; color: red; background-color: #FFFFFF`" variant="text" @click=" router.push('/')">취소</v-btn>
              </v-layout>
          </base-card>
      </v-layout>
  </v-layout>
</template>

<script lang="ts" setup>
interface IPasswordOptionType {
    flag: boolean,
    text: string,
    color: string
}
import { computed, onMounted, ref } from "vue";
import { useStore } from "@/store";
import router from "@/router";
import { getCompareUserAPI, getUserImgAPI, patchUserInfoAPI, uploadUserImgAPI } from "@/api/login/loginAPI";
import BaseModal from "@/components/common/basemodal/BaseModal.vue";
import BaseCard from "@/components/common/basecard/BaseCard.vue";
import BaseTextField from "@/components/common/basetextfield/BaseTextField.vue";
const store = useStore();
const isOpen = ref<Boolean>(false);
const id = ref<null | string>(null);
const password = ref<null | string>(null);
const newPassword = ref<null | string>(null);
const newSubPassword = ref<null | string>(null);
const passwordOptions = ref<IPasswordOptionType>({ flag: false, text: '', color: '#00E268'})
const url = ref<any>(null);
const fileInput = ref<any>(null);
const formData = ref<any>(null);

onMounted(() => {
    isOpen.value = true;
});

const fontStyle = computed(() => {
    return "font-family: 'NanumR' , sans-serif"
});

const clickCloseBtnHandler = () => {
    window.confirm('메인 페이지로 이동하시겠습니까?') && router.push('/');
};

const clickCheckBtnHandler = async () => {
    if(store.getUserInfo.id === id.value){
        const compareUserInfo = await getCompareUserAPI({
            id: id.value !== null ? id.value : '',
            password: password.value !== null ? password.value : ''
        });
        typeof compareUserInfo.data !== "object" ? window.alert('회원 정보가 일치하지 않습니다.') : (isOpen.value = false, await getUserImg());
    }else {
        window.alert('회원 정보가 일치하지 않습니다.')
    }
};

const updatePassword = (value: string) => {
    const isPasswordMatch = newSubPassword.value === value;
    newPassword.value = value;
    if(newSubPassword.value){
        passwordOptions.value.color = isPasswordMatch ? '#00E268' : '#FF4A4A';
        passwordOptions.value.text = isPasswordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.';
        passwordOptions.value.flag = isPasswordMatch;
    }
};

const updateCheckPassword = (value: string) => {
    const isPasswordMatch = newPassword.value === value;
    if(newPassword.value){
        newSubPassword.value = value;
        passwordOptions.value.color = isPasswordMatch ? '#00E268' : '#FF4A4A';
        passwordOptions.value.text = isPasswordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.';
        passwordOptions.value.flag = isPasswordMatch;
    }else{
        window.alert('비밀번호를 입력해주세요')
    }
};

const openFileInput = () => {
    fileInput.value.click(); // Trigger input file click event
};

const uploadImageData = (event: any) => {
    const file = event.target.files[0];
    if(file){
        const reader = new FileReader(); //fileReader 생성
        reader.readAsDataURL(file);
        reader.onload = async () => {   //파일 read 성공시 이벤트 핸들러
            url.value = reader.result; // file read 결과(base64이미지) 확인
            formData.value = new FormData();
            formData.value.append("file", file);
        }
    }
};

const getUserImg = async () => {
    const imgUrl = await getUserImgAPI(id.value || '');
    url.value = imgUrl.data !== 'err' ?`data:image/png;base64,${imgUrl.data}` : require('@/assets/img/common/my-page/add_photo.png');
};

const clickUpdateUserInfo = async () => {
    if(window.confirm('변경하시겠습니까?')){
        if(newPassword.value && !newSubPassword.value) {
            window.alert('데이터를 확인해주세요')
            passwordOptions.value.color = '#FF4A4A';
            passwordOptions.value.text = '비밀번호를 확인해주세요'
        }
        if(passwordOptions.value.flag){
            await patchUserInfoAPI({
                id: id.value,
                password: newPassword.value
            })
        }
        await uploadUserImgAPI({
            id: id.value || '',
            fileData: formData.value
        },)
        window.alert('변경되었습니다.')
        await router.push('/');
    }
}
</script>

<style lang="scss" module>
@import 'MyPage';
</style>