import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BlazorWasm() {
  return (
    <PageContainer
      title="Blazor WebAssembly: C# rodando no navegador"
      subtitle="Descubra como o Blazor consegue executar código .NET diretamente no navegador, sem plugins, e quando essa abordagem faz sentido."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Por décadas, o navegador só entendia uma linguagem de programação: <strong>JavaScript</strong>. Em 2017 isso mudou com o <strong>WebAssembly</strong> (WASM) — um formato binário que qualquer navegador moderno pode executar com performance próxima à nativa. O Blazor WebAssembly tira proveito disso: ele empacota um <strong>runtime .NET</strong> em WASM e baixa para o navegador, permitindo que sua aplicação C# rode <em>do lado do cliente</em> — como um React ou Vue, mas com C#.
      </p>

      <h2>Server vs WebAssembly em uma frase</h2>
      <p>
        No <strong>Blazor Server</strong>, o C# roda no servidor e a UI é controlada por SignalR. No <strong>Blazor WebAssembly</strong>, o C# roda direto no navegador do usuário; o servidor (se existir) só serve arquivos estáticos e endpoints de API. A analogia: Server é um Uber (o motorista dirige por você); WebAssembly é alugar um carro e dirigir você mesmo.
      </p>

      <h2>Criando um projeto Blazor WASM</h2>
      <pre><code>{`# Standalone (sem backend ASP.NET)
dotnet new blazorwasm -n MeuApp

# Hosted (com backend ASP.NET no mesmo solution)
dotnet new blazorwasm -n MeuApp --hosted

cd MeuApp
dotnet run`}</code></pre>
      <p>
        O modo <strong>standalone</strong> gera apenas arquivos estáticos (HTML, CSS, .wasm, .dll) que você pode hospedar em qualquer lugar — GitHub Pages, S3, Netlify. O modo <strong>hosted</strong> cria também um projeto ASP.NET Core servindo APIs para o frontend.
      </p>

      <h2>O que acontece quando o usuário abre o site</h2>
      <p>
        O navegador baixa um HTML mínimo e um arquivo <code>blazor.webassembly.js</code>. Esse JS então puxa o <strong>runtime .NET</strong> em WASM (~1–2 MB), as DLLs da sua aplicação e dependências (mais alguns MB), e carrega tudo na memória do navegador. A partir daí, todo C# que você escreveu é executado <em>localmente</em> — sem chamar o servidor.
      </p>
      <pre><code>{`// Program.cs de um projeto Blazor WASM
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MeuApp;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");

// HttpClient para chamar APIs externas
builder.Services.AddScoped(sp => new HttpClient
{
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)
});

await builder.Build().RunAsync();`}</code></pre>

      <h2>Componentes funcionam igualzinho ao Server</h2>
      <p>
        A grande sacada do Blazor é que componentes <code>.razor</code> são iguais nos dois modos. Você pode literalmente mover um componente de um projeto Server para um WASM:
      </p>
      <pre><code>{`@page "/produtos"
@inject HttpClient Http

<h1>Produtos</h1>

@if (produtos is null) { <p>Carregando...</p> }
else
{
    <ul>
        @foreach (var p in produtos)
        {
            <li>@p.Nome — @p.Preco.ToString("C")</li>
        }
    </ul>
}

@code {
    private Produto[]? produtos;

    protected override async Task OnInitializedAsync()
    {
        // Esta chamada acontece DENTRO do navegador
        produtos = await Http.GetFromJsonAsync<Produto[]>("api/produtos");
    }

    public record Produto(int Id, string Nome, decimal Preco);
}`}</code></pre>

      <h2>AOT compilation: turbinando a performance</h2>
      <p>
        Por padrão, o Blazor WASM usa um <strong>interpretador</strong> de IL — ele lê as DLLs e executa instrução por instrução. É leve para baixar mas lento para cálculos pesados. A partir do .NET 6 existe <strong>AOT</strong> (<em>Ahead-of-Time compilation</em>): suas DLLs são compiladas para WASM nativo, ficando 5–20x mais rápidas em CPU-bound, ao custo de bundle 2–3x maior.
      </p>
      <pre><code>{`<!-- MeuApp.csproj -->
<PropertyGroup>
    <RunAOTCompilation>true</RunAOTCompilation>
</PropertyGroup>`}</code></pre>
      <p>
        Use AOT seletivamente: apps com gráficos, simulações, parsing pesado se beneficiam muito; um CRUD simples normalmente não vale o tamanho extra.
      </p>

      <h2>JS Interop: chamando JavaScript do C# (e vice-versa)</h2>
      <p>
        O navegador tem APIs (Geolocation, LocalStorage, Web Audio) que só existem em JS. O Blazor oferece <code>IJSRuntime</code> para fazer essas pontes:
      </p>
      <pre><code>{`@inject IJSRuntime JS

<button @onclick="MostrarAlerta">Alerta JS</button>
<button @onclick="LerLocalStorage">Ler localStorage</button>

@code {
    private async Task MostrarAlerta()
    {
        // Chama window.alert("...") no navegador
        await JS.InvokeVoidAsync("alert", "Olá do C#!");
    }

    private async Task LerLocalStorage()
    {
        var valor = await JS.InvokeAsync<string>(
            "localStorage.getItem", "tema");
        Console.WriteLine($"Tema salvo: {valor}");
    }
}`}</code></pre>
      <p>
        Para o caminho inverso (JS chamando C#), use <code>[JSInvokable]</code> em métodos estáticos ou em instâncias de objetos passadas via <code>DotNetObjectReference</code>.
      </p>

      <h2>PWA: app instalável</h2>
      <p>
        Adicione <code>--pwa</code> ao criar o projeto (<code>dotnet new blazorwasm -n MeuApp --pwa</code>) e o template gera um <strong>service worker</strong> + manifest. Isso permite que o usuário "instale" o app na tela inicial do celular e até funcione offline (depois do primeiro carregamento).
      </p>

      <AlertBox type="info" title="Hosted: o melhor de dois mundos">
        No modo hosted, o backend ASP.NET serve as DLLs com <strong>compressão Brotli</strong>, hospeda APIs no mesmo origin (sem CORS) e compartilha modelos C# entre cliente e servidor por meio de um projeto Class Library. É a configuração ideal para apps internos completos.
      </AlertBox>

      <h2>Quando escolher Blazor WebAssembly?</h2>
      <ul>
        <li><strong>Apps que precisam funcionar offline</strong> ou em rede instável.</li>
        <li><strong>SaaS multi-tenant</strong> com muitos usuários — você não paga RAM por sessão (como em Server).</li>
        <li><strong>Quer reaproveitar lógica C#</strong> entre frontend e backend (validações, DTOs, regras).</li>
        <li><strong>Hospedar em CDN</strong> sem servidor de aplicação (apenas arquivos estáticos).</li>
      </ul>
      <p>
        Não é uma boa quando: o tempo de primeiro carregamento precisa ser instantâneo (o download inicial pesa), seu público está em conexões lentas, ou o app precisa de SEO crítico (o conteúdo só aparece após executar WASM).
      </p>

      <AlertBox type="warning" title="Bundle size importa">
        Mesmo com compressão Brotli, um app Blazor WASM "vazio" baixa ~2 MB. Para apps grandes, considere o <strong>trimming</strong> (remover código não usado das DLLs) e dividir features em <em>lazy-loaded assemblies</em>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar Reflection completa:</strong> com trimming/AOT, alguns cenários de Reflection quebram. Prefira <em>Source Generators</em>.</li>
        <li><strong>Usar tipos não serializáveis</strong> em chamadas <code>HttpClient.GetFromJsonAsync</code> — gera erro silencioso.</li>
        <li><strong>Tratar o navegador como servidor:</strong> qualquer dado sensível incluído em DLLs estará visível ao usuário (extraível com ferramentas).</li>
        <li><strong>Esquecer de configurar CORS</strong> no backend quando o frontend está em outro domínio.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Blazor WebAssembly executa C# direto no navegador via WASM.</li>
        <li>Modos: <strong>standalone</strong> (só estático) ou <strong>hosted</strong> (com backend ASP.NET).</li>
        <li>Componentes <code>.razor</code> são idênticos aos do Blazor Server.</li>
        <li>AOT compilation acelera CPU-bound mas aumenta o bundle.</li>
        <li><code>IJSRuntime</code> permite interoperar com JavaScript em ambas direções.</li>
        <li>Adicionar <code>--pwa</code> habilita instalação e funcionamento offline.</li>
      </ul>
    </PageContainer>
  );
}
