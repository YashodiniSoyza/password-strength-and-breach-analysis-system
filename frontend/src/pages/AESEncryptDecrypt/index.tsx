import {
  Box,
  createStyles,
  Title,
  SimpleGrid,
  Text,
  Button,
  ThemeIcon,
  Grid,
  Col,
  Image,
} from "@mantine/core";
import { AESEncryptDecrypt, Hero, UserHeaderMenu } from "../../components";
import ENCRYPT_BACKGROUND from "../../assets/encrypt-background.png";
import {
  IconFileCode,
  IconKey,
  IconLockAccess,
  IconRepeat,
} from "@tabler/icons";
import AES_VS_DES from "../../assets/aes_vs_des.png";
import ECB from "../../assets/ECB.png";
import CBC from "../../assets/CBC.png";

const useStyles = createStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing.xl * 2,
    padding: `${theme.spacing.xl * 2}px ${theme.spacing.xl}px`,
    width: "90%",
    margin: "auto",
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 36,
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },

  subTitle: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
}));

const features = [
  {
    icon: IconLockAccess,
    title: "High Security",
    description:
      "AES is considered one of the most secure encryption algorithms available today, with the ability to withstand brute-force attacks even with modern computing power.",
  },
  {
    icon: IconFileCode,
    title: "Symmetric Key Encryption",
    description:
      "AES uses symmetric key encryption, which means the same key is used for both encryption and decryption. This key must be kept secret, as anyone who has it can decrypt the data",
  },
  {
    icon: IconKey,
    title: "Key Size Options",
    description:
      "AES supports key sizes of 128, 192, and 256 bits. A larger key size means more security, but it also means more processing power is required to encrypt and decrypt the data.",
  },
  {
    icon: IconRepeat,
    title: "Multiple Rounds",
    description:
      "AES uses multiple encryption rounds based on key size: 10 for 128-bit, 12 for 192-bit, and 14 for 256-bit keys. Each round substitutes and permutes data, increasing complexity and making decryption harder.",
  },
];

const AESEncryptDecryptPage: React.FC = () => {
  const { classes } = useStyles();

  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ deg: 133, from: "blue", to: "cyan" }}
      >
        <feature.icon size={26} stroke={1.5} />
      </ThemeIcon>
      <Text size="lg" mt="sm" weight={500}>
        {feature.title}
      </Text>
      <Text color="dimmed" size="sm">
        {feature.description}
      </Text>
    </div>
  ));
  return (
    <Box>
      <UserHeaderMenu />
      <Hero
        background={ENCRYPT_BACKGROUND}
        title="Protect Your Data with AES Encryption Tool"
        description="Protecting your data has never been more critical than it is today. From personal information to sensitive business data, it's essential to keep your confidential information secure. That's where our AES encryption tool comes in."
        buttonLabel="Learn more"
        buttonLink="#learn-more"
      />
      <div className={classes.wrapper} id="learn-more">
        <Grid gutter={80}>
          <Col span={12} md={5}>
            <Title className={classes.title} order={2}>
              AES Encryption and Decryption Online Tool
            </Title>
            <Text color="dimmed">
              AES (Advanced Encryption Standard) is a widely used symmetric
              encryption algorithm that provides high-level security for the
              encryption of data.It is currently the industry standard due to
              its support for 128-bit, 192-bit, and 256-bit encryption. Compared
              to asymmetric encryption, symmetric encryption is faster and more
              efficient, making it ideal for use in systems such as database
              management systems. It was selected by the U.S. National Institute
              of Standards and Technology (NIST) in 2001 to replace the older
              DES (Data Encryption Standard) algorithm, which had become
              vulnerable to brute-force attacks due to its small key size.
            </Text>

            <Button
              variant="gradient"
              gradient={{ deg: 133, from: "blue", to: "cyan" }}
              size="lg"
              radius="md"
              mt="xl"
              onClick={() => {
                window.location.href = "#aes";
              }}
            >
              Use AES Encryption Tool
            </Button>
          </Col>
          <Col span={12} md={7}>
            <SimpleGrid
              cols={2}
              spacing={30}
              breakpoints={[{ maxWidth: "md", cols: 1 }]}
            >
              {items}
            </SimpleGrid>
          </Col>
        </Grid>
      </div>
      <AESEncryptDecrypt />
      <Box p={30} w="80%" m="auto">
        <Title className={classes.subTitle} order={2} ta="center" mt={20}>
          How to Use AES Encryption Tool
        </Title>
        <Text color="dimmed">
          To use an AES tool for encryption and decryption, first select the
          appropriate mode (ECB or CBC) and enter the plaintext or ciphertext,
          depending on the operation you wish to perform. Then, enter the
          encryption or decryption key, which must match the key used for the
          original encryption. After entering all the required information,
          click on the appropriate button to encrypt or decrypt the data. The
          tool will then display the encrypted or decrypted data, which you can
          copy and use as needed.
        </Text>
        <Image
          src={AES_VS_DES}
          alt="AES vs DES"
          radius="md"
          width={557}
          height={340}
          fit="contain"
          m="auto"
        />
        <Title className={classes.subTitle} order={2} ta="center" mt={20}>
          Different Modes of AES Encryption
        </Title>
        <Text color="dimmed">
          AES encryption can be used in two modes, each with its own unique
          characteristics and strengths. The most common modes include:
        </Text>
        <br />
        <Text color="dimmed">
          <Text span c="blue" inherit>
            Electronic Codebook (ECB) Mode
          </Text>
          : In this mode, each block of plaintext is encrypted independently,
          making it vulnerable to pattern attacks. ECB is best used for small
          amounts of data and not recommended for larger datasets.
        </Text>
        <Image
          src={ECB}
          alt="ECB"
          radius="md"
          width={600}
          height={300}
          fit="contain"
          m="auto"
        />
        <Text color="dimmed">
          <Text span c="blue" inherit>
            Cipher Block Chaining (CBC) Mode
          </Text>
          : In CBC mode, each block of plaintext is XORed with the previous
          block's ciphertext before being encrypted, making it less susceptible
          to pattern attacks. CBC is suitable for encrypting large datasets and
          is widely used in secure communication protocols.
        </Text>
        <Image
          src={CBC}
          alt="CBC"
          radius="md"
          width={600}
          height={300}
          fit="contain"
          m="auto"
        />
        <Title className={classes.subTitle} order={2} ta="center" mt={20}>
          AES Encryption Key Size
        </Title>
        <Text color="dimmed">
          The key size in AES determines the number of possible keys that can be
          used to encrypt and decrypt data. AES supports three key sizes: 128,
          192, and 256 bits. A larger key size provides more possible key
          combinations, making it more difficult for attackers to guess the
          correct key and decrypt the data. However, larger key sizes also
          require more processing power to encrypt and decrypt data. Thus, the
          choice of key size in AES involves a trade-off between security and
          performance.
        </Text>
        <Title className={classes.subTitle} order={2} ta="center" mt={20}>
          AES Secret Key
        </Title>
        <Text color="dimmed">
          AES Secret Key refers to the secret key used in the AES encryption
          algorithm. This key is a symmetric key, meaning it is the same key
          used for both encryption and decryption. The secret key must be kept
          secure, as anyone who possesses it can decrypt the data. AES supports
          three different key sizes: 128, 192, and 256 bits, with larger key
          sizes providing greater security but requiring more processing power
          to encrypt and decrypt the data.
        </Text>
      </Box>
    </Box>
  );
};

export default AESEncryptDecryptPage;
