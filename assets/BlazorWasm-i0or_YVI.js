import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(r,{title:"Blazor WebAssembly: C# rodando no navegador",subtitle:"Descubra como o Blazor consegue executar código .NET diretamente no navegador, sem plugins, e quando essa abordagem faz sentido.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["Por décadas, o navegador só entendia uma linguagem de programação: ",e.jsx("strong",{children:"JavaScript"}),". Em 2017 isso mudou com o ",e.jsx("strong",{children:"WebAssembly"})," (WASM) — um formato binário que qualquer navegador moderno pode executar com performance próxima à nativa. O Blazor WebAssembly tira proveito disso: ele empacota um ",e.jsx("strong",{children:"runtime .NET"})," em WASM e baixa para o navegador, permitindo que sua aplicação C# rode ",e.jsx("em",{children:"do lado do cliente"})," — como um React ou Vue, mas com C#."]}),e.jsx("h2",{children:"Server vs WebAssembly em uma frase"}),e.jsxs("p",{children:["No ",e.jsx("strong",{children:"Blazor Server"}),", o C# roda no servidor e a UI é controlada por SignalR. No ",e.jsx("strong",{children:"Blazor WebAssembly"}),", o C# roda direto no navegador do usuário; o servidor (se existir) só serve arquivos estáticos e endpoints de API. A analogia: Server é um Uber (o motorista dirige por você); WebAssembly é alugar um carro e dirigir você mesmo."]}),e.jsx("h2",{children:"Criando um projeto Blazor WASM"}),e.jsx("pre",{children:e.jsx("code",{children:`# Standalone (sem backend ASP.NET)
dotnet new blazorwasm -n MeuApp

# Hosted (com backend ASP.NET no mesmo solution)
dotnet new blazorwasm -n MeuApp --hosted

cd MeuApp
dotnet run`})}),e.jsxs("p",{children:["O modo ",e.jsx("strong",{children:"standalone"})," gera apenas arquivos estáticos (HTML, CSS, .wasm, .dll) que você pode hospedar em qualquer lugar — GitHub Pages, S3, Netlify. O modo ",e.jsx("strong",{children:"hosted"})," cria também um projeto ASP.NET Core servindo APIs para o frontend."]}),e.jsx("h2",{children:"O que acontece quando o usuário abre o site"}),e.jsxs("p",{children:["O navegador baixa um HTML mínimo e um arquivo ",e.jsx("code",{children:"blazor.webassembly.js"}),". Esse JS então puxa o ",e.jsx("strong",{children:"runtime .NET"})," em WASM (~1–2 MB), as DLLs da sua aplicação e dependências (mais alguns MB), e carrega tudo na memória do navegador. A partir daí, todo C# que você escreveu é executado ",e.jsx("em",{children:"localmente"})," — sem chamar o servidor."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Program.cs de um projeto Blazor WASM
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

await builder.Build().RunAsync();`})}),e.jsx("h2",{children:"Componentes funcionam igualzinho ao Server"}),e.jsxs("p",{children:["A grande sacada do Blazor é que componentes ",e.jsx("code",{children:".razor"})," são iguais nos dois modos. Você pode literalmente mover um componente de um projeto Server para um WASM:"]}),e.jsx("pre",{children:e.jsx("code",{children:`@page "/produtos"
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
}`})}),e.jsx("h2",{children:"AOT compilation: turbinando a performance"}),e.jsxs("p",{children:["Por padrão, o Blazor WASM usa um ",e.jsx("strong",{children:"interpretador"})," de IL — ele lê as DLLs e executa instrução por instrução. É leve para baixar mas lento para cálculos pesados. A partir do .NET 6 existe ",e.jsx("strong",{children:"AOT"})," (",e.jsx("em",{children:"Ahead-of-Time compilation"}),"): suas DLLs são compiladas para WASM nativo, ficando 5–20x mais rápidas em CPU-bound, ao custo de bundle 2–3x maior."]}),e.jsx("pre",{children:e.jsx("code",{children:`<!-- MeuApp.csproj -->
<PropertyGroup>
    <RunAOTCompilation>true</RunAOTCompilation>
</PropertyGroup>`})}),e.jsx("p",{children:"Use AOT seletivamente: apps com gráficos, simulações, parsing pesado se beneficiam muito; um CRUD simples normalmente não vale o tamanho extra."}),e.jsx("h2",{children:"JS Interop: chamando JavaScript do C# (e vice-versa)"}),e.jsxs("p",{children:["O navegador tem APIs (Geolocation, LocalStorage, Web Audio) que só existem em JS. O Blazor oferece ",e.jsx("code",{children:"IJSRuntime"})," para fazer essas pontes:"]}),e.jsx("pre",{children:e.jsx("code",{children:`@inject IJSRuntime JS

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
}`})}),e.jsxs("p",{children:["Para o caminho inverso (JS chamando C#), use ",e.jsx("code",{children:"[JSInvokable]"})," em métodos estáticos ou em instâncias de objetos passadas via ",e.jsx("code",{children:"DotNetObjectReference"}),"."]}),e.jsx("h2",{children:"PWA: app instalável"}),e.jsxs("p",{children:["Adicione ",e.jsx("code",{children:"--pwa"})," ao criar o projeto (",e.jsx("code",{children:"dotnet new blazorwasm -n MeuApp --pwa"}),") e o template gera um ",e.jsx("strong",{children:"service worker"}),' + manifest. Isso permite que o usuário "instale" o app na tela inicial do celular e até funcione offline (depois do primeiro carregamento).']}),e.jsxs(o,{type:"info",title:"Hosted: o melhor de dois mundos",children:["No modo hosted, o backend ASP.NET serve as DLLs com ",e.jsx("strong",{children:"compressão Brotli"}),", hospeda APIs no mesmo origin (sem CORS) e compartilha modelos C# entre cliente e servidor por meio de um projeto Class Library. É a configuração ideal para apps internos completos."]}),e.jsx("h2",{children:"Quando escolher Blazor WebAssembly?"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Apps que precisam funcionar offline"})," ou em rede instável."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"SaaS multi-tenant"})," com muitos usuários — você não paga RAM por sessão (como em Server)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Quer reaproveitar lógica C#"})," entre frontend e backend (validações, DTOs, regras)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Hospedar em CDN"})," sem servidor de aplicação (apenas arquivos estáticos)."]})]}),e.jsx("p",{children:"Não é uma boa quando: o tempo de primeiro carregamento precisa ser instantâneo (o download inicial pesa), seu público está em conexões lentas, ou o app precisa de SEO crítico (o conteúdo só aparece após executar WASM)."}),e.jsxs(o,{type:"warning",title:"Bundle size importa",children:['Mesmo com compressão Brotli, um app Blazor WASM "vazio" baixa ~2 MB. Para apps grandes, considere o ',e.jsx("strong",{children:"trimming"})," (remover código não usado das DLLs) e dividir features em ",e.jsx("em",{children:"lazy-loaded assemblies"}),"."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar Reflection completa:"})," com trimming/AOT, alguns cenários de Reflection quebram. Prefira ",e.jsx("em",{children:"Source Generators"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar tipos não serializáveis"})," em chamadas ",e.jsx("code",{children:"HttpClient.GetFromJsonAsync"})," — gera erro silencioso."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tratar o navegador como servidor:"})," qualquer dado sensível incluído em DLLs estará visível ao usuário (extraível com ferramentas)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer de configurar CORS"})," no backend quando o frontend está em outro domínio."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Blazor WebAssembly executa C# direto no navegador via WASM."}),e.jsxs("li",{children:["Modos: ",e.jsx("strong",{children:"standalone"})," (só estático) ou ",e.jsx("strong",{children:"hosted"})," (com backend ASP.NET)."]}),e.jsxs("li",{children:["Componentes ",e.jsx("code",{children:".razor"})," são idênticos aos do Blazor Server."]}),e.jsx("li",{children:"AOT compilation acelera CPU-bound mas aumenta o bundle."}),e.jsxs("li",{children:[e.jsx("code",{children:"IJSRuntime"})," permite interoperar com JavaScript em ambas direções."]}),e.jsxs("li",{children:["Adicionar ",e.jsx("code",{children:"--pwa"})," habilita instalação e funcionamento offline."]})]})]})}export{n as default};
