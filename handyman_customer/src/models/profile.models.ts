import { Category } from "./category.models";
import { User } from "./user.models";

export class Profile {
    id: number;
    primary_category_id: number;
    user_id: number;
    is_verified: number;
    price: number;
    priceToShow: string;
    document_url: string;
    price_type: string;
    distance: string;
    address: string;
    about: string;
    latitude: string;
    longitude: string;
    primary_category: Category;
    subcategories: Array<Category>;
    ratings: any;
    user: User;
}