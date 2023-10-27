import {Timestamp} from "firebase-admin/firestore";
export type User = {
    id: string ;
    address: string;
    userName: string;
    following: string[];
    followers: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp | null;
    totalTweets: number;
    displayPrice: number;
    holderCount: number;
    holdingCount: number;
    referralCodes: string[];
};
