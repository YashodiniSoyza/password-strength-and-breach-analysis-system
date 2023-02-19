import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Box,
  Center,
  Progress,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import UserAPI from "../../api/UserAPI";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle, IconX } from "@tabler/icons";
import { Link } from "react-router-dom";

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text color={meets ? "teal" : "red"} mt={5} size="sm">
      <Center inline>
        {meets ? (
          <IconCheck size={14} stroke={1.5} />
        ) : (
          <IconX size={14} stroke={1.5} />
        )}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

function userSignUp(values: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword: string;
}): void {
  showNotification({
    id: "signup-user",
    loading: true,
    title: "Logging in...",
    message: "Please wait while we log you in to the site",
    autoClose: false,
    disallowClose: true,
  });

  const data = {
    firstName: values.firstName,
    lastName: values.lastName,
    dateOfBirth: values.dateOfBirth,
    email: values.email,
    password: values.confirmPassword,
  };

  UserAPI.userSignUp(data)
    .then((response) => {
      updateNotification({
        id: "signup-user",
        color: "teal",
        title: "Signup successful",
        message:
          "Your account has been created successfully. please login to continue",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
        onClose: () => {
          window.location.href = "/login";
        },
      });
    })
    .catch((error) => {
      updateNotification({
        id: "signup-user",
        color: "red",
        title: "Signup failed",
        message:
          "There was an error creating your account. Please try again later." +
          error.response.data.message,
        icon: <IconAlertTriangle size={16} />,
        autoClose: 5000,
      });
    });
}

const UserSignUp: React.FC = () => {
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
    },

    validate: {
      firstName: (value) =>
        value.length > 0 ? null : "First name is required",
      lastName: (value) => (value.length > 0 ? null : "Last name is required"),
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",
      dateOfBirth: (value) =>
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.test(value)
          ? null
          : "Please enter a valid date of birth (YYYY-MM-DD)",
      password: (value) =>
        /[0-9]/.test(value) &&
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /[$&+,:;=?@#|'<>.^*()%!-]/.test(value) &&
        value.length > 7
          ? null
          : "Password must be at least 8 characters long and include at least one number, one lowercase letter, one uppercase letter and one special symbol",
      confirmPassword: (value, { password }) =>
        value === password ? null : "Passwords do not match",
    },
  });

  const strength = getStrength(form.values.password);

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.values.password)}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: "0ms" } }}
        value={
          form.values.password.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
            ? 100
            : 0
        }
        color={strength > 80 ? "teal" : strength > 50 ? "yellow" : "red"}
        key={index}
        size={4}
      />
    ));

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome to the site!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Enter your details below to sign up
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => userSignUp(values))}>
          <TextInput
            label="First Name"
            placeholder="Enter your first name"
            required
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Last Name"
            placeholder="Enter your last name"
            required
            {...form.getInputProps("lastName")}
          />
          <TextInput
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            required
            {...form.getInputProps("dateOfBirth")}
          />
          <TextInput
            label="Email"
            placeholder="you@example.dev"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            placeholder="Your New password"
            label="New Password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{8,}"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            placeholder="Confirm your password"
            label="Confirm Password"
            {...form.getInputProps("confirmPassword")}
          />
          <Group spacing={5} grow mt="xs" mb="md">
            {bars}
          </Group>
          <PasswordRequirement
            label="Has at least 8 characters"
            meets={form.values.password.length > 7}
          />
          {checks}
          <Button fullWidth mt="xl" type="submit">
            Sign Up
          </Button>
        </form>
        <Group position="center" mt="md">
          <Text color="dimmed" size="sm">
            Already have an account?
          </Text>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Text color="blue" size="sm">
              Sign in
            </Text>
          </Link>
        </Group>
      </Paper>
    </Container>
  );
};

export default UserSignUp;
