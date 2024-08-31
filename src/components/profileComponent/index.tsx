import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  TextField,
  Divider,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../atoms/customButton";

const genderEnum = z.enum(["male", "female", "other"]);

interface UserData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  gender: string;
  userCode: string;
  isActive: number;
  UserType: number;
}

interface UserProfileProps {
  userData: UserData;
}

const getUserRole = (userType: number): string => {
  switch (userType) {
    case 1:
      return "Admin";
    case 2:
      return "User";
    case 3:
      return "Manager";
    default:
      return "Guest";
  }
};

const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string(),
  email: z.string().email("Invalid email address"),
  gender: genderEnum,
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  const {
    username,
    email,
    firstname,
    lastname,
    gender,
    userCode,
    isActive,
    UserType,
  } = userData;

  const userRole = getUserRole(UserType);
  const [editPassword, setEditPassword] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: firstname,
      lastName: lastname,
      email,
      gender,
    },
  });

  const handleEditProfileSubmit = (data: any) => {
    console.log("Edit Profile Data:", data);
  };

  const {
    register: registerChangePassword,
    handleSubmit: handleSubmitChangePassword,
    formState: { errors: changePasswordErrors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleChangePasswordSubmit = (data: any) => {
    console.log("Change Password Data:", data);
  };

  const getErrorMessage = (error: any) => {
    if (typeof error === "string") {
      return error;
    } else if (error && typeof error.message === "string") {
      return error.message;
    }
    return undefined;
  };

  const getFormVisible = (val: string) => {
    if (val === "profile") {
      setEditProfile(!editProfile);
      setEditPassword(false);
    } else if (val === "password") {
      setEditProfile(false);
      setEditPassword(!editPassword);
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, position: "relative" }}>
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <Typography variant="subtitle1" color="textSecondary">
          Role: {userRole}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" mb={3}>
        <Avatar sx={{ width: 80, height: 80, marginRight: 3 }}>
          {firstname[0]} {lastname[0]}
        </Avatar>
        <Box>
          <Typography variant="h5">{username}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            User Code: {userCode}
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color={isActive ? "green" : "red"}
          >
            {isActive ? "Active" : "Inactive"}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>First Name:</strong> {firstname}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Last Name:</strong> {lastname}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Email:</strong> {email}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Gender:</strong> {gender}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ marginY: 3 }} />

      <CustomButton
        sx={{ marginRight: 2 }}
        onClick={() => getFormVisible("profile")}
      >
        Edit Profile
      </CustomButton>
      <CustomButton onClick={() => getFormVisible("password")}>
        Change Password
      </CustomButton>

      {editProfile && (
        <Card sx={{ marginTop: 2 }}>
          <CardHeader
            title="Edit Profile"
            titleTypographyProps={{
              variant: "h6",
            }}
            sx={{
              backgroundColor: "#e2e6e7",
              borderBottom: "1px solid #ddd",
            }}
          />
          <CardContent>
            <form onSubmit={handleSubmit(handleEditProfileSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    fullWidth
                    {...register("firstName")}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message || ""}
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    fullWidth
                    {...register("lastName")}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message || ""}
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message || ""}
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel>Gender</InputLabel>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors.gender}
                          defaultValue={gender}
                        >
                          <MenuItem value="">Please select a gender</MenuItem>
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.gender && (
                      <Typography fontSize="12px" color="error">
                        {errors.gender.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <CustomButton variant="contained" type="submit">
                    Save Changes
                  </CustomButton>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}

      {editPassword && (
        <Card sx={{ marginTop: 2 }}>
          <CardHeader
            title="Change Password"
            titleTypographyProps={{
              variant: "h6",
            }}
            sx={{
              backgroundColor: "#e2e6e7",
              borderBottom: "1px solid #ddd",
            }}
          />
          <CardContent>
            <form
              onSubmit={handleSubmitChangePassword(handleChangePasswordSubmit)}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Current Password"
                    type={passwordVisible ? "text" : "password"}
                    fullWidth
                    {...registerChangePassword("currentPassword")}
                    error={!!changePasswordErrors.currentPassword}
                    helperText={getErrorMessage(
                      changePasswordErrors.currentPassword?.message
                    )}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {passwordVisible ? (
                              <VisibilityOffOutlined />
                            ) : (
                              <VisibilityOutlined />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="New Password"
                    type={passwordVisible ? "text" : "password"}
                    fullWidth
                    {...registerChangePassword("newPassword")}
                    error={!!changePasswordErrors.newPassword}
                    helperText={getErrorMessage(
                      changePasswordErrors.newPassword?.message
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm Password"
                    type={passwordVisible ? "text" : "password"}
                    fullWidth
                    {...registerChangePassword("confirmPassword")}
                    error={!!changePasswordErrors.confirmPassword}
                    helperText={getErrorMessage(
                      changePasswordErrors.confirmPassword?.message
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomButton variant="contained" type="submit">
                    Change Password
                  </CustomButton>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}
    </Paper>
  );
};

export default UserProfile;
