import { Box } from "@mantine/core";
import { AESEncryptDecrypt, UserHeaderMenu } from "../../components";
const AESEncryptDecryptPage: React.FC = () => {
  return (
    <Box>
      <UserHeaderMenu />
      <AESEncryptDecrypt />
    </Box>
  );
};

export default AESEncryptDecryptPage;
