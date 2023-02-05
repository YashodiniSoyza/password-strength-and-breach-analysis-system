import { AdminSideBar } from "../../components";
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
  Title,
  Card,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertTriangle, IconCheck, IconX } from "@tabler/icons";
import AdminAPI from "../../api/AdminAPI";
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

const AdminSettings: React.FC = () => {
  const loggedAdmin = JSON.parse(localStorage.getItem("admin") || "{}");
  const adminSettingsForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: loggedAdmin.name,
      email: loggedAdmin.email,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",
    },
  });
  const adminPasswordForm = useForm({
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
  const strength = getStrength(adminPasswordForm.values.password);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(adminPasswordForm.values.password)}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: "0ms" } }}
        value={
          adminPasswordForm.values.password.length > 0 && index === 0
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

  const updateAdminInfo = async (values: { name: string; email: string }) => {
    showNotification({
      id: "edit-admin",
      loading: true,
      title: "Saving changes",
      message: "Saving changes in database",
      autoClose: false,
      disallowClose: true,
    });
    const adminInfo = {
      id: loggedAdmin._id,
      name: values.name,
      email: values.email,
    };
    AdminAPI.editAdmin(adminInfo)
      .then((response) => {
        const admin = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          accessToken: loggedAdmin.accessToken,
        };
        localStorage.setItem("admin", JSON.stringify(admin));
        window.location.reload();
        updateNotification({
          id: "edit-admin",
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

  const updateAdminPassword = async (values: {
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }) => {
    showNotification({
      id: "edit-admin-password",
      loading: true,
      title: "Saving changes",
      message: "Saving your new password",
      autoClose: false,
      disallowClose: true,
    });
    const adminPassword = {
      id: loggedAdmin._id,
      currentPassword: values.currentPassword,
      password: values.password,
    };
    AdminAPI.changeAdminPassword(adminPassword)
      .then((response) => {
        updateNotification({
          id: "edit-admin-password",
          color: "teal",
          title: "Update successful",
          message: "Your password has been updated.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
      })
      .catch((error) => {
        updateNotification({
          id: "edit-admin-password",
          color: "red",
          title: "Update failed",
          message: error.response.data.message,
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  return (
    <Flex
      gap="xs"
      justify="space-between"
      align="flex-start"
      direction="row"
      wrap="wrap"
      style={{ height: "100vh" }}
    >
      <AdminSideBar />
      <Box
        sx={{
          width: "79%",
          height: "100vh",
        }}
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        <Card shadow="sm" p="lg" radius="md" withBorder m="xs">
          <form
            onSubmit={adminSettingsForm.onSubmit((values) =>
              updateAdminInfo(values)
            )}
          >
            <TextInput
              label="Name"
              placeholder="Enter name"
              {...adminSettingsForm.getInputProps("name")}
              required
            />
            <TextInput
              label="Email"
              placeholder="Enter email"
              type={"email"}
              {...adminSettingsForm.getInputProps("email")}
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
            onSubmit={adminPasswordForm.onSubmit((values) =>
              updateAdminPassword(values)
            )}
          >
            <PasswordInput
              placeholder="Your current password"
              label="Current Password"
              {...adminPasswordForm.getInputProps("currentPassword")}
            />
            <PasswordInput
              placeholder="Your New password"
              label="New Password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{8,}"
              {...adminPasswordForm.getInputProps("password")}
            />
            <PasswordInput
              placeholder="Confirm your password"
              label="Confirm Password"
              {...adminPasswordForm.getInputProps("confirmPassword")}
            />
            <Group spacing={5} grow mt="xs" mb="md">
              {bars}
            </Group>
            <PasswordRequirement
              label="Has at least 8 characters"
              meets={adminPasswordForm.values.password.length > 7}
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
    </Flex>
  );
};

export default AdminSettings;
