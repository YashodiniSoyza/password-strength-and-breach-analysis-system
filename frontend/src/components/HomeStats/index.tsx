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
} from "@tabler/icons";

interface StatsProps {
  data: {
    label: string;
    stats: string;
    icon: "email" | "password" | "username" | "phone";
  }[];
}

const icons = {
  email: IconMail,
  password: IconLockOpenOff,
  username: IconUserSearch,
  phone: IconDeviceMobileMessage,
};

const HomeStats: React.FC<StatsProps> = ({ data }) => {
  const theme = useMantineTheme();
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label}>
        <Group>
          <Icon size={36} stroke={2} color={theme.primaryColor} />

          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              {stat.label}
            </Text>
            <Text weight={700} size="xl">
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });
  return (
    <SimpleGrid
      cols={4}
      breakpoints={[{ maxWidth: "sm", cols: 1 }]}
      w="90%"
      m="10px auto 30px auto"
    >
      {stats}
    </SimpleGrid>
  );
};

export default HomeStats;
