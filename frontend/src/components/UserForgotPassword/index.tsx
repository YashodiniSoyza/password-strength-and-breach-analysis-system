import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Center,
  Box,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconArrowLeft, IconCheck } from "@tabler/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import UserAPI from "../../api/UserAPI";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
  },
}));

const UserForgotPassword = () => {
  const { classes } = useStyles();
  const [email, setEmail] = useState("");

  const forgotPassword = async () => {
    showNotification({
      id: "forgot-password",
      loading: true,
      title: "Generating new password...",
      message: "Please wait while we generate a new password for you",
      autoClose: false,
      disallowClose: true,
    });
    await UserAPI.forgotPassword(email)
      .then((response) => {
        updateNotification({
          id: "forgot-password",
          color: "teal",
          title: "Password reset successfully",
          message:
            "You have been sent a new password. Please check your email.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
      })
      .catch((error) => {
        console.log(error);
        updateNotification({
          id: "forgot-password",
          color: "red",
          title: "Password reset failed",
          message:
            "We were unable to reset your password. Please try again." +
            error.response.data.message,
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center">
        Forgot your password?
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a new password sent to you.
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <TextInput
          label="Your email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Group position="apart" mt="lg" className={classes.controls}>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Text color="dimmed" size="sm" className={classes.control}>
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5}>Back to the login page</Box>
              </Center>
            </Text>
          </Link>
          <Button
            className={classes.control}
            onClick={() => {
              forgotPassword();
            }}
          >
            Reset password
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};

export default UserForgotPassword;
