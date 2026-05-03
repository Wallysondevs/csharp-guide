import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AspnetIntro() {
  return (
    <PageContainer
      title="ASP.NET Core: visão geral do framework web"
      subtitle="Entenda o que é o ASP.NET Core, de onde ele veio, como funciona por dentro e por que é uma das stacks mais rápidas do mercado."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Quando você abre o navegador e digita um endereço, alguma coisa do outro lado precisa <em>receber</em> aquela requisição, decidir o que fazer e devolver uma resposta (uma página HTML, um JSON, uma imagem). Esse "alguma coisa" é um <strong>servidor web</strong>. O <strong>ASP.NET Core</strong> é o framework que a Microsoft mantém para você escrever esse servidor em C#. Pense nele como o motor de um carro: você fornece a carroceria (a lógica do seu negócio) e o ASP.NET cuida de virar a chave, ligar o motor, distribuir combustível e mover as rodas.
      </p>

      <h2>De .NET Framework a .NET Core: uma breve história</h2>
      <p>
        Em 2002 a Microsoft lançou o <strong>ASP.NET</strong> original, parte do <strong>.NET Framework</strong> — um runtime (ambiente de execução) que só rodava em Windows. Era acoplado ao <strong>IIS</strong> (Internet Information Services), o servidor web da Microsoft. Funcionava bem, mas só servia quem usava Windows Server, e ficou pesado e difícil de modernizar com o tempo.
      </p>
      <p>
        Em 2016 a Microsoft tomou uma decisão radical: reescreveu tudo do zero, com código aberto, multi-plataforma (Linux, macOS e Windows) e modular. Nasceu o <strong>ASP.NET Core 1.0</strong>. Hoje, em 2025, estamos no <strong>.NET 9</strong> (a Microsoft tirou o "Core" do nome em 2020, virou só "ASP.NET" rodando sobre o ".NET" unificado). É um dos frameworks web mais rápidos em benchmarks como o TechEmpower.
      </p>
      <pre><code>{`# Criar um projeto web vazio com a CLI do .NET
dotnet new web -n MeuSite
cd MeuSite
dotnet run

# Sai algo como:
# Now listening on: http://localhost:5000
# Application started. Press Ctrl+C to shut down.`}</code></pre>

      <h2>Kestrel: o servidor que vem dentro</h2>
      <p>
        Diferente do ASP.NET clássico, que dependia do IIS, todo app ASP.NET Core embute o <strong>Kestrel</strong> — um servidor HTTP escrito em C# de altíssima performance. Quando você roda <code>dotnet run</code>, o Kestrel sobe ouvindo em uma porta TCP e já está pronto para receber requisições. Isso significa que seu app é, ao mesmo tempo, a aplicação <em>e</em> o servidor — basta um único processo.
      </p>
      <p>
        Em produção, é comum colocar um <strong>reverse proxy</strong> (Nginx, IIS ou YARP) na frente do Kestrel. O proxy lida com TLS (HTTPS), compressão, rate limiting e múltiplos sites no mesmo IP, e repassa as requisições para o Kestrel via HTTP simples na rede interna. É um padrão também usado em Node.js e Go.
      </p>
      <pre><code>{`var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Endpoint mínimo: recebe GET / e responde "Olá!"
app.MapGet("/", () => "Olá do Kestrel!");

app.Run(); // Inicia o servidor`}</code></pre>

      <h2>Hosting e o pipeline de requisições</h2>
      <p>
        Toda requisição HTTP que chega passa por um <strong>pipeline</strong> — uma fila de pequenos componentes chamados <strong>middlewares</strong>. Cada middleware pode ler/modificar a requisição, decidir se passa para o próximo ou se já devolve uma resposta. É como uma linha de produção numa fábrica: a peça (a requisição) entra de um lado e cada estação faz uma operação (autenticar, logar, comprimir, rotear).
      </p>
      <pre><code>{`var app = builder.Build();

app.UseHttpsRedirection();   // 1. Redireciona HTTP para HTTPS
app.UseAuthentication();     // 2. Lê cookies/JWT do usuário
app.UseAuthorization();      // 3. Verifica permissões
app.MapControllers();        // 4. Roteia para o Controller certo

app.Run();`}</code></pre>
      <p>
        A <strong>ordem</strong> em que você adiciona middlewares importa muito — autenticação tem que vir antes de autorização, por exemplo. Veremos isso em detalhe no capítulo de Middleware.
      </p>

      <AlertBox type="info" title="Comparação rápida">
        Vindo de outras stacks? <code>app.Run()</code> equivale ao <code>app.listen()</code> do Express (Node), os middlewares correspondem a <em>filters</em> do Spring Boot (Java) e o Kestrel cumpre o papel do Tomcat ou do Puma (Rails).
      </AlertBox>

      <h2>Modelos de aplicação que o ASP.NET oferece</h2>
      <p>
        Em cima desse pipeline, o ASP.NET Core oferece vários "estilos" de programação para você escolher. Cada um vira um capítulo deste livro:
      </p>
      <ul>
        <li><strong>Minimal APIs:</strong> APIs REST em poucas linhas, ideal para microsserviços pequenos.</li>
        <li><strong>MVC Controllers:</strong> estrutura clássica organizada em Controllers, indicada para APIs grandes.</li>
        <li><strong>Razor Pages:</strong> páginas server-side com code-behind (.cshtml + .cshtml.cs), ótimo para sites tradicionais.</li>
        <li><strong>Blazor Server / WebAssembly:</strong> SPAs (Single Page Applications) escritas em C# em vez de JavaScript.</li>
        <li><strong>SignalR:</strong> comunicação em tempo real (WebSocket) para chats, dashboards e jogos.</li>
        <li><strong>gRPC:</strong> chamadas de procedimento remoto binárias para comunicação entre serviços.</li>
      </ul>

      <h2>Multi-plataforma de verdade</h2>
      <p>
        Você pode desenvolver no Windows com Visual Studio, no macOS com Rider, no Linux com VS Code — e fazer deploy em qualquer um deles ou em containers Docker baseados em Alpine, Ubuntu, Debian. A própria Microsoft publica imagens oficiais como <code>mcr.microsoft.com/dotnet/aspnet:9.0</code>.
      </p>
      <pre><code>{`# Dockerfile típico de produção
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "MeuSite.dll"]`}</code></pre>

      <AlertBox type="success" title="Performance real">
        Em benchmarks recentes, ASP.NET Core processa <strong>milhões de requisições por segundo</strong> em uma única máquina, ficando à frente de Node.js, Spring Boot e Django na maioria dos cenários. Boa parte disso vem do Kestrel, do JIT do .NET e do uso intensivo de <code>Span&lt;T&gt;</code> internamente.
      </AlertBox>

      <h2>Erros comuns ao começar</h2>
      <ul>
        <li><strong>Confundir .NET Framework com .NET (Core):</strong> Framework está em modo manutenção; novos projetos devem usar .NET 8/9.</li>
        <li><strong>Achar que precisa do IIS:</strong> Kestrel já é um servidor completo, especialmente em Linux/Docker.</li>
        <li><strong>Inverter a ordem dos middlewares</strong> (ex.: chamar <code>UseAuthorization()</code> antes de <code>UseAuthentication()</code>).</li>
        <li><strong>Esquecer <code>app.Run()</code>:</strong> sem essa linha o programa termina antes de servir qualquer requisição.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>ASP.NET Core é o framework web open-source e multi-plataforma do .NET.</li>
        <li>Veio substituir o ASP.NET clássico (Framework, Windows-only) com foco em performance e portabilidade.</li>
        <li><strong>Kestrel</strong> é o servidor HTTP embutido em todo app.</li>
        <li>Toda requisição passa por um <strong>pipeline de middlewares</strong> em ordem.</li>
        <li>Você pode escolher entre Minimal APIs, MVC, Razor Pages, Blazor, SignalR, gRPC.</li>
        <li>Roda em Linux, macOS, Windows, Docker — sem amarras com IIS.</li>
      </ul>
    </PageContainer>
  );
}
