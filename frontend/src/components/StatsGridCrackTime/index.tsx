import { createStyles, Group, Paper, SimpleGrid, Text } from "@mantine/core";
import {
  IconDeviceDesktop,
  IconDeviceDesktopAnalytics,
  IconLockAccess,
  IconLockAccessOff,
} from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xl * 1.5,
    width: "75%",
    margin: "auto",
  },

  value: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1,
  },

  bottom: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

const icons = {
  throttling: IconLockAccess,
  noThrottling: IconLockAccessOff,
  offlineSlow: IconDeviceDesktop,
  offlineFast: IconDeviceDesktopAnalytics,
};

interface StatsGridCrackTimeProps {
  data: {
    title: string;
    icon: keyof typeof icons;
    value: string;
    bottom: string;
  }[];
}

const StatsGridCrackTime: React.FC<StatsGridCrackTimeProps> = ({ data }) => {
  const { classes } = useStyles();
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group position="apart">
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size={22} stroke={1.5} />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
        </Group>

        <Text size="xs" color="dimmed" mt={7}>
          {stat.bottom}
        </Text>
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={2}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
      >
        {stats}
      </SimpleGrid>
    </div>
  );
};

export default StatsGridCrackTime;
