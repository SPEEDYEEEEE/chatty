// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setPosts } from "../../state";
// import PostWidget from "./PostWidget";

// const PostsWidget = ({ userId, isProfile = false }) => {
//   const dispatch = useDispatch();
//   const posts = useSelector((state) => state.posts);
//   const token = useSelector((state) => state.token);

//   const getPosts = async () => {
//     const response = await fetch("http://localhost:3001/posts", {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await response.json();
//     dispatch(setPosts({ posts: data }));
//   };

//   const getUserPosts = async () => {
//     const response = await fetch(`http://localhost:3001/posts/${userId}/posts`, {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await response.json();
//     dispatch(setPosts({ posts: data }));
//   };

//   useEffect(() => {
//     if (isProfile) {
//       getUserPosts();
//     } else {
//       getPosts();
//     }
//     // eslint-disable-next-line
//   }, [isProfile, userId, token, dispatch]);

//   // Ensure posts is an array before using it
//   if (!Array.isArray(posts)) {
//     return null;  // or a placeholder/error message
//   }

//   return (
//     <>
//       {posts.slice().reverse().map(
//         ({
//           _id,
//           userId,
//           firstName,
//           lastName,
//           description,
//           location,
//           picturePath,
//           userPicturePath,
//           likes,
//           comments,
//           tags,
//           campaigns,
//         }) => (
//           <PostWidget
//             key={_id}
//             postId={_id}
//             postUserId={userId}
//             name={`${firstName} ${lastName}`}
//             description={description}
//             location={location}
//             picturePath={picturePath}
//             userPicturePath={userPicturePath}
//             likes={likes}
//             comments={comments}
//             tags={tags}
//             campaigns={campaigns}
//           />
//         )
//       )}
//     </>
//   );
// };

// export default PostsWidget;

// PostsWidget.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import PostWidget from "./PostWidget";
import { Box } from "@mui/material";

const PostsWidget = ({ userId, campaignId, isProfile = false, userPicturePath }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getCampaignPosts = async () => {
    const response = await fetch(`http://localhost:3001/posts/${campaignId}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (campaignId) {
      getCampaignPosts();
    } else if (isProfile) {
      // Fetch user posts
      const getUserPosts = async () => {
        const response = await fetch(`http://localhost:3001/posts/${userId}/posts`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setPosts({ posts: data }));
      };
      getUserPosts();
    } else {
      getPosts();
    }
  }, [campaignId, isProfile, userId, token, dispatch]);

  // Ensure posts is an array before using it
  if (!Array.isArray(posts)) {
    return null;  // or a placeholder/error message
  }
  
  return (
    <Box sx={{ marginTop: '1rem' }}>
      {posts.slice().reverse().map(
        ({
          _id,
          userId,
          displayName,
          // firstName,
          // lastName,
          description,
          location,
          picturePath,
          // userPicturePath,
          likes,
          comments,
          tags,
          campaigns,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            displayName={displayName}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            tags={tags}
            campaigns={campaigns}
          />
        )
      )}
    </Box>
  );
};

export default PostsWidget;
