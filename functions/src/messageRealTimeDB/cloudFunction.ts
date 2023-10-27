import * as admin from "firebase-admin";
// import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import {app} from "../config/appExpress";
import MessageController from "./controller";
const rtdb = admin.database();

app.post("/users/:userID/group/:groupID/messagesRT", MessageController.creatMessageRT);
app.put("/users/:userID/group/:groupID/messagesRT", MessageController.deleteMessageRT);

export const createGroupRTOnUserCreate = functions
    .firestore.document("users/{user_id}")
    .onCreate(async (snap, context) => {
        const uid = context.params.user_id;
        const mesRomRef = rtdb.ref(`groups/${uid}`);
        await mesRomRef.set({
            members: {[uid]: true},
            name: snap.data().userName,
            owner_id: uid
        });
    });




