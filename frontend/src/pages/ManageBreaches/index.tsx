import {
  AdminSideBar,
  ManageBreaches as ManageBreachesComponent,
} from "../../components";
import { Flex } from "@mantine/core";

const ManageBreaches: React.FC = () => {
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
      <ManageBreachesComponent />
    </Flex>
  );
};

export default ManageBreaches;
