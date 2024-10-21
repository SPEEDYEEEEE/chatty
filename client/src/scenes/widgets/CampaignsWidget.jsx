import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import { useSelector } from 'react-redux';

const CampaignsWidget = ({ onSelectCampaign }) => {
  const [campaigns, setCampaigns] = useState([]);
  const token = useSelector((state) => state.token);

  console.log(token);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`http://localhost:3001/campaigns`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setCampaigns(data); // Campaigns fetched successfully
      } else {
        console.error("Failed to fetch campaigns");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCampaignSelect = (campaignId) => {
    // Save the selected campaign ID in localStorage
    localStorage.setItem('selectedCampaignId', campaignId);
    onSelectCampaign(campaignId);
  };

  return (
    <Box sx={{ padding: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
        All Campaigns
      </Typography>
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

export default CampaignsWidget;