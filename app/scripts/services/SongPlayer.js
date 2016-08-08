(function() {
     function SongPlayer(Fixtures) {
          var SongPlayer = {};

          /**
          * @desc Current album information
          * @type {Object} album
          **/ 
          var currentAlbum = Fixtures.getAlbum();

          /**
          * @desc Buzz audio file object
          * @type {Object}
          **/
          var currentBuzzObject = null;

          /**
          * @function setSong
          * @desc Stops currently playing song and loads new audio file as currentBuzzObject
          * @param {Object} song
          **/

          var setSong = function(song) {
              if (currentBuzzObject) {
                  currentBuzzObject.stop();
                  SongPlayer.currentSong.playing = null;
              }

              currentBuzzObject = new buzz.sound(song.audioUrl, {
                  formats: ['mp3'],
                  preload: true
              });

              SongPlayer.currentSong = song;
          };

          /**
          * @function playSong
          * @desc  Plays audio file as currentBuzzObject and sets the .playing property of the object to true
          * @param {Object} song
          **/
          // private function
          var playSong = function(song) {
          // plays current Buzz object!
              currentBuzzObject.play();

          // sets .playing property to true
              song.playing = true;  
          };

          /**
          * @desc Return index of song
          * @type Number
          **/
          var getSongIndex = function(song) {
              return currentAlbum.songs.indexOf(song);
          };

          /**
          * @desc Active song object from list of songs
          * @type {Object}
          **/
          SongPlayer.currentSong = null;

          /**
          * @function play
          * @desc Play current or new song
          * @param {Object} song
          **/
          SongPlayer.play = function(song) {
              song = song || SongPlayer.currentSong;
              if (SongPlayer.currentSong !== song) {
                 setSong(song);
          // replace two instances of song.playing w/ playSong
          // #1
                 playSong(song);

              } else if (SongPlayer.currentSong === song) {
                 if (currentBuzzObject.isPaused()) {
                     playSong(song);
                 }
              }
          };

          /**
          * @function pause
          * @desc Pause current song
          * @param {Object} song
          **/
          SongPlayer.pause = function(song) {
              song = song || SongPlayer.currentSong;
              currentBuzzObject.pause();
              song.playing = false;
          };

          /**
          * @function previous
          * @desc Skips to song prior to current song
          * @param {Object} song
          **/
          SongPlayer.previous = function() {
              var currentSongIndex = getSongIndex(SongPlayer.currentSong);
              currentSongIndex--;
          // if user is on the first song
              if (currentSongIndex < 0) {
                  currentBuzzObject.stop();
                  SongPlayer.currentSong.playing = null;
          // if user is not on first song        
              } else {
                  var song = currentAlbum.songs[currentSongIndex]
                  setSong(song);
                  playSong(song);
              }   
          };

          return SongPlayer;
          }


     angular
         .module('blocJams')
         .factory('SongPlayer', SongPlayer);
 })();