import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const Organization = ({ name, userPicturePath }) => {
  return (
    <Box display="flex" alignItems="center" gap="1rem">
      <Avatar src={userPicturePath} alt={name} />
      <Box>
        <Typography variant="h6">{name}</Typography>
      </Box>
    </Box>
  );
};

export default Organization;