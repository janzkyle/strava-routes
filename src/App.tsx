import Map from "./components/Map";
import Login from "./pages/Login";
import { useLocation } from "react-router-dom";
import { stravaAPI } from "./api";
import { useEffect, useState } from "react";

function App() {
  let location = useLocation();
  const search = location?.search;
  const code = new URLSearchParams(search).get("code");
  const scope = new URLSearchParams(search).get("scope");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (code && scope?.includes("activity:read_all")) {
      (async function fetchToken() {
        const tokens = await stravaAPI.post("/oauth/token", {
          client_id: parseInt(process.env.REACT_APP_STRAVA_CLIENT_ID!, 10),
          client_secret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
        });

        stravaAPI.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokens.data.access_token}`;
        setIsAuthenticated(true);
      })();
    }
  }, [code, scope]);

  return isAuthenticated ? <Map /> : <Login />;
}

export default App;
