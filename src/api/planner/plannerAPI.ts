import { axios } from '@/main';

const url = {
    getTodoListURL: 'planner',
    patchTodoListURL: 'planner/id'
}

interface IGetTodoListType {
    userId: string | null,
    date?: string,
    year?: string,
    month?: string
}

interface IPostTodoListType {
    listId: number,
    userId: string | null,
    date: string,
    title: string,
    update_time: any,
    contents: string,
    check_list: boolean
}

const getTodoListAPI = async(params: IGetTodoListType): Promise<any> => {
    return await axios.get(`${url.getTodoListURL}`, {params});
};

const patchTodoListAPI = async(body: IPostTodoListType): Promise<any> => {
    const { listId } = body;
    return await axios.patch(`${url.patchTodoListURL}/${listId}`, { ...body });
};

export { getTodoListAPI, patchTodoListAPI }