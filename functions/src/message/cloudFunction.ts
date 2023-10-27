import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {FieldValue} from "firebase-admin/firestore";

const db = admin.firestore();
const messagesRef = db.collection("messages");

export const holding_onHoldingChanged = functions
    .firestore.document("users/{userID}/holding/{holdingID}")
    .onWrite(async (change, context) => {
        const {userID, holdingID} = context.params;
        const isAdd = !change.before.exists;
        const isDelete = !change.after.exists;

        if (isAdd) {
            functions.logger.info(`New holding added to user ${userID} with id ${holdingID}`);
            await messagesRef.doc(holdingID).set(
                {
                    groupID: holdingID,
                    lastUpdated: FieldValue.serverTimestamp(),
                    members: FieldValue.arrayUnion(userID),
                    priority: 0,
                    type: "group"
                },
                {
                    merge: true
                }
            );
            await db.doc(`users/${userID}/stats/message`).set({
                [`unseen_${holdingID}`]: 0
            }, {merge: true});
        }
        if (isDelete) {
            functions.logger.info(`Holding deleted from user ${userID} with id ${holdingID}`);
            await messagesRef.doc(holdingID).set(
                {
                    groupID: holdingID,
                    members: FieldValue.arrayRemove(userID),
                    priority: 0,
                    type: "group",
                    author: "Someone"
                },
                {
                    merge: true
                }
            );
            await db.doc(`users/${userID}/stats/message`).update({
                [`unseen_${holdingID}`]:FieldValue.delete()
            });
        }
    });

// export const messages_onMessageAdded = functions
//     .database.ref("/groups/{groupID}/messages/{msgID}")
//     .onCreate(async (snapshot, context) => {
//         const groupID = context.params.groupID;
//         const msgID = context.params.msgID;
//         const messageData = snapshot.val();
//         functions.logger.info(
//             `New message added to group ${groupID} with id ${msgID}`
//             , messageData
//         )
//         await messagesRef.doc(groupID).set({
//             author: messageData.name,
//             groupID: groupID,
//             lastMessage: messageData.message,
//             member:
//         })
//     })
