import { User } from "./user.models";
import { Profile } from "./profile.models";
import { Address } from "./address.models";
import { Category } from "./category.models";
import { StatusLog } from "./status-log.models";

export class Appointment {
    id: number;
    provider_id: number;
    user_id: number;
    address_id: number;
    status: string;
    statusToShow: string;
    date: string;
    time_from: string;
    time_to: string;
    date_formatted: string;
    time_from_formatted: string;
    time_to_formatted: string;
    created_at: string;
    updated_at: string;
    user: User;
    provider: Profile;
    address: Address;
    category: Category;
    logs: Array<StatusLog>;
}