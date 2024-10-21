import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Avatar, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { useSelector } from "react-redux";

const OrganizationProfile = () => {
    const navigate = useNavigate(); // Use useNavigate here
    const { orgId } = useParams();
    const [organization, setOrganization] = useState(null);
    const token = useSelector((state) => state.token);
    const [campaigns, setCampaigns] = useState([]);
  
    const fetchOrganizationData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/organizations/${orgId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setOrganization(data.organization);
        setCampaigns(data.campaigns);
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };
  
    const handleCampaignSelect = (campaignId) => {
      // Navigate directly to the selected campaign
      localStorage.setItem('selectedCampaignId', campaignId);
      navigate(`/campaign/${campaignId}`); // Use navigate here
    };
  
    useEffect(() => {
      fetchOrganizationData();
    }, [orgId]);
  
    if (!organization) {
      return <Typography>Loading...</Typography>;
    }
  
    return (
      <Box sx={{ padding: "2rem" }}>
        {/* Organization Info */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
          <Avatar src={organization.picturePath} alt={organization.organizationName} sx={{ marginRight: "1rem" }} />
          <Typography variant="h4">{organization.organizationName}</Typography>
        </Box>
  
        {/* Campaigns */}
        <Typography variant="h6">Campaigns:</Typography>
        {campaigns.length > 0 ? (
          <Grid container spacing={2}>
            {campaigns.map((campaign) => (
              <Grid item xs={12} sm={6} md={4} key={campaign._id}>
                <Card sx={{ boxShadow: 2, transition: '0.3s', '&:hover': { boxShadow: 4 } }}>
                  {campaign.picturePath && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={`http://localhost:3001/assets/${campaign.picturePath}`}
                      alt={campaign.headline}
                      sx={{ borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
                    />
                  )}
                  <CardContent>
                    <Typography
                      variant="h6"
                      onClick={() => handleCampaignSelect(campaign._id)} // Trigger handleCampaignSelect
                      sx={{ cursor: 'pointer', color: 'primary.main', marginBottom: 1 }}
                    >
                      {campaign.headline}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                      {campaign.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created by: {campaign.userId.organizationName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', marginTop: 2 }}>
            No campaigns available
          </Typography>
        )}
      </Box>
    );
  };
  

export default OrganizationProfile;
