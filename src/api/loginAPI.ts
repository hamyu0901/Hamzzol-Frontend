import { axios } from '@/main';

interface IPostUserInfoType {
    name: string | null
    id: string | null,
    password: string | null,
    typeId: number | null,
    typeAnswer: string | null
}

const url = {
    getUserInfoURL: 'login',
    getSecurityQATypeURL: 'login/security/type',
    postUserInfoURL: 'login',
}

const getUserInfoAPI = async(): Promise<any> => {
    return await axios.get(url.getUserInfoURL);
};

const getSecurityQATypeInfo = async(): Promise<any> => {
    return await axios.get(url.getSecurityQATypeURL);
};

const postUserInfoAPI = async(body: IPostUserInfoType): Promise<any> => {
    return await axios.post(`${url.postUserInfoURL}`, {...body})
};

export { getUserInfoAPI, getSecurityQATypeInfo, postUserInfoAPI }