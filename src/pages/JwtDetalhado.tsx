import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function JwtDetalhado() {
  return (
    <PageContainer
      title={"JWT a fundo"}
      subtitle={"Estrutura, validação, expiração, refresh tokens."}
      difficulty={"avancado"}
      timeToRead={"6 min"}
    >
      <p>JWT = header.payload.signature, base64url-encoded. Stateless: não há lista de tokens válidos no servidor — só verifica assinatura e exp.</p>

      <h2>Pegadinhas</h2>

      <ul>
        <li><code>alg: none</code> deve ser sempre rejeitado.</li>
        <li>Sempre valide <code>iss</code>, <code>aud</code>, <code>exp</code>, <code>nbf</code>.</li>
        <li>Use HS256 (segredo) ou RS256 (chave pública/privada). Não use HS256 com chave fraca.</li>
        <li>Tokens curtos (5-15min) + refresh token guardado no servidor.</li>
      </ul>

      <CodeBlock
        language="csharp"
        code={`var validation = new TokenValidationParameters
{
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ClockSkew = TimeSpan.FromSeconds(30),
    ValidIssuer = "...",
    ValidAudience = "...",
    IssuerSigningKey = key
};

var handler = new JwtSecurityTokenHandler();
var principal = handler.ValidateToken(token, validation, out var validated);`}
      />
    </PageContainer>
  );
}
