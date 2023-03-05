import {
  Box,
  Paper,
  Title,
  Text,
  TextInput,
  Flex,
  Loader,
  Card,
  Image,
  createStyles,
  Container,
  Button,
  Alert,
  Progress,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheck,
  IconDots,
  IconSearch,
} from "@tabler/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import BreachAPI from "../../api/BreachAPI";
import { UserHeaderMenu, Hero } from "../../components";
import { Dots } from "./Dots";
import IP_BACKGROUND from "../../assets/ip-background.png";
import AbuseIPAPI from "../../api/AbuseIPAPI";
import ReactCountryFlag from "react-country-flag";
var countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

interface IPCheckData {
  ipAddress: string;
  totalReports: number;
  lastReportedAt: string;
  isPublic: boolean;
  ipVersion: number;
  isWhitelisted: boolean;
  abuseConfidenceScore: number;
  countryCode: string;
  usageType: string;
  isp: string;
  domain: string;
  hostnames: string[];
  numDistinctUsers: number;
}

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

  resultTitle: {
    fontWeight: 600,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
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

const IPCheck: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IPCheckData | null>(null);
  const { classes } = useStyles();

  const handleSearch = () => {
    setIsLoading(true);

    if (value === "") {
      showNotification({
        id: "searching",
        color: "red",
        title: "Search failed!",
        message:
          "You have not entered any IP Address  to search for. Please enter an IP Address and try again.",
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
        "We are searching for the IP Address you have entered in our databases. This may take a few seconds.",
      autoClose: false,
      disallowClose: true,
    });
    AbuseIPAPI.checkIP(value)
      .then((res) => {
        setData(res.data.data);
        updateNotification({
          id: "searching",
          color: "teal",
          title: "Search complete!",
          message:
            "We have successfully searched for the IP Address you have entered in our databases. Please see the results below.",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        updateNotification({
          id: "searching",
          color: "red",
          title: "Search failed!",
          message:
            "We have failed to search for the IP Address you have entered in our databases. Please try again later.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 3000,
        });
        setIsLoading(false);
      });
  };

  return (
    <Box>
      <UserHeaderMenu />
      <Hero
        background={IP_BACKGROUND}
        title={"Protect Your Network with Abuse IP Checker"}
        description={
          "Use Abuse IP Checker to identify and block IP addresses with a history of abusive behavior. This powerful tool is trusted by security professionals and website owners worldwide to keep their networks and users safe from cyber threats. Stay ahead of the bad guys and protect your network with Abuse IP Checker."
        }
        buttonLabel={"Check Now!"}
        buttonLink={"#check"}
      />
      <Box>
        <Paper shadow="md" p="xs" m="md" ta="center" mih={650}>
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
                Check IP Reputation with Abuse IP Checker
              </Title>
              <Container p={0} size={600}>
                <Text size="lg" color="dimmed" className={classes.description}>
                  Use Abuse IP Checker to check the reputation of any IP address
                  and determine if it has a history of abusive behavior.
                </Text>
              </Container>
              <TextInput
                icon={<IconSearch size={24} stroke={2} />}
                radius="xl"
                size="xl"
                w="70%"
                m="20px auto 20px auto"
                placeholder={"Enter IP Address"}
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
          </Box>
          {data && (
            <Card shadow="sm" p="lg" radius="md" withBorder w="60%" m="auto">
              {data.lastReportedAt === null ? (
                <>
                  <Alert
                    icon={<IconCheck size={16} />}
                    title={
                      <Title
                        size="xl"
                        color="white"
                        sx={{
                          fontSize: 18,
                        }}
                      >
                        {data.ipAddress} was not found in our database.
                      </Title>
                    }
                    color="green"
                    ta="left"
                    w="95%"
                    m="10px auto 20px auto"
                    variant="filled"
                  >
                    <Text size="md" color="white" fw={600}>
                      This IP was not found in our database. This means that it
                      has not been reported as an abusive IP address.
                    </Text>
                  </Alert>
                  <Box w="70%" ml={30}>
                    <Flex direction="row" justify="left" align="center">
                      <Text size="lg" className={classes.resultTitle}>
                        ISP:
                      </Text>
                      <Text
                        size="lg"
                        color="dimmed"
                        sx={{
                          marginLeft: 10,
                        }}
                      >
                        {data.isp ? data.isp : "Unknown"}
                      </Text>
                    </Flex>
                    <Flex direction="row" justify="left" align="center">
                      <Text size="lg" className={classes.resultTitle}>
                        Usage Type:
                      </Text>
                      <Text
                        size="lg"
                        color="dimmed"
                        sx={{
                          marginLeft: 10,
                        }}
                      >
                        {data.usageType ? data.usageType : "Unknown"}
                      </Text>
                    </Flex>
                    <Flex direction="row" justify="left" align="center">
                      <Text size="lg" className={classes.resultTitle}>
                        Domain Name:
                      </Text>
                      <Text
                        size="lg"
                        color="dimmed"
                        sx={{
                          marginLeft: 10,
                        }}
                      >
                        {data.domain ? data.domain : "Unknown"}
                      </Text>
                    </Flex>
                    <Flex direction="row" justify="left" align="center">
                      <Text size="lg" className={classes.resultTitle}>
                        Country:
                      </Text>
                      <Text
                        size="lg"
                        color="dimmed"
                        sx={{
                          marginLeft: 10,
                        }}
                      >
                        <Image
                          src={
                            data.countryCode
                              ? `https://www.countryflags.io/${data.countryCode}/flat/64.png`
                              : "https://www.countryflags.io/Unknown/flat/64.png"
                          }
                          w={20}
                          h={20}
                          mr={10}
                        />
                        {data.countryCode ? data.countryCode : "Unknown"}
                      </Text>
                    </Flex>
                  </Box>
                  <Text size="lg" color="dimmed" ml={30} mt={20}>
                    Congratulations! We have checked the reputation of the IP
                    address you entered and found no evidence of abusive
                    behavior. This means that the IP address has not been
                    involved in activities such as spamming, hacking, or other
                    malicious behavior. However, please note that IP reputation
                    can change over time, so we recommend that you continue to
                    monitor the activity associated with this IP address to
                    ensure that it remains safe and trustworthy.
                  </Text>
                </>
              ) : (
                <>
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    title={
                      <Title
                        size="xl"
                        color="white"
                        sx={{
                          fontSize: 18,
                        }}
                      >
                        {data.ipAddress} was found in our database.
                      </Title>
                    }
                    color="red"
                    ta="left"
                    w="90%"
                    m="10px auto 10px auto"
                    variant="filled"
                  >
                    <Text size="md" color="white" fw={600}>
                      This IP was reported {data.totalReports} times in the last
                      year. Confidence of abuse is {data.abuseConfidenceScore}%.
                    </Text>
                  </Alert>
                  <Progress
                    value={data.abuseConfidenceScore}
                    label={data.abuseConfidenceScore + "%"}
                    color={
                      data.abuseConfidenceScore < 10
                        ? "green"
                        : data.abuseConfidenceScore < 30
                        ? "yellow"
                        : data.abuseConfidenceScore < 50
                        ? "orange"
                        : "red"
                    }
                    size="xl"
                    radius="xl"
                    w="95%"
                    h="30px"
                    m="10px auto 10px auto"
                  />
                  <Box w="70%" ml={30}>
                    <Flex direction="row" justify="left" align="center">
                      <Text size="lg" className={classes.resultTitle}>
                        ISP:
                      </Text>
                      <Text
                        size="lg"
                        color="dimmed"
                        sx={{
                          marginLeft: 10,
                        }}
                      >
                        {data.isp ? data.isp : "Unknown"}
                      </Text>
                    </Flex>
                    <Flex direction="row" justify="left" align="center">
                      <Text size="lg" className={classes.resultTitle}>
                        Usage Type:
                      </Text>
                      <Text
                        size="lg"
                        color="dimmed"
                        sx={{
                          marginLeft: 10,
                        }}
                      >
                        {data.usageType ? data.usageType : "Unknown"}
                      </Text>
                    </Flex>
                    <Flex direction="row" justify="left" align="center">
                      <Text size="lg" className={classes.resultTitle}>
                        Domain Name:
                      </Text>
                      <Text
                        size="lg"
                        color="dimmed"
                        sx={{
                          marginLeft: 10,
                        }}
                      >
                        {data.domain ? data.domain : "Unknown"}
                      </Text>
                    </Flex>
                    <Flex direction="row" justify="left" align="center">
                      <Text size="lg" className={classes.resultTitle}>
                        Country:
                      </Text>
                      <Text
                        size="lg"
                        color="dimmed"
                        sx={{
                          marginLeft: 10,
                        }}
                      >
                        {data.countryCode
                          ? countries.getName(data.countryCode, "en")
                          : "Unknown"}
                      </Text>
                      <ReactCountryFlag
                        countryCode={data.countryCode}
                        svg
                        style={{
                          width: "1.5em",
                          height: "1.5em",
                          marginLeft: 10,
                        }}
                      />
                    </Flex>
                    <Flex direction="row" justify="left" align="center">
                      <Text size="lg" className={classes.resultTitle}>
                        Last Reported At:
                      </Text>
                      <Text
                        size="lg"
                        color="dimmed"
                        sx={{
                          marginLeft: 10,
                        }}
                      >
                        {data.lastReportedAt.split("T")[0] +
                          " " +
                          data.lastReportedAt.split("T")[1].split("+")[0]}
                      </Text>
                    </Flex>
                  </Box>
                  <Text size="lg" color="dimmed" ml={30} mt={20}>
                    We have detected that the IP address you entered has been
                    reported for abusive behavior. This may indicate that the IP
                    address has been involved in activities such as spamming,
                    hacking, or other malicious behavior.
                  </Text>
                </>
              )}
            </Card>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default IPCheck;
