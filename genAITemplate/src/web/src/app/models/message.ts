
export enum Role {
    system
}

export interface Message {
    id: string;
    threadId: string;
    role: string;
    message: string;
}