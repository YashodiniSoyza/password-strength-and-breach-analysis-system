import { Box } from "@mantine/core";
import { UserSettings, UserHeaderMenu } from "../../components";

const UserSettingsPage: React.FC = () => {
  return (
    <Box>
      <UserHeaderMenu noHero={true} />
      <UserSettings />
    </Box>
  );
};

export default UserSettingsPage;
