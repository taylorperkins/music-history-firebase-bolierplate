"use strict";

let $ = require('jquery'),
    db = require('./db-interaction'),
    templates = require('./dom-builder'),
    user = require('./user.js');
    // login = require("./user");


// Using the REST API
let loadSongsToDOM = (myUser) => {
  console.log("Need to load some songs, Buddy");
  let currentUser = user.getUser();
  debugger;
  db.getSongs(currentUser)
    .then( function(songData){
      if (songData === null) {
        console.log("You need more songs!!");
        templates.makeSongList(songData);
      } else {
        console.log("got data", songData);
        var idArray = Object.keys(songData);
        idArray.forEach( function(key) {
          songData[key].id = key;
        });
        console.log("song object with id: ", songData);
        templates.makeSongList(songData);
      }
    });
};

// loadSongsToDOM(); //<--Move to auth section after adding login btn

// Send newSong data to db then reload DOM with updated song data
$(document).on("click", ".save_new_btn", function() {
  console.log("Clicks .save_new_btn");
  let songObj = buildSongObj();
  db.addSong(songObj)
    .then( function(songId) {
      loadSongsToDOM();
    });
});

// go get the song from database and then populate the form for editing.
$(document).on("click", ".edit-btn", function () {
  console.log("Clicked on the edit song button");
  let songID = $(this).data("edit-id");
  db.getSong(songID)
    .then(
        (song) => {return templates.songForm(song, songID);}
      ).then(
        (finishedForm) => {$('.uiContainer--wrapper').html(finishedForm);}
      );
});

//Save edited song to FB then reload DOM with updated song data
$(document).on("click", ".save_edit_btn", function() {
  let songObj = buildSongObj(),
  songID = $(this).attr("id");
  db.editSong(songObj, songID)
    .then(
        (data) => {return loadSongsToDOM();}
      );
});

// Remove song then reload the DOM w/out new song
$(document).on("click", ".delete-btn", function () {
  console.log("clicked the delete song btn: ", $(this).data("delete-id"));
  let songId = $(this).data("delete-id");
  db.deleteSong(songId)
    .then(() => {loadSongsToDOM();});
});

$('#view-songs').click(() => {
  $('#.uiContainer--wrapper').html("");
  loadSongsToDOM();
});


$('#auth-btn').click( function(event) {
  console.log("click auth");
  user.logInGoogle()
    .then( (result) => {
      console.log("result from login", result.user.uid);
      user.setUser(result.user.uid);
      $('#auth-btn').addClass('is-hidden');
      $('#logout').removeClass('is-hidden');
      loadSongsToDOM();
    });
});

$('#logout').click( function() {
  user.logOut()
    .then( (result) => {
      console.log("result from login", result.user.uid);
      $('#logOut').addClass('is-hidden');
      $('#auth-btn').removeClass('is-hidden');
      $('#uiContainer--wrapper').html('');
      loadSongsToDOM();
    });
});


// Helper functions for forms stuff. Nothing related to Firebase
// Build a song obj from form data.
let buildSongObj = () => {
    let songObj = {
    title: $("#form--title").val(),
    artist: $("#form--artist").val(),
    album: $("#form--album").val(),
    year: $("#form--year").val(),
    uid: user.getUser()
  };
  return songObj;
};

// Load the new song form
$("#add-song").click(function() {
  console.log("clicked add song");
  var songForm = templates.songForm()
  .then(function(songForm) {
    $(".uiContainer--wrapper").html(songForm);
  });
});
