import { useState, useEffect } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Box,
  Button,
  Modal,
  Badge,
  Card,
  ActionIcon,
  Flex,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconEdit,
  IconTrash,
  IconCheck,
  IconAlertTriangle,
} from "@tabler/icons";
import {} from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import UserAPI from "../../api/UserAPI";
import { useForm } from "@mantine/form";

//Interface for user data - (Raw data)
interface UserData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

//Get all user records from the database
const getAllUsers = async () => {
  const response = await UserAPI.getUsers();
  const data = await response.data;
  return data;
};

//Stylings
const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

//Interface for Table header props
interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

//Create Table Headers
function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

//Filter Data
function filterData(data: UserData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

//Sort Data
function sortData(
  data: UserData[],
  payload: { sortBy: keyof UserData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

const ManageUsers: React.FC = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch user data
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loading-data",
        loading: true,
        title: "Loading data",
        message: "Users data is loading..",
        autoClose: false,
        disallowClose: true,
      });
      const result = await getAllUsers();
      const data = result.map((item: any) => {
        return {
          id: item._id,
          userId: item.userId,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          dateOfBirth: item.dateOfBirth,
        };
      });
      setData(data);
      setLoading(false);
      const payload = {
        sortBy: null,
        reversed: false,
        search: "",
      };
      setSortedData(sortData(data, payload));
      updateNotification({
        id: "loading-data",
        color: "teal",
        title: "Data loaded successfully",
        message:
          "You can now manage users by adding, editing or deleting them.",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    };
    fetchData();
  }, []);

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof UserData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [opened, setOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);

  //edit user form
  const EditUser = async (values: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  }) => {
    showNotification({
      id: "edit-user",
      loading: true,
      title:
        "Updating user records of" + values.firstName + " " + values.lastName,
      message: "Updating user record..",
      autoClose: false,
      disallowClose: true,
    });
    UserAPI.editUser(values)
      .then((response) => {
        updateNotification({
          id: "edit-user",
          color: "teal",
          title: "User record updated successfully",
          message:
            "Updated user records of  " +
            values.firstName +
            " " +
            values.lastName,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        editForm.reset();
        setEditOpened(false);
        const newData = data.map((item) => {
          if (item.id === values.id) {
            return {
              id: values.id,
              userId: values.userId,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              dateOfBirth: values.dateOfBirth,
            };
          } else {
            return item;
          }
        });
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setData(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "edit-user",
          color: "red",
          title: "Update failed",
          message: "We were unable to update user data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //add user
  const addUser = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  }) => {
    showNotification({
      id: "add-user",
      loading: true,
      title: "Adding user record",
      message: "Please wait while we add user record..",
      autoClose: false,
      disallowClose: true,
    });
    UserAPI.addUser(values)
      .then((response) => {
        updateNotification({
          id: "add-user",
          color: "teal",
          title: "user added successfully",
          message: "user data added successfully.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        addForm.reset();
        setOpened(false);
        const newData = [
          ...data,
          {
            id: response.data._id,
            userId: response.data.userId,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            dateOfBirth: values.dateOfBirth,
          },
        ];
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setData(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "add-user",
          color: "red",
          title: "Adding user failed",
          message: "We were unable to add the user to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //delete user
  const deleteUser = async (id: string) => {
    showNotification({
      id: "delete-user",
      loading: true,
      title: "Deleting user",
      message: "Please wait while we delete the user record",
      autoClose: false,
      disallowClose: true,
    });
    UserAPI.deleteUser(id)
      .then((response) => {
        updateNotification({
          id: "delete-user",
          color: "teal",
          title: "user record deleted successfully",
          message: "The user record has been deleted successfully",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        const newData = data.filter((item) => item.id !== id);
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setData(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "delete-user",
          color: "red",
          title: "Deleting user record failed",
          message: "We were unable to delete the user record",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //declare edit form
  const editForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      id: "",
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
    },
    validate: {
      firstName: (value) =>
        value.length < 2 ? "First name must have at least 2 letters" : null,
      lastName: (value) =>
        value.length < 2 ? "Last name must have at least 2 letters" : null,
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Please enter a valid email address",
      dateOfBirth: (value) =>
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.test(value)
          ? null
          : "Please enter a valid date of birth (YYYY-MM-DD)",
    },
  });

  //declare add form
  const addForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
    },
    validate: {
      firstName: (value) =>
        value.length < 2 ? "First name must have at least 2 letters" : null,
      lastName: (value) =>
        value.length < 2 ? "Last name must have at least 2 letters" : null,
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Please enter a valid email address",
      dateOfBirth: (value) =>
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.test(value)
          ? null
          : "Please enter a valid date of birth (YYYY-MM-DD)",
    },
  });

  const setSorting = (field: keyof UserData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  //Open delete modal
  const openDeleteModal = (id: string) =>
    openConfirmModal({
      title: "Delete this user record?",
      centered: false,
      zIndex: 1000,
      children: (
        <Text size="sm">
          Are you sure you want to delete this user record? This action cannot
          be undone.
        </Text>
      ),
      labels: { confirm: "Delete user record", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "The user record was not deleted",
          color: "teal",
        });
      },
      onConfirm: () => {
        deleteUser(id);
      },
    });

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row.id} style={{ textAlign: "left" }}>
      <td>
        <Badge variant="gradient" gradient={{ from: "indigo", to: "cyan" }}>
          {row.userId}
        </Badge>
      </td>
      <td>{row.firstName + " " + row.lastName}</td>
      <td>{row.email}</td>
      <td>{row.dateOfBirth.substring(0, 10)}</td>
      <td>
        <Flex>
          <ActionIcon
            color="teal"
            onClick={() => {
              editForm.setValues({
                id: row.id,
                userId: row.userId,
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                dateOfBirth: row.dateOfBirth.substring(0, 10),
              });
              setEditOpened(true);
            }}
            mr="xs"
            variant="outline"
          >
            <IconEdit size={14} />
          </ActionIcon>
          <ActionIcon
            color="red"
            onClick={() => openDeleteModal(row.id)}
            mr="xs"
            variant="outline"
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Flex>
      </td>
    </tr>
  ));

  return (
    <Box
      sx={{
        width: "79%",
        height: "96vh",
      }}
    >
      <Card
        shadow="sm"
        radius="md"
        withBorder
        m="xs"
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          height: "100%",
        }}
      >
        <Modal
          opened={opened}
          onClose={() => {
            addForm.reset();
            setOpened(false);
          }}
          title="Add User"
          zIndex={1000}
        >
          <form onSubmit={addForm.onSubmit((values) => addUser(values))}>
            <TextInput
              label="First Name"
              placeholder="Enter first name"
              {...addForm.getInputProps("firstName")}
              required
            />
            <TextInput
              label="Last Name"
              placeholder="Enter last name"
              {...addForm.getInputProps("lastName")}
              required
            />
            <TextInput
              label="Email"
              placeholder="Enter email"
              {...addForm.getInputProps("email")}
              required
            />
            <TextInput
              label="Date of Birth"
              placeholder="Enter date of birth"
              {...addForm.getInputProps("dateOfBirth")}
              required
            />
            <Button
              color="teal"
              sx={{ marginTop: "10px", width: "100%" }}
              type="submit"
            >
              Add
            </Button>
          </form>
        </Modal>
        <Modal
          opened={editOpened}
          onClose={() => {
            editForm.reset();
            setEditOpened(false);
          }}
          title="Edit User"
          zIndex={1000}
        >
          <form onSubmit={editForm.onSubmit((values) => EditUser(values))}>
            <input
              placeholder="Enter ID"
              disabled
              {...editForm.getInputProps("id")}
              required
              hidden={true}
            />
            <TextInput
              label="User ID"
              placeholder="Enter User ID"
              disabled
              {...editForm.getInputProps("userId")}
              required
            />
            <TextInput
              label="First Name"
              placeholder="Enter first name"
              {...editForm.getInputProps("firstName")}
              required
            />
            <TextInput
              label="Last Name"
              placeholder="Enter last name"
              {...editForm.getInputProps("lastName")}
              required
            />
            <TextInput
              label="Email"
              placeholder="Enter email"
              {...editForm.getInputProps("email")}
              required
            />
            <TextInput
              label="Date of Birth"
              placeholder="Enter date of birth"
              {...editForm.getInputProps("dateOfBirth")}
              required
            />
            <Button
              color="teal"
              sx={{ marginTop: "10px", width: "100%" }}
              type="submit"
            >
              Save
            </Button>
          </form>
        </Modal>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <TextInput
              placeholder="Search by any field"
              mb="md"
              icon={<IconSearch size={14} stroke={1.5} />}
              value={search}
              onChange={handleSearchChange}
              sx={{ width: "300px" }}
            />
            <Button
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              sx={{ width: "200px", marginRight: "20px" }}
              onClick={() => setOpened(true)}
            >
              Add User
            </Button>
          </Box>
          <ScrollArea>
            <Table
              horizontalSpacing="md"
              verticalSpacing="xs"
              sx={{ tableLayout: "auto", width: "100%" }}
            >
              <thead>
                <tr>
                  <Th
                    sorted={sortBy === "id"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("id")}
                  >
                    User ID
                  </Th>
                  <Th
                    sorted={sortBy === "firstName"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("firstName")}
                  >
                    Name
                  </Th>
                  <Th
                    sorted={sortBy === "email"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("email")}
                  >
                    Email
                  </Th>
                  <Th
                    sorted={sortBy === "dateOfBirth"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("dateOfBirth")}
                  >
                    Date of Birth
                  </Th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <Text weight={500} align="center">
                        Loading
                      </Text>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <Text weight={500} align="center">
                        No items found
                      </Text>
                    </td>
                  </tr>
                ) : (
                  rows
                )}
              </tbody>
            </Table>
          </ScrollArea>
        </Box>
      </Card>
    </Box>
  );
};

export default ManageUsers;
