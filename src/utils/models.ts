export class UserDTO {
    userEmail?: string;
    bucketList?: any[];
}

export enum ActiveTab {
    LogIn,
    Swiping, 
    BucketList,
    KanbanBoard
}