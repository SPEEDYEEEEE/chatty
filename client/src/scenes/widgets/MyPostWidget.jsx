import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  //GifBoxOutlined,  //no gifs allowed right now
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
  TagOutlined,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  styled,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { motion } from "framer-motion";


// Create a styled MenuItem
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: "skyblue",
    color: "white",
  },
}));

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [isTag, setIsTag] = useState(false); // State for toggling tag dropdown
  const [isCampaign, setIsCampaign] = useState(false); // State for toggling campaign dropdown
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [tags, setTags] = useState([]); // State for selected tags
  const [campaigns, setCampaigns] = useState([]); // State for selected campaigns
  const { palette } = useTheme();
  const { _id: userId } = useSelector((state) => state.user); // Retrieve user ID from the state
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const tagOptions = [
    "Education",
    "Healthcare",
    "Water and Sanitation",
    "Women's Empowerment",
    "Child Welfare",
    "Environmental Conservation",
    "Disaster Relief",
    "Poverty Alleviation",
    "Human Rights",
    "Animal Welfare",
    "Community Development",
    "Elderly Care",
    "Arts and Culture",
    "Sports and Recreation",
    "Technology and Innovation",
  ];

  const navigate = useNavigate(); // Initialize useNavigate

  // Retrieve the campaign ID from localStorage when the component mounts
  useEffect(() => {
    const selectedCampaignId = localStorage.getItem('selectedCampaignId');
    if (selectedCampaignId) {
      setCampaigns([selectedCampaignId]); // Store it in the state for campaigns
    }
  }, []);

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("organizationName", userId.organizationName);
    formData.append("description", post);
    formData.append("tags", JSON.stringify(tags)); // Send selected tags as JSON string
    formData.append("campaigns", JSON.stringify(campaigns)); // Send selected campaigns as JSON string
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }

    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setImage(null);
    setPost("");
    setTags([]);
    setCampaigns([]); // Clear campaigns after submission
    setIsImage(false); // Close image menu
    setIsTag(false); // Close tags menu
    setIsCampaign(false); // Close campaigns menu
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        {/* Add onClick to navigate to the user's profile */}
        <UserImage
          image={picturePath}
          onClick={() => navigate(`/profile/${userId}`)} // Navigate to the profile page
          style={{ cursor: "pointer" }} // Add a pointer cursor
        />
        <InputBase
          placeholder="Post About Something"
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>

      {isImage && (
        <Box border={`1px solid ${medium}`} borderRadius="5px" mt="1rem" p="1rem">
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={true}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
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

      {isTag && (
        <Box border={`1px solid ${medium}`} borderRadius="5px" mt="1rem" p="1rem">
          <FormControl fullWidth>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {tagOptions.map((tag) => (
                <StyledMenuItem key={tag} value={tag}>
                  {tag}
                </StyledMenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => setIsTag(!isTag)}>
          <TagOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Tags
          </Typography>
        </FlexBetween>

        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
