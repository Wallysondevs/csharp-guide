import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IdentityAspnet() {
  return (
    <PageContainer
      title="ASP.NET Identity: usuários, senhas e roles"
      subtitle="Cadastro, login, hash de senha, papéis (roles) e claims sem reinventar a roda."
      difficulty="intermediario"
      timeToRead="18 min"
    >
      <p>
        Quase toda aplicação web precisa, em algum momento, responder à pergunta: <em>"quem é a pessoa do outro lado da tela?"</em>. Implementar isso à mão é um campo minado: hashing de senha, salt, lockout após tentativas erradas, confirmação de e-mail, recuperação por token, autenticação por dois fatores… São centenas de horas para fazer mal. O <strong>ASP.NET Core Identity</strong> é a biblioteca oficial da Microsoft que resolve tudo isso de forma plugável. Pense nela como um "kit pronto de portaria": você ainda decide quem entra, mas o catraca, o crachá e o livro de visitas vêm prontos.
      </p>

      <h2>Instalação e configuração inicial</h2>
      <p>
        Identity é entregue como um conjunto de pacotes NuGet. O mais comum em projetos com Entity Framework Core é <code>Microsoft.AspNetCore.Identity.EntityFrameworkCore</code>, que persiste usuários e roles num banco relacional. A peça central é o <strong>DbContext</strong> (a classe que representa a conexão com o banco no EF) — ele precisa herdar de <code>IdentityDbContext</code> em vez de <code>DbContext</code>, para já trazer as tabelas de usuários, roles, claims e tokens.
      </p>
      <pre><code>{`// Program.cs (.NET 8/9)
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
app.Run();`}</code></pre>
      <p>
        A ordem dos middlewares importa: <code>UseAuthentication</code> sempre <strong>antes</strong> de <code>UseAuthorization</code>. Autenticação descobre <em>quem</em> você é (lendo o cookie ou o JWT); autorização decide <em>se</em> você pode entrar naquela rota.
      </p>

      <h2>O DbContext de Identity</h2>
      <pre><code>{`using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : IdentityDbContext<IdentityUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

    // Suas tabelas de domínio convivem com as de Identity
    public DbSet<Pedido> Pedidos => Set<Pedido>();
}`}</code></pre>
      <p>
        Ao rodar <code>dotnet ef migrations add Initial</code> e <code>dotnet ef database update</code>, são criadas tabelas como <code>AspNetUsers</code>, <code>AspNetRoles</code>, <code>AspNetUserRoles</code>, <code>AspNetUserClaims</code> e <code>AspNetUserTokens</code>. Você não precisa escrever SQL para nada disso.
      </p>

      <h2>UserManager e SignInManager</h2>
      <p>
        Esses dois serviços, injetados no construtor por DI, são as duas mãos da Identity. <code>UserManager</code> cuida do <em>cadastro</em> (criar, atualizar, deletar usuário, gerenciar senha, claims, roles). <code>SignInManager</code> cuida do <em>login</em> (validar senha, emitir cookie, bloquear, deslogar).
      </p>
      <pre><code>{`[ApiController]
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
}`}</code></pre>

      <AlertBox type="info" title="Como a senha é guardada?">
        A senha em texto puro <strong>nunca</strong> vai para o banco. O Identity usa <code>PasswordHasher</code>, que aplica <em>PBKDF2</em> com SHA-256, 100.000+ iterações e um salt aleatório por usuário. O resultado fica num único campo <code>PasswordHash</code> em <code>AspNetUsers</code>. Essa abordagem cumpre o mesmo papel de bibliotecas como bcrypt/argon2: tornar a quebra por força bruta proibitivamente cara.
      </AlertBox>

      <h2>Roles e Claims</h2>
      <p>
        Uma <strong>role</strong> é um rótulo grosso ("Admin", "Gerente", "Cliente"). Uma <strong>claim</strong> é um par chave-valor mais fino ("departamento=financeiro", "podeAprovarAté=10000"). Use roles para controle simples e claims quando precisar de granularidade.
      </p>
      <pre><code>{`// Criar role e atribuir
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
public IActionResult Relatorios() => Ok();`}</code></pre>

      <h2>Customizando o usuário</h2>
      <p>
        <code>IdentityUser</code> traz só o básico (Id, UserName, Email, PhoneNumber). Quase sempre você quer mais campos. Basta herdar:
      </p>
      <pre><code>{`public class AppUser : IdentityUser
{
    public string NomeCompleto { get; set; } = "";
    public DateOnly DataNascimento { get; set; }
}

public class AppDbContext : IdentityDbContext<AppUser> { /* ... */ }

builder.Services
    .AddIdentity<AppUser, IdentityRole>(/*...*/)
    .AddEntityFrameworkStores<AppDbContext>();`}</code></pre>
      <p>
        Após herdar, gere uma nova migration e os campos viram colunas em <code>AspNetUsers</code>. Todo o restante (UserManager&lt;AppUser&gt;, SignInManager&lt;AppUser&gt;) continua funcionando.
      </p>

      <AlertBox type="warning" title="API ou MVC?">
        Identity nasceu pensando em <em>cookies</em> (apps MVC/Razor). Para APIs REST puras, geralmente você combina Identity (para guardar usuários e validar senha) com <strong>JWT Bearer</strong> (para emitir tokens). Não use cookies em APIs consumidas por mobile/SPA cross-domain — você pegará dor de cabeça com CORS e CSRF.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>UseAuthentication()</code></strong> antes de <code>UseAuthorization()</code> — o servidor responde 401 mesmo com login válido porque ninguém leu o cookie.</li>
        <li><strong>Não rodar a migration</strong> após herdar <code>IdentityUser</code> — a coluna nova existe na classe mas não no banco; o EF lança erro ao consultar.</li>
        <li><strong>Logar o objeto <code>IdentityUser</code> inteiro</strong> — vaza o <code>PasswordHash</code> e o <code>SecurityStamp</code> em logs. Mapeie para um DTO antes.</li>
        <li><strong>Trocar a política de senha em produção sem migrar</strong> — usuários antigos com senha curta continuam podendo logar; só novos cadastros sentem a regra.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>AddIdentity&lt;TUser, TRole&gt;</code> registra todo o pipeline com uma linha.</li>
        <li><code>UserManager</code> = cadastro; <code>SignInManager</code> = login.</li>
        <li>Senhas viram hash PBKDF2 com salt — nunca fique tentado a guardar texto puro.</li>
        <li>Roles para grupos amplos, claims para regras finas, policies para combinar.</li>
        <li>Customize o usuário herdando de <code>IdentityUser</code> e gerando nova migration.</li>
      </ul>
    </PageContainer>
  );
}
