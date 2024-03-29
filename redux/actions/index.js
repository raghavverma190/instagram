import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USERS_LIKES_STATE_CHANGE,
  CLEAR_DATA,
} from '../constants/index';
import firebase from 'firebase';
import { SnapshotViewIOSComponent } from 'react-native';
require('firebase/firestore');

export function clearData() {
  //deleting everything from redux store
  return (dispatch) => {
    dispatch({ type: CLEAR_DATA });
  };
}
export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log('does not exist');
        }
      });
  };
}

export function fetchUserPosts() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
      });
  };
}

export function fetchUserFollowing() {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        // console.log(getState());
        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUsersData(following[i], true));
        }
      });
  };
}

export function fetchUsersData(uid, getPosts) {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid);
    if (!found) {
      firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            user.uid = snapshot.id;

            dispatch({ type: USERS_DATA_STATE_CHANGE, user });
            // console.log(getState());
          } else {
            console.log('does not exist');
          }
        });
      if (getPosts) {
        dispatch(fetchUsersFollowingPosts(uid));
      }
    }
  };
}

export function fetchUsersFollowingPosts(uid) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        const uid = snapshot.query.EP.path.segments[1];
        // console.log(uid);
        const user = getState().usersState.users.find((el) => el.uid === uid);

        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });
        for (let i = 0; i < posts.length; i++) {
          dispatch(fetchUsersFollowingLikes(uid, posts[i].id));
        } //fetching likes on each post
        dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
      });
  };
}

export function fetchUsersFollowingLikes(uid, postId) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        const postId = snapshot.ZE.path.segments[3]; //to retrieve post id

        let currentUserLike = false;
        if (snapshot.exists) {
          currentUserLike = true;
        } //if snapshot exists, it means user has already liked post

        dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike });
      });
  };
}
