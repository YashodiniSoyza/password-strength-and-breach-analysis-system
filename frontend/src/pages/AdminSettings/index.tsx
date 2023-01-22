import { AdminSideBar } from "../../components";
import { Flex } from "@mantine/core";

const AdminSettings: React.FC = () => {
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
      <h1>Admin Settings</h1>
    </Flex>
  );
};

export default AdminSettings;
