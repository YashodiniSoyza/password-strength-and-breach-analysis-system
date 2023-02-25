import {
  RingProgress,
  Text,
  SimpleGrid,
  Paper,
  Center,
  Group,
  useMantineTheme,
} from "@mantine/core";
import {
  IconMail,
  IconLockOpenOff,
  IconDeviceMobileMessage,
  IconUserSearch,
  IconFileAlert,
  IconUserExclamation,
} from "@tabler/icons";

interface StatsProps {
  data: {
    label: string;
    stats: string;
    icon: "email" | "password" | "username" | "phone" | "user" | "breach";
  }[];
  width?: string;
}

const icons = {
  breach: IconFileAlert,
  email: IconMail,
  password: IconLockOpenOff,
  username: IconUserSearch,
  phone: IconDeviceMobileMessage,
  user: IconUserExclamation,
};

const HomeStats: React.FC<StatsProps> = ({ data, width }) => {
  const theme = useMantineTheme();
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label}>
        <Group mt={10} mb={10}>
          <Icon size={36} stroke={2} color={theme.primaryColor} />

          <div>
            <Text
              color="dimmed"
              size="xs"
              transform="uppercase"
              weight={700}
              ta="left"
            >
              {stat.label}
            </Text>
            <Text weight={700} size="xl" ta="left">
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });
  return (
    <SimpleGrid
      cols={3}
      breakpoints={[{ maxWidth: "sm", cols: 1 }]}
      w={width ? width : "75%"}
      m="10px auto 30px auto"
    >
      {stats}
    </SimpleGrid>
  );
};

export default HomeStats;
