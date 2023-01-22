import { AdminSideBar } from "../../components";
import { Flex } from "@mantine/core";
import { ManageAdmins as ManageAdminsComponent } from "../../components";

const ManageAdmins: React.FC = () => {
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
      <ManageAdminsComponent />
    </Flex>
  );
};

export default ManageAdmins;
