import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(s,{title:"Configuration e Options pattern",subtitle:"Aprenda como o ASP.NET Core lê configurações de várias fontes (JSON, env vars, secrets) e como tipá-las com classes fortemente tipadas.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["Toda aplicação real precisa de ",e.jsx("strong",{children:"configurações"}),": endereço do banco de dados, chave de API externa, porta de escuta, nível de log, e por aí vai. Espalhar esses valores no código é receita para desastre — você acaba commitando senhas no Git ou tendo que recompilar para mudar uma URL. O ASP.NET Core resolve isso com um sistema unificado de configuração que lê de múltiplas fontes (arquivos, variáveis de ambiente, cofres de segredos) e as expõe como um único ",e.jsx("code",{children:"IConfiguration"}),". Em cima disso, o ",e.jsx("strong",{children:"Options pattern"})," mapeia seções para classes C# tipadas. Pense no ",e.jsx("code",{children:"IConfiguration"})," como uma agenda telefônica e nas Options como contatos transformados em fichas estruturadas."]}),e.jsxs("h2",{children:["O arquivo ",e.jsx("code",{children:"appsettings.json"})]}),e.jsx("p",{children:"É o arquivo principal, no estilo JSON, na raiz do projeto. Qualquer projeto ASP.NET já vem com um:"}),e.jsx("pre",{children:e.jsx("code",{children:`{
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
}`})}),e.jsxs("p",{children:["A estrutura é hierárquica: ",e.jsx("code",{children:"Email:Smtp"})," seria o caminho para acessar o servidor SMTP. Por convenção, separadores ",e.jsx("code",{children:":"})," (dois pontos) navegam pela árvore."]}),e.jsx("h2",{children:"Configurações por ambiente"}),e.jsxs("p",{children:["Você pode ter overrides por ambiente: ",e.jsx("code",{children:"appsettings.Development.json"}),", ",e.jsx("code",{children:"appsettings.Production.json"}),", ",e.jsx("code",{children:"appsettings.Staging.json"}),". O ASP.NET escolhe automaticamente baseado na variável ",e.jsx("code",{children:"ASPNETCORE_ENVIRONMENT"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`# appsettings.Development.json
{
    "Logging": {
        "LogLevel": { "Default": "Debug" }   // logs mais verbosos em dev
    },
    "ConnectionStrings": {
        "Principal": "Server=localhost;Database=LojaDev;..."
    }
}`})}),e.jsxs("p",{children:["O sistema faz ",e.jsx("em",{children:"merge"}),": o arquivo base + o do ambiente vigente. O do ambiente sobrescreve campos que conflitam."]}),e.jsx("h2",{children:"Variáveis de ambiente e User Secrets"}),e.jsxs("p",{children:["Senhas e chaves ",e.jsx("strong",{children:"não devem"})," entrar no Git. Em desenvolvimento, use ",e.jsx("strong",{children:"User Secrets"})," — um arquivo JSON guardado no perfil do usuário, fora do projeto:"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Inicializa secrets no projeto (cria UserSecretsId no .csproj)
dotnet user-secrets init

# Define um valor (vai para %APPDATA%MicrosoftUserSecrets... no Windows
# ou ~/.microsoft/usersecrets/... no Linux/macOS)
dotnet user-secrets set "Email:SenhaSmtp" "minhasenhasecreta"

# Listar
dotnet user-secrets list`})}),e.jsxs("p",{children:["Em produção, prefira ",e.jsx("strong",{children:"variáveis de ambiente"})," ou serviços como Azure Key Vault, AWS Secrets Manager ou HashiCorp Vault. Para variáveis de ambiente, o ",e.jsx("code",{children:":"})," vira ",e.jsx("code",{children:"__"})," (dois underscores) por compatibilidade com shells:"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Linux/macOS
export Email__SenhaSmtp="senha-de-producao"
export ConnectionStrings__Principal="Server=db.prod.com;..."

dotnet run`})}),e.jsx("h2",{children:"Ordem de precedência"}),e.jsx("p",{children:"Quando o mesmo valor existe em vários lugares, o ASP.NET segue esta ordem (do menor para o maior peso):"}),e.jsxs("ol",{children:[e.jsx("li",{children:e.jsx("code",{children:"appsettings.json"})}),e.jsx("li",{children:e.jsxs("code",{children:["appsettings.","{Environment}",".json"]})}),e.jsx("li",{children:"User Secrets (apenas em Development)"}),e.jsx("li",{children:"Variáveis de ambiente"}),e.jsx("li",{children:"Argumentos de linha de comando"})]}),e.jsx("p",{children:"Argumentos de CLI vencem tudo, o que é prático para overrides pontuais em deploys."}),e.jsxs("h2",{children:["Lendo via ",e.jsx("code",{children:"IConfiguration"})]}),e.jsxs("p",{children:["A forma mais direta — e crua — é injetar ",e.jsx("code",{children:"IConfiguration"})," e usar indexador ou ",e.jsx("code",{children:"GetSection"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class EmailService
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
var conn = builder.Configuration.GetConnectionString("Principal");`})}),e.jsx("p",{children:'Funciona, mas espalha "strings mágicas" pelo código. É melhor usar Options pattern.'}),e.jsx("h2",{children:"Options pattern: configuração tipada"}),e.jsxs("p",{children:["Você cria uma classe POCO (",e.jsx("em",{children:"Plain Old CLR Object"}),") que reflete a seção do JSON, registra-a no DI e injeta ",e.jsx("code",{children:"IOptions<T>"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class EmailOptions
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
    .ValidateOnStart();    // falha no boot se inválido`})}),e.jsx("pre",{children:e.jsx("code",{children:`public class EmailService
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
}`})}),e.jsx("h2",{children:"IOptions vs IOptionsSnapshot vs IOptionsMonitor"}),e.jsx("p",{children:"São três variações que diferem em como reagem a mudanças:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"IOptions<T>"})," — lê uma vez no startup. Singleton. Não atualiza nunca. Padrão para a maioria dos casos."]}),e.jsxs("li",{children:[e.jsx("code",{children:"IOptionsSnapshot<T>"})," — relê a cada requisição (Scoped). Útil quando o config pode mudar e você quer pegar versão fresca por request."]}),e.jsxs("li",{children:[e.jsx("code",{children:"IOptionsMonitor<T>"})," — Singleton com ",e.jsx("em",{children:"callback"})," de mudança. Ideal para serviços de longa duração (background jobs) que precisam reagir a alterações em tempo real."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`public class FilaProcessadora(IOptionsMonitor<EmailOptions> monitor)
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
}`})}),e.jsxs(o,{type:"info",title:"Reload automático",children:["Por padrão, o ASP.NET observa mudanças em ",e.jsx("code",{children:"appsettings.json"})," e dispara reload em memória. Apenas ",e.jsx("code",{children:"IOptionsSnapshot"})," e ",e.jsx("code",{children:"IOptionsMonitor"})," recebem os valores atualizados — ",e.jsx("code",{children:"IOptions"})," mantém o snapshot do startup."]}),e.jsx("h2",{children:"Múltiplas fontes customizadas"}),e.jsx("p",{children:"Você pode plugar fontes adicionais — banco de dados, JSON remoto, INI, XML:"}),e.jsx("pre",{children:e.jsx("code",{children:`builder.Configuration
    .AddJsonFile("config-extras.json", optional: true)
    .AddEnvironmentVariables(prefix: "MEUAPP_")  // só MEUAPP_*
    .AddCommandLine(args)
    .AddAzureKeyVault(new Uri("https://meucofre.vault.azure.net/"),
                      new DefaultAzureCredential());`})}),e.jsxs(o,{type:"warning",title:"Nunca commite secrets",children:["Adicione ",e.jsx("code",{children:"appsettings.Development.json"})," ao ",e.jsx("code",{children:".gitignore"})," se contiver senhas, e use ",e.jsx("em",{children:"User Secrets"})," para dev e ",e.jsx("em",{children:"Key Vault/env vars"})," para prod. O dia que uma chave de produção vazar para o GitHub público, o ataque chega em minutos."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:":"})," ou ",e.jsx("code",{children:"__"}),":"]})," ",e.jsx("code",{children:'config["Email.Smtp"]'})," não funciona; o separador correto é ",e.jsx("code",{children:":"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tipos errados:"})," ler ",e.jsx("code",{children:'"587"'})," como string em vez de int causa ",e.jsx("code",{children:"InvalidCastException"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"IOptions"})," esperando reload:"]})," ele NÃO atualiza; troque para ",e.jsx("code",{children:"IOptionsMonitor"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Hardcode em produção:"})," sempre passe overrides via env vars no Docker/Kubernetes."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Configuração vem de várias fontes (",e.jsx("code",{children:"appsettings.json"}),", env vars, secrets, CLI), todas unificadas em ",e.jsx("code",{children:"IConfiguration"}),"."]}),e.jsxs("li",{children:["Override por ambiente via ",e.jsxs("code",{children:["appsettings.","{Environment}",".json"]}),"."]}),e.jsxs("li",{children:["Em desenvolvimento, use ",e.jsx("strong",{children:"User Secrets"}),"; em produção, env vars ou Key Vault."]}),e.jsx("li",{children:"Options pattern transforma seções JSON em classes C# tipadas."}),e.jsxs("li",{children:[e.jsx("code",{children:"IOptions"})," = snapshot inicial; ",e.jsx("code",{children:"IOptionsSnapshot"})," = por request; ",e.jsx("code",{children:"IOptionsMonitor"})," = reativo."]}),e.jsxs("li",{children:["Validação com ",e.jsx("code",{children:"ValidateOnStart()"})," garante que o app não suba com config inválida."]})]})]})}export{n as default};
