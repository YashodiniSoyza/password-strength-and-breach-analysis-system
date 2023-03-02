import {
  Box,
  Paper,
  Title,
  Text,
  TextInput,
  Select,
  Flex,
  Loader,
  Card,
  Image,
  createStyles,
  Container,
  Button,
  Alert,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheck,
  IconDots,
  IconSearch,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BreachAPI from "../../api/BreachAPI";
import UserAPI from "../../api/UserAPI";
import { HomeStats, UserHeaderMenu, Hero } from "../../components";
import { Dots } from "./Dots";
import HOME_BACKGROUND from "../../assets/home-background.jpg";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: 20,
    paddingBottom: 20,

    "@media (max-width: 755px)": {
      paddingTop: 80,
      paddingBottom: 60,
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  dots: {
    position: "absolute",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],

    "@media (max-width: 755px)": {
      display: "none",
    },
  },

  dotsLeft: {
    left: 0,
    top: 0,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    "@media (max-width: 520px)": {
      fontSize: 28,
      textAlign: "left",
    },
  },

  subTitle: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: 30,
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    "@media (max-width: 520px)": {
      fontSize: 28,
      textAlign: "left",
    },
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
  },

  description: {
    textAlign: "center",

    "@media (max-width: 520px)": {
      textAlign: "left",
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",

    "@media (max-width: 520px)": {
      flexDirection: "column",
    },
  },

  control: {
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    "@media (max-width: 520px)": {
      height: 42,
      fontSize: theme.fontSizes.md,

      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

const Home: React.FC = () => {
  const [selectOption, setSelectOption] = useState<string | null>("email");
  const [value, setValue] = useState<string>("");
  const [isBreachedTrue, setIsBreachedTrue] = useState<boolean>(false);
  const [isBreachedFalse, setIsBreachedFalse] = useState<boolean>(false);
  const [breaches, setBreaches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stats, setStats] = useState({
    breaches: 0,
    accounts: 0,
    emails: 0,
    passwords: 0,
    usernames: 0,
    phoneNumbers: 0,
  });
  const { classes } = useStyles();

  useEffect(() => {
    const fetchStats = async () => {
      const response = await UserAPI.getHomeStats();
      const data = response.data;
      setStats({
        breaches: data.breaches,
        accounts: data.accounts,
        emails: data.emails,
        passwords: data.passwords,
        usernames: data.usernames,
        phoneNumbers: data.phoneNumbers,
      });
    };
    fetchStats();
  }, []);

  const handleSearch = () => {
    setIsBreachedTrue(false);
    setIsBreachedFalse(false);
    setIsLoading(true);

    if (value === "") {
      showNotification({
        id: "searching",
        color: "red",
        title: "Search failed!",
        message:
          "You have not entered any value to search for. Please enter a value and try again.",
        icon: <IconAlertTriangle size={16} />,
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }
    showNotification({
      id: "searching",
      loading: true,
      title: "Searching...",
      message:
        "We are searching for your " +
        selectOption +
        " in our database. Please wait...",
      autoClose: false,
      disallowClose: true,
    });
    if (selectOption === "email") {
      BreachAPI.searchEmail(value)
        .then(async (res) => {
          const breachIds = res.data.map((breach: any) => breach.breachId);
          const uniqueBreachIds = breachIds.filter(
            (item: any, index: any) => breachIds.indexOf(item) === index
          );
          if (uniqueBreachIds.length !== 0) {
            const breaches = await BreachAPI.getBreachesByIds(uniqueBreachIds);
            setBreaches(breaches.data);
            setIsBreachedTrue(true);
          } else {
            setIsBreachedFalse(true);
          }
          updateNotification({
            id: "searching",
            color: "teal",
            title: "Search complete!",
            message:
              "We have successfully searched for your email in our databases.",
            icon: <IconCheck size={16} />,
            autoClose: 3000,
          });
          setIsLoading(false);
        })
        .catch((err) => {
          updateNotification({
            id: "searching",
            color: "red",
            title: "Search failed!",
            message:
              "We have failed to search for your email in our databases. Please try again later.",
            icon: <IconAlertTriangle size={16} />,
            autoClose: 3000,
          });
          setIsLoading(false);
        });
    } else if (selectOption === "username") {
      BreachAPI.searchUsername(value)
        .then(async (res) => {
          const breachIds = res.data.map((breach: any) => breach.breachId);
          const uniqueBreachIds = breachIds.filter(
            (item: any, index: any) => breachIds.indexOf(item) === index
          );
          if (uniqueBreachIds.length !== 0) {
            const breaches = await BreachAPI.getBreachesByIds(uniqueBreachIds);
            setBreaches(breaches.data);
          } else {
            setIsBreachedFalse(true);
          }
          updateNotification({
            id: "searching",
            color: "teal",
            title: "Search complete!",
            message:
              "We have successfully searched for your username in our databases.",
            icon: <IconCheck size={16} />,
            autoClose: 3000,
          });
          setIsLoading(false);
        })
        .catch((err) => {
          updateNotification({
            id: "searching",
            color: "red",
            title: "Search failed!",
            message:
              "We have failed to search for your username in our databases. Please try again later.",
            icon: <IconAlertTriangle size={16} />,
            autoClose: 3000,
          });
          setIsLoading(false);
        });
    } else if (selectOption === "phone") {
      BreachAPI.searchPhone(value)
        .then(async (res) => {
          const breachIds = res.data.map((breach: any) => breach.breachId);
          const uniqueBreachIds = breachIds.filter(
            (item: any, index: any) => breachIds.indexOf(item) === index
          );
          if (uniqueBreachIds.length !== 0) {
            const breaches = await BreachAPI.getBreachesByIds(uniqueBreachIds);
            setBreaches(breaches.data);
            setIsBreachedTrue(true);
          } else {
            setIsBreachedFalse(true);
          }
          updateNotification({
            id: "searching",
            color: "teal",
            title: "Search complete!",
            message:
              "We have successfully searched for your phone number in our databases.",
            icon: <IconCheck size={16} />,
            autoClose: 3000,
          });
          setIsLoading(false);
        })
        .catch((err) => {
          updateNotification({
            id: "searching",
            color: "red",
            title: "Search failed!",
            message:
              "We have failed to search for your phone number in our databases. Please try again later.",
            icon: <IconAlertTriangle size={16} />,
            autoClose: 3000,
          });
          setIsLoading(false);
        });
    } else if (selectOption === "password") {
      BreachAPI.searchPassword(value)
        .then(async (res) => {
          const breachIds = res.data.map((breach: any) => breach.breachId);
          const uniqueBreachIds = breachIds.filter(
            (item: any, index: any) => breachIds.indexOf(item) === index
          );
          if (uniqueBreachIds.length !== 0) {
            const breaches = await BreachAPI.getBreachesByIds(uniqueBreachIds);
            setBreaches(breaches.data);
            setIsBreachedTrue(true);
          } else {
            setIsBreachedFalse(true);
          }
          updateNotification({
            id: "searching",
            color: "teal",
            title: "Search complete!",
            message:
              "We have successfully searched for your password in our databases.",
            icon: <IconCheck size={16} />,
            autoClose: 3000,
          });
          setIsLoading(false);
        })
        .catch((err) => {
          updateNotification({
            id: "searching",
            color: "red",
            title: "Search failed!",
            message:
              "We have failed to search for your password in our databases. Please try again later.",
            icon: <IconAlertTriangle size={16} />,
            autoClose: 3000,
          });
          setIsLoading(false);
        });
    }
  };

  const breachesList = breaches.map((breach: any) => {
    return (
      <Card withBorder p="xl" radius="md" m="sm">
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          w="100%"
          h="100%"
        >
          <Box w="200px">
            <Image src={breach.logo} alt={breach.name} />
          </Box>
          <Box w="80%" h="100%" ta="left">
            <Box>
              <Title className={classes.subTitle} ta="left">
                {breach.name}
              </Title>
              <Text mt={10} weight={600}>
                {breach.description}
              </Text>
            </Box>
            <Box mt={20}>
              <Text weight={600}>Domain: {breach.domain}</Text>
              <Text weight={600}>
                Breach date: {breach.breachDate.slice(0, 10)}
              </Text>
              <Text weight={600}>
                Date added: {breach.createdAt.slice(0, 10)}
              </Text>
              <Text weight={600}>
                Compromised accounts: {breach.compromisedAccounts}
              </Text>
              <Text weight={600}>
                Compromised data: {breach.compromisedData}
              </Text>
            </Box>
          </Box>
        </Flex>
      </Card>
    );
  });

  return (
    <Box>
      <UserHeaderMenu />
      <Hero
        background={HOME_BACKGROUND}
        title={"Check if Your Personal Data Has Been Compromised"}
        description={
          "Have you ever wondered if your personal data, such as your email address or password, has been stolen and sold on the dark web? With our powerful search engine, you can quickly and easily check if your data has been compromised in a data breach."
        }
        buttonLabel={"Check Now!"}
        buttonLink={"#check"}
      />
      <Box>
        <Paper shadow="md" p="xs" m="md" ta="center" mih={650}>
          <HomeStats
            data={[
              {
                label: "Toatal Breaches",
                stats: stats.breaches
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                icon: "breach",
              },
              {
                label: "Total accounts",
                stats: stats.accounts
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                icon: "user",
              },
              {
                label: "pwned emails",
                stats: stats.emails
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                icon: "email",
              },
              {
                label: "pwned passwords",
                stats: stats.passwords
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                icon: "password",
              },
            ]}
            width="100%"
          />
          <Container className={classes.wrapper} size={1400}>
            <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
            <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
            <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
            <Dots className={classes.dots} style={{ left: 0, top: 280 }} />
            <Dots className={classes.dots} style={{ right: 0, top: 0 }} />
            <Dots className={classes.dots} style={{ right: 60, top: 0 }} />
            <Dots className={classes.dots} style={{ right: 0, top: 140 }} />
            <Dots className={classes.dots} style={{ right: 0, top: 280 }} />
            <Dots className={classes.dots} style={{ left: 100, top: 280 }} />
            <Dots className={classes.dots} style={{ right: 100, top: 280 }} />

            <div className={classes.inner} id="check">
              <Title className={classes.title}>
                Search for your compromised accounts
              </Title>
              <Container p={0} size={600}>
                <Text size="lg" color="dimmed" className={classes.description}>
                  We will search for your {selectOption} in our database of
                  compromised accounts. If your {selectOption} has been
                  compromised, we will show you the details of the breach.
                </Text>
              </Container>
              <Select
                m="10px auto 10px auto"
                radius="xl"
                size="xl"
                w="70%"
                placeholder="Select option"
                data={[
                  { label: "Email", value: "email" },
                  { label: "Username", value: "username" },
                  { label: "Phone number", value: "phone" },
                  { label: "Password", value: "password" },
                ]}
                value={selectOption}
                onChange={(value) => {
                  setIsBreachedTrue(false);
                  setIsBreachedFalse(false);
                  setSelectOption(value);
                }}
              />
              <TextInput
                icon={<IconSearch size={24} stroke={2} />}
                radius="xl"
                size="xl"
                w="70%"
                m="20px auto 20px auto"
                placeholder={"Enter your " + selectOption}
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <div className={classes.controls}>
                <Button
                  className={classes.control}
                  size="lg"
                  variant="default"
                  color="gray"
                  w="200px"
                  rightIcon={<IconDots size={24} stroke={2} />}
                  onClick={() => {
                    setIsBreachedTrue(false);
                    setIsBreachedFalse(false);
                    setValue("");
                  }}
                >
                  Clear
                </Button>
                <Button
                  className={classes.control}
                  size="lg"
                  onClick={() => handleSearch()}
                  rightIcon={<IconSearch size={24} stroke={2} />}
                  w="200px"
                >
                  Check now
                </Button>
              </div>
            </div>
          </Container>
          <Box>
            {isLoading && (
              <Box>
                <Loader size="md" m="auto" />
              </Box>
            )}
            {isBreachedTrue && (
              <Box>
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Oh bad news - You have been pwned!"
                  color="red"
                  ta="left"
                  w="70%"
                  m="10px auto 20px auto"
                  variant="filled"
                >
                  <Text size="lg" color="white" weight={700}>
                    Your {selectOption} has been compromised in a{" "}
                    {breaches.length} data breach.
                  </Text>
                  {selectOption === "password" && (
                    <Box>
                      <Text weight={700}>
                        You can use our{" "}
                        <Link
                          to={"/password-generator"}
                          style={{ textDecoration: "inherit", color: "black" }}
                        >
                          password generator tool
                        </Link>{" "}
                        for generate secure, unique passwords for every account.
                      </Text>
                    </Box>
                  )}
                </Alert>
                <Box ta="left" ml="sm">
                  <Title order={4} className={classes.subTitle}>
                    Breaches you were pwned in:
                  </Title>
                </Box>
                {breachesList}
              </Box>
            )}
            {isBreachedFalse && (
              <Box>
                <Alert
                  icon={<IconCheck size={16} />}
                  title="Great news - No pwnage found!"
                  color="green"
                  ta="left"
                  w="70%"
                  m="10px auto 10px auto"
                  variant="filled"
                >
                  <Text size="lg" color="white" weight={700}>
                    Your {selectOption} has not been compromised in any data
                    breach.
                  </Text>
                </Alert>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Home;
