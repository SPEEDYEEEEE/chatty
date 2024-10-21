import { Box, Typography, useTheme } from "@mui/material";
import Organization from "components/Organizations";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFollowedOrganizations } from "state";
import { Button } from "@mui/material"; // Import Button from MUI

const FollowedOrganizationListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const followedOrganizations = useSelector((state) => state.followedOrganizations);

  useEffect(() => {
    const getFollowedOrganizations = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userId}/followedOrganizations`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        dispatch(setFollowedOrganizations(data));
      } catch (error) {
        console.error("Error fetching followed organizations:", error);
      }
    };

    getFollowedOrganizations();
  }, [userId, dispatch, token]);

  // Function to handle unfollowing an organization
  const handleUnfollow = async (orgId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/unfollow/${orgId}`,
        {
          method: "DELETE", // Use DELETE for unfollowing
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        // Remove the organization from the Redux state or refetch
        dispatch(setFollowedOrganizations(followedOrganizations.filter(org => org._id !== orgId)));
      } else {
        console.error("Failed to unfollow organization");
      }
    } catch (error) {
      console.error("Error unfollowing organization:", error);
    }
  };

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Followed Organizations
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {followedOrganizations && followedOrganizations.length > 0 ? (
          followedOrganizations.map((org) => 
            org ? (
              <Box key={org._id} display="flex" alignItems="center" justifyContent="space-between">
                <Organization
                  name={org.organizationName}
                  userPicturePath={org.picturePath}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleUnfollow(org._id)} // Call the unfollow function
                >
                  Unfollow
                </Button>
              </Box>
            ) : null
          )
        ) : (
          <Typography>No organizations followed</Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FollowedOrganizationListWidget;
