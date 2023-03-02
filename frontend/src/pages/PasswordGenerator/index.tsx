import { Box } from "@mantine/core";
import { Hero, PasswordGenerator, UserHeaderMenu } from "../../components";
import PSW_GEN_BACKGROUND from "../../assets/password-generator.jpeg";

const PasswordGeneratorPage: React.FC = () => {
  return (
    <Box>
      <UserHeaderMenu />
      <Hero
        background={PSW_GEN_BACKGROUND}
        title="Generate Secure Passwords with Ease"
        description="Our password generator creates strong, unique passwords that will keep your online accounts secure. Choose your password length and character types, and let our generator do the rest. Say goodbye to weak passwords and hello to peace of mind with our easy-to-use password generator."
        buttonLabel="Try it now!"
        buttonLink="#password-generator"
      />
      <PasswordGenerator />
    </Box>
  );
};

export default PasswordGeneratorPage;
