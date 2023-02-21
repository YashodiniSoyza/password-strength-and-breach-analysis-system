import {
  Box,
  Button,
  Card,
  Select,
  SimpleGrid,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
var CryptoJS = require("crypto-js");

// Encrypt Method takes data, mode, key, output format as parameters.
const encrypt = (data: string, mode: string | null, key: string) => {
  return CryptoJS.AES.encrypt(data, key, {
    mode: mode === "ECB" ? CryptoJS.mode.ECB : CryptoJS.mode.CBC,
    iv: CryptoJS.enc.Utf8.parse("0000000000000000"),
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
};

// Decrypt Method takes data, mode, key, input format as parameters
const decrypt = (data: string, mode: string | null, key: string) => {
  return CryptoJS.AES.decrypt(data, key, {
    mode: mode === "ECB" ? CryptoJS.mode.ECB : CryptoJS.mode.CBC,
    iv: CryptoJS.enc.Utf8.parse("0000000000000000"),
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
};

// const a = encrypt("Hello World", "ECB", "1");
// console.log(a);
// const b = decrypt(a, "ECB", "1");
// console.log(b);

const AESEncryptDecrypt: React.FC = () => {
  const [dataEncrypt, setDataEncrypt] = useState<string>("");
  const [modeEncrypt, setModeEncrypt] = useState<string | null>("ECB");
  const [keyEncrypt, setKeyEncrypt] = useState<string>("");
  const [outputEncrypt, setOutputEncrypt] = useState<string>("");

  const [dataDecrypt, setDataDecrypt] = useState<string>("");
  const [modeDecrypt, setModeDecrypt] = useState<string | null>("ECB");
  const [keyDecrypt, setKeyDecrypt] = useState<string>("");
  const [outputDecrypt, setOutputDecrypt] = useState<string>("");
  return (
    <Box p="xl">
      <Title order={1} ta="center">
        AES Encryption and Decryption Tool
      </Title>
      <SimpleGrid
        cols={2}
        spacing="xl"
        mt={20}
        breakpoints={[
          { maxWidth: "lg", cols: 2 },
          { maxWidth: "md", cols: 1 },
        ]}
      >
        <Card shadow="xs" p="lg" radius="md" withBorder>
          <Title order={2} ta="center" mt={10}>
            Encrypt
          </Title>
          <Textarea
            label="Enter text to be Encrypted"
            autosize
            minRows={5}
            value={dataEncrypt}
            onChange={(e) => setDataEncrypt(e.target.value)}
            mt={10}
          />
          <Select
            label="Select Cipher Mode of Encryption"
            data={[
              { label: "ECB", value: "ECB" },
              { label: "CBC", value: "CBC" },
            ]}
            value={modeEncrypt}
            onChange={setModeEncrypt}
            mt={10}
          />
          <TextInput
            label="Enter Secret Key"
            value={keyEncrypt}
            onChange={(e) => setKeyEncrypt(e.target.value)}
            mt={10}
          />
          <Button
            onClick={() =>
              setOutputEncrypt(encrypt(dataEncrypt, modeEncrypt, keyEncrypt))
            }
            w="100%"
            mt={10}
          >
            Encrypt
          </Button>
          <Textarea label="Output" autosize minRows={5} value={outputEncrypt} />
        </Card>
        <Card shadow="xs" p="lg" radius="md" withBorder>
          <Title order={2} ta="center" mt={10}>
            Decrypt
          </Title>
          <Textarea
            label="Enter text to be Decrypted"
            autosize
            minRows={5}
            value={dataDecrypt}
            onChange={(e) => setDataDecrypt(e.target.value)}
            mt={10}
          />
          <Select
            label="Select Cipher Mode of Decryption"
            data={[
              { label: "ECB", value: "ECB" },
              { label: "CBC", value: "CBC" },
            ]}
            value={modeDecrypt}
            onChange={setModeDecrypt}
            mt={10}
          />
          <TextInput
            label="Enter Secret Key used for Encryption"
            value={keyDecrypt}
            onChange={(e) => setKeyDecrypt(e.target.value)}
            mt={10}
          />
          <Button
            onClick={() => {
              setOutputDecrypt(decrypt(dataDecrypt, modeDecrypt, keyDecrypt));
            }}
            mt={10}
            w="100%"
          >
            Decrypt
          </Button>
          <Textarea label="Output" autosize minRows={5} value={outputDecrypt} />
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default AESEncryptDecrypt;
