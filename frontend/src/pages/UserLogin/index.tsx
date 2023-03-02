import { Box } from "@mantine/core";
import { UserLogin, UserHeaderMenu } from "../../components";

const UserLoginPage: React.FC = () => {
  return (
    <Box>
      <UserHeaderMenu noHero={true} />
      <UserLogin />
    </Box>
  );
};

export default UserLoginPage;
