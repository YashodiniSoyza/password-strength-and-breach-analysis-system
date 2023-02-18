import { Box } from "@mantine/core";
import { EncryptDecrypt, UserHeaderMenu } from "../../components";

const EncryptDecryptPage: React.FC = () => {
  return (
    <Box>
      <UserHeaderMenu />
      <EncryptDecrypt />
    </Box>
  );
};

export default EncryptDecryptPage;
