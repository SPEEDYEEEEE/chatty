import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import OrganizationListWidget from "scenes/widgets/OrganizationListWidget";
import FollowedOrganizationListWidget from "scenes/widgets/FollowedOrganizationsWidget";
import CampaignWidget from "scenes/widgets/CampaignWidget";
import CampaignsWidget from "scenes/widgets/CampaignsWidget";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate(); // React Router hook for navigation

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${_id}`, {
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

  const role = user.role;

  // Function to handle campaign selection and navigate to the new page
  const handleSelectCampaign = (campaignId) => {
    navigate(`/campaign/${campaignId}`); // Navigate to the campaign page
  };

  // return (
  //   <Box>
  //     <Navbar />
  //     <Box
  //       width="100%"
  //       padding="2rem 6%"
  //       display={isNonMobileScreens ? "flex" : "block"}
  //       gap="0.5rem"
  //       justifyContent="space-between"
  //     >
  //       <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
  //         <UserWidget userId={_id} picturePath={picturePath} />
  //         {role !== "org" && <OrganizationListWidget />}
  //       </Box>
  //       <Box
  //         flexBasis={isNonMobileScreens ? "42%" : undefined}
  //         mt={isNonMobileScreens ? undefined : "2rem"}
  //       >
  //         {role === "org" ? <CampaignWidget picturePath={picturePath} /> : null}
  //         <CampaignsWidget onSelectCampaign={handleSelectCampaign} />
  //       </Box>
  //       {isNonMobileScreens && (
  //         <Box flexBasis="26%">
  //           <AdvertWidget />
  //           <Box m="2rem 0" />
  //           {role !== "org" && <FollowedOrganizationListWidget userId={_id} />}
  //         </Box>
  //       )}
  //     </Box>
  //   </Box>
  // );
  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="1.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined} sx={{ backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
          <UserWidget userId={_id} picturePath={picturePath} />
          <Box m="2rem 0" />
          {role !== "org" && <OrganizationListWidget />}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          sx={{ backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}
        >
          {role === "org" ? <CampaignWidget picturePath={picturePath} /> : null}
          <CampaignsWidget onSelectCampaign={handleSelectCampaign} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            {role !== "org" && <FollowedOrganizationListWidget userId={_id} />}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
