import { firestore } from "../../components/fb/config";

export const SETTING_USER = "SETTING_USER";
export const SET_USER_SUCCESS = "SET_USER_SUCCESS";
export const SET_USER_ERROR = "SET_USER_ERROR";

const settingUser = () => {
  return {
    type: SETTING_USER
  };
};

const setUserSuccess = data => {
  return {
    type: SET_USER_SUCCESS,
    payload: { data }
  };
};

const setUserError = err => {
  return {
    type: SET_USER_ERROR,
    payload: { err }
  };
};

export const setUser = user => {
  return dispatch => {
    dispatch(settingUser());
    firestore
      .collection("users")
      .doc(user.id)
      .set({
        email: user.email,
        firstName: user.givenName,
        lastName: user.familyName,
        initials: user.givenName[0] + user.familyName[0],
        id: user.id,
        name: user.name,
        photoUrl: user.photoUrl
      })
      .then(resp => {
        console.log("SET_USER_SUCCESS", resp);
        dispatch(setUserSuccess(resp));
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        dispatch(setUserError(errorMessage));
        console.log("SET_USER_ERROR", errorMessage);
      });
  };
};

// export function setData(senderId, recieverId) {
//   return dispatch => {
//     dispatch(gettingData());
//     let setDataPromise = new Promise((resolve, reject) => {
//       var doc_id = `${senderId}` + `${recieverId}`;
//       const snapshot = firestore
//         .collection("chatRooms")
//         .doc(doc_id)
//         .collection("messages")
//         .orderBy("createdAt", "desc")
//         .onSnapshot(function(querySnapshot) {
//           let dataRecieved = querySnapshot.docs.map(doc => doc.data());
//           dataRecieved.forEach(doc => {
//             doc.createdAt = doc.createdAt.toDate();
//           });
//           dispatch(getDataSuccess(dataRecieved));
//         });
//       resolve(snapshot);
//       reject("some error occured");
//     });
//     setDataPromise
//       .then(dataRecieved => {
//         console.log("dataRecieved", dataRecieved);
//         // dataRecieved = snapshot.docs.map(doc => doc.data());
//         //   dataRecieved = snapshot.map(doc => doc.data());
//         // dispatch(getDataSuccess(dataRecieved));
//       })
//       .catch(err => {
//         dispatch(getDataError(err));
//         console.log("set data err=>", err);
//       });
//   };
// }
