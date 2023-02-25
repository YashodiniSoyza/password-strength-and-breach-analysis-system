import {
  Box,
  Paper,
  Title,
  Text,
  TextInput,
  ActionIcon,
  useMantineTheme,
  Select,
  Flex,
  Loader,
  Card,
  Image,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconSearch,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BreachAPI from "../../api/BreachAPI";
import UserAPI from "../../api/UserAPI";
import { HomeStats, UserHeaderMenu } from "../../components";
const Home: React.FC = () => {
  const theme = useMantineTheme();
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
              <Title>{breach.name}</Title>
              <Text mt={10}>{breach.description}</Text>
            </Box>
            <Box mt={20}>
              <Text>Domain: {breach.domain}</Text>
              <Text>Breach date: {breach.breachDate.slice(0, 10)}</Text>
              <Text>Date added: {breach.createdAt.slice(0, 10)}</Text>
              <Text>Compromised accounts: {breach.compromisedAccounts}</Text>
              <Text>Compromised data: {breach.compromisedData}</Text>
            </Box>
          </Box>
        </Flex>
      </Card>
    );
  });

  return (
    <Box>
      <UserHeaderMenu />
      <Box>
        <Paper shadow="md" p="xs" m="md" ta="center" h="87vh">
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
              {
                label: "pwned usernames",
                stats: stats.usernames
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                icon: "username",
              },
              {
                label: "pwned phone numbers",
                stats: stats.phoneNumbers
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                icon: "phone",
              },
            ]}
          />
          <Title mt={20}>Have I Been Pwned?</Title>
          <Text mb={30}>
            Check if your email, username, phone number or password has been
            compromised in a data breach.
          </Text>
          <Flex direction="row" align="center" justify="center" mt={20}>
            <Text>I want to check if my</Text>
            <Select
              m="0 10px 0 10px"
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
            <Text>has been compromised.</Text>
          </Flex>
          <TextInput
            icon={<IconSearch size={24} stroke={2} />}
            radius="xl"
            size="xl"
            w="60%"
            m="20px auto 20px auto"
            rightSection={
              <ActionIcon
                size={48}
                radius="xl"
                color={theme.primaryColor}
                variant="filled"
                mr={20}
                onClick={() => handleSearch()}
              >
                {theme.dir === "ltr" ? (
                  <IconArrowRight size={24} stroke={2} />
                ) : (
                  <IconArrowLeft size={24} stroke={2} />
                )}
              </ActionIcon>
            }
            placeholder={"Enter your " + selectOption}
            rightSectionWidth={42}
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Box>
            {isLoading && (
              <Box>
                <Loader size="md" m="auto" />
              </Box>
            )}
            {isBreachedTrue && (
              <Box>
                <Title color="red" order={3} m="10px 0 10px 0">
                  Oh bad news - You have been pwned!
                </Title>
                <Text color="red" m="10px 0 10px 0">
                  Your {selectOption} has been compromised in a{" "}
                  {breaches.length} data breach.
                </Text>
                {selectOption === "password" && (
                  <Box>
                    <Text>
                      You can use our{" "}
                      <Link to={"/password-generator"}>
                        password generator tool
                      </Link>{" "}
                      for generate secure, unique passwords for every account.
                    </Text>
                  </Box>
                )}
                <Box ta="left" ml="sm">
                  <Title order={2}>Breaches you were pwned in:</Title>
                </Box>
                {breachesList}
              </Box>
            )}
            {isBreachedFalse && (
              <Box>
                <Title color="green" order={3} m="10px 0 10px 0">
                  Great news - No pwnage found!
                </Title>
                <Text color="green" m="10px 0 10px 0">
                  Your {selectOption} has not been compromised in any data
                  breach.
                </Text>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Home;
