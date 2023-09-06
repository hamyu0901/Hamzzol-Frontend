<template>
    <v-layout :class="$style['register-view']">
        <v-layout :class="$style['register-view__container']">
            <base-card title="Register" :width="550" :height="650" class="ma-3">
                <base-text-field
                     class="pt-2 pb-2"
                     :value="name"
                     icon="mdi-card-account-details-outline"
                     label="Name"
                     place-holder="이름을 입력해주세요"
                     @updateValue="updateNameHandler($event)"
                     :error="typeItemOptions[0].errorFlag">
                </base-text-field>
                <span v-if="typeItemOptions[0].errorFlag" style="color: #FF4A4A">{{ typeItemOptions[0].errorTitle }}</span>
                <v-layout style="align-items: center;" class="pt-2 pb-2">
                    <base-text-field style="width: 400px !important;" :value="id" icon="mdi-account" label="Id" place-holder="ID를 입력해주세요" @updateValue="updateIdHandler($event)" :error="typeItemOptions[1].errorFlag"></base-text-field>
                    <v-btn class="ml-3" :class="$style['register-view__container-btn']" @click="clickIdBtn" variant="outlined" color="#684AFF">중복 확인</v-btn>
                </v-layout>
                <span v-if="typeItemOptions[1].errorFlag" style="color: #FF4A4A">{{ typeItemOptions[1].errorTitle }}</span>
                <span v-if="typeItemOptions[1].checkFlag" style="color: #00E268">{{ typeItemOptions[1].checkTitle }}</span>
                <base-text-field class="pt-2 pb-2" :value="password" icon="mdi-lock" label="Password" place-holder="Password 를 입력해주세요" type="password" :error="typeItemOptions[2].errorFlag" @updateValue="password=$event"></base-text-field>
                <span v-if="typeItemOptions[2].errorFlag" style="color: #FF4A4A">{{ typeItemOptions[2].errorTitle }}</span>
                <base-text-field class="pt-2 pb-2" :value="subPassword" icon="mdi-lock-check" label="Password 확인" place-holder="Password 확인" type="password" :error="typeItemOptions[3].errorFlag" @updateValue="updateSubPasswordHandler($event)"></base-text-field>
                <span v-if="!typeItemOptions[3].checkFlag" style="color: #FF4A4A">{{ typeItemOptions[3].errorTitle }}</span>
                <span v-if="typeItemOptions[3].checkFlag" style="color: #00E268">{{ typeItemOptions[3].checkTitle }}</span>
                <v-select
                    v-model="selectedSecurityType"
                    :class="$style['register-view__container-select-box']"
                    class="pt-2 pb-2"
                    prepend-inner-icon="mdi-comment-question"
                    label="비밀번호 찾기 질문"
                    :items="securityTypeItems"
                    item-title="type_contents"
                    item-value="type_id"
                    variant="outlined"
                    return-object
                    @update:modelValue="selectSecurityType($event)"
                    :error="typeItemOptions[4].errorFlag"
                ></v-select>
                <span v-if="typeItemOptions[4].errorFlag" style="color: #FF4A4A">{{ typeItemOptions[4].errorTitle }}</span>
                <base-text-field class="pt-2 pb-2" :value="securityAnswer" icon="mdi-comment" label="질문 답변" place-holder="질문 답변" type="password" :error="typeItemOptions[5].errorFlag" @updateValue="updateAnswerHandler($event)"></base-text-field>
                <span v-if="typeItemOptions[5].errorFlag" style="color: #FF4A4A">{{ typeItemOptions[5].errorTitle }}</span>
                <v-layout style="justify-content: right; padding-top: 60px" >
                    <v-btn :class="$style['register-view__container-btn']" style="color: #FFFFFF; background-color: #684AFF" variant="text" @click="clickRegisterBtn">Register</v-btn>
                    <v-btn :class="$style['register-view__container-btn']" style="color: #684AFF; background-color: #FFFFFF" variant="text" @click="clickLoginBtn">Login</v-btn>
                </v-layout>
            </base-card>
        </v-layout>
    </v-layout>

</template>
<script lang="ts" setup>
import router from "@/router";
import  { useStore } from "@/store";
import { isEmpty } from "lodash";
import { getSecurityQATypeInfo, getUserInfoAPI, postUserInfoAPI} from "@/api/loginAPI";
import { onMounted, ref } from "vue";
import BaseTextField from "@/components/common/basetextfield/BaseTextField.vue";
import BaseCard from "@/components/common/basecard/BaseCard.vue";

interface IGetSecurityTypeItem {
    type_id: number,
    type_contents: string
}
interface ITypeItemOptions {
    typeId: number,
    errorTitle: string,
    checkTitle: string,
    errorFlag: boolean,
    checkFlag: boolean
}

const store = useStore();
const name = ref<null | string>(null);
const id = ref<null | string>(null);
const password = ref<null | string>(null);
const subPassword = ref<null | string>(null);
const securityAnswer = ref<null | string>(null);
const securityTypeItems = ref<IGetSecurityTypeItem[]>([]);
const selectedSecurityType = ref<IGetSecurityTypeItem | null>(null);
const typeItemOptions = ref<ITypeItemOptions[]>([
    { typeId: 0, errorTitle: '', checkTitle: '', errorFlag: false, checkFlag: false },
    { typeId: 1, errorTitle: '', checkTitle: '', errorFlag: false, checkFlag: false },
    { typeId: 2, errorTitle: '', checkTitle: '', errorFlag: false, checkFlag: false },
    { typeId: 3, errorTitle: '', checkTitle: '', errorFlag: false, checkFlag: false },
    { typeId: 4, errorTitle: '', checkTitle: '', errorFlag: false, checkFlag: false },
    { typeId: 5, errorTitle: '', checkTitle: '', errorFlag: false, checkFlag: false }
]);

onMounted (async () => {
    const securityTypeResult = await getSecurityQATypeInfo();
    securityTypeItems.value = securityTypeResult && !isEmpty(securityTypeResult.data) ? securityTypeResult.data : [];
});

const setError = (item: ITypeItemOptions, errorFlag: boolean, errorMsg: string, checkFlag: boolean, checkMsg: string) => {
    item.errorFlag = errorFlag;
    item.errorTitle = errorMsg;
    item.checkFlag = checkFlag;
    item.checkTitle = checkMsg;
};

const updateNameHandler = (value: string) => {
    name.value = value;
    typeItemOptions.value[0].checkFlag = true;
};

const updateIdHandler = (value: string) => {
    id.value = value;
    typeItemOptions.value[1].checkFlag = false;
};

const clickIdBtn = async () => {
    const userInfo = await getUserInfoAPI(id.value || '');

    if(userInfo && !isEmpty(userInfo.data)){
        const findUserId = userInfo.data.find((userInfo: any) => userInfo.user_id === id.value);
        if(findUserId){ // 기존 db에 같은 id가 있는 경우
            setError(typeItemOptions.value[1], true, '이미 사용하고 있는 아이디 입니다.', false, '')
        }
        else if (!id.value){ // 입력한 id가 없는 경우
            setError(typeItemOptions.value[1], true, '아이디를 입력해주세요.', false , '')
        }
        else {
            setError(typeItemOptions.value[1], false, '', true, '사용 가능한 아이디입니다.')
        }
    }else {
        setError(typeItemOptions.value[1], false, '', true, '사용 가능한 아이디입니다.')
    }
};

const updateSubPasswordHandler = (value: string) => {
    subPassword.value = value;

    if(password.value){
        setError(typeItemOptions.value[2], false, '', true, typeItemOptions.value[2].checkTitle);
        if(password.value !== value) {
            setError(typeItemOptions.value[3], true, '비밀번호가 일치하지 않습니다.', false, typeItemOptions.value[3].checkTitle);
        }else {
            setError(typeItemOptions.value[3], false, '', true, '비밀번호가 일치합니다.');
        }
    }else{
        setError(typeItemOptions.value[3], true, '비밀번호를 입력해주세요.', false, typeItemOptions.value[3].checkTitle);
    }
};

const selectSecurityType = (item: IGetSecurityTypeItem) => {
    selectedSecurityType.value = item;
    typeItemOptions.value[4].checkFlag = true;
};

const updateAnswerHandler = (value: string) => {
    securityAnswer.value = value;
    typeItemOptions.value[5].checkFlag = true;
};

const checkName = () => {
    if(!name.value){
        setError(typeItemOptions.value[0], true, '이름을 입력해주세요.', typeItemOptions.value[0].checkFlag, typeItemOptions.value[0].checkTitle);
    }else{
        setError(typeItemOptions.value[0], false, typeItemOptions.value[0].errorTitle, true, typeItemOptions.value[0].checkTitle);
    }
};

const checkId = () => {
    if(!typeItemOptions.value[1].checkFlag || !id.value){
        setError(typeItemOptions.value[1], true, '아이디 중복 확인을 해주세요', typeItemOptions.value[1].checkFlag, typeItemOptions.value[1].checkTitle)
    }else{
        setError(typeItemOptions.value[1], false, typeItemOptions.value[1].errorTitle, typeItemOptions.value[1].checkFlag, '')
    }
};

const checkPassword = () => {
    setError(typeItemOptions.value[2], password.value ? false : true, password.value ? '' : '비밀번호를 확인해주세요', password.value ? true : false, typeItemOptions.value[2].checkTitle);
    setError(typeItemOptions.value[3], subPassword.value ? false : true, subPassword.value ? '' : '비밀번호를 확인해주세요', typeItemOptions.value[3].checkFlag, typeItemOptions.value[3].checkTitle);

    if(!typeItemOptions.value[2].errorFlag && !typeItemOptions.value[3].errorFlag){
        if(!typeItemOptions.value[3].checkFlag) {
            setError(typeItemOptions.value[3], true, '비밀번호가 일치하지 않습니다.', false, '' )
        }else{
            setError(typeItemOptions.value[3], false, '', true, '' );
        }
    }
};

const checkSelectedSecurityType = () => {
    if(selectedSecurityType.value) {
        setError(typeItemOptions.value[4], false, '', true, '');
    }else {
        setError(typeItemOptions.value[4], true, '질문을 선택해주세요.', false, '');
    }
};

const checkSecurityAnswer = () => {
    if(securityAnswer.value) {
        setError(typeItemOptions.value[5], false, '', true, '');
    }else {
        setError(typeItemOptions.value[5], true, '답변을 입력해주세요', false, '');
    }
};

const clickRegisterBtn = async () => {
    if(typeItemOptions.value.every(type => type.checkFlag)){
        await postUserInfoAPI({
            name: name.value,
            id: id.value,
            password: password.value,
            typeId: selectedSecurityType.value ? selectedSecurityType.value.type_id : null,
            typeAnswer: securityAnswer.value
        });
        window.alert('가입되었습니다.');
        window.confirm('바로 로그인하시겠습니까?') && await router.push({ path: `/user-container/login` });
    }else{
        window.alert('입력한 정보를 확인해주세요');
        checkName();
        checkId();
        checkPassword();
        checkSelectedSecurityType();
        checkSecurityAnswer();
    }
};

const clickLoginBtn = () => {
    const username = store.getUserInfo.name;
    if(username){
        if(window.confirm('현재 상태를 로그아웃 하시겠습니까??')){
            store.setUserInfo({
                id: '',
                name: '',
            });
            router.push({ path: `/user-container/login` });
        }
    }else {
        router.push({ path: `/user-container/login` });
    }
};
</script>
<style lang="scss" module>
@import 'RegisterView';
</style>