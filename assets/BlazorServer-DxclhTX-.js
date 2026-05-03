import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(r,{title:"Blazor Server: SPA com C# rodando no servidor",subtitle:"Construa interfaces interativas em tempo real escrevendo C# no lugar de JavaScript — com renderização e estado vivendo no servidor.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["SPA (",e.jsx("em",{children:"Single Page Application"}),') é uma aplicação web em que o navegador baixa a "casca" da página uma vez só e, depois, troca pedaços de tela sem recarregar — pense em Gmail ou Trello. Tradicionalmente isso exige ',e.jsx("strong",{children:"JavaScript"})," (React, Vue, Angular). O ",e.jsx("strong",{children:"Blazor"})," é a aposta da Microsoft para escrever SPAs em ",e.jsx("strong",{children:"C#"}),". E ele tem dois sabores: ",e.jsx("em",{children:"Server"})," (este capítulo) e ",e.jsx("em",{children:"WebAssembly"})," (próximo). Pense no Blazor Server como um boneco de marionete: o navegador é o boneco visível, mas todos os fios e a inteligência ficam com o titereiro (o servidor)."]}),e.jsx("h2",{children:"Como funciona por baixo"}),e.jsxs("p",{children:["Em Blazor Server, sua aplicação ",e.jsx("em",{children:"roda inteira no servidor"}),". Quando o usuário abre o site, o servidor envia um HTML inicial e abre uma conexão ",e.jsx("strong",{children:"SignalR"}),' (uma camada do .NET sobre WebSocket — um "telefone" sempre aberto entre navegador e servidor). A partir daí, cada clique, cada digitação, é enviado como um eventozinho pelo cabo. O servidor recalcula o que mudou na tela e devolve só o "diff" para o navegador aplicar.']}),e.jsx("p",{children:"Vantagem: o navegador baixa muito pouco código (só um runtime JS minúsculo do Blazor). Desvantagem: tudo depende da rede; com latência alta (200ms+), a interface fica lenta."}),e.jsx("h2",{children:"Habilitando Blazor Server"}),e.jsx("pre",{children:e.jsx("code",{children:`var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();   // habilita o modo "Server"

var app = builder.Build();

app.UseStaticFiles();
app.MapRazorComponents<App>()
   .AddInteractiveServerRenderMode();

app.Run();`})}),e.jsxs("p",{children:["O ponto-chave é ",e.jsx("code",{children:"AddInteractiveServerComponents()"}),": ele registra o hub SignalR que mantém a conexão com cada navegador. Cada usuário conectado consome um pouquinho de RAM no servidor (estado da UI dele)."]}),e.jsxs("h2",{children:["Componentes ",e.jsx("code",{children:".razor"})]}),e.jsxs("p",{children:["Tudo no Blazor é ",e.jsx("strong",{children:"componente"}),": arquivos com extensão ",e.jsx("code",{children:".razor"})," que misturam HTML, sintaxe Razor (",e.jsx("code",{children:"@"}),") e blocos C# em ",e.jsx("code",{children:"@code"}),". Um componente pode usar outros como tags HTML."]}),e.jsx("pre",{children:e.jsx("code",{children:`@* Components/Pages/Contador.razor *@
@page "/contador"
@rendermode InteractiveServer

<h1>Contador</h1>
<p>Valor atual: <strong>@valor</strong></p>

<button class="btn btn-primary" @onclick="Incrementar">
    Clique aqui
</button>

@code {
    private int valor = 0;

    private void Incrementar()
    {
        valor++;
        // Não precisa chamar StateHasChanged() — eventos da UI já disparam re-render
    }
}`})}),e.jsxs("p",{children:["A diretiva ",e.jsx("code",{children:'@page "/contador"'})," faz desse componente uma rota; ",e.jsx("code",{children:"@onclick"})," liga o evento HTML a um método C#; ",e.jsx("code",{children:"@valor"})," imprime a variável no HTML. Quando o método modifica o estado, o Blazor recalcula o que mudou e envia o diff para o navegador."]}),e.jsx("h2",{children:"Componentes reutilizáveis com parâmetros"}),e.jsx("pre",{children:e.jsx("code",{children:`@* Components/Cartao.razor *@
<div class="card">
    <h3>@Titulo</h3>
    <div>@ChildContent</div>
</div>

@code {
    [Parameter, EditorRequired]
    public string Titulo { get; set; } = "";

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}`})}),e.jsx("pre",{children:e.jsx("code",{children:`@* Uso em outra página *@
<Cartao Titulo="Promoção da semana">
    <p>Tudo com 30% de desconto até sexta!</p>
    <button>Comprar</button>
</Cartao>`})}),e.jsxs("p",{children:[e.jsx("code",{children:"RenderFragment"}),' é o equivalente do "children" no React: aceita qualquer marcação Razor. ',e.jsx("code",{children:"[Parameter]"})," expõe a propriedade ao componente pai."]}),e.jsx("h2",{children:"Render modes (.NET 8 e 9)"}),e.jsxs("p",{children:["Desde o .NET 8 o Blazor tem ",e.jsx("strong",{children:"render modes"})," que decidem ONDE cada componente roda: estático no servidor (HTML inicial), interativo no servidor (SignalR), interativo no WebAssembly (no navegador), ou Auto (começa Server e migra para WASM quando o runtime baixa). Você marca componente por componente:"]}),e.jsx("pre",{children:e.jsx("code",{children:`@page "/dashboard"
@rendermode InteractiveServer        @* este aqui é Server *@

@page "/grafico"
@rendermode InteractiveWebAssembly   @* este aqui roda no navegador *@

@page "/sobre"
@* sem @rendermode = renderização estática (apenas HTML, sem interatividade) *@`})}),e.jsx(o,{type:"info",title:"Estado por usuário, na RAM do servidor",children:'Cada conexão Blazor Server mantém o "Circuit" — um pacote de estado vivo no servidor. Se o servidor reiniciar ou a conexão cair por mais de alguns segundos, o usuário vê uma tela de "reconectando…". Para apps com muitos usuários simultâneos, dimensione a RAM com cuidado.'}),e.jsx("h2",{children:"Ciclo de vida e injeção de dependências"}),e.jsxs("p",{children:['Componentes têm "ganchos" (lifecycle methods) similares a React/Vue: ',e.jsx("code",{children:"OnInitializedAsync"}),", ",e.jsx("code",{children:"OnParametersSetAsync"}),", ",e.jsx("code",{children:"OnAfterRenderAsync"}),". Use-os para carregar dados:"]}),e.jsx("pre",{children:e.jsx("code",{children:`@page "/produtos"
@inject IProdutoService Servico

<h1>Produtos</h1>

@if (produtos is null)
{
    <p>Carregando...</p>
}
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
    private List<Produto>? produtos;

    protected override async Task OnInitializedAsync()
    {
        produtos = await Servico.ListarAsync();
    }
}`})}),e.jsxs("p",{children:["A diretiva ",e.jsx("code",{children:"@inject"})," recebe qualquer serviço registrado no DI container do ASP.NET — o mesmo container que você usa em Controllers e Minimal APIs."]}),e.jsx("h2",{children:"Quando escolher Blazor Server?"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Aplicações internas"})," (intranets, ERPs, painéis admin) onde a latência é baixa porque todo mundo está perto do servidor."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Quando o estado é pesado"})," e você quer evitar transferi-lo para o cliente (regras de negócio sensíveis)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"SEO e tempo de primeiro pixel"}),": HTML chega pronto no primeiro request, ótimo para indexadores."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Desenvolvimento rápido:"})," tudo é C# e roda no mesmo processo, sem build pipeline de JS."]})]}),e.jsx("p",{children:"Não é uma boa quando: usuários estão dispersos pelo mundo (latência), o app precisa funcionar offline, ou você espera milhões de usuários simultâneos por servidor (cada um custa RAM)."}),e.jsxs(o,{type:"warning",title:"Cuidado com componentes pesados",children:["Renderizar uma tabela de 10.000 linhas no servidor a cada clique mata a performance — todo o diff precisa ir pelo SignalR. Use virtualização (",e.jsx("code",{children:'<Virtualize Items="..." />'}),") ou paginação."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"@rendermode InteractiveServer"}),":"]}),' a página renderiza estática e os botões "não funcionam".']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Modificar ",e.jsx("code",{children:"List<T>"})," sem chamar ",e.jsx("code",{children:"StateHasChanged()"})]})," em código de fora da UI (como callbacks de timer)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bloquear o thread:"})," nunca use ",e.jsx("code",{children:".Result"})," ou ",e.jsx("code",{children:".Wait()"})," em métodos async — derruba o circuit."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Guardar dados sensíveis no estado do componente"})," sem criptografia — qualquer admin com acesso ao processo enxerga."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Blazor Server = SPA escrita em C# com lógica e estado no servidor."}),e.jsxs("li",{children:["Comunicação navegador ↔ servidor via ",e.jsx("strong",{children:"SignalR"})," (WebSocket)."]}),e.jsxs("li",{children:["Componentes ",e.jsx("code",{children:".razor"})," misturam HTML, Razor e blocos ",e.jsx("code",{children:"@code"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@rendermode InteractiveServer"})," ativa interatividade."]}),e.jsx("li",{children:"Ótimo para apps internos; ruim para usuários remotos com latência alta."}),e.jsx("li",{children:"DI, serviços e ciclo de vida funcionam de forma familiar a quem vem do React/Vue."})]})]})}export{n as default};
