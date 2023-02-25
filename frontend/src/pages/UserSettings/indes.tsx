import { Box } from "@mantine/core";
import { UserSettings, UserHeaderMenu } from "../../components";

const UserSettingsPage: React.FC = () => {
  return (
    <Box>
      <UserHeaderMenu />
      <UserSettings />
    </Box>
  );
};

export default UserSettingsPage;
