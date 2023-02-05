import { AdminSideBar, PageViewsCard, StatsGrid } from "../../components";
import { Flex, Box } from "@mantine/core";

const data = [
  {
    title: "New users",
    icon: "user" as const,
    value: "1,234",
    diff: 12,
  },
  {
    title: "Passwords",
    icon: "password" as const,
    value: "1,234",
    diff: 12,
  },
  {
    title: "Breaches",
    icon: "breach" as const,
    value: "1,234",
    diff: 12,
  },
  {
    title: "Revenue",
    icon: "coin" as const,
    value: "1,234",
    diff: 12,
  },
];

const AdminDashboard: React.FC = () => {
  return (
    <Flex
      gap="xs"
      justify="space-between"
      align="flex-start"
      direction="row"
      wrap="wrap"
      style={{ height: "100vh" }}
    >
      <AdminSideBar />
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "79vw",
        }}
      >
        <StatsGrid data={data} />
        <PageViewsCard
          total="345,765"
          diff={18}
          data={[
            { label: "Mobile", count: "204,001", part: 59, color: "#47d6ab" },
            { label: "Desktop", count: "121,017", part: 35, color: "#03141a" },
            { label: "Tablet", count: "31,118", part: 6, color: "#4fcdf7" },
          ]}
        />
      </Box>
    </Flex>
  );
};

export default AdminDashboard;
