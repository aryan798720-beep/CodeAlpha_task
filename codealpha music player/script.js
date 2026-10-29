
const audio = document.getElementById("audio");

const title = document.getElementById("song-title");
const artist = document.getElementById("song-artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeText = document.getElementById("current-time");
const durationText = document.getElementById("duration");
const volume = document.getElementById("volume");
const autoplay = document.getElementById("autoplay");
const playlist = document.getElementById("playlist");

// Song collection
const songs = [
    {
        title: "SoundHelix Song 1",
        artist: "SoundHelix",
        src: "player2.mp4"
    },
    {
        title: "SoundHelix Song 2",
        artist: "SoundHelix",
        src: "player3.mp4"
    },
    {
        title: "SoundHelix Song 3",
        artist: "SoundHelix",
        src: "player4.mp4"
    }
];

let songIndex = 0;

// Convert seconds into minutes:seconds
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${String(secs).padStart(2, "0")}`;
}

// Display playlist
function renderPlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span class="song-name">${index + 1}. ${song.title}</span>
            <span class="song-number">♫</span>
        `;

        li.addEventListener("click", () => {
            loadSong(index);
            playSong();
        });

        playlist.appendChild(li);
    });

    updateActiveSong();
}

// Highlight currently selected song
function updateActiveSong() {
    const items = playlist.querySelectorAll("li");

    items.forEach((item, index) => {
        item.classList.toggle("active", index === songIndex);
    });
}

// Load a song
function loadSong(index) {
    songIndex = index;

    const song = songs[songIndex];

    audio.src = song.src;
    title.textContent = song.title;
    artist.textContent = song.artist;

    progress.value = 0;
    currentTimeText.textContent = "0:00";
    durationText.textContent = "0:00";

    updateActiveSong();
}

// Play music
function playSong() {
    audio.play()
        .then(() => {
            playBtn.textContent = "⏸";
            playBtn.setAttribute("aria-label", "Pause music");
        })
        .catch((error) => {
            console.error("Unable to play audio:", error);
            playBtn.textContent = "▶";
            alert("Music could not be played. Check your internet connection or audio URL.");
        });
}

// Pause music
function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Play music");
}

// Play/Pause button
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// Next song
function nextSong(shouldPlay = true) {
    const nextIndex = (songIndex + 1) % songs.length;

    loadSong(nextIndex);

    if (shouldPlay) {
        playSong();
    }
}

// Previous song
function previousSong() {
    // Restart current song if it has played for more than 3 seconds
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songIndex);
    playSong();
}

nextBtn.addEventListener("click", () => nextSong());
prevBtn.addEventListener("click", previousSong);

// Update progress bar and current time
audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = (audio.currentTime / audio.duration) * 100;
    }

    currentTimeText.textContent = formatTime(audio.currentTime);
});

// Display total duration when audio is ready
audio.addEventListener("loadedmetadata", () => {
    durationText.textContent = formatTime(audio.duration);
});

// Seek to a position using the progress bar
progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

// Volume control
volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});

// Automatically play the next song when the current one ends
audio.addEventListener("ended", () => {
    if (autoplay.checked) {
        nextSong();
    } else {
        pauseSong();
        audio.currentTime = 0;
        progress.value = 0;
        currentTimeText.textContent = "0:00";
    }
});

// Keep button state correct if playback stops
audio.addEventListener("pause", () => {
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Play music");
});

audio.addEventListener("play", () => {
    playBtn.textContent = "⏸";
    playBtn.setAttribute("aria-label", "Pause music");
});

// Initialize player
audio.volume = Number(volume.value);
renderPlaylist();
loadSong(0);
