function Login() {
  function redirectToStravaOAuth() {
    const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID;
    const redirectURI = process.env.REACT_APP_BASE_URL;
    const responseType = "code";
    const scope = "activity:read_all";
    window.location.href = `https://www.strava.com/api/v3/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=${responseType}&scope=${scope}`;
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={redirectToStravaOAuth}
    >
      LOG IN TO STRAVA
    </button>
  );
}

export default Login;
