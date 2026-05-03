import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AuthJwt() {
  return (
    <PageContainer
      title="Autenticação com JWT em ASP.NET Core"
      subtitle="Como emitir, validar e proteger endpoints com JSON Web Tokens — o padrão de fato para APIs modernas."
      difficulty="avancado"
      timeToRead="16 min"
    >
      <p>
        Quando um usuário faz login na sua API, você precisa de um jeito de "lembrar" que ele é quem diz ser nas próximas requisições — sem pedir login a cada vez. A solução clássica é o <strong>JWT</strong> (JSON Web Token): uma string assinada digitalmente que o servidor entrega no login e o cliente devolve em todo cabeçalho <code>Authorization: Bearer ...</code>. O servidor verifica a assinatura e confia no conteúdo. Pense num crachá com selo holográfico: qualquer porteiro consegue verificar a autenticidade sem ligar para a central.
      </p>

      <h2>O formato do JWT</h2>
      <p>
        Um JWT é uma string com três partes separadas por ponto: <em>header</em>.<em>payload</em>.<em>signature</em>. Header diz o algoritmo (ex.: <code>HS256</code>); payload contém <strong>claims</strong> (afirmações sobre o usuário: id, papéis, expiração); signature é o resultado da assinatura HMAC ou RSA aplicada às duas primeiras partes com uma chave secreta.
      </p>
      <pre><code>{`# Exemplo (cortado) — cole em jwt.io para inspecionar
eyJhbGciOiJIUzI1NiJ9.
eyJzdWIiOiIxMiIsIm5hbWUiOiJBbmEiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MzAwMDAwMDB9.
9X4fRgT...`}</code></pre>

      <h2>Configurando autenticação no <code>Program.cs</code></h2>
      <p>
        Instale o pacote oficial e registre o esquema <code>JwtBearer</code>.
      </p>
      <pre><code>{`# terminal
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer`}</code></pre>
      <pre><code>{`using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Lê do appsettings.json para evitar segredo no código
var jwt = builder.Configuration.GetSection("Jwt");
var chave = Encoding.UTF8.GetBytes(jwt["Key"]!);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,             // expira tokens vencidos
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(chave),
            ClockSkew = TimeSpan.FromMinutes(1)  // tolerância para relógios
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();
app.UseAuthentication();   // ORDEM IMPORTA
app.UseAuthorization();
app.Run();`}</code></pre>

      <p>
        E o <code>appsettings.json</code> correspondente:
      </p>
      <pre><code>{`{
  "Jwt": {
    "Issuer":   "MinhaApi",
    "Audience": "MeusClientes",
    "Key":      "SUBSTITUA-POR-32-CARACTERES-OU-MAIS-AQUI"
  }
}`}</code></pre>

      <AlertBox type="danger" title="Chave em segredo, sempre">
        A chave HS256 é a única coisa entre o atacante e a capacidade de forjar tokens em nome de qualquer usuário. <strong>Nunca</strong> a deixe em código versionado. Use <code>dotnet user-secrets</code> em desenvolvimento e variáveis de ambiente / Azure Key Vault / AWS Secrets Manager em produção. Mínimo 32 caracteres aleatórios.
      </AlertBox>

      <h2>Gerando o token no endpoint de login</h2>
      <pre><code>{`using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

app.MapPost("/login", (LoginDto dto, IConfiguration config) =>
{
    // Valide credenciais contra seu banco aqui (use hash + salt!)
    if (dto.Usuario != "ana" || dto.Senha != "123")
        return Results.Unauthorized();

    var jwt = config.GetSection("Jwt");
    var chave = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(jwt["Key"]!));

    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, "12"),     // id do usuário
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.Name, dto.Usuario),
        new Claim(ClaimTypes.Role, "admin")
    };

    var token = new JwtSecurityToken(
        issuer:   jwt["Issuer"],
        audience: jwt["Audience"],
        claims:   claims,
        expires:  DateTime.UtcNow.AddMinutes(15),
        signingCredentials: new SigningCredentials(
            chave, SecurityAlgorithms.HmacSha256));

    var jwtString = new JwtSecurityTokenHandler().WriteToken(token);
    return Results.Ok(new { access_token = jwtString });
});

record LoginDto(string Usuario, string Senha);`}</code></pre>

      <h2>Protegendo endpoints com [Authorize]</h2>
      <p>
        Em controllers ou minimal APIs, marque o que precisa de token. Tudo o que <strong>não</strong> está marcado continua aberto — a menos que você configure o oposto.
      </p>
      <pre><code>{`// Minimal API: precisa de token válido
app.MapGet("/perfil", (ClaimsPrincipal user) =>
{
    var nome = user.Identity?.Name;
    return Results.Ok(new { nome });
})
.RequireAuthorization();

// Restringe por papel
app.MapDelete("/usuarios/{id:int}", (int id) => Results.NoContent())
   .RequireAuthorization(p => p.RequireRole("admin"));

// Em controllers tradicionais:
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PedidosController : ControllerBase
{
    [HttpGet]
    public IActionResult Listar() => Ok();

    [AllowAnonymous]                              // exceção: aberta
    [HttpGet("publicos")]
    public IActionResult Publicos() => Ok();
}`}</code></pre>

      <h2>Lendo claims dentro do endpoint</h2>
      <pre><code>{`app.MapGet("/quem-sou-eu", (ClaimsPrincipal user) =>
{
    var id    = user.FindFirstValue(JwtRegisteredClaimNames.Sub);
    var nome  = user.FindFirstValue(ClaimTypes.Name);
    var papel = user.FindFirstValue(ClaimTypes.Role);

    return Results.Ok(new { id, nome, papel });
}).RequireAuthorization();`}</code></pre>

      <h2>Refresh token: prolongando sessões com segurança</h2>
      <p>
        Tokens curtos (15 min) limitam o estrago se vazarem, mas obrigariam o usuário a relogar toda hora. A solução é emitir, junto, um <strong>refresh token</strong> de longa duração (dias/semanas) — uma string opaca, gravada no banco, ligada ao usuário. Quando o JWT expira, o cliente envia o refresh token a um endpoint dedicado e recebe um novo par. Se o refresh for revogado/roubado, basta apagar do banco.
      </p>
      <pre><code>{`record TokensResponse(string AccessToken, string RefreshToken);

app.MapPost("/refresh", async (string refreshToken, IUsuarioRepo repo) =>
{
    var usuario = await repo.BuscarPorRefreshAsync(refreshToken);
    if (usuario is null || usuario.RefreshExpiraEm < DateTime.UtcNow)
        return Results.Unauthorized();

    // Rotaciona: invalida o antigo e gera um novo (boa prática)
    var novoRefresh = Guid.NewGuid().ToString("N");
    usuario.RefreshToken    = novoRefresh;
    usuario.RefreshExpiraEm = DateTime.UtcNow.AddDays(7);
    await repo.SalvarAsync(usuario);

    var novoAccess = GerarJwt(usuario);
    return Results.Ok(new TokensResponse(novoAccess, novoRefresh));
});`}</code></pre>

      <AlertBox type="warning" title="HTTPS é obrigatório">
        JWT viaja no cabeçalho — qualquer um na rede capturando tráfego HTTP em texto claro consegue copiar e usar. Sirva sua API <strong>somente</strong> via HTTPS. Em produção, configure HSTS e nunca aceite tokens em querystrings.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>401 sem detalhes</strong>: ative <code>opt.IncludeErrorDetails = true</code> em desenvolvimento para ver "token expirado", "issuer inválido" etc.</li>
        <li><strong>Trocar a ordem</strong> <code>UseAuthentication</code> / <code>UseAuthorization</code> — autenticação SEMPRE antes.</li>
        <li><strong>Chave curta demais</strong>: HS256 exige pelo menos 32 bytes; senão a biblioteca recusa.</li>
        <li><strong>Esquecer <code>ValidateLifetime</code></strong> — token expirado continua aceito; falha grave de segurança.</li>
        <li><strong>Guardar JWT em <code>localStorage</code></strong> em SPA: vulnerável a XSS. Prefira cookie <code>HttpOnly + Secure + SameSite</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>JWT = header.payload.signature; claims contêm dados do usuário.</li>
        <li>Configure <code>AddAuthentication().AddJwtBearer(...)</code> validando issuer, audience, lifetime, key.</li>
        <li>Gere o token no login com <code>JwtSecurityTokenHandler</code> e claims relevantes.</li>
        <li>Proteja endpoints com <code>[Authorize]</code> ou <code>RequireAuthorization()</code>; libere com <code>[AllowAnonymous]</code>.</li>
        <li>Use <strong>refresh tokens rotativos</strong> para combinar segurança (access curto) e UX (sessão longa).</li>
        <li>Sempre HTTPS; chave em cofre; nunca em código versionado.</li>
      </ul>
    </PageContainer>
  );
}
