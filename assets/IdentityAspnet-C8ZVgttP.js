import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"ASP.NET Identity: usuários, senhas e roles",subtitle:"Cadastro, login, hash de senha, papéis (roles) e claims sem reinventar a roda.",difficulty:"intermediario",timeToRead:"18 min",children:[e.jsxs("p",{children:["Quase toda aplicação web precisa, em algum momento, responder à pergunta: ",e.jsx("em",{children:'"quem é a pessoa do outro lado da tela?"'}),". Implementar isso à mão é um campo minado: hashing de senha, salt, lockout após tentativas erradas, confirmação de e-mail, recuperação por token, autenticação por dois fatores… São centenas de horas para fazer mal. O ",e.jsx("strong",{children:"ASP.NET Core Identity"}),' é a biblioteca oficial da Microsoft que resolve tudo isso de forma plugável. Pense nela como um "kit pronto de portaria": você ainda decide quem entra, mas o catraca, o crachá e o livro de visitas vêm prontos.']}),e.jsx("h2",{children:"Instalação e configuração inicial"}),e.jsxs("p",{children:["Identity é entregue como um conjunto de pacotes NuGet. O mais comum em projetos com Entity Framework Core é ",e.jsx("code",{children:"Microsoft.AspNetCore.Identity.EntityFrameworkCore"}),", que persiste usuários e roles num banco relacional. A peça central é o ",e.jsx("strong",{children:"DbContext"})," (a classe que representa a conexão com o banco no EF) — ele precisa herdar de ",e.jsx("code",{children:"IdentityDbContext"})," em vez de ",e.jsx("code",{children:"DbContext"}),", para já trazer as tabelas de usuários, roles, claims e tokens."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Program.cs (.NET 8/9)
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Banco de dados — o DbContext herda de IdentityDbContext
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlite("Data Source=app.db"));

// 2. Identity com usuário padrão (IdentityUser) e role padrão (IdentityRole)
builder.Services
    .AddIdentity<IdentityUser, IdentityRole>(options =>
    {
        // política de senha
        options.Password.RequireDigit = true;
        options.Password.RequiredLength = 8;
        options.Password.RequireNonAlphanumeric = false;
        // bloqueio após tentativas
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        // exigir e-mail confirmado para logar
        options.SignIn.RequireConfirmedEmail = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders(); // tokens para reset de senha, confirmação etc.

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();`})}),e.jsxs("p",{children:["A ordem dos middlewares importa: ",e.jsx("code",{children:"UseAuthentication"})," sempre ",e.jsx("strong",{children:"antes"})," de ",e.jsx("code",{children:"UseAuthorization"}),". Autenticação descobre ",e.jsx("em",{children:"quem"})," você é (lendo o cookie ou o JWT); autorização decide ",e.jsx("em",{children:"se"})," você pode entrar naquela rota."]}),e.jsx("h2",{children:"O DbContext de Identity"}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : IdentityDbContext<IdentityUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

    // Suas tabelas de domínio convivem com as de Identity
    public DbSet<Pedido> Pedidos => Set<Pedido>();
}`})}),e.jsxs("p",{children:["Ao rodar ",e.jsx("code",{children:"dotnet ef migrations add Initial"})," e ",e.jsx("code",{children:"dotnet ef database update"}),", são criadas tabelas como ",e.jsx("code",{children:"AspNetUsers"}),", ",e.jsx("code",{children:"AspNetRoles"}),", ",e.jsx("code",{children:"AspNetUserRoles"}),", ",e.jsx("code",{children:"AspNetUserClaims"})," e ",e.jsx("code",{children:"AspNetUserTokens"}),". Você não precisa escrever SQL para nada disso."]}),e.jsx("h2",{children:"UserManager e SignInManager"}),e.jsxs("p",{children:["Esses dois serviços, injetados no construtor por DI, são as duas mãos da Identity. ",e.jsx("code",{children:"UserManager"})," cuida do ",e.jsx("em",{children:"cadastro"})," (criar, atualizar, deletar usuário, gerenciar senha, claims, roles). ",e.jsx("code",{children:"SignInManager"})," cuida do ",e.jsx("em",{children:"login"})," (validar senha, emitir cookie, bloquear, deslogar)."]}),e.jsx("pre",{children:e.jsx("code",{children:`[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _users;
    private readonly SignInManager<IdentityUser> _signIn;

    public AuthController(UserManager<IdentityUser> u, SignInManager<IdentityUser> s)
    { _users = u; _signIn = s; }

    [HttpPost("registrar")]
    public async Task<IActionResult> Registrar(string email, string senha)
    {
        var user = new IdentityUser { UserName = email, Email = email };
        var resultado = await _users.CreateAsync(user, senha);
        if (!resultado.Succeeded)
            return BadRequest(resultado.Errors); // política de senha violada etc.
        return Ok("Usuário criado");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(string email, string senha)
    {
        var r = await _signIn.PasswordSignInAsync(
            email, senha,
            isPersistent: true,         // cookie sobrevive ao fechar do browser
            lockoutOnFailure: true);    // ativa o lockout configurado

        if (r.IsLockedOut) return StatusCode(423, "Conta bloqueada");
        if (!r.Succeeded) return Unauthorized();
        return Ok("Logado");
    }
}`})}),e.jsxs(o,{type:"info",title:"Como a senha é guardada?",children:["A senha em texto puro ",e.jsx("strong",{children:"nunca"})," vai para o banco. O Identity usa ",e.jsx("code",{children:"PasswordHasher"}),", que aplica ",e.jsx("em",{children:"PBKDF2"})," com SHA-256, 100.000+ iterações e um salt aleatório por usuário. O resultado fica num único campo ",e.jsx("code",{children:"PasswordHash"})," em ",e.jsx("code",{children:"AspNetUsers"}),". Essa abordagem cumpre o mesmo papel de bibliotecas como bcrypt/argon2: tornar a quebra por força bruta proibitivamente cara."]}),e.jsx("h2",{children:"Roles e Claims"}),e.jsxs("p",{children:["Uma ",e.jsx("strong",{children:"role"}),' é um rótulo grosso ("Admin", "Gerente", "Cliente"). Uma ',e.jsx("strong",{children:"claim"}),' é um par chave-valor mais fino ("departamento=financeiro", "podeAprovarAté=10000"). Use roles para controle simples e claims quando precisar de granularidade.']}),e.jsx("pre",{children:e.jsx("code",{children:`// Criar role e atribuir
await roleManager.CreateAsync(new IdentityRole("Admin"));
await _users.AddToRoleAsync(user, "Admin");

// Adicionar claim customizada
await _users.AddClaimAsync(user, new Claim("departamento", "financeiro"));

// Proteger endpoints
[Authorize(Roles = "Admin")]
[HttpDelete("usuarios/{id}")]
public IActionResult Remover(string id) { /* ... */ return NoContent(); }

// Policy baseada em claim
builder.Services.AddAuthorization(opts =>
{
    opts.AddPolicy("SoFinanceiro", p =>
        p.RequireClaim("departamento", "financeiro"));
});

[Authorize(Policy = "SoFinanceiro")]
[HttpGet("relatorios")]
public IActionResult Relatorios() => Ok();`})}),e.jsx("h2",{children:"Customizando o usuário"}),e.jsxs("p",{children:[e.jsx("code",{children:"IdentityUser"})," traz só o básico (Id, UserName, Email, PhoneNumber). Quase sempre você quer mais campos. Basta herdar:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class AppUser : IdentityUser
{
    public string NomeCompleto { get; set; } = "";
    public DateOnly DataNascimento { get; set; }
}

public class AppDbContext : IdentityDbContext<AppUser> { /* ... */ }

builder.Services
    .AddIdentity<AppUser, IdentityRole>(/*...*/)
    .AddEntityFrameworkStores<AppDbContext>();`})}),e.jsxs("p",{children:["Após herdar, gere uma nova migration e os campos viram colunas em ",e.jsx("code",{children:"AspNetUsers"}),". Todo o restante (UserManager<AppUser>, SignInManager<AppUser>) continua funcionando."]}),e.jsxs(o,{type:"warning",title:"API ou MVC?",children:["Identity nasceu pensando em ",e.jsx("em",{children:"cookies"})," (apps MVC/Razor). Para APIs REST puras, geralmente você combina Identity (para guardar usuários e validar senha) com ",e.jsx("strong",{children:"JWT Bearer"})," (para emitir tokens). Não use cookies em APIs consumidas por mobile/SPA cross-domain — você pegará dor de cabeça com CORS e CSRF."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"UseAuthentication()"})]})," antes de ",e.jsx("code",{children:"UseAuthorization()"})," — o servidor responde 401 mesmo com login válido porque ninguém leu o cookie."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não rodar a migration"})," após herdar ",e.jsx("code",{children:"IdentityUser"})," — a coluna nova existe na classe mas não no banco; o EF lança erro ao consultar."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Logar o objeto ",e.jsx("code",{children:"IdentityUser"})," inteiro"]})," — vaza o ",e.jsx("code",{children:"PasswordHash"})," e o ",e.jsx("code",{children:"SecurityStamp"})," em logs. Mapeie para um DTO antes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Trocar a política de senha em produção sem migrar"})," — usuários antigos com senha curta continuam podendo logar; só novos cadastros sentem a regra."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"AddIdentity<TUser, TRole>"})," registra todo o pipeline com uma linha."]}),e.jsxs("li",{children:[e.jsx("code",{children:"UserManager"})," = cadastro; ",e.jsx("code",{children:"SignInManager"})," = login."]}),e.jsx("li",{children:"Senhas viram hash PBKDF2 com salt — nunca fique tentado a guardar texto puro."}),e.jsx("li",{children:"Roles para grupos amplos, claims para regras finas, policies para combinar."}),e.jsxs("li",{children:["Customize o usuário herdando de ",e.jsx("code",{children:"IdentityUser"})," e gerando nova migration."]})]})]})}export{i as default};
