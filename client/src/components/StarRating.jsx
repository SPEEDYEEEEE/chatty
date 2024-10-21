import React from "react";
import { Box } from "@mui/material";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';

const StarRating = ({ rating }) => {
  const totalStars = 5;

  return (
    <Box display="flex">
      {Array.from({ length: totalStars }, (_, index) => (
        index < rating ? (
          <StarIcon key={index} style={{ color: "#FFD700" }} />
        ) : (
          <StarOutlineIcon key={index} style={{ color: "#FFD700" }} />
        )
      ))}
    </Box>
  );
};

export default StarRating;
