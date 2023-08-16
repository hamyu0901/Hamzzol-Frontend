// import { defineStore } from 'pinia';
//
// interface IUserInfoType {
//     id: string;
//     password: string;
// }
//
// export const useStore = defineStore('store', {
//     state: (): IUserInfoType => {
//         return {
//             userInfo: {
//                 id: '',
//                 password: ''
//             }
//         };
//     },
//     getters: {
//         getUserInfo: (state): IUserInfoType => {
//             return state.userInfo;
//         },
//     },
//     actions: {
//         setUser(user: IUserInfoType) {
//             this.$state.userInfo = user;
//         }
//     },
//     persist: true
// });