import { Box } from "@mantine/core";
import { PasswordGenerator, UserHeaderMenu } from "../../components";

const PasswordGeneratorPage: React.FC = () => {
  return (
    <Box>
      <UserHeaderMenu />
      <PasswordGenerator />
    </Box>
  );
};

export default PasswordGeneratorPage;
