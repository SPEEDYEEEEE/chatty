import React, { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setCampaigns } from "state"; // Action to update the campaigns state
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CampaignWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [headline, setHeadline] = useState(""); // For campaign headline (name)
  const [description, setDescription] = useState(""); // For campaign description
  const { palette } = useTheme();
  const { _id: userId } = useSelector((state) => state.user); // Retrieve user ID from the state
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  
  const navigate = useNavigate(); // Initialize useNavigate 
  
  const handleCampaign = async () => {
    const campaignData = {
      userId,
      headline, // Campaign Headline (Name)
      description, // Campaign Description
      picturePath: image ? image.name : null, // Only send image name/path if an image exists
    };
    console.log(campaignData);
  
    try {
      const response = await fetch(`http://localhost:3001/campaigns`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Sending JSON data
        },
        body: JSON.stringify(campaignData), // Send data as JSON
      });
  
      if (response.ok) {
        const campaigns = await response.json();
        dispatch(setCampaigns({ campaigns })); // Update the state with new campaigns
        // Reset form fields
        setImage(null);
        setHeadline("");
        setDescription("");
        setIsImage(false); // Close image menu
      } else {
        console.error("Failed to create campaign");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // return (
  //   <WidgetWrapper>
  //     <FlexBetween gap="1.5rem">
  //       <UserImage
  //         image={picturePath}
  //         onClick={() => navigate(`/profile/${userId}`)} // Navigate to profile page
  //         style={{ cursor: "pointer" }} // Add a pointer cursor
  //       />
  //       <InputBase
  //         placeholder="Campaign Headline (Name)"
  //         onChange={(e) => setHeadline(e.target.value)}
  //         value={headline}
  //         sx={{
  //           width: "100%",
  //           backgroundColor: palette.neutral.light,
  //           borderRadius: "2rem",
  //           padding: "1rem 2rem",
  //         }}
  //       />
  //     </FlexBetween>

  //     <InputBase
  //       placeholder="Campaign Description"
  //       onChange={(e) => setDescription(e.target.value)}
  //       value={description}
  //       multiline
  //       sx={{
  //         width: "100%",
  //         backgroundColor: palette.neutral.light,
  //         borderRadius: "1rem",
  //         padding: "1rem 2rem",
  //         marginTop: "1rem",
  //       }}
  //     />

  //     {isImage && (
  //       <Box border={`1px solid ${medium}`} borderRadius="5px" mt="1rem" p="1rem">
  //         <Dropzone
  //           acceptedFiles=".jpg,.jpeg,.png"
  //           multiple={false} // Single file only
  //           onDrop={(acceptedFiles) => setImage(acceptedFiles[0])} // Get the first image
  //         >
  //           {({ getRootProps, getInputProps }) => (
  //             <FlexBetween>
  //               <Box
  //                 {...getRootProps()}
  //                 border={`2px dashed ${palette.primary.main}`}
  //                 p="1rem"
  //                 width="100%"
  //                 sx={{ "&:hover": { cursor: "pointer" } }}
  //               >
  //                 <input {...getInputProps()} />
  //                 {!image ? (
  //                   <p>Add Image Here</p>
  //                 ) : (
  //                   <FlexBetween>
  //                     <Typography>{image.name}</Typography>
  //                     <EditOutlined />
  //                   </FlexBetween>
  //                 )}
  //               </Box>
  //               {image && (
  //                 <IconButton onClick={() => setImage(null)} sx={{ width: "15%" }}>
  //                   <DeleteOutlined />
  //                 </IconButton>
  //               )}
  //             </FlexBetween>
  //           )}
  //         </Dropzone>
  //       </Box>
  //     )}

  //     <Divider sx={{ margin: "1.25rem 0" }} />

  //     <FlexBetween>
  //       <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
  //         <MoreHorizOutlined sx={{ color: mediumMain }} />
  //         <Typography
  //           color={mediumMain}
  //           sx={{ "&:hover": { cursor: "pointer", color: medium } }}
  //         >
  //           Add Image
  //         </Typography>
  //       </FlexBetween>

  //       <Button
  //         disabled={!headline || !description}
  //         onClick={handleCampaign}
  //         sx={{
  //           color: palette.background.alt,
  //           backgroundColor: palette.primary.main,
  //           borderRadius: "3rem",
  //         }}
  //       >
  //         CREATE CAMPAIGN
  //       </Button>
  //     </FlexBetween>
  //   </WidgetWrapper>
  // );
  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage
          image={picturePath}
          onClick={() => navigate(`/profile/${userId}`)}
          style={{ cursor: "pointer", transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.1)' } }} 
        />
        <InputBase
          placeholder="Campaign Headline (Name)"
          onChange={(e) => setHeadline(e.target.value)}
          value={headline}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
            transition: 'background-color 0.3s',
            '&:focus': {
              backgroundColor: '#e3f2fd',
              border: `1px solid ${palette.primary.main}`
            }
          }}
        />
      </FlexBetween>

      <InputBase
        placeholder="Campaign Description"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        multiline
        sx={{
          width: "100%",
          backgroundColor: palette.neutral.light,
          borderRadius: "1rem",
          padding: "1rem 2rem",
          marginTop: "1rem",
          transition: 'background-color 0.3s',
          '&:focus': {
            backgroundColor: '#e3f2fd',
            border: `1px solid ${palette.primary.main}`
          }
        }}
      />

      {isImage && (
        <Box border={`1px solid ${medium}`} borderRadius="5px" mt="1rem" p="1rem">
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer", backgroundColor: '#f5f5f5' } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton onClick={() => setImage(null)} sx={{ width: "15%" }}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <MoreHorizOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Add Image
          </Typography>
        </FlexBetween>

        <Button
          disabled={!headline || !description}
          onClick={handleCampaign}
          sx={{
            color: "white",
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            "&:hover": { backgroundColor: palette.primary.light }
          }}
        >
          Create Campaign
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default CampaignWidget;
