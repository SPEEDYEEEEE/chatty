import { Box, Typography, Card, CardContent, Avatar, Button} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFollowedOrganization, setFollowedOrganizations } from "state";
import { Link } from "react-router-dom"; // Import Link for navigation

const OrganizationListWidget = () => {
  const [organizations, setOrganizations] = useState([]);
  const token = useSelector((state) => state.token);
  const followedOrganizations = useSelector((state) => state.followedOrganizations); // Access from Redux
  const dispatch = useDispatch();

  const fetchOrganizations = async () => {
    const response = await fetch("http://localhost:3001/users/organizations", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    // Filter out already followed organizations
    const notFollowedOrgs = data.filter(
      (org) => !followedOrganizations.some((followedOrg) => followedOrg._id === org._id)
    );
    
    setOrganizations(notFollowedOrgs);
  };

  useEffect(() => {
    fetchOrganizations();
  }, [followedOrganizations]); // Re-fetch when followed organizations change

  const handleFollow = async (orgId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${orgId}/follow`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      const followedOrg = organizations.find((org) => org._id === orgId);
      dispatch(setFollowedOrganizations([...followedOrganizations, followedOrg]));

      setOrganizations(organizations.filter((org) => org._id !== orgId));

    } catch (error) {
      console.error("Error following organization:", error);
    }
  };

  // return (
  //   <Box sx={{ marginTop: "1rem", padding: "1rem", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
  //     <Typography variant="h6" gutterBottom>
  //       Recommended Organizations
  //     </Typography>
  //     {organizations.length > 0 ? (
  //       organizations.map((org) => (
  //         <Card key={org._id} sx={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
  //           <CardContent sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
  //             <Avatar src={org.picturePath} alt={org.organizationName} sx={{ marginRight: "1rem" }} />
  //             {/* Make Organization Name a clickable link */}
  //             <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
  //               <Link to={`/organizations/${org._id}`}> {/* Link to the organization profile page */}
  //                 {org.organizationName}
  //               </Link>
  //             </Typography>
  //             <Button
  //               variant="contained"
  //               color="primary"
  //               onClick={() => handleFollow(org._id)}
  //             >
  //               Follow
  //             </Button>
  //           </CardContent>
  //         </Card>
  //       ))
  //     ) : (
  //       <Typography variant="body2">No organizations found.</Typography>
  //     )}
  //   </Box>
  // );
  return (
    <Box sx={{ marginTop: "1rem", padding: "1rem", borderRadius: "8px", backgroundColor: "#ffffff", boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h6" gutterBottom>
        Recommended Organizations
      </Typography>
      {organizations.length > 0 ? (
        organizations.map((org) => (
          <Card key={org._id} sx={{ marginBottom: "1rem", display: "flex", alignItems: "center", transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
            <CardContent sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Avatar src={org.picturePath} alt={org.organizationName} sx={{ marginRight: "1rem" }} />
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                <Link to={`/organizations/${org._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                  {org.organizationName}
                </Link>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleFollow(org._id)}
                sx={{ '&:hover': { backgroundColor: '#1976d2' } }}
              >
                Follow
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2">No organizations found.</Typography>
      )}
    </Box>
  );
};

export default OrganizationListWidget;
