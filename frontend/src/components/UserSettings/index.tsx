import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  PasswordInput,
  Progress,
  TextInput,
  Text,
  Card,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertTriangle, IconCheck, IconX } from "@tabler/icons";
import UserAPI from "../../api/UserAPI";
import { showNotification, updateNotification } from "@mantine/notifications";

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

const UserSettings = () => {
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userSettingsForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      firstName: loggedUser.firstName,
      lastName: loggedUser.lastName,
      email: loggedUser.email,
      dateOfBirth: loggedUser.dateOfBirth.slice(0, 10),
    },
    validate: {
      firstName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      lastName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",
      dateOfBirth: (value) =>
        /^\d{4}-\d{2}-\d{2}$/.test(value)
          ? null
          : "Invalid date. Format: YYYY-MM-DD",
    },
  });
  const userPasswordForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
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
  const strength = getStrength(userPasswordForm.values.password);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(userPasswordForm.values.password)}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: "0ms" } }}
        value={
          userPasswordForm.values.password.length > 0 && index === 0
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

  const updateUserInfo = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  }) => {
    showNotification({
      id: "edit-user",
      loading: true,
      title: "Saving changes",
      message: "Saving changes in database",
      autoClose: false,
      disallowClose: true,
    });
    const userInfo = {
      id: loggedUser._id,
      userId: loggedUser.userId,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      dateOfBirth: values.dateOfBirth,
    };
    UserAPI.editUser(userInfo)
      .then((response) => {
        const user = {
          _id: response.data._id,
          userId: response.data.userId,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          dateOfBirth: response.data.dateOfBirth,
          accessToken: loggedUser.accessToken,
        };
        localStorage.setItem("user", JSON.stringify(user));
        window.location.reload();
        updateNotification({
          id: "edit-user",
          color: "teal",
          title: "Update successful",
          message: "Your data has been updated.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
      })
      .catch((error) => {
        updateNotification({
          id: "edit-admin",
          color: "red",
          title: "Update failed",
          message: "We were unable to update your data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  const updateUserPassword = async (values: {
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }) => {
    showNotification({
      id: "edit-user-password",
      loading: true,
      title: "Saving changes",
      message: "Saving your new password",
      autoClose: false,
      disallowClose: true,
    });
    const userPassword = {
      id: loggedUser._id,
      currentPassword: values.currentPassword,
      password: values.password,
    };
    UserAPI.changeUserPassword(userPassword)
      .then((response) => {
        updateNotification({
          id: "edit-user-password",
          color: "teal",
          title: "Update successful",
          message: "Your password has been updated.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
      })
      .catch((error) => {
        updateNotification({
          id: "edit-user-password",
          color: "red",
          title: "Update failed",
          message: error.response.data.message,
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };
  return (
    <Box
      sx={{
        width: "79%",
        height: "100vh",
      }}
      m="auto"
    >
      <Card shadow="sm" p="lg" radius="md" withBorder m="xs">
        <form
          onSubmit={userSettingsForm.onSubmit((values) =>
            updateUserInfo(values)
          )}
        >
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            {...userSettingsForm.getInputProps("firstName")}
            required
          />
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            {...userSettingsForm.getInputProps("lastName")}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            type={"email"}
            {...userSettingsForm.getInputProps("email")}
            required
          />
          <TextInput
            label="Date of Birth"
            placeholder="Enter date of birth"
            {...userSettingsForm.getInputProps("dateOfBirth")}
            required
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Save Info
          </Button>
        </form>
      </Card>
      <Card shadow="sm" p="lg" radius="md" withBorder m="xs">
        <form
          onSubmit={userPasswordForm.onSubmit((values) =>
            updateUserPassword(values)
          )}
        >
          <PasswordInput
            placeholder="Your current password"
            label="Current Password"
            {...userPasswordForm.getInputProps("currentPassword")}
          />
          <PasswordInput
            placeholder="Your New password"
            label="New Password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{8,}"
            {...userPasswordForm.getInputProps("password")}
          />
          <PasswordInput
            placeholder="Confirm your password"
            label="Confirm Password"
            {...userPasswordForm.getInputProps("confirmPassword")}
          />
          <Group spacing={5} grow mt="xs" mb="md">
            {bars}
          </Group>
          <PasswordRequirement
            label="Has at least 8 characters"
            meets={userPasswordForm.values.password.length > 7}
          />
          {checks}
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Change Password
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default UserSettings;
