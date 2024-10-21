import React, { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, TextField, Button, Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import StarRating from "../../components/StarRating"; // Import the StarRating component

const PostWidget = ({
  postId,
  postUserId,
  displayName,
  description,
  location,
  picturePath,
  userPicturePath,
  likes = {}, // Default to an empty object
  comments = [], // Default to an empty array
  tags,
  campaigns,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);

  const theme = useTheme(); // Use theme hook to access colors
  const main = theme.palette.neutral.main;
  const primary = theme.palette.primary.main;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const primaryDark = theme.palette.primary.dark;

  const isLiked = likes ? Boolean(likes[loggedInUserId]) : false;
  const likeCount = likes ? Object.keys(likes).length : 0;

  // Function to handle like action
  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, text: newComment }),
      });

      if (!response.ok) {
        console.error("Failed to submit comment:", response.statusText);
        return;
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setNewComment(""); // Clear the comment input
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={displayName}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      
      {/* Render campaigns if available */}
      {/* {campaigns && campaigns.length > 0 && (
        <Box mt="0.5rem">
          <Typography color={main} sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
            Campaigns:{" "}
            {campaigns.map((campaign, index) => (
              <Chip
                key={index}
                label={campaign}
                sx={{
                  margin: '0.25rem',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  backgroundColor: background,
                  color: theme.palette.mode === "dark" ? primary : "#008899",
                  fontSize: "0.9rem",
                }}
              />
            ))}
          </Typography>
        </Box>
      )} */}

      {/* Render tags if available */}
      {tags && tags.length > 0 && (
        <Box mt="0.5rem">
          <Typography color={main} sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
            Tags:{" "}
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                sx={{
                  margin: '0.25rem',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  backgroundColor: background,
                  color: theme.palette.mode === "dark" ? primary : "#008899",
                  fontSize: "0.9rem",
                }}
              />
            ))}
          </Typography>
        </Box>
      )}

      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments ? comments.length : 0}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${comment._id}-${i}`} display="flex" justifyContent="space-between">
              <Box>
                <Typography sx={{ color: main, fontWeight: "bold", m: "0.5rem 0", pl: "1rem" }}>
                  {comment.userId?.firstName} {comment.userId?.lastName}
                </Typography>
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment.text}
                </Typography>
              </Box>
              <Typography sx={{ color: main, fontSize: "0.8rem", textAlign: "right", pr: "1rem" }}>
                {/* Add formatted date */}
              </Typography>
            </Box>
          ))}
          <Divider />
          <Box display="flex" mt="0.5rem">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ marginRight: "1rem" }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: primary,
                color: background,
                "&:hover": {
                  backgroundColor: primaryDark,
                  color: primaryLight,
                },
              }}
              onClick={handleAddComment}
            >
              Post
            </Button>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;

// import React, { useState } from "react";
// import {
//   ChatBubbleOutlineOutlined,
//   FavoriteBorderOutlined,
//   FavoriteOutlined,
//   ShareOutlined,
// } from "@mui/icons-material";
// import { Box, Divider, IconButton, Typography, useTheme, TextField, Button, Chip } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { setPost } from "../../state";
// import FlexBetween from "../../components/FlexBetween";
// import Friend from "../../components/Friend";
// import WidgetWrapper from "../../components/WidgetWrapper";
// import StarRating from "../../components/StarRating"; // Import the StarRating component

// const PostWidget = ({
//   postId,
//   postUserId,
//   name,
//   description,
//   location,
//   picturePath,
//   userPicturePath,
//   likes,
//   comments,
//   tags,
//   campaigns, 
// }) => {
//   const [isComments, setIsComments] = useState(false);
//   const [newComment, setNewComment] = useState("");
//   const dispatch = useDispatch();
//   const loggedInUserId = useSelector((state) => state.user._id);
//   const token = useSelector((state) => state.token);
//   const isLiked = Boolean(likes[loggedInUserId]);
//   const likeCount = Object.keys(likes).length;

//   const theme = useTheme();
//   const main = theme.palette.neutral.main;
//   const primary = theme.palette.primary.main;
//   const background = theme.palette.background.default;
//   const primaryLight = theme.palette.primary.light;
//   const primaryDark = theme.palette.primary.dark;

//   // Generate random rating once for the session
//   const getRandomRating = () => Math.floor(Math.random() * 5) + 1;
  
//   const [rating, setRating] = useState(() => {
//     const storedRating = sessionStorage.getItem(`postRating-${postId}`);
//     if (storedRating) {
//       return parseInt(storedRating, 10);
//     }
//     const newRating = getRandomRating();
//     sessionStorage.setItem(`postRating-${postId}`, newRating);
//     return newRating;
//   });

//   const patchLike = async () => {
//     const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
//       method: "PATCH",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId: loggedInUserId }),
//     });
//     const updatedPost = await response.json();
//     dispatch(setPost({ post: updatedPost }));
//   };

//   const handleAddComment = async () => {
//     if (newComment.trim() === "") return;

//     try {
//       const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId: loggedInUserId, text: newComment }),
//       });

//       if (!response.ok) {
//         console.error("Failed to submit comment:", response.statusText);
//         return;
//       }

//       const updatedPost = await response.json();
//       dispatch(setPost({ post: updatedPost }));
//       setNewComment(""); // Clear the comment input
//     } catch (error) {
//       console.error("Error submitting comment:", error);
//     }
//   };

//   const toggleComments = () => {
//     setIsComments(!isComments);
//   };

//   return (
//     <WidgetWrapper m="2rem 0">
//       <Friend
//         friendId={postUserId}
//         name={name}
//         subtitle={location}
//         userPicturePath={userPicturePath}
//       />
      
//       {campaigns && campaigns.length > 0 && (
//         <Box mt="0.5rem">
//           <Typography color={main} sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
//             Campaigns:{" "}
//             {campaigns.map((campaign, index) => (
//               <Chip
//                 key={index}
//                 label={campaign}
//                 sx={{
//                   margin: '0.25rem',
//                   fontWeight: 'bold',
//                   textDecoration: 'underline',
//                   backgroundColor: background,
//                   color: theme.palette.mode === "dark" ? primary : "#008899", 
//                   fontSize: "0.9rem", 
//                 }}
//               />
//             ))}
//           </Typography>
//         </Box>
//       )}

//       {tags && tags.length > 0 && (
//         <Box mt="0.5rem">
//           <Typography color={main} sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
//             Tags:{" "}
//             {tags.map((tag, index) => (
//               <Chip
//                 key={index}
//                 label={tag}
//                 sx={{
//                   margin: '0.25rem',
//                   fontWeight: 'bold',
//                   textDecoration: 'underline',
//                   backgroundColor: background,
//                   color: theme.palette.mode === "dark" ? primary : "#008899", 
//                   fontSize: "0.9rem", 
//                 }}
//               />
//             ))}
//           </Typography>
//         </Box>
//       )}

//       <Typography color={main} sx={{ mt: "1rem" }}>
//         {description}
//       </Typography>
//       {picturePath && (
//         <img
//           width="100%"
//           height="auto"
//           alt="post"
//           style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
//           src={`http://localhost:3001/assets/${picturePath}`}
//         />
//       )}

//       {/* Display star rating for the post */}
//       <Box mt="1rem">
//         <StarRating rating={rating} />
//       </Box>

//       <FlexBetween mt="0.25rem">
//         <FlexBetween gap="1rem">
//           <FlexBetween gap="0.3rem">
//             <IconButton onClick={patchLike}>
//               {isLiked ? (
//                 <FavoriteOutlined sx={{ color: primary }} />
//               ) : (
//                 <FavoriteBorderOutlined />
//               )}
//             </IconButton>
//             <Typography>{likeCount}</Typography>
//           </FlexBetween>

//           <FlexBetween gap="0.3rem">
//             <IconButton onClick={toggleComments}>
//               <ChatBubbleOutlineOutlined />
//             </IconButton>
//             <Typography>{comments.length}</Typography>
//           </FlexBetween>
//         </FlexBetween>

//         <IconButton>
//           <ShareOutlined />
//         </IconButton>
//       </FlexBetween>
//       {isComments && (
//         <Box mt="0.5rem">
// {comments.map((comment, i) => (
//   <Box key={`${comment._id}-${i}`} display="flex" justifyContent="space-between">
//     <Box>
//       <Typography sx={{ color: main, fontWeight: 'bold', m: "0.5rem 0", pl: "1rem" }}>
//         {comment.userId?.firstName} {comment.userId?.lastName} {/* Display the commenter's name */}
//       </Typography>
//       <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
//         {comment.text}
//       </Typography>
//     </Box>
//     <Typography sx={{ color: main, fontSize: "0.8rem", textAlign: "right", pr: "1rem" }}>
//       {//formatCommentDate(comment.createdAt)
//       }
//     </Typography>
//             </Box>
//           ))}
//           <Divider />
//           <Box display="flex" mt="0.5rem">
//             <TextField
//               fullWidth
//               variant="outlined"
//               size="small"
//               placeholder="Add a comment"
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               sx={{ marginRight: "1rem" }}
//             />
//             <Button
//               variant="contained"
//               sx={{
//                 backgroundColor: primary,
//                 color: background,
//                 "&:hover": {
//                   backgroundColor: primaryDark,
//                   color: primaryLight,
//                 },
//               }}
//               onClick={handleAddComment}
//             >
//               Post
//             </Button>
//           </Box>
//         </Box>
//       )}
//     </WidgetWrapper>
//   );
// };