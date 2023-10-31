import { axios } from '@/main';

interface IPostUserInfoType {
    name?: string | null
    id: string | null,
    password: string | null,
    typeId?: number | null,
    typeAnswer?: string | null,
}

const url = {
    getUserInfoURL: 'login/id',
    getSecurityQATypeURL: 'login/security/type',
    postUserInfoURL: 'login',
    getCompareUserInfoURL: 'login/compare',
    uploadUserInfoUrl: 'login/file/id',
    getUserInfoUrl: 'login/file/id',
    patchUserInfoURL: 'login/id'
}

const getUserInfoAPI = async(id: string): Promise<any> => {
    return await axios.get(url.getUserInfoURL + `/${id}`);
};

const getCompareUserAPI = async (params: {id: string, password: string}): Promise<any> => {
    return await axios.get(`${url.getCompareUserInfoURL}`, {params})
};

const getSecurityQATypeInfo = async(): Promise<any> => {
    return await axios.get(url.getSecurityQATypeURL);
};

const postUserInfoAPI = async(body: IPostUserInfoType): Promise<any> => {
    return await axios.post(`${url.postUserInfoURL}`, {...body})
};

const patchUserInfoAPI = async(body: IPostUserInfoType): Promise<any> => {
    return await axios.patch(`${url.patchUserInfoURL}/${body.id}`, {...body})
};

const uploadUserImgAPI = async (body: {id: string, fileData: any}): Promise<any> => {
    return await axios.post(`${url.uploadUserInfoUrl}/${body.id}`, body.fileData, {
        headers: {
            'Content-Type': 'multipart/form-data' // Set the correct content type
        }
    });
};

const getUserImgAPI = async (id: string): Promise<any> => {
    return await axios.get(`${url.getUserInfoUrl}/${id}`);
};

export { getUserInfoAPI, getSecurityQATypeInfo, postUserInfoAPI, getCompareUserAPI, uploadUserImgAPI, getUserImgAPI, patchUserInfoAPI }