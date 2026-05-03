import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HashCripto() {
  return (
    <PageContainer
      title={"Hash, criptografia, password"}
      subtitle={"BCrypt, SHA256, AES, sem inventar roda."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <h2>Senha — sempre hash com salt</h2>

      <CodeBlock
        language="csharp"
        code={`// BCrypt.Net (NuGet)
string hash = BCrypt.Net.BCrypt.HashPassword(senha, workFactor: 12);
bool ok = BCrypt.Net.BCrypt.Verify(senha, hash);

// Argon2 (Konscious.Security.Cryptography)
// PBKDF2 nativo
var bytes = Rfc2898DeriveBytes.Pbkdf2(
    Encoding.UTF8.GetBytes(senha),
    salt,
    100_000,
    HashAlgorithmName.SHA256,
    32);`}
      />

      <h2>SHA256 (hash de dados, NÃO senha)</h2>

      <CodeBlock
        language="csharp"
        code={`var hash = SHA256.HashData(Encoding.UTF8.GetBytes(texto));
string hex = Convert.ToHexString(hash);`}
      />

      <h2>AES-GCM (criptografia simétrica)</h2>

      <CodeBlock
        language="csharp"
        code={`var key = RandomNumberGenerator.GetBytes(32);
var nonce = RandomNumberGenerator.GetBytes(12);
var plaintext = Encoding.UTF8.GetBytes("segredo");
var ciphertext = new byte[plaintext.Length];
var tag = new byte[16];

using var aes = new AesGcm(key, 16);
aes.Encrypt(nonce, plaintext, ciphertext, tag);

// decrypt
var output = new byte[ciphertext.Length];
aes.Decrypt(nonce, ciphertext, tag, output);`}
      />

      <AlertBox type="warning" title={"NUNCA invente cripto"}>
        <p>Use BCL/libs auditadas. Não escreva seu próprio AES, sua própria chave KDF, seu próprio MAC.</p>
      </AlertBox>
    </PageContainer>
  );
}
