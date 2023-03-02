import {
  TextInput,
  CopyButton,
  ActionIcon,
  Tooltip,
  Group,
  Box,
  Card,
  Flex,
  Slider,
  NumberInput,
  Checkbox,
  Progress,
  Text,
  Title,
  createStyles,
  Container,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
  IconCopy,
  IconRepeat,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import generator from "generate-password-browser";
import { showNotification } from "@mantine/notifications";
import StatsGridCrackTime from "../StatsGridCrackTime";
import React from "react";
import { Dots } from "./Dots";
const zxcvbn = require("zxcvbn");

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: 50,
    paddingBottom: 30,

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

interface PasswordGeneratorProps {
  length: number | undefined;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const generatePassword = ({
  length,
  uppercase,
  lowercase,
  numbers,
  symbols,
}: PasswordGeneratorProps) => {
  return generator.generate({
    length,
    uppercase,
    lowercase,
    numbers,
    symbols,
  });
};

const PasswordGenerator: React.FC = () => {
  const { classes } = useStyles();
  const [password, setPassword] = useState<string>(
    generatePassword({
      length: 10,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    })
  );
  const [howManyCharacters, setHowManyCharacters] = useState<
    number | undefined
  >(10);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [strength, setStrength] = useState(Object);

  useEffect(() => {
    setPassword(
      generatePassword({
        length: howManyCharacters,
        uppercase,
        lowercase,
        numbers,
        symbols,
      })
    );
  }, [howManyCharacters, uppercase, lowercase, numbers, symbols]);

  useEffect(() => {
    const strength = zxcvbn(password);
    setStrength(strength);
  }, [password]);

  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: "0ms" } }}
        value={
          strength.score === 0
            ? 0
            : strength.score === index + 1
            ? 100
            : strength.score > index + 1
            ? 100
            : 0
        }
        color={
          strength.score > 0
            ? strength.score > 3
              ? "teal"
              : strength.score > 1
              ? "yellow"
              : "red"
            : "gray"
        }
        key={index}
        size={4}
      />
    ));

  return (
    <Box mt={10} mb={10} id="password-generator">
      <Container className={classes.wrapper} size={1400}>
        <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
        <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

        <div className={classes.inner}>
          <Title className={classes.title}>
            <Text
              component="span"
              className={classes.highlight}
              inherit
              variant="gradient"
              gradient={{ from: "pink", to: "yellow" }}
            >
              Password Generator
            </Text>{" "}
            and{" "}
            <Text
              component="span"
              className={classes.highlight}
              inherit
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              Strength Checker
            </Text>
          </Title>

          <Container p={0} size="lg" mt={20}>
            <Text size="lg" color="dimmed" className={classes.description}>
              Creating a strong and unique password is essential for keeping
              your online accounts secure. Our password generator allows you to
              select the types of characters you want to include in your
              password such as uppercase letters, lowercase letters, numbers,
              and symbols, and choose your desired length using the slider.
            </Text>
            <br />
            <Text size="lg" color="dimmed" className={classes.description}>
              To ensure that your password is strong enough, we use a password
              strength estimator inspired by password crackers. This estimator
              uses pattern matching and conservative estimation to recognize and
              weigh common passwords, names, surnames, English words from
              Wikipedia, US television and movies, as well as other patterns
              like dates, repeats (aaa), sequences (abcd), keyboard patterns
              (qwertyuiop), and l33t speak.
            </Text>
            <br />
            <Text size="lg" color="dimmed" className={classes.description}>
              Our password generator will provide you with a strong, unique
              password that will help protect your online accounts. You can even
              check the estimated crack time for your password to get an idea of
              just how secure it is. So generate your password now and rest
              assured that your accounts are protected!
            </Text>
          </Container>
        </div>
      </Container>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        mr="auto"
        ml="auto"
        w="80%"
      >
        <Flex
          gap="xs"
          align="center"
          direction="row"
          wrap="wrap"
          justify="center"
          w="100%"
          h="120px"
        >
          <TextInput
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            w="55%"
            size="lg"
            rightSection={
              <>
                <CopyButton value={password} timeout={1000}>
                  {({ copied, copy }) => (
                    <Tooltip
                      label={copied ? "Copied" : "Copy"}
                      withArrow
                      position="right"
                    >
                      <ActionIcon
                        color={copied ? "teal" : "gray"}
                        onClick={copy}
                        mr="10px"
                      >
                        {copied ? (
                          <IconCheck size={32} />
                        ) : (
                          <IconCopy size={32} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
                <Tooltip label="Regenerate" withArrow position="right">
                  <ActionIcon
                    variant="transparent"
                    mr="40px"
                    onClick={() => {
                      setPassword(
                        generatePassword({
                          length: howManyCharacters,
                          uppercase,
                          lowercase,
                          numbers,
                          symbols,
                        })
                      );
                    }}
                  >
                    <IconRepeat size={32} />
                  </ActionIcon>
                </Tooltip>
              </>
            }
          />
        </Flex>
        <Flex
          gap="xs"
          align="center"
          direction="row"
          wrap="wrap"
          justify="center"
          w="100%"
          h="100px"
          mt={20}
        >
          <Slider
            value={
              password.length === howManyCharacters
                ? howManyCharacters
                : password.length
            }
            onChange={(value) => {
              setHowManyCharacters(value);
            }}
            min={1}
            max={100}
            w="50%"
          />
          <NumberInput
            min={1}
            max={100}
            value={
              password.length === howManyCharacters
                ? howManyCharacters
                : password.length
            }
            type="number"
            onChange={(value) => {
              setHowManyCharacters(value);
            }}
            w="100px"
          />
          <Flex
            gap="xs"
            align="center"
            direction="row"
            wrap="wrap"
            justify="center"
            w="100%"
          >
            <Checkbox
              label="Uppercase"
              checked={uppercase && password.match(/[A-Z]/g) ? true : false}
              error={true}
              onChange={(e) => {
                if (!lowercase && !numbers && !symbols) {
                  showNotification({
                    id: "password-generator",
                    color: "red",
                    title: "Error",
                    message: "You must select at least one option",
                    icon: <IconAlertTriangle size={16} />,
                    autoClose: 5000,
                  });
                } else {
                  setUppercase(e.currentTarget.checked);
                }
              }}
            />
            <Checkbox
              label="Lowercase"
              checked={lowercase && password.match(/[a-z]/g) ? true : false}
              error={true}
              onChange={(e) => {
                if (!uppercase && !numbers && !symbols) {
                  showNotification({
                    id: "password-generator",
                    color: "red",
                    title: "Error",
                    message: "You must select at least one option",
                    icon: <IconAlertTriangle size={16} />,
                    autoClose: 5000,
                  });
                } else {
                  setLowercase(e.currentTarget.checked);
                }
              }}
            />
            <Checkbox
              label="Numbers"
              checked={numbers && password.match(/[0-9]/g) ? true : false}
              error={true}
              onChange={(e) => {
                if (!uppercase && !lowercase && !symbols) {
                  showNotification({
                    id: "password-generator",
                    color: "red",
                    title: "Error",
                    message: "You must select at least one option",
                    icon: <IconAlertTriangle size={16} />,
                    autoClose: 5000,
                  });
                } else {
                  setNumbers(e.currentTarget.checked);
                }
              }}
            />
            <Checkbox
              label="Symbols"
              checked={
                symbols && password.match(/[^A-Za-z0-9]/g) ? true : false
              }
              error={true}
              onChange={(e) => {
                if (!uppercase && !lowercase && !numbers) {
                  showNotification({
                    id: "password-generator",
                    color: "red",
                    title: "Error",
                    message: "You must select at least one option",
                    icon: <IconAlertTriangle size={16} />,
                    autoClose: 5000,
                  });
                } else {
                  setSymbols(e.currentTarget.checked);
                }
              }}
            />
          </Flex>
          {!uppercase ||
          !lowercase ||
          !numbers ||
          !symbols ||
          strength.score === 0 ||
          strength.score === 1 ||
          password.length < 8 ||
          password.match(/[^A-Za-z0-9]/g) === null ? (
            <Text color="red" mt="0" mb="0">
              A strong password must have at least 8 characters and contain at
              least one uppercase, one lowercase, one number and one symbol.
            </Text>
          ) : (
            <Text color="green" mt="0" mb="0">
              {strength.score === 3
                ? "This password is strong. But it can be more stronger."
                : strength.score === 4
                ? "This password is strong."
                : ""}
            </Text>
          )}

          <Box w="100%">
            <Group spacing={5} grow mt="xs" mb="md">
              {bars}
            </Group>
          </Box>
        </Flex>
        <Title w="100%" order={2} mt="50px" ta={"center"}>
          This password can be cracked in:
        </Title>
        <StatsGridCrackTime
          data={[
            {
              title: "Online throttling",
              icon: "throttling" as const,
              value:
                strength &&
                strength.crack_times_display &&
                strength.crack_times_display.online_throttling_100_per_hour.toString(),
              bottom: "(100 guesses per hour)",
            },
            {
              title: "Online no throttling",
              icon: "noThrottling" as const,
              value:
                strength &&
                strength.crack_times_display &&
                strength.crack_times_display.online_no_throttling_10_per_second.toString(),
              bottom: "(10 guesses per second)",
            },
            {
              title: "Offline slow hashing",
              icon: "offlineSlow" as const,
              value:
                strength &&
                strength.crack_times_display &&
                strength.crack_times_display.offline_slow_hashing_1e4_per_second.toString(),
              bottom: "(10,000 guesses per second)",
            },
            {
              title: "Offline fast hashing",
              icon: "offlineFast" as const,
              value:
                strength &&
                strength.crack_times_display &&
                strength.crack_times_display.offline_fast_hashing_1e10_per_second.toString(),
              bottom: "(10,000,000,000 guesses per second)",
            },
          ]}
        />

        {strength && strength.feedback && strength.feedback.warning && (
          <Box p="lg" ta="center">
            <Title w="100%" order={2} ta={"center"}>
              Warning
            </Title>
            <Text color="yellow" ml="auto" mr="auto">
              {strength.feedback.warning}
            </Text>
          </Box>
        )}

        {strength &&
          strength.feedback &&
          strength.feedback.suggestions &&
          strength.feedback.suggestions.length > 0 && (
            <Box p="lg" ta="center">
              <Title w="100%" order={2} ta={"center"}>
                Suggestions
              </Title>
              <Text color="yellow" ml="auto" mr="auto">
                {strength.feedback.suggestions.map(
                  (suggestion: string, index: number) => {
                    return (
                      <React.Fragment key={index}>
                        {suggestion}
                        <br />
                      </React.Fragment>
                    );
                  }
                )}
              </Text>
            </Box>
          )}
      </Card>
    </Box>
  );
};

export default PasswordGenerator;
