import {Request, Response} from "express";
import * as admin from "firebase-admin";

const rtdb = admin.database();
const db = admin.firestore();

class MessageController {
    static async creatMessageRT(req: Request, res: Response) {
        try {
            const groupID = req.params.groupID;
            const {message} = req.body;
            const messagesRef = rtdb.ref(`groups/${groupID}/messages`);
            const uid = req.params.userID;
            const userRef = db.collection("users").doc(uid);
            const user = await userRef.get();
            const userData = user.data();
            await messagesRef.push({
                create_at: new Date().getTime(),
                message: message,
                name: userData?.userName,
                user_id: uid
            });
            res.status(200).json({
                message: "Create messageRT success!",
            });
        } catch (e) {
            res.status(500).json({
                message: e
            });
        }
    }

    static async deleteMessageRT(req: Request, res: Response) {
        try {
            const groupID = req.params.groupID;
            const uid = req.params.userID;
            const {messageID} = req.body;
            let message_userid = '';
            const messagesRef = rtdb.ref(`groups/${groupID}/messages/${messageID}`);
            await messagesRef.once('value', data => {
                const messageData = data.val();
                message_userid = messageData.user_id;
            });
            if (uid === groupID || uid === message_userid) {
                await messagesRef.remove();
                res.status(200).json({
                    message: "Delete messageRealTimeDB success!",
                });
            } else {
                res.status(200).json({
                    message: "fail!",
                    reason: "no permit"
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e
            });
        }
    }

}

export default MessageController;