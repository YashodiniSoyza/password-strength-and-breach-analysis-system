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
} from "@tabler/icons";
import { IconEdit, IconTrash } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import AdminAPI from "../../api/AdminAPI";
import { IconCheck, IconAlertTriangle } from "@tabler/icons";
import { useForm } from "@mantine/form";

//Interface for admin data - (Raw data)
interface AdminData {
  id: string;
  adminId: string;
  name: string;
  email: string;
  createdAt: string;
}

//!Get all admin records from the database
// Fetch all user records
const getAllAdmin = async () => {
  const response = await AdminAPI.getAdmins();
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
function filterData(data: AdminData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

//Sort Data
function sortData(
  data: AdminData[],
  payload: { sortBy: keyof AdminData | null; reversed: boolean; search: string }
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

const ManageAdmins: React.FC = () => {
  const [data, setData] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch admin data
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "admin data is loading..",
        autoClose: false,
        disallowClose: true,
      });
      const result = await getAllAdmin();
      const data = result.map((item: any) => {
        return {
          id: item._id,
          adminId: item.adminId,
          name: item.name,
          email: item.email,
          createdAt: item.createdAt,
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
        id: "loding-data",
        color: "teal",
        title: "Data loaded successfully",
        message:
          "You can now manage administrators by adding, editing or deleting them.",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    };
    fetchData();
  }, []);

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof AdminData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [opened, setOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);

  //edit admin form
  const editAdmin = async (values: {
    id: string;
    adminId: string;
    name: string;
    email: string;
  }) => {
    showNotification({
      id: "edit-admin",
      loading: true,
      title: "Updating admin of " + values.name,
      message: "Updating admin record..",
      autoClose: false,
      disallowClose: true,
    });
    AdminAPI.editAdmin(values)
      .then((response) => {
        updateNotification({
          id: "edit-admin",
          color: "teal",
          title: "admin record updated successfully",
          message: "Updated admin record of " + values.name,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        editForm.reset();
        setEditOpened(false);
        const newData = data.map((item) => {
          if (item.id === values.id) {
            return {
              id: values.id,
              adminId: values.adminId,
              name: values.name,
              email: values.email,
              createdAt: item.createdAt,
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
          id: "edit-admin",
          color: "red",
          title: "Update failed",
          message: "We were unable to update admin data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //add admin
  const addAdmin = async (values: { name: string; email: string }) => {
    showNotification({
      id: "add-admin",
      loading: true,
      title: "Adding admin record",
      message: "Please wait while we add admin record..",
      autoClose: false,
      disallowClose: true,
    });
    AdminAPI.addAdmin(values)
      .then((response) => {
        updateNotification({
          id: "add-admin",
          color: "teal",
          title: "admin added successfully",
          message: "admin data added successfully.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        addForm.reset();
        setOpened(false);
        const newData = [
          ...data,
          {
            id: response.data._id,
            name: values.name,
            email: values.email,
            adminId: response.data.adminId,
            createdAt: response.data.createdAt,
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
          id: "add-admin",
          color: "red",
          title: "Adding admin failed",
          message: "We were unable to add the admin to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //delete admin
  const deleteAdmin = async (id: string) => {
    showNotification({
      id: "delete-admin",
      loading: true,
      title: "Deleting admin",
      message: "Please wait while we delete the admin record",
      autoClose: false,
      disallowClose: true,
    });
    AdminAPI.deleteAdmin(id)
      .then((response) => {
        updateNotification({
          id: "delete-admin",
          color: "teal",
          title: "admin record deleted successfully",
          message: "The admin record has been deleted successfully",
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
          id: "delete-admin",
          color: "red",
          title: "Deleting admin record failed",
          message: "We were unable to delete the admin record",
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
      adminId: "",
      name: "",
      email: "",
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

  //declare add form
  const addForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      email: "",
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

  const setSorting = (field: keyof AdminData) => {
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
      title: "Delete this admin record?",
      centered: false,
      zIndex: 1000,
      children: (
        <Text size="sm">
          Are you sure you want to delete this admin record? This action cannot
          be undone.
        </Text>
      ),
      labels: { confirm: "Delete admin record", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "The admin record was not deleted",
          color: "teal",
        });
      },
      onConfirm: () => {
        deleteAdmin(id);
      },
    });

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row.id} style={{ textAlign: "left" }}>
      <td>
        <Badge variant="gradient" gradient={{ from: "indigo", to: "cyan" }}>
          {row.adminId}
        </Badge>
      </td>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.createdAt.slice(0, 10) + " " + row.createdAt.slice(11, 19)}</td>
      <td>
        <Flex>
          <ActionIcon
            color="teal"
            onClick={() => {
              editForm.setValues({
                id: row.id,
                name: row.name,
                email: row.email,
                adminId: row.adminId,
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
          title="Add Administator"
          zIndex={1000}
        >
          <form onSubmit={addForm.onSubmit((values) => addAdmin(values))}>
            <TextInput
              label="Name"
              placeholder="Enter name"
              {...addForm.getInputProps("name")}
              required
            />
            <TextInput
              label="Email"
              placeholder="Enter email"
              {...addForm.getInputProps("email")}
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
          title="Edit Administator"
          zIndex={1000}
        >
          <form onSubmit={editForm.onSubmit((values) => editAdmin(values))}>
            <input
              placeholder="Enter ID"
              disabled
              {...editForm.getInputProps("id")}
              required
              hidden={true}
            />
            <TextInput
              label="Admin ID"
              placeholder="Enter admin ID"
              disabled
              {...editForm.getInputProps("adminId")}
              required
            />
            <TextInput
              label="Name"
              placeholder="Enter name"
              {...editForm.getInputProps("name")}
              required
            />
            <TextInput
              label="Email"
              placeholder="Enter email"
              {...editForm.getInputProps("email")}
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
        <Box>
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
              Add Administator
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
                    Admin ID
                  </Th>
                  <Th
                    sorted={sortBy === "name"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("name")}
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
                    sorted={sortBy === "createdAt"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("createdAt")}
                  >
                    Added On
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

export default ManageAdmins;
