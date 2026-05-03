import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ConfigurationOptions() {
  return (
    <PageContainer
      title="Configuration e Options pattern"
      subtitle="Aprenda como o ASP.NET Core lê configurações de várias fontes (JSON, env vars, secrets) e como tipá-las com classes fortemente tipadas."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Toda aplicação real precisa de <strong>configurações</strong>: endereço do banco de dados, chave de API externa, porta de escuta, nível de log, e por aí vai. Espalhar esses valores no código é receita para desastre — você acaba commitando senhas no Git ou tendo que recompilar para mudar uma URL. O ASP.NET Core resolve isso com um sistema unificado de configuração que lê de múltiplas fontes (arquivos, variáveis de ambiente, cofres de segredos) e as expõe como um único <code>IConfiguration</code>. Em cima disso, o <strong>Options pattern</strong> mapeia seções para classes C# tipadas. Pense no <code>IConfiguration</code> como uma agenda telefônica e nas Options como contatos transformados em fichas estruturadas.
      </p>

      <h2>O arquivo <code>appsettings.json</code></h2>
      <p>
        É o arquivo principal, no estilo JSON, na raiz do projeto. Qualquer projeto ASP.NET já vem com um:
      </p>
      <pre><code>{`{
    "Logging": {
        "LogLevel": {
            "Default": "Information",
            "Microsoft.AspNetCore": "Warning"
        }
    },
    "AllowedHosts": "*",
    "ConnectionStrings": {
        "Principal": "Server=localhost;Database=Loja;User=app;Password=xxx"
    },
    "Email": {
        "Smtp": "smtp.gmail.com",
        "Porta": 587,
        "Remetente": "noreply@minhaloja.com"
    }
}`}</code></pre>
      <p>
        A estrutura é hierárquica: <code>Email:Smtp</code> seria o caminho para acessar o servidor SMTP. Por convenção, separadores <code>:</code> (dois pontos) navegam pela árvore.
      </p>

      <h2>Configurações por ambiente</h2>
      <p>
        Você pode ter overrides por ambiente: <code>appsettings.Development.json</code>, <code>appsettings.Production.json</code>, <code>appsettings.Staging.json</code>. O ASP.NET escolhe automaticamente baseado na variável <code>ASPNETCORE_ENVIRONMENT</code>:
      </p>
      <pre><code>{`# appsettings.Development.json
{
    "Logging": {
        "LogLevel": { "Default": "Debug" }   // logs mais verbosos em dev
    },
    "ConnectionStrings": {
        "Principal": "Server=localhost;Database=LojaDev;..."
    }
}`}</code></pre>
      <p>
        O sistema faz <em>merge</em>: o arquivo base + o do ambiente vigente. O do ambiente sobrescreve campos que conflitam.
      </p>

      <h2>Variáveis de ambiente e User Secrets</h2>
      <p>
        Senhas e chaves <strong>não devem</strong> entrar no Git. Em desenvolvimento, use <strong>User Secrets</strong> — um arquivo JSON guardado no perfil do usuário, fora do projeto:
      </p>
      <pre><code>{`# Inicializa secrets no projeto (cria UserSecretsId no .csproj)
dotnet user-secrets init

# Define um valor (vai para %APPDATA%\Microsoft\UserSecrets\... no Windows
# ou ~/.microsoft/usersecrets/... no Linux/macOS)
dotnet user-secrets set "Email:SenhaSmtp" "minhasenhasecreta"

# Listar
dotnet user-secrets list`}</code></pre>
      <p>
        Em produção, prefira <strong>variáveis de ambiente</strong> ou serviços como Azure Key Vault, AWS Secrets Manager ou HashiCorp Vault. Para variáveis de ambiente, o <code>:</code> vira <code>__</code> (dois underscores) por compatibilidade com shells:
      </p>
      <pre><code>{`# Linux/macOS
export Email__SenhaSmtp="senha-de-producao"
export ConnectionStrings__Principal="Server=db.prod.com;..."

dotnet run`}</code></pre>

      <h2>Ordem de precedência</h2>
      <p>
        Quando o mesmo valor existe em vários lugares, o ASP.NET segue esta ordem (do menor para o maior peso):
      </p>
      <ol>
        <li><code>appsettings.json</code></li>
        <li><code>appsettings.{`{Environment}`}.json</code></li>
        <li>User Secrets (apenas em Development)</li>
        <li>Variáveis de ambiente</li>
        <li>Argumentos de linha de comando</li>
      </ol>
      <p>
        Argumentos de CLI vencem tudo, o que é prático para overrides pontuais em deploys.
      </p>

      <h2>Lendo via <code>IConfiguration</code></h2>
      <p>
        A forma mais direta — e crua — é injetar <code>IConfiguration</code> e usar indexador ou <code>GetSection</code>:
      </p>
      <pre><code>{`public class EmailService
{
    private readonly string _smtp;
    private readonly int _porta;

    public EmailService(IConfiguration config)
    {
        _smtp = config["Email:Smtp"] ?? throw new("Smtp não configurado");
        _porta = config.GetValue<int>("Email:Porta");
    }
}

// Para connection strings, há um atalho:
var conn = builder.Configuration.GetConnectionString("Principal");`}</code></pre>
      <p>
        Funciona, mas espalha "strings mágicas" pelo código. É melhor usar Options pattern.
      </p>

      <h2>Options pattern: configuração tipada</h2>
      <p>
        Você cria uma classe POCO (<em>Plain Old CLR Object</em>) que reflete a seção do JSON, registra-a no DI e injeta <code>IOptions&lt;T&gt;</code>:
      </p>
      <pre><code>{`public class EmailOptions
{
    public const string SectionName = "Email";

    public string Smtp { get; set; } = "";
    public int Porta { get; set; } = 587;
    public string Remetente { get; set; } = "";
    public string SenhaSmtp { get; set; } = "";
}

// Em Program.cs
builder.Services.Configure<EmailOptions>(
    builder.Configuration.GetSection(EmailOptions.SectionName));

// Bonus: validação automática
builder.Services.AddOptions<EmailOptions>()
    .Bind(builder.Configuration.GetSection("Email"))
    .ValidateDataAnnotations()
    .ValidateOnStart();    // falha no boot se inválido`}</code></pre>
      <pre><code>{`public class EmailService
{
    private readonly EmailOptions _opts;

    public EmailService(IOptions<EmailOptions> options)
    {
        _opts = options.Value;
    }

    public void Enviar(string para, string assunto)
    {
        Console.WriteLine($"[{_opts.Smtp}:{_opts.Porta}] {assunto}");
    }
}`}</code></pre>

      <h2>IOptions vs IOptionsSnapshot vs IOptionsMonitor</h2>
      <p>
        São três variações que diferem em como reagem a mudanças:
      </p>
      <ul>
        <li><code>IOptions&lt;T&gt;</code> — lê uma vez no startup. Singleton. Não atualiza nunca. Padrão para a maioria dos casos.</li>
        <li><code>IOptionsSnapshot&lt;T&gt;</code> — relê a cada requisição (Scoped). Útil quando o config pode mudar e você quer pegar versão fresca por request.</li>
        <li><code>IOptionsMonitor&lt;T&gt;</code> — Singleton com <em>callback</em> de mudança. Ideal para serviços de longa duração (background jobs) que precisam reagir a alterações em tempo real.</li>
      </ul>
      <pre><code>{`public class FilaProcessadora(IOptionsMonitor<EmailOptions> monitor)
{
    private EmailOptions _opts;

    public FilaProcessadora(IOptionsMonitor<EmailOptions> monitor) : this()
    {
        _opts = monitor.CurrentValue;
        // Notificado quando o JSON muda em disco
        monitor.OnChange(novo =>
        {
            _opts = novo;
            Console.WriteLine($"Config recarregada: {_opts.Smtp}");
        });
    }
}`}</code></pre>

      <AlertBox type="info" title="Reload automático">
        Por padrão, o ASP.NET observa mudanças em <code>appsettings.json</code> e dispara reload em memória. Apenas <code>IOptionsSnapshot</code> e <code>IOptionsMonitor</code> recebem os valores atualizados — <code>IOptions</code> mantém o snapshot do startup.
      </AlertBox>

      <h2>Múltiplas fontes customizadas</h2>
      <p>
        Você pode plugar fontes adicionais — banco de dados, JSON remoto, INI, XML:
      </p>
      <pre><code>{`builder.Configuration
    .AddJsonFile("config-extras.json", optional: true)
    .AddEnvironmentVariables(prefix: "MEUAPP_")  // só MEUAPP_*
    .AddCommandLine(args)
    .AddAzureKeyVault(new Uri("https://meucofre.vault.azure.net/"),
                      new DefaultAzureCredential());`}</code></pre>

      <AlertBox type="warning" title="Nunca commite secrets">
        Adicione <code>appsettings.Development.json</code> ao <code>.gitignore</code> se contiver senhas, e use <em>User Secrets</em> para dev e <em>Key Vault/env vars</em> para prod. O dia que uma chave de produção vazar para o GitHub público, o ataque chega em minutos.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>:</code> ou <code>__</code>:</strong> <code>config["Email.Smtp"]</code> não funciona; o separador correto é <code>:</code>.</li>
        <li><strong>Tipos errados:</strong> ler <code>"587"</code> como string em vez de int causa <code>InvalidCastException</code>.</li>
        <li><strong>Usar <code>IOptions</code> esperando reload:</strong> ele NÃO atualiza; troque para <code>IOptionsMonitor</code>.</li>
        <li><strong>Hardcode em produção:</strong> sempre passe overrides via env vars no Docker/Kubernetes.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Configuração vem de várias fontes (<code>appsettings.json</code>, env vars, secrets, CLI), todas unificadas em <code>IConfiguration</code>.</li>
        <li>Override por ambiente via <code>appsettings.{`{Environment}`}.json</code>.</li>
        <li>Em desenvolvimento, use <strong>User Secrets</strong>; em produção, env vars ou Key Vault.</li>
        <li>Options pattern transforma seções JSON em classes C# tipadas.</li>
        <li><code>IOptions</code> = snapshot inicial; <code>IOptionsSnapshot</code> = por request; <code>IOptionsMonitor</code> = reativo.</li>
        <li>Validação com <code>ValidateOnStart()</code> garante que o app não suba com config inválida.</li>
      </ul>
    </PageContainer>
  );
}
