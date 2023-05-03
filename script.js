/*HTML Audio/Video DOM Reference:
https://www.w3schools.com/tags/ref_av_dom.asp
*/

//Elements needed to populate the text and img
const image = document.querySelector('img');
const songTitle = document.getElementById("title");
const artist = document.getElementById("artist");

//Elements for the progress line and time
const progressWhiteLine = document.getElementById('progress-container');
const progressDarkLine = document.getElementById('progress');
const currentTimeBar = document.getElementById('current-time');
const songDuration = document.getElementById('duration');

//Elements needed for playing the songs
const song = document.querySelector('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
let songNo = document.getElementById('songNo');

// Check if Playing
let isPlaying = false;

// Play 
function playSong() {
isPlaying = true;
playBtn.classList.replace('fa-play', 'fa-pause');
playBtn.setAttribute('title', 'Pause'); // set the attribute pause on hover
song.play();
}
// Pause
function pauseSong() {
isPlaying = false;
playBtn.classList.replace('fa-pause', 'fa-play');
playBtn.setAttribute('title', 'Play'); // set the attribute play on hover
song.pause();
}

// Play or Pause Event Listener
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()))

// update DOM
function loadSong(music) {
	songTitle.textContent = music.songName;
	artist.textContent = music.artist;
	image.src = "./Img/" + music.img;
	song.src = "./Music/" + music.mp3;
	songDuration.textContent = music.duration;
}

// Current Song
let songIndex = 0;

//On Load Select First Song
loadSong(myMusic[songIndex]);

//Next Song
function nextSong() {
	songIndex++
	songIndex < myMusic.length ? loadSong(myMusic[songIndex]) : songIndex = (myMusic.length - 1);
	songNo.textContent = songIndex + 1;
	playSong();
}
//Previous Song
function prevSong() {
	songIndex--
	songIndex >= 0 && songIndex <= myMusic.length ? loadSong(myMusic[songIndex]) : songIndex = 0;	
	songNo.textContent = songIndex + 1;
	playSong();
}

// Update Progress Bar and Time

function updateProgressBar(e){ // e is from event
	if (isPlaying) {
		const { duration, currentTime } = e.srcElement; // destructuring the Event object - check console.log(e);
		// Update progress bar width
		const progressPercent = (currentTime / duration) * 100; // check console.log(progressPercent)
		progressDarkLine.style.width = `${progressPercent}%`
		// Calculate display for duration
		let durationMinutes = Math.floor(duration / 60); // console.log(durationMinutes); we'll get the number of minutes, but also a bunch of decimals that should be floored with Math.floor
		//for the decimals we'll use the Remainder(%) operator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
		if (durationMinutes < 10) {
			durationMinutes = `0${durationMinutes}`
		};
			
		let durationSeconds = Math.floor(duration % 60);
		if (durationSeconds < 10) {
			durationSeconds = `0${durationSeconds}`; // because we need two decimals after the minutes. If we have a duration of 02:03 the Math.floor(duration % 60) will return 3 and we need two decimals
		
		songDuration.textContent = `${durationMinutes}:${durationSeconds}`;
		}	
		// Calculate display for current time
		let currentMinutes = Math.floor(currentTime / 60);
		if (currentMinutes < 10) {
			currentMinutes = `0${currentMinutes}`
		} else currentMinutes = currentMinutes;
			let currentSeconds = Math.floor(currentTime % 60);
		if (currentSeconds < 10) {
			currentSeconds = `0${currentSeconds}` // because we need two decimals after the minutes. If we have a duration of 02:03 the Math.floor(duration % 60) will return 3 and we need two decimals
		}else currentSeconds = currentSeconds
		currentTimeBar.textContent = `${currentMinutes}:${currentSeconds}`;
		}	
	}

	// Set Progress Bar
	function setProgressBar(e) { // if we console.log(e); and search for the clientWidth we'll see that that value is 360px
		//we'll use this keyword for rhis event: In an event, this refers to the element that received the event: https://www.w3schools.com/js/js_this.asp
		const width = this.clientWidth; // we assign the 360px value to our width variable
	/* to see where we click on the progress bar, we havejust to click on it and 
	console.log(e) and search for the offsetX value. Just check it for a no of times.*/
		const clickX = e.offsetX;
		const { duration } = song; //extracts the duration from audio // const song = document.querySelector('audio');
		song.currentTime = (clickX / width) * duration; // in this case currentTime is an atribute a property: https://www.w3schools.com/tags/av_prop_currenttime.asp 
	}

// Event Listeners for Prev and Next Btn
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
song.addEventListener('timeupdate', updateProgressBar); // more infos reg. timeupdate Event: https://www.w3schools.com/tags/av_event_timeupdate.asp
progressWhiteLine.addEventListener('click', setProgressBar)
song.addEventListener('ended', nextSong); // to start the ext song after the current one ends

/* ---------------Note:
in the updateProgressBar we setted up the duration of the song using the Math.floor() method, but also the duration it is picked up
from the myMysic object as we inserted the duration for every song. If we insert a console.log(durationMinutes); after the if 
statement in which we setted up the durationMinutes, we'll see that in console, when we'll click the prevBtn or NextBtn we receive
a NaN and that is because the calculation are made with a delay. Visually it is not a problem because the duration it is set also default from the 
object, as mentioned before. If this didn't be setted then the duration will appear with a millisecond delay.
For this bug, we have to delay the Math calculation for the seconds and for this we'll insert an if statement in which we'll say that 
the duration to be populated only if the durationSeconds calculation is made:
if (durationSeconds) {
songDuration.textContent = `${durationMinutes}:${durationSeconds}`;
}
---------------------*/

