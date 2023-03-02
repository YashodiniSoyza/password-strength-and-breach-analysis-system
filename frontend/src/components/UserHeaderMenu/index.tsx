import { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Button,
  Menu,
  UnstyledButton,
  Avatar,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import LOGO from "../../assets/favicon.png";
import DEFAULTPROFILE from "../../assets/defaultprofile.png";
import {
  IconAlertTriangle,
  IconCheck,
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconTrash,
} from "@tabler/icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import UserAPI from "../../api/UserAPI";

const HEADER_HEIGHT = 60;

const links = [
  { link: "/", label: "Home" },
  { link: "/password-generator", label: "Generate Password" },
  { link: "/encrypt-decrypt/aes", label: "Encrypt and Decrypt" },
  { link: "/user/vault", label: "Vault" },
];

const CustomLink: React.FC<{
  to: string;
  item: any;
  onClick: any;
  noHero?: boolean;
}> = ({ to, item, onClick, noHero }) => {
  const useStyles = createStyles((theme) => ({
    link: {
      display: "block",
      lineHeight: 1,
      padding: "8px 12px",
      borderRadius: theme.radius.sm,
      textDecoration: "none",
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[0]
          : theme.colors.gray[7],
      fontSize: theme.fontSizes.sm,
      fontWeight: 500,

      "&:hover": {
        boxShadow: `0 0 0 1px ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0]
        }`,
        backgroundColor: noHero ? theme.colors.gray[3] : "transparent",
      },

      [theme.fn.smallerThan("sm")]: {
        borderRadius: 0,
        padding: theme.spacing.md,
      },
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  }));
  const { classes, cx } = useStyles();
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <Link
      className={cx(classes.link, {
        [classes.linkActive]: item.link === match?.pathname,
      })}
      to={item.link}
      key={item.label}
      onClick={onClick}
    >
      <Text color={match?.pathname === item.link || noHero ? "black" : "white"}>
        {item.label}
      </Text>
    </Link>
  );
};

interface UserHeaderMenuProps {
  noHero?: boolean;
}

const UserHeaderMenu: React.FC<UserHeaderMenuProps> = ({ noHero }) => {
  const useStyles = createStyles((theme) => ({
    root: {
      width: "100%",
      position: "relative",
      zIndex: 2500,
      backgroundColor: "transparent",
    },

    dropdown: {
      position: "absolute",
      top: HEADER_HEIGHT,
      left: 0,
      right: 0,
      zIndex: 0,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      borderTopWidth: 0,
      overflow: "hidden",

      [theme.fn.largerThan("sm")]: {
        display: "none",
      },
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "100%",
      width: "90%",
      maxWidth: 1200,
    },

    links: {
      [theme.fn.smallerThan("sm")]: {
        display: "none",
      },
    },

    burger: {
      [theme.fn.largerThan("sm")]: {
        display: "none",
      },
    },

    hiddenMobile: {
      [theme.fn.smallerThan("sm")]: {
        display: "none",
      },
    },

    user: {
      color: noHero ? "black" : "white",
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      transition: "background-color 100ms ease",

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
        color: "black",
      },
    },

    userActive: {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },
  }));
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const items = links.map((link) => (
    <CustomLink
      to={link.link}
      item={link}
      key={link.label}
      onClick={close}
      noHero={noHero}
    />
  ));

  //Open delete modal
  const openDeleteModal = (id: string) =>
    openConfirmModal({
      title: "Delete Your Account?",
      centered: false,
      zIndex: 3000,
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
              color: "red",
              title: "Account deleted successfully",
              message: "The account has been deleted, loggin out...",
              icon: <IconCheck size={16} />,
              autoClose: 2000,
            });
            setTimeout(() => {
              window.location.href = "/logout";
            }, 2000);
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
      },
    });

  return (
    <Header
      height={HEADER_HEIGHT}
      className={classes.root}
      withBorder={noHero ? true : false}
    >
      <Container className={classes.header}>
        <img src={LOGO} alt="logo" width="50" height="50" />
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Group>
          {(user && user.firstName && (
            <Menu
              width={260}
              position="bottom-end"
              transition="pop-top-right"
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group spacing={7}>
                    <Avatar
                      src={DEFAULTPROFILE}
                      alt={user.name}
                      radius="xl"
                      size={20}
                    />
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {user.firstName + " " + user.lastName}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Settings</Menu.Label>
                <Link
                  to="/user/settings"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>
                    Account settings
                  </Menu.Item>
                </Link>
                <Link
                  to="/logout"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Menu.Item icon={<IconLogout size={14} stroke={1.5} />}>
                    Logout
                  </Menu.Item>
                </Link>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  color="red"
                  icon={<IconTrash size={14} stroke={1.5} />}
                  onClick={() => {
                    const user = JSON.parse(
                      localStorage.getItem("user") || "{}"
                    );
                    openDeleteModal(user._id);
                  }}
                >
                  Delete account
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )) || (
            <Group className={classes.hiddenMobile}>
              <Link to="/login">
                <Button variant="default">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </Group>
          )}
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
        </Group>
        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
              {!(user && user.firstName) && (
                <Group position="center" grow pb="xl" px="md">
                  <Link to="/login">
                    <Button variant="default">Log in</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Sign up</Button>
                  </Link>
                </Group>
              )}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
};

export default UserHeaderMenu;
