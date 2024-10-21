import { BrowserRouter, Navigate, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import CampaignPage from "scenes/CampaignsPost/CampaingPost";
import OrganizationListWidget from "scenes/widgets/OrganizationListWidget";
import OrganizationProfile from "scenes/profilePage/OrganizationProfile";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route path="/" element={<OrganizationListWidget />} />
            {/* Define a route for the organization profile page */}
            <Route path="/organizations/:orgId" element={<OrganizationProfile />} />
            <Route path="/campaign/:campaignId" element={<CampaignPage />} />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
