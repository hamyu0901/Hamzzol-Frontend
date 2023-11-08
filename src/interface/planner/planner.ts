interface IPlannerListItemType {
    list_id?: number,
    user_id: string,
    date: string,
    title: string,
    contents: string,
    update_time: string,
    check_list: boolean,
    date_range: string[],
    color?: string
}

export { IPlannerListItemType }