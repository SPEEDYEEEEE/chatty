import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { useState } from "react";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  // State to track whether we're on the login or signup page
  const [pageType, setPageType] = useState("login");

  return (
    <Box>
      {/* Header */}
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Charity Book
        </Typography>
      </Box>

      {/* Form Section */}
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h4" sx={{ mb: "1.5rem" }}>
          CharityBook, the Facebook for Charities and Donors!
        </Typography>

        {/* Show only on signup page */}
        {pageType === "register" && (
          <Typography variant="h5"sx={{ mb: "1rem" }}>
            Sign up as either a Donor or a Charity organization.
          </Typography>
        )}

        {/* Form Component */}
        <Form setPageType={setPageType} />
      </Box>
    </Box>
  );
};

export default LoginPage;
