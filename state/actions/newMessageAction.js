import uuid from "uuid";
import { db } from "../../fb/config";

export const NEW_MES_SENT = "NEW_MES_SENT";
export const NEW_MES_ERR = "NEW_MES_ERR";
export const SENDING_NEW_MES = "SENDING_NEW_MES";

const sentMessage = docRef => {
  return {
    type: NEW_MES_SENT,
    payload: { docId: docRef }
  };
};

const sendError = err => {
  return {
    type: NEW_MES_ERR,
    payload: { err }
  };
};
const sendingMessage = () => {
  return {
    type: SENDING_NEW_MES
  };
};

export function sendMessgae(text, userDetails, senderId, recieverId) {
  console.log("check?");
  return dispatch => {
    console.log("sooka blooka");
    dispatch(sendingMessage());
    console.log("baangu baangu");
    var doc_id = `${senderId}` + `${recieverId}`;

    db.collection("chatRooms")
      .doc(doc_id)
      .collection("messages")
      .add({
        text: text,
        createdAt: new Date(),
        user: userDetails,
        senderId: senderId,
        recieverId: recieverId,
        _id: uuid()
      })
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
        dispatch(sentMessage(docRef.id));
      })
      .catch(err => {
        dispatch(sendError(err));
        console.log("send message err=>", err);
      });
  };
}
