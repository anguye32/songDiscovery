// Function to handle user login to Spotify
function loginWithSpotify() {
  const clientId = "c3f2317f0a1947bd819cbf6a3fa85b1b";
  const redirectUri = "http://localhost:5502/callback/";
  const scopes = "user-read-private user-read-email";
  const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  window.location.href = authUrl;
}


function signIn() {
  console.log("here in Sign In button")
  location.href = "/signin"
}

function signUp() {
  location.href = "/signup"
}

