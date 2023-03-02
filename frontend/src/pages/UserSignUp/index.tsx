import { Box } from "@mantine/core";
import { UserSignUp, UserHeaderMenu } from "../../components";

const UserSignUpPage: React.FC = () => {
  return (
    <Box>
      <UserHeaderMenu noHero={true} />
      <UserSignUp />
    </Box>
  );
};

export default UserSignUpPage;
