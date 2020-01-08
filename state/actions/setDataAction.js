import { db } from "../../fb/config";

export const GET_DATA_SUCCESS = "GET_DATA_SUCCESS";
export const GET_DATA_ERROR = "GET_DATA_ERROR";
export const GETTING_DATA = "GETTING_DATA";

const getDataSuccess = data => {
  return {
    type: GET_DATA_SUCCESS,
    payload: { data }
  };
};

const getDataError = err => {
  return {
    type: GET_DATA_ERROR,
    payload: { err }
  };
};
const gettingData = () => {
  return {
    type: GETTING_DATA
  };
};

export function setData(senderId, recieverId) {
  return dispatch => {
    dispatch(gettingData());
    let setDataPromise = new Promise((resolve, reject) => {
      var doc_id = `${senderId}` + `${recieverId}`;
      const snapshot = db
        .collection("chatRooms")
        .doc(doc_id)
        .collection("messages")
        .orderBy("createdAt", "desc")
        .onSnapshot(function(querySnapshot) {
          let dataRecieved = querySnapshot.docs.map(doc => doc.data());
          dataRecieved.forEach(doc => {
            doc.createdAt = doc.createdAt.toDate();
          });
          dispatch(getDataSuccess(dataRecieved));
        });
      resolve(snapshot);
      reject("some error occured");
    });
    setDataPromise
      .then(dataRecieved => {
        console.log("dataRecieved", dataRecieved);
        // dataRecieved = snapshot.docs.map(doc => doc.data());
        //   dataRecieved = snapshot.map(doc => doc.data());
        // dispatch(getDataSuccess(dataRecieved));
      })
      .catch(err => {
        dispatch(getDataError(err));
        console.log("set data err=>", err);
      });
  };
}
