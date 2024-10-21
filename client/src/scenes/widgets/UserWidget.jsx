import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  // Handle whether it's an organization or a user
  const displayName = user.role === 'org' ? user.organizationName : `${user.firstName} ${user.lastName}`;
  const isOrg = user.role === 'org';

  // return (
  //   <WidgetWrapper>
  //     {/* FIRST ROW */}
  //     <FlexBetween
  //       gap="0.5rem"
  //       pb="1.1rem"
  //       onClick={() => navigate(`/profile/${userId}`)}
  //     >
  //       <FlexBetween gap="1rem">
  //         <UserImage image={picturePath} />
  //         <Box>
  //           <Typography
  //             variant="h4"
  //             color={dark}
  //             fontWeight="500"
  //             sx={{
  //               "&:hover": {
  //                 color: palette.primary.light,
  //                 cursor: "pointer",
  //               },
  //             }}
  //           >
  //             {displayName}
  //           </Typography>
  //           {/* Show friend count for users, or other relevant info for orgs */}
  //           {isOrg ? (
  //             <Typography color={medium}>Organization</Typography>
  //           ) : (
  //             <Typography color={medium}>{user.friends.length} Follows</Typography>
  //           )}
  //         </Box>
  //       </FlexBetween>
  //       <ManageAccountsOutlined />
  //     </FlexBetween>

  //     <Divider />

  //     {/* SECOND ROW */}
  //     <Box p="1rem 0">
  //       <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
  //         <LocationOnOutlined fontSize="large" sx={{ color: main }} />
  //         <Typography color={medium}>{user.location}</Typography>
  //       </Box>
  //     </Box>

  //     <Divider />

  //     {/* THIRD ROW */}
  //     <Box p="1rem 0">
  //       <FlexBetween mb="0.5rem">
  //         <Typography color={medium}>Who's viewed your profile</Typography>
  //         <Typography color={main} fontWeight="500">
  //           {user.viewedProfile}
  //         </Typography>
  //       </FlexBetween>
  //     </Box>
  //   </WidgetWrapper>
  // );
  return (
    <WidgetWrapper>
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
        sx={{
          transition: 'background-color 0.3s',  
        }}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
                transition: 'color 0.3s',
              }}
            >
              {displayName}
            </Typography>
            {isOrg ? (
              <Typography color={medium}>Organization</Typography>
            ) : (
              <Typography color={medium}>{user.friends.length} Follows</Typography>
            )}
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>
      <Divider />
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{user.location}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {user.viewedProfile}
          </Typography>
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
