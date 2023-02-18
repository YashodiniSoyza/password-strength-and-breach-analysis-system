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
  Card,
  Textarea,
  ActionIcon,
  Flex,
  Radio,
  FileInput,
  Badge,
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
  IconUpload,
  IconEye,
} from "@tabler/icons";
import {} from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import BreachAPI from "../../api/BreachAPI";
import { useForm } from "@mantine/form";

interface BreachData {
  id: string;
  name: string;
  domain: string;
  logo: string;
  description: string;
  breachDate: string;
  compromisedAccounts: string;
  compromisedData: string;
  createdAt: string;
  updatedAt: string;
}

interface BreachedData {
  email: string;
  password: string;
  username: string;
  phone: string;
}

const getAllBreaches = async () => {
  const response = await BreachAPI.getBreaches();
  const breaches = await response.data;
  return breaches;
};

//Styles
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
function filterData(data: BreachData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key].toString().toLowerCase().includes(query)
    )
  );
}

//Filter Data for Breached Data
function filterDataForBreachedData(data: BreachedData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key].toString().toLowerCase().includes(query)
    )
  );
}

//Sort Data
function sortData(
  data: BreachData[],
  payload: {
    sortBy: keyof BreachData | null;
    reversed: boolean;
    search: string;
  }
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

//Sort Data for Breached Data
function sortDataForBreachedData(
  data: BreachedData[],
  payload: {
    sortBy: keyof BreachedData | null;
    reversed: boolean;
    search: string;
  }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterDataForBreachedData(data, payload.search);
  }

  return filterDataForBreachedData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

const ManageBreaches: React.FC = () => {
  const [data, setData] = useState<BreachData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof BreachData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [addOpened, setAddOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [importOpened, setImportOpened] = useState(false);
  const [importFileType, setImportFileType] = useState("excel");
  const [showBreachedDataOpened, setShowBreachedDataOpened] = useState(false);

  const [breachedData, setBreachedData] = useState<BreachedData[]>([]);
  const [breachedDataSearch, setBreachedDataSearch] = useState("");
  const [breachedDataSortedData, setBreachedDataSortedData] =
    useState(breachedData);
  const [breachedDataSortBy, setBreachedDataSortBy] = useState<
    keyof BreachedData | null
  >(null);
  const [
    breachedDataReverseSortDirection,
    setBreachedDataReverseSortDirection,
  ] = useState(false);

  const [breachName, setBreachName] = useState("");

  const importData = async (values: {
    id: string;
    file: File | null;
    fileType: string;
    fileColumns: string;
  }) => {
    showNotification({
      id: "importing-data",
      loading: true,
      title: "Importing data",
      message: "Please wait while we import breach data",
      autoClose: false,
      disallowClose: true,
    });
    BreachAPI.importBreaches(values)
      .then((response) => {
        console.log(response);
        updateNotification({
          id: "importing-data",
          color: "teal",
          title: "Data imported successfully",
          message: "Breach data has been imported successfully",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        updateNotification({
          id: "importing-data",
          color: "red",
          title: "Error importing data",
          message: "An error occurred while importing breach data",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 3000,
        });
      });
  };

  const getLeakedData = async (id: string) => {
    showNotification({
      id: "loading-data",
      loading: true,
      title: "Loading data",
      message: "Please wait while we load breach data",
      autoClose: false,
      disallowClose: true,
    });
    BreachAPI.getLeakedDataByBreachId(id)
      .then((response) => {
        updateNotification({
          id: "loading-data",
          color: "teal",
          title: "Data loaded successfully",
          message: "Breach data has been loaded successfully",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
        setBreachedData(response.data);
        setBreachedDataSortedData(response.data);
      })
      .catch((error) => {
        console.log(error);
        updateNotification({
          id: "loading-data",
          color: "red",
          title: "Error loading data",
          message: "An error occurred while loading breach data",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 3000,
        });
      });
  };

  const importForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      id: "",
      file: null,
      fileType: "excel",
      fileColumns: "",
    },
    validate: {
      file: (value) => (value === null ? "File is required" : null),
      fileColumns: (value) =>
        value === "" ? "File columns are required" : null,
    },
  });

  // fetch user data
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loading-data",
        loading: true,
        title: "Loading data",
        message: "Please wait while we load breach data",
        autoClose: false,
        disallowClose: true,
      });
      const result = await getAllBreaches();
      const data = result.map((item: any) => {
        return {
          id: item._id,
          name: item.name,
          domain: item.domain,
          logo: item.logo,
          description: item.description,
          breachDate: item.breachDate,
          compromisedAccounts: item.compromisedAccounts,
          compromisedData: item.compromisedData,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
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
        message: "You can now view and manage all breaches in the table",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    };
    fetchData();
  }, []);

  //edit user form
  const editBreach = async (values: {
    id: string;
    name: string;
    domain: string;
    logo: string;
    description: string;
    breachDate: string;
    compromisedAccounts: string;
    compromisedData: string;
  }) => {
    showNotification({
      id: "edit-breach",
      loading: true,
      title: "Updating breach records of " + values.name + ", " + values.domain,
      message: "Updating breach record..",
      autoClose: false,
      disallowClose: true,
    });
    const compromisedAccounts = parseInt(values.compromisedAccounts);
    const newValues = {
      id: values.id,
      name: values.name,
      domain: values.domain,
      logo: values.logo,
      description: values.description,
      breachDate: values.breachDate,
      compromisedAccounts: compromisedAccounts,
      compromisedData: values.compromisedData,
    };
    BreachAPI.updateBreach(newValues)
      .then((response) => {
        updateNotification({
          id: "edit-breach",
          color: "teal",
          title:
            "Updates breach records of " + values.name + ", " + values.domain,
          message:
            "Updated breach records of  " +
            values.name +
            ", " +
            values.domain +
            " successfully",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        editForm.reset();
        setEditOpened(false);
        const newData = data.map((item) => {
          if (item.id === values.id) {
            return {
              id: values.id,
              name: values.name,
              domain: values.domain,
              logo: values.logo,
              description: values.description,
              breachDate: values.breachDate,
              compromisedAccounts: values.compromisedAccounts.toString(),
              compromisedData: values.compromisedData,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
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
          id: "edit-breach",
          color: "red",
          title: "Update failed",
          message: "We were unable to update breach data",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //add user
  const addBreach = async (values: {
    name: string;
    domain: string;
    logo: string;
    description: string;
    breachDate: string;
    compromisedAccounts: string;
    compromisedData: string;
  }) => {
    showNotification({
      id: "add-breach",
      loading: true,
      title: "Adding breach record of " + values.name + ", " + values.domain,
      message: "Please wait while we add breach record..",
      autoClose: false,
      disallowClose: true,
    });

    const compromisedAccounts = parseInt(values.compromisedAccounts);
    const newValues = {
      name: values.name,
      domain: values.domain,
      logo: values.logo,
      description: values.description,
      breachDate: values.breachDate,
      compromisedAccounts: compromisedAccounts,
      compromisedData: values.compromisedData,
    };

    BreachAPI.addBreach(newValues)
      .then((response) => {
        updateNotification({
          id: "add-breach",
          color: "teal",
          title: "Added breach record of " + values.name + ", " + values.domain,
          message:
            "Added breach record of " + values.name + ", " + values.domain,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        addForm.reset();
        setAddOpened(false);
        const newData = [
          ...data,
          {
            id: response.data._id,
            name: values.name,
            domain: values.domain,
            logo: values.logo,
            description: values.description,
            breachDate: values.breachDate,
            compromisedAccounts: values.compromisedAccounts.toString(),
            compromisedData: values.compromisedData,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
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
          id: "add-breach",
          color: "red",
          title: "Add failed",
          message: "We were unable to add breach data",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //delete user
  const deleteUser = async (id: string) => {
    showNotification({
      id: "delete-breach",
      loading: true,
      title: "Deleting breach record",
      message: "Please wait while we delete the breach record..",
      autoClose: false,
      disallowClose: true,
    });
    BreachAPI.deleteBreach(id)
      .then((response) => {
        updateNotification({
          id: "delete-breach",
          color: "teal",
          title: "Deleted breach record",
          message: "Deleted breach record successfully",
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
          id: "delete-breach",
          color: "red",
          title: "Delete failed",
          message: "We were unable to delete breach data",
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
      name: "",
      domain: "",
      logo: "",
      description: "",
      breachDate: "",
      compromisedAccounts: "",
      compromisedData: "",
    },
    validate: {
      compromisedAccounts: (
        value //must be a number
      ) => (/^([0-9])+$/.test(value) ? null : "Must be a number"),
      breachDate: (value) =>
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.test(value)
          ? null
          : "Please enter a valid date (YYYY-MM-DD)",
    },
  });

  //declare add form
  const addForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      domain: "",
      logo: "",
      description: "",
      breachDate: "",
      compromisedAccounts: "",
      compromisedData: "",
    },
    validate: {
      compromisedAccounts: (value) =>
        /^([0-9])+$/.test(value) ? null : "Must be a number",
      breachDate: (value) =>
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.test(value)
          ? null
          : "Please enter a valid date (YYYY-MM-DD)",
    },
  });

  const setSorting = (field: keyof BreachData) => {
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

  const setSortingForBreachedData = (field: keyof BreachedData) => {
    const reversed =
      field === breachedDataSortBy ? !breachedDataReverseSortDirection : false;
    setBreachedDataReverseSortDirection(reversed);
    setBreachedDataSortBy(field);
    setBreachedDataSortedData(
      sortDataForBreachedData(breachedData, {
        sortBy: field,
        reversed,
        search: breachedDataSearch,
      })
    );
  };

  const handleSearchChangeForBreachedData = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.currentTarget;
    setBreachedDataSearch(value);
    setBreachedDataSortedData(
      sortDataForBreachedData(breachedData, {
        sortBy: breachedDataSortBy,
        reversed: breachedDataReverseSortDirection,
        search: value,
      })
    );
  };

  //Open delete modal
  const openDeleteModal = (id: string) =>
    openConfirmModal({
      title: "Delete this breach record?",
      centered: false,
      zIndex: 1000,
      children: (
        <Text size="sm">
          Are you sure you want to delete this breach record? This action cannot
          be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "You cancelled the delete action",
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
      <td>{row.name}</td>
      <td>{row.domain}</td>
      <td>{row.breachDate.substring(0, 10)}</td>
      <td>{row.compromisedAccounts}</td>
      <td>{row.createdAt.substring(0, 10)}</td>

      <td>
        <Flex>
          <ActionIcon
            color="teal"
            onClick={() => {
              editForm.setValues({
                id: row.id,
                name: row.name,
                domain: row.domain,
                logo: row.logo,
                description: row.description,
                breachDate: row.breachDate.substring(0, 10),
                compromisedAccounts: row.compromisedAccounts,
                compromisedData: row.compromisedData,
              });
              setEditOpened(true);
            }}
            variant="outline"
            mr="xs"
          >
            <IconEdit size={14} />
          </ActionIcon>
          <ActionIcon
            color="red"
            onClick={() => openDeleteModal(row.id)}
            variant="outline"
            mr="xs"
          >
            <IconTrash size={14} />
          </ActionIcon>
          <ActionIcon
            color="yellow"
            onClick={() => {
              importForm.setValues({
                id: row.id,
              });
              setImportOpened(true);
            }}
            variant="outline"
            mr="xs"
          >
            <IconUpload size={14} />
          </ActionIcon>
          <ActionIcon
            color="blue"
            onClick={() => {
              setBreachName(row.name + "(" + row.domain + ") ");
              getLeakedData(row.id);
              setShowBreachedDataOpened(true);
            }}
            variant="outline"
            mr="xs"
          >
            <IconEye size={14} />
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
          opened={addOpened}
          onClose={() => {
            addForm.reset();
            setAddOpened(false);
          }}
          title="Add Breach"
          zIndex={1000}
        >
          <form onSubmit={addForm.onSubmit((values) => addBreach(values))}>
            <TextInput
              label="Name"
              placeholder="Enter name"
              {...addForm.getInputProps("name")}
              required
            />
            <TextInput
              label="Domain"
              placeholder="Enter domain"
              {...addForm.getInputProps("domain")}
              required
            />
            <TextInput
              label="Logo URL"
              placeholder="Enter logo url"
              {...addForm.getInputProps("logo")}
              required
            />
            <Textarea
              minRows={5}
              label="Description"
              placeholder="Enter description"
              {...addForm.getInputProps("description")}
              required
            />
            <TextInput
              label="Breach Date"
              placeholder="Enter breach date"
              {...addForm.getInputProps("breachDate")}
              required
            />
            <TextInput
              label="Compromised Accounts"
              placeholder="Enter compromised accounts"
              {...addForm.getInputProps("compromisedAccounts")}
              required
            />
            <TextInput
              label="Compromised Data"
              placeholder="Enter compromised data"
              {...addForm.getInputProps("compromisedData")}
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
          title="Edit Breach"
          zIndex={1000}
        >
          <form onSubmit={editForm.onSubmit((values) => editBreach(values))}>
            <input
              placeholder="Enter ID"
              disabled
              {...editForm.getInputProps("id")}
              required
              hidden={true}
            />
            <TextInput
              label="Name"
              placeholder="Enter name"
              {...editForm.getInputProps("name")}
              required
            />
            <TextInput
              label="Domain"
              placeholder="Enter domain"
              {...editForm.getInputProps("domain")}
              required
            />
            <TextInput
              label="Logo URL"
              placeholder="Enter logo url"
              {...editForm.getInputProps("logo")}
              required
            />
            <Textarea
              minRows={5}
              label="Description"
              placeholder="Enter description"
              {...editForm.getInputProps("description")}
              required
            />
            <TextInput
              label="Breach Date"
              placeholder="Enter breach date"
              {...editForm.getInputProps("breachDate")}
              required
            />
            <TextInput
              label="Compromised Accounts"
              placeholder="Enter compromised accounts"
              {...editForm.getInputProps("compromisedAccounts")}
              required
            />
            <TextInput
              label="Compromised Data"
              placeholder="Enter compromised data"
              {...editForm.getInputProps("compromisedData")}
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
        <Modal
          opened={importOpened}
          onClose={() => {
            setImportOpened(false);
            importForm.reset();
          }}
          title="Import Data"
          zIndex={1000}
        >
          <form onSubmit={importForm.onSubmit((values) => importData(values))}>
            <Radio.Group
              label="File Type"
              value={importFileType}
              onChange={(value) => {
                setImportFileType(value);
                importForm.values.file = null;
                importForm.values.fileType = value;
              }}
              required
            >
              <Radio value="excel" label="Excel" />
              <Radio value="txt" label="TXT" />
              <Radio value="json" label="JSON" />
              <Radio value="csv" label="CSV" />
            </Radio.Group>
            <FileInput
              placeholder="Pick file"
              label="File"
              accept={
                importFileType === "excel"
                  ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  : importFileType === "txt"
                  ? "text/plain"
                  : importFileType === "json"
                  ? "application/json"
                  : importFileType === "csv"
                  ? "text/csv"
                  : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              }
              icon={<IconUpload size={14} />}
              required
              {...importForm.getInputProps("file")}
            />
            <TextInput
              label="Order of Columns (separated by comma)"
              placeholder="Enter order of columns, e.g. email,password,username,phone"
              required
              {...importForm.getInputProps("fileColumns")}
            />

            <Button
              color="teal"
              sx={{ marginTop: "10px", width: "100%" }}
              type="submit"
            >
              Import
            </Button>
          </form>
        </Modal>
        {/* //Model for show leaked data */}
        <Modal
          opened={showBreachedDataOpened}
          onClose={() => {
            setShowBreachedDataOpened(false);
          }}
          title={"Breached Data for " + breachName + "breach"}
          zIndex={1000}
          size="1000px"
        >
          <Box sx={{ margin: "20px", width: "100%", minHeight: "60vh" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <TextInput
                placeholder="Search by any field"
                mb="md"
                icon={<IconSearch size={14} stroke={1.5} />}
                value={breachedDataSearch}
                onChange={handleSearchChangeForBreachedData}
                sx={{ width: "300px" }}
              />
            </Box>
            <ScrollArea>
              <Table
                horizontalSpacing="md"
                verticalSpacing="xs"
                sx={{ tableLayout: "fixed", width: "100%" }}
              >
                <thead>
                  <tr>
                    <Th
                      sorted={breachedDataSortBy === "email"}
                      reversed={breachedDataReverseSortDirection}
                      onSort={() => {
                        setSortingForBreachedData("email");
                      }}
                    >
                      Email
                    </Th>
                    <Th
                      sorted={breachedDataSortBy === "password"}
                      reversed={breachedDataReverseSortDirection}
                      onSort={() => {
                        setSortingForBreachedData("password");
                      }}
                    >
                      Password
                    </Th>
                    <Th
                      sorted={breachedDataSortBy === "username"}
                      reversed={breachedDataReverseSortDirection}
                      onSort={() => {
                        setSortingForBreachedData("username");
                      }}
                    >
                      Username
                    </Th>
                    <Th
                      sorted={breachedDataSortBy === "phone"}
                      reversed={breachedDataReverseSortDirection}
                      onSort={() => {
                        setSortingForBreachedData("phone");
                      }}
                    >
                      Phone
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {breachedDataSortedData.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        No data found
                      </td>
                    </tr>
                  ) : (
                    breachedDataSortedData.map((row, index) => (
                      <tr key={index}>
                        <td>
                          {row.email === "" ? (
                            <Badge variant="outline" color="red">
                              Not Available
                            </Badge>
                          ) : (
                            row.email
                          )}
                        </td>
                        <td>
                          {row.password === "" ? (
                            <Badge variant="outline" color="red">
                              Not Available
                            </Badge>
                          ) : (
                            row.password
                          )}
                        </td>
                        <td>
                          {row.username === "" ? (
                            <Badge variant="outline" color="red">
                              Not Available
                            </Badge>
                          ) : (
                            row.username
                          )}
                        </td>
                        <td>
                          {row.phone === "" ? (
                            <Badge variant="outline" color="red">
                              Not Available
                            </Badge>
                          ) : (
                            row.phone
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </ScrollArea>
          </Box>
        </Modal>

        <Box w="100%" h="90%">
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
              onClick={() => setAddOpened(true)}
            >
              Add Breach
            </Button>
          </Box>
          <ScrollArea w="100%" h="100%">
            <Table
              horizontalSpacing="md"
              verticalSpacing="xs"
              sx={{ tableLayout: "auto", width: "100%" }}
            >
              <thead>
                <tr>
                  <Th
                    sorted={sortBy === "name"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("name")}
                  >
                    Name
                  </Th>
                  <Th
                    sorted={sortBy === "domain"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("domain")}
                  >
                    Domain
                  </Th>
                  <Th
                    sorted={sortBy === "breachDate"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("breachDate")}
                  >
                    Breach Date
                  </Th>
                  <Th
                    sorted={sortBy === "compromisedAccounts"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("compromisedAccounts")}
                  >
                    Accounts
                  </Th>
                  <Th
                    sorted={sortBy === "createdAt"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("createdAt")}
                  >
                    Added At
                  </Th>
                  <th>Actions</th>
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

export default ManageBreaches;
