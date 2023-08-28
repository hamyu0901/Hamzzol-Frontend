import { defineStore } from 'pinia';

interface IUserInfoType {
    id: string;
    name: string
}

interface IStoreType {
    userInfo: IUserInfoType;
}

export const useStore = defineStore('store', {
    state: (): IStoreType => {
        return {
            userInfo: { id: '', name: '' }
        };
    },
    getters: {
        getUserInfo: (state: IStoreType): IUserInfoType => { // 반환 타입 수정
            return state.userInfo;
        },
    },
    actions: {
        setUserInfo(userInfo: IUserInfoType) {
            this.$state.userInfo = userInfo;
        },
    },
    persist: true
});