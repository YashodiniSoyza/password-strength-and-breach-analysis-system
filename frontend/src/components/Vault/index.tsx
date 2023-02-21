import { showNotification, updateNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck, IconTrash, IconX } from "@tabler/icons";
import { useEffect, useState } from "react";
import UserAPI from "../../api/UserAPI";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import {
  Box,
  Button,
  Flex,
  Group,
  PasswordInput,
  TextInput,
  Text,
  createStyles,
  Image,
  Title,
  Center,
  Modal,
  Progress,
  Card,
  SimpleGrid,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import CryptoJS from "crypto-js";
import DATASECURITYIMAGE from "../../assets/data-security.png";

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing.xl * 2,
    margin: "50px auto",
    width: "70%",
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[3]
    }`,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: "column-reverse",
      padding: theme.spacing.xl,
    },
  },

  image: {
    maxWidth: "40%",

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  body: {
    paddingRight: theme.spacing.xl * 4,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      paddingRight: 0,
      marginTop: theme.spacing.xl,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
  },

  controls: {
    display: "flex",
    marginTop: theme.spacing.xl,
  },

  control: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
}));

const keySize = 256;
const iterations = 100;

const encrypt = (vault: any, iKey: any) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);

  const key = CryptoJS.PBKDF2(iKey, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const encrypted = CryptoJS.AES.encrypt(vault, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  const encryptedVault = salt.toString() + iv.toString() + encrypted.toString();
  return encryptedVault;
};

const decrypt = (vault: any, iKey: any) => {
  const salt = CryptoJS.enc.Hex.parse(vault.substr(0, 32));
  const iv = CryptoJS.enc.Hex.parse(vault.substr(32, 32));
  const encrypted = vault.substring(64);

  const key = CryptoJS.PBKDF2(iKey, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

let message = "Hello World";
let password = "Secret Password";
let encrypted = encrypt(message, password);
let decrypted = decrypt(encrypted, password);

console.log("Message: " + message);
console.log("Encrypted: " + encrypted);
console.log("Decrypted: " + decrypted);

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

//create vault mehhod that takes userSalt and masterPassword as parameters
const createVault = (userSalt: any, masterPassword: any) => {
  //vault is empty stringfied object
  const vault = JSON.stringify({
    accounts: [],
  });
  //concatenate userSalt and masterPassword
  const key = userSalt + masterPassword;
  //encrypt vault with key
  const encryptedVault = encrypt(vault, key);

  return encryptedVault;
};

const encryptVault = (userSalt: any, masterPassword: any, vault: any) => {
  //concatenate userSalt and masterPassword
  const key = userSalt + masterPassword;
  //encrypt vault with key
  const encryptedVault = encrypt(vault, key);

  return encryptedVault;
};

const decryptVault = (userSalt: any, masterPassword: any, vault: any) => {
  //concatenate userSalt and masterPassword
  const key = userSalt + masterPassword;
  //decrypt vault with key
  const decryptedVault = decrypt(vault, key);
  //convert stringified object to object
  if (decryptedVault === "") {
    showNotification({
      id: "decrypt-vault",
      color: "red",
      title: "Error creating vault",
      message: "Wrong master password",
      icon: <IconX size={16} />,
      autoClose: 3000,
    });
  }
  const vaultObject = JSON.parse(decryptedVault);

  return vaultObject;
};

interface VaultData {
  id: string;
  vault: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
}

interface DecryptedVault {
  accounts: {
    domain: string;
    username: string;
    hashedPassword: string;
  }[];
}

const Vault: React.FC = () => {
  const [vault, setVault] = useState<VaultData>({
    id: "",
    vault: "",
    salt: "",
    createdAt: "",
    updatedAt: "",
  });
  const [createMasterPasswordOpened, setCreateMasterPasswordOpened] =
    useState(false);
  const [decryptVaultOpened, setDecryptVaultOpened] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [isDecrypted, setIsDecrypted] = useState(false);
  const { classes } = useStyles();

  const form = useForm({
    initialValues: {
      vault: [
        {
          key: randomId(),
          domain: "",
          username: "",
          password: "",
        },
      ],
    },
  });

  const createVaultHandler = async (masterPassword: string) => {
    setCreateMasterPasswordOpened(false);
    showNotification({
      id: "create-vault",
      loading: true,
      title: "Creating your vault",
      message: "Please wait...",
      autoClose: false,
      disallowClose: true,
    });
    const encryptedVault = createVault(vault.salt, masterPassword);
    const values = {
      id: vault.id,
      vault: encryptedVault,
    };
    await UserAPI.updateVault(values)
      .then((res) => {
        setVault({
          ...vault,
          vault: encryptedVault,
        });
        form.removeListItem("vault", 0);
        setMasterPassword(masterPassword);
        updateNotification({
          id: "create-vault",
          color: "teal",
          title: "Vault created",
          message: "Your vault has been created",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      })
      .catch((err) => {
        updateNotification({
          id: "create-vault",
          color: "red",
          title: "Error creating vault",
          message: err.response.data.message,
          icon: <IconX size={16} />,
          autoClose: 3000,
        });
      });
  };

  const validateVault = (vault: DecryptedVault) => {
    let isValidated = true;
    vault.accounts.forEach((account) => {
      if (account.domain === "") {
        isValidated = false;
      }
      if (account.username === "") {
        isValidated = false;
      }
      if (account.hashedPassword === "") {
        isValidated = false;
      }
    });
    return isValidated;
  };

  const updateVaultHandler = async () => {
    //get vault from form
    const vaultFromForm = form.values.vault;
    //create vault object
    const vaultObject: DecryptedVault = {
      accounts: [],
    };
    //loop through vault from form and push to vault object
    vaultFromForm.forEach((account: any) => {
      vaultObject.accounts.push({
        domain: account.domain,
        username: account.username,
        hashedPassword: account.password,
      });
    });
    const isValidated = validateVault(vaultObject);

    if (!isValidated) {
      showNotification({
        id: "validate-vault",
        color: "red",
        title: "Error updating vault",
        message: "Please fill in all fields",
        icon: <IconX size={16} />,
        autoClose: 3000,
      });
      return;
    }
    //stringify vault object
    const vaultString = JSON.stringify(vaultObject);
    //encrypt vault
    const encryptedVault = encryptVault(
      vault.salt,
      masterPassword,
      vaultString
    );
    //update vault
    const values = {
      ...vault,
      vault: encryptedVault,
    };
    await UserAPI.updateVault(values)
      .then((res) => {
        setVault({
          ...vault,
          vault: encryptedVault,
        });
        showNotification({
          id: "update-vault",
          color: "teal",
          title: "Vault updated",
          message: "Your vault has been updated",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      })
      .catch((err) => {
        showNotification({
          id: "update-vault",
          color: "red",
          title: "Error updating vault",
          message: err.response.data.message,
          icon: <IconX size={16} />,
          autoClose: 3000,
        });
      });
  };
  const decryptVaultHandler = async (masterPassword: string) => {
    const decryptedVault = decryptVault(
      vault.salt,
      masterPassword,
      vault.vault
    );
    if (decryptedVault !== null) {
      form.removeListItem("vault", 0);
      if (decryptedVault.accounts.length > 0) {
        decryptedVault.accounts.forEach((account: any) => {
          form.insertListItem("vault", {
            key: randomId(),
            domain: account.domain,
            username: account.username,
            password: account.hashedPassword,
          });
        });
      }
      setIsDecrypted(true);
      setMasterPassword(masterPassword);
    }
    setDecryptVaultOpened(false);
  };

  useEffect(() => {
    const getVault = async () => {
      showNotification({
        id: "get-vault",
        loading: true,
        title: "Loading your vault",
        message: "Please wait...",
        autoClose: false,
        disallowClose: true,
      });
      await UserAPI.getVaultByUserId()
        .then((res) => {
          const vaultData: VaultData = {
            id: res.data[0]._id,
            vault: res.data[0].vault,
            salt: res.data[0].salt,
            createdAt: res.data[0].createdAt,
            updatedAt: res.data[0].updatedAt,
          };
          setVault(vaultData);
          updateNotification({
            id: "get-vault",
            color: "teal",
            title: "Vault loaded",
            message: "Your vault has been loaded",
            icon: <IconCheck size={16} />,
            autoClose: 3000,
          });
        })
        .catch((err) => {
          updateNotification({
            id: "get-vault",
            color: "red",
            title: "Error while loading the vault",
            message:
              "An error has occurred while loading your vault, please try again later",
            icon: <IconAlertTriangle size={16} />,
            autoClose: 3000,
          });
        });
    };
    getVault();
  }, []);

  const newMasterPasswordForm = useForm({
    validateInputOnChange: true,
    initialValues: {
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

  const decryptVaultForm = useForm({
    initialValues: {
      masterPassword: "",
    },
  });

  const strength = getStrength(newMasterPasswordForm.values.password);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(newMasterPasswordForm.values.password)}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: "0ms" } }}
        value={
          newMasterPasswordForm.values.password.length > 0 && index === 0
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

  //Open delete modal
  const openDeleteModal = (index: number) =>
    openConfirmModal({
      title: "Delete this password?",
      centered: false,
      zIndex: 1000,
      children: (
        <Text size="sm">
          Are you sure you want to delete this password? This action cannot be
          undone.
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
        form.removeListItem("vault", index);
        showNotification({
          title: "Deleted",
          message: "The password has been deleted",
          color: "red",
        });
      },
    });

  const fields = form.values.vault.map((field, index) => (
    <Card shadow="sm" p="xs" radius="md" withBorder key={field.key}>
      <Flex w="100%" direction="column" justify="space-between" align="center">
        <TextInput
          label="Domain"
          placeholder="Domain"
          required
          {...form.getInputProps(`vault.${index}.domain`)}
          w="90%"
        />
        <TextInput
          label="Username"
          placeholder="Username"
          required
          {...form.getInputProps(`vault.${index}.username`)}
          w="90%"
        />
        <PasswordInput
          label="Password"
          placeholder="Password"
          required
          {...form.getInputProps(`vault.${index}.password`)}
          w="90%"
        />
        <Button
          color="pink"
          size="md"
          onClick={() => openDeleteModal(index)}
          mt="10px"
          w="90%"
          leftIcon={<IconTrash size={16} />}
        >
          Delete
        </Button>
      </Flex>
    </Card>
  ));

  return (
    <Box>
      <Modal
        opened={createMasterPasswordOpened}
        onClose={() => {
          newMasterPasswordForm.reset();
          setCreateMasterPasswordOpened(false);
        }}
        title="Create a master password"
        zIndex={1000}
      >
        <form
          onSubmit={newMasterPasswordForm.onSubmit((values) => {
            createVaultHandler(values.password);
          })}
        >
          <PasswordInput
            placeholder="Your New password"
            label="New Password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{8,}"
            {...newMasterPasswordForm.getInputProps("password")}
          />
          <PasswordInput
            placeholder="Confirm your password"
            label="Confirm Password"
            {...newMasterPasswordForm.getInputProps("confirmPassword")}
          />
          <Group spacing={5} grow mt="xs" mb="md">
            {bars}
          </Group>
          <PasswordRequirement
            label="Has at least 8 characters"
            meets={newMasterPasswordForm.values.password.length > 7}
          />
          {checks}
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Create Master Password
          </Button>
        </form>
      </Modal>
      <Modal
        opened={decryptVaultOpened}
        onClose={() => {
          decryptVaultForm.reset();
          setDecryptVaultOpened(false);
        }}
        title="Enter your master password"
        zIndex={1000}
      >
        <form
          onSubmit={decryptVaultForm.onSubmit((values) => {
            decryptVaultHandler(values.masterPassword);
          })}
        >
          <PasswordInput
            placeholder="Enter your master password"
            label="Master Password"
            {...decryptVaultForm.getInputProps("masterPassword")}
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Create Master Password
          </Button>
        </form>
      </Modal>
      {vault.vault === "" ? (
        <Box className={classes.wrapper}>
          <Box className={classes.body}>
            <Title className={classes.title}>You are almost there!</Title>
            <Text weight={500} size="lg" mb={5}>
              You need to create a master password before you can start using
              your vault.
            </Text>
            <Text size="sm" color="dimmed">
              Your master password will be used to encrypt your vault, so make
              sure to remember it. We don't store your master password or a
              hashed version of it anywhere, so if you forget it, you will be
              not able to recover your vault.
            </Text>

            <Box className={classes.controls}>
              <Button
                className={classes.control}
                onClick={() => {
                  setCreateMasterPasswordOpened(true);
                }}
              >
                Create Master Password
              </Button>
            </Box>
          </Box>
          <Image src={DATASECURITYIMAGE} className={classes.image} />
        </Box>
      ) : (
        <Box m="auto" w="80%">
          <Group position="center" mt="md">
            <Button
              onClick={() => {
                form.insertListItem("vault", {
                  key: randomId(),
                  domain: "",
                  username: "",
                  password: "",
                });
              }}
            >
              Add New Password
            </Button>
          </Group>
          <Box>
            {form.values.vault.length === 0 ? (
              <Box ta="center">
                <Title>Your vault is empty!</Title>
                <Text size="sm" color="dimmed">
                  You can add as many passwords as you want to your vault, and
                  you can also delete them whenever you want.
                </Text>
              </Box>
            ) : isDecrypted ? (
              <Box>
                <SimpleGrid
                  cols={3}
                  breakpoints={[{ maxWidth: "xs", cols: 1 }]}
                  mt="xl"
                >
                  {fields}
                </SimpleGrid>
                <Group position="center" mt="md">
                  <Button
                    onClick={() => {
                      updateVaultHandler();
                    }}
                  >
                    Save Vault
                  </Button>
                </Group>
              </Box>
            ) : (
              <Box ta="center">
                <Title>Your vault is encrypted!</Title>
                <Text size="sm" color="dimmed">
                  You need to enter your master password to decrypt your vault.
                </Text>
                <Button
                  onClick={() => {
                    setDecryptVaultOpened(true);
                  }}
                >
                  Decrypt Vault
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Vault;
