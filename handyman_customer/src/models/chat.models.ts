import { Helper } from './helper.models';

export class Chat {
    chatId: string;
    myId: string;
    dateTimeStamp: string;
    timeDiff: string;
    lastMessage: string;
    chatName: string;
    chatImage: string;
    chatStatus: string;
    isGroup: boolean;
    isRead: boolean;

    fromRow(arg0: any) {
        this.chatId = arg0.chatId;
        this.myId = arg0.myId;
        this.dateTimeStamp = arg0.dateTimeStamp;
        this.timeDiff = Helper.getTimeDiff(new Date(Number(this.dateTimeStamp)));
        this.lastMessage = arg0.lastMessage;
        this.chatName = arg0.chatName;
        this.chatImage = arg0.chatImage;
        this.chatStatus = arg0.chatStatus;
        this.isGroup = arg0.isGroup == 1;
        this.isRead = arg0.isRead == 1;
    }
}