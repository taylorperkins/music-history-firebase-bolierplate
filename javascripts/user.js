"use strict";
let firebase = require("./firebaseConfig"),
	provider = new firebase.auth.GoogleAuthProvider(),
	currentUser = null;

firebase.auth().onAuthStateChanged( (user) => {
	if (user) {
		console.log("Current user logged in: ", currentUser);
		currentUser = user.uid;
	} else {
		currentUser = null;
		console.log("User is not logged in");
	}
});


function logInGoogle() {
	return firebase.auth().signInWithPopup(provider);
}
function logOut() {
	return firebase.auth().signOut();
}
function getUser() {
	return currentUser;
}
function setUser(val) {
	currentUser = val;
}

module.exports = {logInGoogle, logOut, getUser, setUser};
