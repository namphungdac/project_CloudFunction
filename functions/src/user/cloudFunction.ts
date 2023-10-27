// import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import {FieldValue} from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import {app} from "../config/appExpress"
import UserController from "./controller";
import {createAndEncryptWallet, generateReferralCode} from "../wallet/controller";

app.get("users/city", UserController.getAllUserByCity);
app.post("users/testBatch", UserController.testBatch);
app.get("/users", UserController.getAllUser);
app.post("/users", UserController.createUser);
app.put("/users/:userID", UserController.updateUser);
app.get("/users/:userID", UserController.getUserByUserID);
app.post("/users/:userID/holding", UserController.holding);
app.post("/users/:userID/unHolding", UserController.unHolding);
app.post("/users/:userID/following", UserController.following);
app.post("/users/:userID/unfollow", UserController.unfollow);

const db = admin.firestore();

export const onUserDocCreated = functions
    .firestore.document("users/{uid}")
    .onCreate(async (snap, context) => {
        const {uid} = context.params;
        functions.logger.info(`New user add with id ${uid}`, snap.data());
        // const userData = snap.data();
        const batch = db.batch();
        const userRef = db.collection("users").doc(uid);
        // Generate wallet
        let wallet = await createAndEncryptWallet(snap.data().userName);
        const referralCodes = generateReferralCode(3)
        batch.set(
            userRef,
            {
                address: wallet.address,
                referralCodes: FieldValue.arrayUnion(...referralCodes)
            },
            {
                merge: true
            }
        );
        batch.set(db.collection("users_private").doc(uid), wallet, {merge: true});
        const userStatsData = {
            likes: [],
            tweets: [],
            updatedAt: null,
            holderCount: 0,
            holdingCount: 0,
            displayPrice: 0,
            referralFeeEarned: 0,
            holdingFeeEarned: 0,
            tradingFeeEarned: 0,
            randomSeed: Math.random(),
        };
        batch.set(userRef.collection("stats").doc("stats"), userStatsData, {merge: true});
        functions.logger.info(`Creating user wallet ${uid} successfully ${wallet.address}...`);
        const collectionRef = db.collection("referralCodes");
        for (const code of referralCodes) {
            const docRef = collectionRef.doc(code);
            batch.set(docRef, {
                referralAddress: wallet.address.toLowerCase(),
                refereeAddress: "",
                isUsed: false,
                owner: uid,
            });
        }
        await batch.commit();
    });
