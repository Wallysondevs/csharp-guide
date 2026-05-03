import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function JwtAuth() {
  return (
    <PageContainer
      title={"Autenticação JWT"}
      subtitle={"JWT bearer no ASP.NET Core sem mistério."}
      difficulty={"avancado"}
      timeToRead={"8 min"}
    >
      <CodeBlock
        language="csharp"
        code={`builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new()
        {
            ValidIssuer = "meuapp",
            ValidAudience = "api",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
builder.Services.AddAuthorization();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/me", (ClaimsPrincipal user) => user.Identity!.Name)
   .RequireAuthorization();`}
      />

      <h2>Emitindo o token</h2>

      <CodeBlock
        language="csharp"
        code={`var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
var token = new JwtSecurityToken(
    issuer: "meuapp", audience: "api",
    claims: new[] { new Claim(ClaimTypes.Name, "ana") },
    expires: DateTime.UtcNow.AddHours(1),
    signingCredentials: creds);

var jwt = new JwtSecurityTokenHandler().WriteToken(token);`}
      />
    </PageContainer>
  );
}
