import{j as e}from"./index-CzLAthD5.js";import{P as r,A as i}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(r,{title:"Autenticação com JWT em ASP.NET Core",subtitle:"Como emitir, validar e proteger endpoints com JSON Web Tokens — o padrão de fato para APIs modernas.",difficulty:"avancado",timeToRead:"16 min",children:[e.jsxs("p",{children:['Quando um usuário faz login na sua API, você precisa de um jeito de "lembrar" que ele é quem diz ser nas próximas requisições — sem pedir login a cada vez. A solução clássica é o ',e.jsx("strong",{children:"JWT"})," (JSON Web Token): uma string assinada digitalmente que o servidor entrega no login e o cliente devolve em todo cabeçalho ",e.jsx("code",{children:"Authorization: Bearer ..."}),". O servidor verifica a assinatura e confia no conteúdo. Pense num crachá com selo holográfico: qualquer porteiro consegue verificar a autenticidade sem ligar para a central."]}),e.jsx("h2",{children:"O formato do JWT"}),e.jsxs("p",{children:["Um JWT é uma string com três partes separadas por ponto: ",e.jsx("em",{children:"header"}),".",e.jsx("em",{children:"payload"}),".",e.jsx("em",{children:"signature"}),". Header diz o algoritmo (ex.: ",e.jsx("code",{children:"HS256"}),"); payload contém ",e.jsx("strong",{children:"claims"})," (afirmações sobre o usuário: id, papéis, expiração); signature é o resultado da assinatura HMAC ou RSA aplicada às duas primeiras partes com uma chave secreta."]}),e.jsx("pre",{children:e.jsx("code",{children:`# Exemplo (cortado) — cole em jwt.io para inspecionar
eyJhbGciOiJIUzI1NiJ9.
eyJzdWIiOiIxMiIsIm5hbWUiOiJBbmEiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MzAwMDAwMDB9.
9X4fRgT...`})}),e.jsxs("h2",{children:["Configurando autenticação no ",e.jsx("code",{children:"Program.cs"})]}),e.jsxs("p",{children:["Instale o pacote oficial e registre o esquema ",e.jsx("code",{children:"JwtBearer"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`# terminal
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer`})}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.AspNetCore.Authentication.JwtBearer;
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
app.Run();`})}),e.jsxs("p",{children:["E o ",e.jsx("code",{children:"appsettings.json"})," correspondente:"]}),e.jsx("pre",{children:e.jsx("code",{children:`{
  "Jwt": {
    "Issuer":   "MinhaApi",
    "Audience": "MeusClientes",
    "Key":      "SUBSTITUA-POR-32-CARACTERES-OU-MAIS-AQUI"
  }
}`})}),e.jsxs(i,{type:"danger",title:"Chave em segredo, sempre",children:["A chave HS256 é a única coisa entre o atacante e a capacidade de forjar tokens em nome de qualquer usuário. ",e.jsx("strong",{children:"Nunca"})," a deixe em código versionado. Use ",e.jsx("code",{children:"dotnet user-secrets"})," em desenvolvimento e variáveis de ambiente / Azure Key Vault / AWS Secrets Manager em produção. Mínimo 32 caracteres aleatórios."]}),e.jsx("h2",{children:"Gerando o token no endpoint de login"}),e.jsx("pre",{children:e.jsx("code",{children:`using System.IdentityModel.Tokens.Jwt;
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

record LoginDto(string Usuario, string Senha);`})}),e.jsx("h2",{children:"Protegendo endpoints com [Authorize]"}),e.jsxs("p",{children:["Em controllers ou minimal APIs, marque o que precisa de token. Tudo o que ",e.jsx("strong",{children:"não"})," está marcado continua aberto — a menos que você configure o oposto."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Minimal API: precisa de token válido
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
}`})}),e.jsx("h2",{children:"Lendo claims dentro do endpoint"}),e.jsx("pre",{children:e.jsx("code",{children:`app.MapGet("/quem-sou-eu", (ClaimsPrincipal user) =>
{
    var id    = user.FindFirstValue(JwtRegisteredClaimNames.Sub);
    var nome  = user.FindFirstValue(ClaimTypes.Name);
    var papel = user.FindFirstValue(ClaimTypes.Role);

    return Results.Ok(new { id, nome, papel });
}).RequireAuthorization();`})}),e.jsx("h2",{children:"Refresh token: prolongando sessões com segurança"}),e.jsxs("p",{children:["Tokens curtos (15 min) limitam o estrago se vazarem, mas obrigariam o usuário a relogar toda hora. A solução é emitir, junto, um ",e.jsx("strong",{children:"refresh token"})," de longa duração (dias/semanas) — uma string opaca, gravada no banco, ligada ao usuário. Quando o JWT expira, o cliente envia o refresh token a um endpoint dedicado e recebe um novo par. Se o refresh for revogado/roubado, basta apagar do banco."]}),e.jsx("pre",{children:e.jsx("code",{children:`record TokensResponse(string AccessToken, string RefreshToken);

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
});`})}),e.jsxs(i,{type:"warning",title:"HTTPS é obrigatório",children:["JWT viaja no cabeçalho — qualquer um na rede capturando tráfego HTTP em texto claro consegue copiar e usar. Sirva sua API ",e.jsx("strong",{children:"somente"})," via HTTPS. Em produção, configure HSTS e nunca aceite tokens em querystrings."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"401 sem detalhes"}),": ative ",e.jsx("code",{children:"opt.IncludeErrorDetails = true"}),' em desenvolvimento para ver "token expirado", "issuer inválido" etc.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Trocar a ordem"})," ",e.jsx("code",{children:"UseAuthentication"})," / ",e.jsx("code",{children:"UseAuthorization"})," — autenticação SEMPRE antes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Chave curta demais"}),": HS256 exige pelo menos 32 bytes; senão a biblioteca recusa."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"ValidateLifetime"})]})," — token expirado continua aceito; falha grave de segurança."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Guardar JWT em ",e.jsx("code",{children:"localStorage"})]})," em SPA: vulnerável a XSS. Prefira cookie ",e.jsx("code",{children:"HttpOnly + Secure + SameSite"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"JWT = header.payload.signature; claims contêm dados do usuário."}),e.jsxs("li",{children:["Configure ",e.jsx("code",{children:"AddAuthentication().AddJwtBearer(...)"})," validando issuer, audience, lifetime, key."]}),e.jsxs("li",{children:["Gere o token no login com ",e.jsx("code",{children:"JwtSecurityTokenHandler"})," e claims relevantes."]}),e.jsxs("li",{children:["Proteja endpoints com ",e.jsx("code",{children:"[Authorize]"})," ou ",e.jsx("code",{children:"RequireAuthorization()"}),"; libere com ",e.jsx("code",{children:"[AllowAnonymous]"}),"."]}),e.jsxs("li",{children:["Use ",e.jsx("strong",{children:"refresh tokens rotativos"})," para combinar segurança (access curto) e UX (sessão longa)."]}),e.jsx("li",{children:"Sempre HTTPS; chave em cofre; nunca em código versionado."})]})]})}export{s as default};
