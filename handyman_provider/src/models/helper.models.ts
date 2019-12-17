import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { Setting } from './setting.models';
import { Constants } from './constants.models';
import { StatusLog } from './status-log.models';

export class Helper {
    static getChatChild(userId: string, myId: string) {
        //example: userId="9" and myId="5" -->> chat child = "5-9"
        let values = [userId, myId];
        values.sort((one, two) => (one > two ? -1 : 1));
        return values[0] + "-" + values[1];
    }

    static getTimeDiff(date: Date) {
        TimeAgo.addLocale(en);
        return new TimeAgo('en-US').format(date);
    }

    static getSetting(settingKey: string) {
        let settings: Array<Setting> = JSON.parse(window.localStorage.getItem(Constants.KEY_SETTING));
        let toReturn: string;
        if (settings) {
            for (let s of settings) {
                if (s.key == settingKey) {
                    toReturn = s.value;
                    break;
                }
            }
        }
        if (!toReturn) toReturn = "";
        return toReturn;
    }

    static getLogTimeForStatus(status: string, logs: Array<StatusLog>) {
        let toReturn = "";
        if (status && logs) {
            for (let log of logs) {
                if (log.status == status) {
                    toReturn = log.created_at;
                    break;
                }
            }
        }
        return toReturn;
    }
}