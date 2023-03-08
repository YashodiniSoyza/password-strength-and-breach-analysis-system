import { Box } from "@mantine/core";
import { UserForgotPassword, UserHeaderMenu } from "../../components";

const UserForgotPasswordPage: React.FC = () => {
  return (
    <Box>
      <UserHeaderMenu noHero={true} />
      <UserForgotPassword />
    </Box>
  );
};

export default UserForgotPasswordPage;
