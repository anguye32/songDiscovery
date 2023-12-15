"use strict"
// Extract the access token from the URL fragment
function extractAccessToken() {
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    return params.get("access_token");
  }
  return null;
}

// Handle the redirect from Spotify and extract the access token
function handleSpotifyRedirect() {
  const token = extractAccessToken();
  // console.log("token1: ", TOKEN1, "token: ", token)
  if (token) {
    sessionStorage.setItem("spotifyAccessToken", token);
    fetchUserData();
  }
}

// Function to fetch the user's Spotify profile
function fetchUserData() {

  const accessToken = sessionStorage.getItem("spotifyAccessToken");
  console.log("access: ", accessToken)
  fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: "Bearer " + accessToken },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("data: ", data)
      displayUserProfile(data);
      fetchUserPlaylists(accessToken);
    });
}

// Function to fetch user's playlists
function fetchUserPlaylists(accessToken) {
  fetch("https://api.spotify.com/v1/me/playlists", {
    headers: { Authorization: "Bearer " + accessToken },
  })
    .then((response) => response.json())
    .then((data) => {
      displayPlaylists(data);
    });

}

// Function to display the user's Spotify profile data
function displayUserProfile(userData) {
  const userProfileDiv = document.getElementById("userProfile");
  userProfileDiv.innerHTML = `
      <h2>Welcome, ${userData.display_name}</h2>
      <p>Followers: ${userData.followers.total}</p>
      <img src="${userData.images[0]?.url}" alt="Profile Picture" width="100">
    `;
  userProfileDiv.classList.remove("hidden");
}

// Function to display user's playlists
function displayPlaylists(data) {
  // console.log("data: ", data)
  const userContentDiv = document.getElementById("userContent");
  userContentDiv.innerHTML = "";
  data.items.forEach((playlist) => {
    const playlistElement = document.createElement("div");
    playlistElement.textContent = playlist.name;
    playlistElement.classList.add("playlist-title");
    playlistElement.onclick = () => {
      displaySongs(playlist.id);
      hideUserProfile();
      moveElementsUp();
    };
    userContentDiv.appendChild(playlistElement);
  });
  userContentDiv.classList.remove("hidden");
}

function hideUserProfile() {
  const userProfileDiv = document.getElementById("userProfile");
  userProfileDiv.classList.add("hidden");
}

function displaySongs(playlistId) {
  const accessToken = sessionStorage.getItem("spotifyAccessToken");
  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: { Authorization: "Bearer " + accessToken },
  })
    .then((response) => response.json())
    .then((data) => {
      processSongs(data.items);
    });
}

function moveElementsUp() {
  const elementsToMove = [
    document.getElementById("userContent"),
    document.getElementById("userProfile"),
    document.getElementById("songsDisplayArea"),
    document.getElementById("recommendationsArea"),
  ];
  elementsToMove.forEach((element) => {
    element.classList.add("move-up");
  });
}


function processSongs(songs) {
  const songsDiv = document.createElement("div");
  songs.forEach((song, index) => {
    const songElement = document.createElement("div");
    songElement.textContent = `${index + 1}. ${song.track.name} - ${song.track.artists.map((artist) => artist.name).join(", ")}`;
    songElement.classList.add("song-title");
    songElement.onclick = () => {
      fetchSongRecommendations(song.track.id);
      moveElementsUp();
    };
    songsDiv.appendChild(songElement);
  });

  const songsDisplayArea = document.getElementById("songsDisplayArea");
  songsDisplayArea.innerHTML = "";
  songsDisplayArea.appendChild(songsDiv);
  songsDisplayArea.classList.remove("hidden");
}

function fetchSongRecommendations(songId) {
  const accessToken = sessionStorage.getItem("spotifyAccessToken");
  fetch(`https://api.spotify.com/v1/recommendations?limit=100&seed_tracks=${songId}`, {
    headers: { Authorization: "Bearer " + accessToken }
  })
    .then((response) => response.json())
    .then((data) => {
      displayRecommendations(data.tracks);
    });
}

function displayRecommendations(tracks) {
  const trackListings = document.getElementById("trackListings");
  trackListings.innerHTML = "";

  tracks.forEach((track, index) => {
    const trackElement = document.createElement("div");
    trackElement.textContent = `${index + 1}. ${track.name} - ${track.artists.map((artist) => artist.name).join(", ")}`;
    trackListings.appendChild(trackElement);
  });

  const recommendationsArea = document.getElementById("recommendationsArea");
  recommendationsArea.classList.remove("hidden");

  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.classList.remove('hidden');
  }

  document.getElementById("userContent").classList.add("hidden");
  document.getElementById("songsDisplayArea").classList.add("hidden");
  document.getElementById("userProfile").classList.add("hidden");
}

function toggleVisibility() {
  const recommendationsArea = document.getElementById('recommendationsArea');
  const userContentDiv = document.getElementById('userContent');
  const songsDisplayArea = document.getElementById('songsDisplayArea');

  if (recommendationsArea && userContentDiv && songsDisplayArea) {
    recommendationsArea.classList.toggle('hidden');
    userContentDiv.classList.toggle('hidden');
    songsDisplayArea.classList.toggle('hidden');

    const backButton = document.getElementById('backButton');
    if (backButton) {
      backButton.classList.add('hidden');
    }
  }
}

window.onload = function () {
  handleSpotifyRedirect();

  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', toggleVisibility);
  }
};


function explorePlaylist() {
  console.log("in explore Playlist")

}





