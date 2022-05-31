interface CategoryNavType {
    readonly _id: string;
    readonly name: string;
    readonly path: string;
    readonly level: "Up" | "Mid" | "Low";
}

export interface LowCategoryNavType extends CategoryNavType {}

export interface MidCategoryNavType extends CategoryNavType {
    readonly subcategories?: LowCategoryNavType[];
}

export interface UpCategoryNavType extends CategoryNavType {
    readonly previewUrl?: string;
    readonly subcategories?: MidCategoryNavType[];
}

export interface AdvantageType {
    readonly id: string;
    readonly iconName: string;
    readonly title: string;
    readonly text: string;
}

export interface FaqType {
    readonly id: string;
    readonly title: string;
    readonly content: string[];
    readonly countable?: boolean;
}

export enum StatusType {
    processing = "processing",
    payment = "payment",
    rejected = "rejected",
    completed = "completed",
}

export enum ApplicationStatusType {
    waiting = "waiting",
    paid = "paid",
}

export interface NotificationType {
    readonly id: string;
    readonly title: string;
    readonly date: Date;
    isNew: boolean;
    readonly status: StatusType;
}

export interface FreqReqType {
    readonly _id: string;
    readonly title: string;
    readonly count: number;
    readonly previewUrl: string;
    readonly [key: string]: any;
}

export interface ContactType {
    readonly address: string;
    readonly email: string;
    readonly mobilePhoneNumber: string;
    readonly phoneNumber: string;
}

export interface SocialType {
    readonly id: string;
    readonly name: string;
    readonly link: string;
}

export interface PartnerType {
    readonly id: string;
    readonly name: string;
    readonly imageUrl: string;
}

export interface BreadcrumbNodeType {
    readonly name: string;
    readonly path: string;
}

export interface OptionType {
    readonly title: string;
    readonly value: string;
}

export interface CreditCardType {
    readonly _id: string;
    readonly number: string;
    readonly name: string;
    readonly expireDate: {
        readonly month: string;
        readonly year: string;
    };
    readonly cvv: string;
}

type TabProp = "profile" | "books" | "favorites";
type ExtendedTabProp = TabProp | "ads" | "requests";

export interface TabType {
    readonly title: string;
    readonly value: TabProp | ExtendedTabProp;
}

export enum BookInfoTitles {
    date = "Дата брони",
    time = "Время",
    size = "Размер",
    bookNumber = "Номер заявки",
    status = "Статус",
}

export type BookInfoType = {
    readonly title: string;
    readonly value: string | { from: string; till: string };
};

export type ModalType = "detailModal" | "reviewModal" | "paymentModal" | "cancelModal";

export type ApplicationModalType = "detailModal" | "approveModal" | "cancelModal";

export type PostFieldType = {
    readonly name: "area" | "capacity" | "address" | "food" | "size" | "sex";
    readonly info: string;
};

type UserCommentType = {
    readonly _id: string;
    readonly name: string;
    readonly surname?: string | null;
    readonly fathername?: string | null;
    readonly image: string | null;
};

export interface CommentType {
    readonly id: string;
    readonly user: UserCommentType;
    readonly postDate: string;
    readonly rating: number;
    readonly text: string;
}

export interface AuthorType {
    readonly companyName: string;
    readonly image: string | null;
    readonly phoneNumber: string;
    readonly telegram: string | null;
    readonly whatsapp: string | null;
}

export interface ReviewRatingType {
    readonly 5: number;
    readonly 4: number;
    readonly 3: number;
    readonly 2: number;
    readonly 1: number;
    readonly avg: number;
    readonly total: number;
}

export interface PostType {
    readonly _id: string;
    readonly author: AuthorType;
    readonly title: string;
    readonly postDate: string;
    readonly rating: ReviewRatingType;
    readonly category: string[];
    readonly images: string[];
    readonly price: number;
    readonly fields: PostFieldType[];
    readonly mapPoint: [number, number];
    readonly description: string;
    readonly reviews: CommentType[];
    readonly raters: any[];
}

export interface AdCardType {
    readonly _id: string;
    readonly title: string;
    readonly previewImage: string;
    readonly price: number;
    readonly fields: PostFieldType[];
    readonly description: string;
    readonly rating: ReviewRatingType;
    readonly postDate: string;
}

export type RoleType = "Admin" | "Author" | "User";

export interface RoleResponseType {
    readonly _id: string;
    readonly name: RoleType;
    readonly permisions: string[];
    readonly description: string;
    readonly [key: string]: any;
}

export interface UserType {
    readonly _id: string;
    readonly name: string;
    readonly surname?: string;
    readonly fathername?: string;
    readonly companyName?: string;
    readonly email: string;
    readonly phoneNumber: string;
    readonly telegram?: string;
    readonly whatsapp?: string;
    readonly birthDate?: string;
    readonly password: string;
    readonly favorites: string[];
    readonly iinNumber?: string;
    readonly roles: RoleResponseType[];
    readonly image: string;
    readonly creditCards: CreditCardType[];
    readonly [key: string]: any;
}

export interface BookType {
    readonly _id: string;
    readonly bookInfos: BookInfoType[];
    readonly bookNumber: string;
    readonly status: StatusType | string;
    readonly postId: string;
    readonly title: string;
    readonly price: number;
    readonly postImages: string[];
    readonly description: string;
}

export interface ApplicationType {
    readonly _id: string;
    readonly bookInfos: BookInfoType[];
    readonly bookNumber: string;
    readonly status: ApplicationStatusType | string;
    readonly postId: string;
    readonly title: string;
    readonly price: number;
    readonly postImages: string[];
    readonly description: string;
}
