import { Box } from "@mantine/core";
import { Vault, UserHeaderMenu } from "../../components";

const VaultPage: React.FC = () => {
  return (
    <Box>
      <UserHeaderMenu />
      <Vault />
    </Box>
  );
};

export default VaultPage;
