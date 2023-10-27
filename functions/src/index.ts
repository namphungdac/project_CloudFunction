import * as admin from "firebase-admin";
import {serviceAccount} from "./config/serviceAccount";
import * as functions from "firebase-functions";
import {app} from "./config/appExpress";

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL: "https://firestore-fbfunction-default-rtdb.asia-southeast1.firebasedatabase.app"
    });
} catch (e) {
    console.error(e)
}
export const api = functions.https.onRequest(app);
export * from "./user/cloudFunction";
export * from "./messageRealTimeDB/cloudFunction";
export * from "./message/cloudFunction";
