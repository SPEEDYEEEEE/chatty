// CampaignPage.js
import React from "react";
import { Box, Typography } from "@mui/material";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";


const CampaignPage = () => {
  const { campaignId } = useParams();
  const { _id: userId, role, picturePath } = useSelector((state) => state.user);

  // return (
  //   <Box>
  //     <Box mt={4}>
  //       {role === "org" && <MyPostWidget campaignId={campaignId} />} {/* Create post */}
  //       <PostsWidget userId={userId} campaignId={campaignId} /> {/* Display posts */}
  //     </Box>
  //   </Box>
  // );
  

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '2rem' }}>
      <Typography variant="h4" sx={{ marginBottom: '1rem', color: '#333' }}>
        YOUR POSTS
      </Typography>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Box mt={4} sx={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '2rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          {role === "org" && <MyPostWidget campaignId={campaignId} picturePath={picturePath} />}
          <PostsWidget userId={userId} campaignId={campaignId} userPicturePath={picturePath}/>
        </Box>
      </motion.div>
    </Box>
  );
};

export default CampaignPage;