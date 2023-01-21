import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import AdminAPI from "../../api/AdminAPI";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle } from "@tabler/icons";

function adminLogin(values: {
  email: string;
  password: string;
  remember: boolean;
}): void {
  showNotification({
    id: "login-admin",
    loading: true,
    title: "Logging in...",
    message: "Please wait while we log you in to the admin dashboard",
    autoClose: false,
    disallowClose: true,
  });

  AdminAPI.adminLogin(values.email, values.password)
    .then((response) => {
      updateNotification({
        id: "login-admin",
        color: "teal",
        title: "Logged in successfully",
        message:
          "You have been logged in successfully. Redirecting you to the admin dashboard...",
        icon: <IconCheck size={16} />,
        autoClose: 1000,
      });
      //add data to local storage
      localStorage.setItem("admin", JSON.stringify(response.data));
      //wait to notification to close and redirect to admin dashboard
      setTimeout(() => {
        //Add role to local storage
        localStorage.setItem("role", "admin");
        window.location.href = "/admin/dashboard";
      }, 1000);
    })
    .catch((error) => {
      updateNotification({
        id: "login-admin",
        color: "red",
        title: "Login failed",
        message:
          "We were unable to log you in. Please check your email and password and try again.",
        icon: <IconAlertTriangle size={16} />,
        autoClose: 5000,
      });
    });
}

const AdminLogin: React.FC = () => {
  if (localStorage.getItem("role")) {
    if (localStorage.getItem("role") === "admin") {
      window.location.href = "/admin/dashboard";
    } else {
      //to do
    }
  }

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { email: "", password: "", remember: false },

    validate: {
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",
    },
  });

  //set the page title
  document.title = "Admin Login - Tuition Management System";

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Admin Login
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Enter your credentials to access the Admin Dashboard
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => adminLogin(values))}>
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
            <Anchor<"a"> href="/admin-forget-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
