import {
  TextInput,
  PasswordInput,
  Checkbox,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import UserAPI from "../../api/UserAPI";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle } from "@tabler/icons";
import { Link } from "react-router-dom";

function userLogin(values: {
  email: string;
  password: string;
  remember: boolean;
}): void {
  showNotification({
    id: "login-user",
    loading: true,
    title: "Logging in...",
    message: "Please wait while we log you in to the site",
    autoClose: false,
    disallowClose: true,
  });

  UserAPI.userLogin(values.email, values.password)
    .then((response) => {
      updateNotification({
        id: "login-user",
        color: "teal",
        title: "Logged in successfully",
        message: "You have been logged in successfully. Redirecting...",
        icon: <IconCheck size={16} />,
        autoClose: 1000,
      });
      //add data to local storage
      localStorage.setItem("user", JSON.stringify(response.data));
      //wait to notification to close and redirect to restricted page
      setTimeout(() => {
        //Add role to local storage
        localStorage.setItem("role", "user");
        window.location.href = localStorage.getItem("redirectUrl") || "/";
      }, 1000);
    })
    .catch((error) => {
      updateNotification({
        id: "login-user",
        color: "red",
        title: "Login failed",
        message:
          "We were unable to log you in. Please check your email and password and try again.",
        icon: <IconAlertTriangle size={16} />,
        autoClose: 5000,
      });
    });
}

const UserLogin: React.FC = () => {
  if (localStorage.getItem("role")) {
    if (localStorage.getItem("role") === "user") {
      window.location.href = "/";
    } else if (localStorage.getItem("role") === "admin") {
      window.location.href = "/admin/dashboard";
    }
  }

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },

    validate: {
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",
    },
  });

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Enter your credentials to access the restricted features.
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => userLogin(values))}>
          <TextInput
            label="Email"
            placeholder="you@example.dev"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Group position="apart" mt="md">
            <Checkbox label="Remember me" {...form.getInputProps("remember")} />
            <Link
              to="/user/forgot-password"
              style={{ textDecoration: "inherit", fontSize: "0.9rem" }}
            >
              Forgot password?
            </Link>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
        <Group position="center" mt="md">
          <Text color="dimmed" size="sm">
            Don't have an account?
          </Text>
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <Text color="blue" size="sm">
              Sign up
            </Text>
          </Link>
        </Group>
      </Paper>
    </Container>
  );
};

export default UserLogin;
