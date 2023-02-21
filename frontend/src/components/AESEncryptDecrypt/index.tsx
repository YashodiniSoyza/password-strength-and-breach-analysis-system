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

const keySize = 256;
const iterations = 100;

const encrypt = (data: any, iKey: any, mode: any) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);

  const key = CryptoJS.PBKDF2(iKey, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: mode === "ECB" ? CryptoJS.mode.ECB : CryptoJS.mode.CBC,
  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  const encryptedData = salt.toString() + iv.toString() + encrypted.toString();
  return encryptedData;
};

const decrypt = (data: any, iKey: any, mode: any) => {
  const salt = CryptoJS.enc.Hex.parse(data.substr(0, 32));
  const iv = CryptoJS.enc.Hex.parse(data.substr(32, 32));
  const encrypted = data.substring(64);

  const key = CryptoJS.PBKDF2(iKey, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: mode === "ECB" ? CryptoJS.mode.ECB : CryptoJS.mode.CBC,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};
const a = encrypt("hello 1 EBC", "1", "ECB");
const b = decrypt(a, "1", "ECB");
console.log(b);

const c = encrypt("hello 2 CBC", "1", "CBC");
const d = decrypt(c, "1", "CBC");
console.log(d);

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
            onClick={() => {
              setOutputEncrypt(encrypt(dataEncrypt, keyEncrypt, modeEncrypt));
            }}
            w="100%"
            mt={10}
            disabled={dataEncrypt === "" || keyEncrypt === ""}
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
              const decrypted = decrypt(dataDecrypt, keyDecrypt, modeDecrypt);
              if (decrypted === "") {
                setOutputDecrypt("!!! Error !!! Wrong Key or Encrypted Text");
              } else {
                setOutputDecrypt(decrypted);
              }
            }}
            mt={10}
            w="100%"
            disabled={dataDecrypt === "" || keyDecrypt === ""}
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
