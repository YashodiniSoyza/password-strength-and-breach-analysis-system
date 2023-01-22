import { createStyles, Navbar, Group, Code } from "@mantine/core";
import {
  IconSettings,
  IconLogout,
  IconLayoutDashboard,
  IconShieldLock,
  IconUsers,
} from "@tabler/icons";
import LOGO from "../../assets/favicon.png";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import AdminProfile from "../AdminProfile";
import DEFAULTPROFILE from "../../assets/defaultprofile.png";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: "light",
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  };
});

const data = [
  { link: "/admin/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  {
    link: "/admin/manage-admins",
    label: "Administrators",
    icon: IconShieldLock,
  },
  { link: "/admin/manage-users", label: "Users", icon: IconUsers },
  { link: "/admin/settings", label: "Settings", icon: IconSettings },
];

const CustomLink: React.FC<{ to: string; item: any }> = ({ to, item }) => {
  const { classes, cx } = useStyles();
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: true });
  console.log(match);

  return (
    <Link
      className={cx(classes.link, {
        [classes.linkActive]: item.link === match?.pathname,
      })}
      to={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  );
};

const AdminSideBar: React.FC = () => {
  const { classes } = useStyles();

  const links = data.map((item) => (
    <CustomLink to={item.link} item={item} key={item.label} />
  ));

  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  return (
    <Navbar height={"100%"} width={{ sm: 300 }} p="md">
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <img src={LOGO} alt="logo" width="50" height="50" />
          <Code sx={{ fontWeight: 700 }}>v1.0.0</Code>
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <AdminProfile
          image={DEFAULTPROFILE}
          name={admin.name}
          email={admin.email}
          icon={<IconShieldLock/>}
        />
        <Link to="/logout" className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </Link>
      </Navbar.Section>
    </Navbar>
  );
};

export default AdminSideBar;
