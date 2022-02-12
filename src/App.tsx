import Map from "./components/Map";
import Login from "./pages/Login";
import { useLocation } from "react-router-dom";
import { stravaAPI } from "./api";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie] = useCookies();

  let location = useLocation();
  const search = location?.search;
  const code = new URLSearchParams(search).get("code");
  const scope = new URLSearchParams(search).get("scope");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (cookies["access_token"]) {
      stravaAPI.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${cookies["access_token"]}`;

      setIsAuthenticated(true);
    } else if (code && scope?.includes("activity:read_all")) {
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

        setCookie("access_token", tokens.data.access_token);
        setIsAuthenticated(true);
      })();
    }
  }, [code, cookies, scope, setCookie]);

  return isAuthenticated ? <Map /> : <Login />;
}

export default App;
