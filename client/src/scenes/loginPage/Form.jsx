import { useState } from "react";
import { FormControl, InputLabel } from "@mui/material";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

// Validation schemas for users and organizations
const registerSchemaUser = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const registerSchemaOrg = yup.object().shape({
  organizationName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  website: yup.string().url("invalid URL").required("required"),
  picture: yup.string().required("required"),
  categories: yup.array().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegisterUser = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  picture: "",
};

const initialValuesRegisterOrg = {
  organizationName: "",
  email: "",
  password: "",
  location: "",
  website: "",
  picture: "",
  categories: [],
  otherCategory: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = ({ setPageType }) => {
  const [pageType, setFormPageType] = useState("login");
  const [registerType, setRegisterType] = useState("register");
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const isUser = registerType === "register";

  const categoryOptions = [
    "Health",
    "Education",
    "Environment",
    "Animal Welfare",
    "Human Services",
    "Arts & Culture",
    "International Affairs",
    "Religion",
    "Orphan Care Program",
    "Other",
  ];

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log("Form values before submit:", values); // Check form values here
    if (isLogin) {
      await login(values, onSubmitProps);
    }
    if (isRegister) {
      console.log("Current register type:", registerType); // Check which register type
      await register(values, onSubmitProps);
    }
  };

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);
  
    // Log the form data to check what is being sent
    console.log("Registering user with data:", values); // Check here as well
  
    try {
      const savedUserResponse = await fetch(
        `http://localhost:3001/auth/${registerType}`,
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("Response status:", savedUserResponse.status); // Check response status

      if (!savedUserResponse.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await savedUserResponse.json();
      console.log("Response from server:", data); // Check server response

      if (data) {
        setFormPageType("login");
        setPageType("login");
      }
      
      onSubmitProps.resetForm();
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={
        isLogin
          ? initialValuesLogin
          : isUser
          ? initialValuesRegisterUser
          : initialValuesRegisterOrg
      }
      validationSchema={
        isLogin
          ? loginSchema
          : isUser
          ? registerSchemaUser
          : registerSchemaOrg
      }
    >
      {({
        // values,
        // errors,
        // touched,
        // handleBlur,
        // handleChange,
        // handleSubmit,
        // setFieldValue,
        // resetForm,
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <Box sx={{ gridColumn: "span 4" }}>
                  <RadioGroup
                    row={isNonMobile}
                    value={registerType}
                    onChange={(e) => setRegisterType(e.target.value)}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                      },
                      justifyContent: "center",
                    }}
                  >
                    <FormControlLabel
                      value="register"
                      control={<Radio />}
                      label="User"
                      sx={{ mx: 2 }}
                    />
                    <FormControlLabel
                      value="register-organization"
                      control={<Radio />}
                      label="Charity Organization"
                      sx={{ mx: 2 }}
                    />
                  </RadioGroup>
                </Box>

                {isUser ? (
                  <>
                    <TextField
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      error={
                        Boolean(touched.firstName) && Boolean(errors.firstName)
                      }
                      helperText={touched.firstName && errors.firstName}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      error={
                        Boolean(touched.lastName) && Boolean(errors.lastName)
                      }
                      helperText={touched.lastName && errors.lastName}
                      sx={{ gridColumn: "span 2" }}
                    />
                  </>
                ) : (
                  <>
                    <TextField
                      label="Organization Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.organizationName}
                      name="organizationName"
                      error={
                        Boolean(touched.organizationName) &&
                        Boolean(errors.organizationName)
                      }
                      helperText={
                        touched.organizationName && errors.organizationName
                      }
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      label="Website"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.website}
                      name="website"
                      error={Boolean(touched.website) && Boolean(errors.website)}
                      helperText={touched.website && errors.website}
                      sx={{ gridColumn: "span 4" }}
                    />

                    {/* Categories Section */}
                    <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
                      <InputLabel shrink>Category</InputLabel>
                      <Select
                        multiple
                        label="Categories"
                        value={values.categories || []}
                        onChange={(e) => {
                          const selectedValues = e.target.value;
                          setFieldValue("categories", selectedValues);

                          if (selectedValues.includes("Other")) {
                            setShowOtherCategory(true);
                          } else {
                            setShowOtherCategory(false);
                            setFieldValue("otherCategory", "");
                          }
                        }}
                        renderValue={(selected) =>
                          selected.length === 0
                            ? "Select Category"
                            : selected.join(", ")
                        }
                        displayEmpty
                        sx={{
                          paddingTop: "0px",
                          paddingBottom: "0px",
                          "& .MuiSelect-select": {
                            paddingTop: "12px",
                            paddingBottom: "12px",
                          },
                        }}
                      >
                        {categoryOptions.map((category) => (
                          // <MenuItem key={category} value={category}>
                          //   <Checkbox
                          //     checked={values.categories.includes(category)}
                          //   />
                          //   <ListItemText primary={category} />
                          // </MenuItem>
                          <MenuItem key={category} value={category}>
                            <Checkbox checked={values.categories?.indexOf(category) > -1} />  {/* Safe check for undefined */}
                            <ListItemText primary={category} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Show "Other Category" field conditionally */}
                    {showOtherCategory && (
                      <TextField
                        label="Other Category"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.otherCategory}
                        name="otherCategory"
                        error={
                          Boolean(touched.otherCategory) &&
                          Boolean(errors.otherCategory)
                        }
                        helperText={
                          touched.otherCategory && errors.otherCategory
                        }
                        sx={{ gridColumn: "span 4" }}
                      />
                    )}
                  </>
                )}

                {/* Common fields for both User and Organization */}
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* File upload for profile picture */}
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ cursor: "pointer" }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            {isLogin && (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}
          </Box>

          {/* Button for submission */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setFormPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;

// import { useState } from "react";
// import { FormControl, InputLabel } from "@mui/material";
// import {
//   Box,
//   Button,
//   TextField,
//   useMediaQuery,
//   Typography,
//   useTheme,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   MenuItem,
//   Select,
//   Checkbox,
//   ListItemText,
// } from "@mui/material";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import { Formik } from "formik";
// import * as yup from "yup";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setLogin } from "state";
// import Dropzone from "react-dropzone";
// import FlexBetween from "components/FlexBetween";

// // Validation schemas for users and organizations
// const registerSchemaUser = yup.object().shape({
//   firstName: yup.string().required("required"),
//   lastName: yup.string().required("required"),
//   email: yup.string().email("invalid email").required("required"),
//   password: yup.string().required("required"),
//   location: yup.string().required("required"),
//   occupation: yup.string().required("required"),
//   picture: yup.string().required("required"),
// });

// const registerSchemaOrg = yup.object().shape({
//   organizationName: yup.string().required("required"),
//   email: yup.string().email("invalid email").required("required"),
//   password: yup.string().required("required"),
//   location: yup.string().required("required"),
//   website: yup.string().url("invalid URL").required("required"),
//   picture: yup.string().required("required"),
//   categories: yup.array().required("required"),
// });

// const loginSchema = yup.object().shape({
//   email: yup.string().email("invalid email").required("required"),
//   password: yup.string().required("required"),
// });

// const initialValuesRegisterUser = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   password: "",
//   location: "",
//   occupation: "",
//   picture: "",
// };

// const initialValuesRegisterOrg = {
//   organizationName: "",
//   email: "",
//   password: "",
//   location: "",
//   website: "",
//   picture: "",
//   categories: [], 
//   otherCategory: "",
// };


// const initialValuesLogin = {
//   email: "",
//   password: "",
// };

// const Form = ({ setPageType }) => {
//   const [pageType, setFormPageType] = useState("login");
//   const [registerType, setRegisterType] = useState("user");
//   const [showOtherCategory, setShowOtherCategory] = useState(false);
//   const { palette } = useTheme();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isNonMobile = useMediaQuery("(min-width:600px)");
//   const isLogin = pageType === "login";
//   const isRegister = pageType === "register";
//   const isUser = registerType === "user";

//   const categoryOptions = [
//     "Health",
//     "Education",
//     "Environment",
//     "Animal Welfare",
//     "Human Services",
//     "Arts & Culture",
//     "International Affairs",
//     "Religion",
//     "Other",
//   ];

//   const register = async (values, onSubmitProps) => {
//     const formData = new FormData();
//     for (let value in values) {
//       formData.append(value, values[value]);
//     }
//     formData.append("picturePath", values.picture.name);

//     const savedUserResponse = await fetch(
//       "http://localhost:3001/auth/register",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );
//     const savedUser = await savedUserResponse.json();
//     onSubmitProps.resetForm();

//     if (savedUser) {
//       setFormPageType("login");
//       setPageType("login");
//     }
//   };

//   const login = async (values, onSubmitProps) => {
//     const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(values),
//     });
//     const loggedIn = await loggedInResponse.json();
//     onSubmitProps.resetForm();
//     if (loggedIn) {
//       dispatch(
//         setLogin({
//           user: loggedIn.user,
//           token: loggedIn.token,
//         })
//       );
//       navigate("/home");
//     }
//   };

//   const handleFormSubmit = async (values, onSubmitProps) => {
//     if (isLogin) await login(values, onSubmitProps);
//     if (isRegister) await register(values, onSubmitProps);
//   };

//   return (
//     <Formik
//       onSubmit={handleFormSubmit}
//       initialValues={
//         isLogin
//           ? initialValuesLogin
//           : isUser
//           ? initialValuesRegisterUser
//           : initialValuesRegisterOrg
//       }
//       validationSchema={
//         isLogin
//           ? loginSchema
//           : isUser
//           ? registerSchemaUser
//           : registerSchemaOrg
//       }
//     >
//       {({
//         values,
//         errors,
//         touched,
//         handleBlur,
//         handleChange,
//         handleSubmit,
//         setFieldValue,
//         resetForm,
//       }) => (
//         <form onSubmit={handleSubmit}>
//           <Box
//             display="grid"
//             gap="30px"
//             gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//             sx={{
//               "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
//             }}
//           >
//             {isRegister && (
//               <>
//                 <Box sx={{ gridColumn: "span 4" }}>
//                   <RadioGroup
//                     row={isNonMobile}
//                     value={registerType}
//                     onChange={(e) => setRegisterType(e.target.value)}
//                     sx={{
//                       "& .MuiFormControlLabel-label": {
//                         fontWeight: "bold",
//                         fontSize: "1.2rem",
//                       },
//                       justifyContent: "center",
//                     }}
//                   >
//                     <FormControlLabel
//                       value="user"
//                       control={<Radio />}
//                       label="User"
//                       sx={{ mx: 2 }}
//                     />
//                     <FormControlLabel
//                       value="org"
//                       control={<Radio />}
//                       label="Charity Organization"
//                       sx={{ mx: 2 }}
//                     />
//                   </RadioGroup>
//                 </Box>

//                 {isUser ? (
//                   <>
//                     <TextField
//                       label="First Name"
//                       onBlur={handleBlur}
//                       onChange={handleChange}
//                       value={values.firstName}
//                       name="firstName"
//                       error={
//                         Boolean(touched.firstName) && Boolean(errors.firstName)
//                       }
//                       helperText={touched.firstName && errors.firstName}
//                       sx={{ gridColumn: "span 2" }}
//                     />
//                     <TextField
//                       label="Last Name"
//                       onBlur={handleBlur}
//                       onChange={handleChange}
//                       value={values.lastName}
//                       name="lastName"
//                       error={
//                         Boolean(touched.lastName) && Boolean(errors.lastName)
//                       }
//                       helperText={touched.lastName && errors.lastName}
//                       sx={{ gridColumn: "span 2" }}
//                     />
//                   </>
//                 ) : (
//                   <>
//                     <TextField
//                       label="Organization Name"
//                       onBlur={handleBlur}
//                       onChange={handleChange}
//                       value={values.organizationName}
//                       name="organizationName"
//                       error={
//                         Boolean(touched.organizationName) &&
//                         Boolean(errors.organizationName)
//                       }
//                       helperText={
//                         touched.organizationName && errors.organizationName
//                       }
//                       sx={{ gridColumn: "span 4" }}
//                     />
//                     <TextField
//                       label="Website"
//                       onBlur={handleBlur}
//                       onChange={handleChange}
//                       value={values.website}
//                       name="website"
//                       error={Boolean(touched.website) && Boolean(errors.website)}
//                       helperText={touched.website && errors.website}
//                       sx={{ gridColumn: "span 4" }}
//                     />

//                     {/* Categories Section */}

//                     <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
//                       <InputLabel shrink>Category</InputLabel> {/* Shrink will ensure the label is correctly positioned */}
//                       <Select
//                         multiple
//                         label="Categories"
//                         value={values.categories || []}  // Ensure values.categories is always an array
//                         onChange={(e) => {
//                           const selectedValues = e.target.value;
//                           setFieldValue("categories", selectedValues);

//                           if (selectedValues.includes("Other")) {
//                             setShowOtherCategory(true);
//                           } else {
//                             setShowOtherCategory(false);  
//                             setFieldValue("otherCategory", "");  // Reset custom category if 'Other' is deselected
//                           }
//                         }}
//                         renderValue={(selected) => (selected.length === 0 ? "Select Category" : selected.join(", "))}
//                         displayEmpty
//                         sx={{
//                           paddingTop: "0px",  // Fix padding top
//                           paddingBottom: "0px",  // Fix padding bottom
//                           "& .MuiSelect-select": {
//                             paddingTop: "12px",  // Adjust padding inside the select box
//                             paddingBottom: "12px",
//                           }
//                         }}
//                         MenuProps={{
//                           PaperProps: {
//                             sx: {
//                               mt: 0,  // Remove margin on top
//                             },
//                           },
//                         }}
//                       >
//                         {categoryOptions.map((category) => (
//                           <MenuItem key={category} value={category}>
//                             <Checkbox checked={values.categories?.indexOf(category) > -1} />  {/* Safe check for undefined */}
//                             <ListItemText primary={category} />
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>




//                     {/* Custom Category Input if "Other" is selected */}
//                     {showOtherCategory && (
//                       <TextField
//                         label="Other Category"
//                         onBlur={handleBlur}
//                         onChange={handleChange}
//                         value={values.otherCategory}
//                         name="otherCategory"
//                         error={
//                           Boolean(touched.otherCategory) &&
//                           Boolean(errors.otherCategory)
//                         }
//                         helperText={touched.otherCategory && errors.otherCategory}
//                         sx={{ gridColumn: "span 4" }}
//                       />
//                     )}
//                   </>
//                 )}

//                 <TextField
//                   label="Location"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   value={values.location}
//                   name="location"
//                   error={
//                     Boolean(touched.location) && Boolean(errors.location)
//                   }
//                   helperText={touched.location && errors.location}
//                   sx={{ gridColumn: "span 4" }}
//                 />
//                 <Box
//                   gridColumn="span 4"
//                   border={`1px solid ${palette.neutral.medium}`}
//                   borderRadius="5px"
//                   p="1rem"
//                 >
//                   <Dropzone
//                     acceptedFiles=".jpg,.jpeg,.png"
//                     multiple={false}
//                     onDrop={(acceptedFiles) =>
//                       setFieldValue("picture", acceptedFiles[0])
//                     }
//                   >
//                     {({ getRootProps, getInputProps }) => (
//                       <Box
//                         {...getRootProps()}
//                         border={`2px dashed ${palette.primary.main}`}
//                         p="1rem"
//                         sx={{ "&:hover": { cursor: "pointer" } }}
//                       >
//                         <input {...getInputProps()} />
//                         {!values.picture ? (
//                           <p>Add Picture Here</p>
//                         ) : (
//                           <FlexBetween>
//                             <Typography>{values.picture.name}</Typography>
//                             <EditOutlinedIcon />
//                           </FlexBetween>
//                         )}
//                       </Box>
//                     )}
//                   </Dropzone>
//                 </Box>
//               </>
//             )}

//             <TextField
//               label="Email"
//               onBlur={handleBlur}
//               onChange={handleChange}
//               value={values.email}
//               name="email"
//               error={Boolean(touched.email) && Boolean(errors.email)}
//               helperText={touched.email && errors.email}
//               sx={{ gridColumn: "span 4" }}
//             />
//             <TextField
//               label="Password"
//               type="password"
//               onBlur={handleBlur}
//               onChange={handleChange}
//               value={values.password}
//               name="password"
//               error={
//                 Boolean(touched.password) && Boolean(errors.password)
//               }
//               helperText={touched.password && errors.password}
//               sx={{ gridColumn: "span 4" }}
//             />
//           </Box>

//           {/* BUTTONS */}
//           <Box>
//             <Button
//               fullWidth
//               type="submit"
//               sx={{
//                 m: "2rem 0",
//                 p: "1rem",
//                 backgroundColor: palette.primary.main,
//                 color: palette.background.alt,
//                 "&:hover": { color: palette.primary.main },
//               }}
//             >
//               {isLogin ? "LOGIN" : "REGISTER"}
//             </Button>
//             <Typography
//               onClick={() => {
//                 const newPageType = pageType === "login" ? "register" : "login";
//                 setFormPageType(newPageType);
//                 setPageType(newPageType);
//                 resetForm();
//               }}
//               sx={{
//                 textDecoration: "underline",
//                 color: palette.primary.main,
//                 "&:hover": {
//                   cursor: "pointer",
//                   color: palette.primary.light,
//                 },
//               }}
//             >
//               {isLogin
//                 ? "Don't have an account? Sign Up here."
//                 : "Already have an account? Login here."}
//             </Typography>
//           </Box>
//         </form>
//       )}
//     </Formik>
//   );
// };

// export default Form;