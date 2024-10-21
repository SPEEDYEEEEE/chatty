import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { Link, useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const UserMenu = ({ fullName, handleLogout, neutralLight }) => (
  <FormControl variant="standard" value={fullName}>
    <Select
      value={fullName}
      sx={{
        backgroundColor: neutralLight,
        width: "150px",
        borderRadius: "0.25rem",
        p: "0.25rem 1rem",
        "& .MuiSvgIcon-root": {
          pr: "0.25rem",
          width: "3rem",
        },
        "& .MuiSelect-select:focus": {
          backgroundColor: neutralLight,
        },
      }}
      input={<InputBase />}
    >
      <MenuItem value={fullName}>
        <Typography>{fullName}</Typography>
      </MenuItem>
      <MenuItem onClick={handleLogout}>Log Out</MenuItem>
    </Select>
  </FormControl>
);

const NavbarIcons = ({ handleModeToggle, theme, dark, handleNotificationClick }) => (
  <>
    <IconButton onClick={handleModeToggle}>
      {theme.palette.mode === "dark" ? (
        <DarkMode sx={{ fontSize: "25px" }} />
      ) : (
        <LightMode sx={{ color: dark, fontSize: "25px" }} />
      )}
    </IconButton>
    <Message sx={{ fontSize: "25px" }} />
    <IconButton onClick={handleNotificationClick}>
      <Notifications sx={{ fontSize: "25px" }} />
    </IconButton>
    <Help sx={{ fontSize: "25px" }} />
  </>
);

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // Make sure state.user contains user data
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const token = useSelector((state) => state.token);


  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  // Check if user is an org or an individual user, and use the appropriate name
  const fullName = user?.role == 'org' ? user?.organizationName : `${user?.firstName || ''} ${user?.lastName || ''}`;

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to search for organizations
  const handleSearch = async () => {
    if (searchTerm.trim() === "") return; // Don't search if input is empty
  
    try {
      const response = await fetch(`http://localhost:3001/search/org?name=${searchTerm}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request headers
        },
      });
  
      // Log the response in case it's an error page
      console.log(response);
  
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data); // Store the search results
      } else {
        console.error("Error fetching search results", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };
  
  
  const handleModeToggle = () => {
    dispatch(setMode());
  };

  const handleLogout = () => {
    dispatch(setLogout());
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const fetchNotifications = () => {
    setNotifications([
      { id: 1, text: "New comment from John" },
      { id: 2, text: "Your post was liked by Doe" },
    ]);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  
  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          Charity Book
        </Typography>
        {isNonMobileScreens && (
          <Box display="flex" flexDirection="column">
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="3rem"
              padding="0.1rem 1.5rem"
            >
              <InputBase
                placeholder="Search for organizations..."
                value={searchTerm} // Bind input to searchTerm state
                onChange={handleSearchChange} // Capture search input
              />
              <IconButton onClick={handleSearch}>
                <Search />
              </IconButton>
            </FlexBetween>

            {/* Render search results when search is performed */}
            {searchResults.length > 0 && (
              <Box mt={2} backgroundColor={neutralLight} borderRadius="9px" padding="1rem" boxShadow={3}>
                {searchResults.map((org) => (
                  <Link
                    to={`/organizations/${org._id}`} // Use Link for navigation
                    style={{ textDecoration: 'none', color: '#1976d2' }} // Style for the link
                    key={org._id}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ padding: '0.5rem 0', "&:hover": { backgroundColor: '#e0f7fa' } }} // Add padding and hover effect
                    >
                      {org.organizationName}
                    </Typography>
                  </Link>
                ))}
              </Box>
            )}
          </Box>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <NavbarIcons handleModeToggle={handleModeToggle} theme={theme} dark={dark} handleNotificationClick={handleNotificationClick} />
          <UserMenu fullName={fullName} handleLogout={handleLogout} neutralLight={neutralLight} />
        </FlexBetween>
      ) : (
        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
              <Close />
            </IconButton>
          </Box>

          <FlexBetween display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="3rem">
            <NavbarIcons handleModeToggle={handleModeToggle} theme={theme} dark={dark} handleNotificationClick={handleNotificationClick} />
            <UserMenu fullName={fullName} handleLogout={handleLogout} neutralLight={neutralLight} />
          </FlexBetween>
        </Box>
      )}

      {/* NOTIFICATIONS POPUP */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box p={2} minWidth="200px">
          {notifications.length > 0 ? (
            <List>
              {notifications.map((notification) => (
                <ListItem key={notification.id}>
                  <ListItemText primary={notification.text} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No notifications</Typography>
          )}
        </Box>
      </Popover>
    </FlexBetween>
  );
};

export default Navbar;

