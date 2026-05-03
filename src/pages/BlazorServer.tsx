import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BlazorServer() {
  return (
    <PageContainer
      title="Blazor Server: SPA com C# rodando no servidor"
      subtitle="Construa interfaces interativas em tempo real escrevendo C# no lugar de JavaScript — com renderização e estado vivendo no servidor."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        SPA (<em>Single Page Application</em>) é uma aplicação web em que o navegador baixa a "casca" da página uma vez só e, depois, troca pedaços de tela sem recarregar — pense em Gmail ou Trello. Tradicionalmente isso exige <strong>JavaScript</strong> (React, Vue, Angular). O <strong>Blazor</strong> é a aposta da Microsoft para escrever SPAs em <strong>C#</strong>. E ele tem dois sabores: <em>Server</em> (este capítulo) e <em>WebAssembly</em> (próximo). Pense no Blazor Server como um boneco de marionete: o navegador é o boneco visível, mas todos os fios e a inteligência ficam com o titereiro (o servidor).
      </p>

      <h2>Como funciona por baixo</h2>
      <p>
        Em Blazor Server, sua aplicação <em>roda inteira no servidor</em>. Quando o usuário abre o site, o servidor envia um HTML inicial e abre uma conexão <strong>SignalR</strong> (uma camada do .NET sobre WebSocket — um "telefone" sempre aberto entre navegador e servidor). A partir daí, cada clique, cada digitação, é enviado como um eventozinho pelo cabo. O servidor recalcula o que mudou na tela e devolve só o "diff" para o navegador aplicar.
      </p>
      <p>
        Vantagem: o navegador baixa muito pouco código (só um runtime JS minúsculo do Blazor). Desvantagem: tudo depende da rede; com latência alta (200ms+), a interface fica lenta.
      </p>

      <h2>Habilitando Blazor Server</h2>
      <pre><code>{`var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();   // habilita o modo "Server"

var app = builder.Build();

app.UseStaticFiles();
app.MapRazorComponents<App>()
   .AddInteractiveServerRenderMode();

app.Run();`}</code></pre>
      <p>
        O ponto-chave é <code>AddInteractiveServerComponents()</code>: ele registra o hub SignalR que mantém a conexão com cada navegador. Cada usuário conectado consome um pouquinho de RAM no servidor (estado da UI dele).
      </p>

      <h2>Componentes <code>.razor</code></h2>
      <p>
        Tudo no Blazor é <strong>componente</strong>: arquivos com extensão <code>.razor</code> que misturam HTML, sintaxe Razor (<code>@</code>) e blocos C# em <code>@code</code>. Um componente pode usar outros como tags HTML.
      </p>
      <pre><code>{`@* Components/Pages/Contador.razor *@
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
}`}</code></pre>
      <p>
        A diretiva <code>@page "/contador"</code> faz desse componente uma rota; <code>@onclick</code> liga o evento HTML a um método C#; <code>@valor</code> imprime a variável no HTML. Quando o método modifica o estado, o Blazor recalcula o que mudou e envia o diff para o navegador.
      </p>

      <h2>Componentes reutilizáveis com parâmetros</h2>
      <pre><code>{`@* Components/Cartao.razor *@
<div class="card">
    <h3>@Titulo</h3>
    <div>@ChildContent</div>
</div>

@code {
    [Parameter, EditorRequired]
    public string Titulo { get; set; } = "";

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}`}</code></pre>
      <pre><code>{`@* Uso em outra página *@
<Cartao Titulo="Promoção da semana">
    <p>Tudo com 30% de desconto até sexta!</p>
    <button>Comprar</button>
</Cartao>`}</code></pre>
      <p>
        <code>RenderFragment</code> é o equivalente do "children" no React: aceita qualquer marcação Razor. <code>[Parameter]</code> expõe a propriedade ao componente pai.
      </p>

      <h2>Render modes (.NET 8 e 9)</h2>
      <p>
        Desde o .NET 8 o Blazor tem <strong>render modes</strong> que decidem ONDE cada componente roda: estático no servidor (HTML inicial), interativo no servidor (SignalR), interativo no WebAssembly (no navegador), ou Auto (começa Server e migra para WASM quando o runtime baixa). Você marca componente por componente:
      </p>
      <pre><code>{`@page "/dashboard"
@rendermode InteractiveServer        @* este aqui é Server *@

@page "/grafico"
@rendermode InteractiveWebAssembly   @* este aqui roda no navegador *@

@page "/sobre"
@* sem @rendermode = renderização estática (apenas HTML, sem interatividade) *@`}</code></pre>

      <AlertBox type="info" title="Estado por usuário, na RAM do servidor">
        Cada conexão Blazor Server mantém o "Circuit" — um pacote de estado vivo no servidor. Se o servidor reiniciar ou a conexão cair por mais de alguns segundos, o usuário vê uma tela de "reconectando…". Para apps com muitos usuários simultâneos, dimensione a RAM com cuidado.
      </AlertBox>

      <h2>Ciclo de vida e injeção de dependências</h2>
      <p>
        Componentes têm "ganchos" (lifecycle methods) similares a React/Vue: <code>OnInitializedAsync</code>, <code>OnParametersSetAsync</code>, <code>OnAfterRenderAsync</code>. Use-os para carregar dados:
      </p>
      <pre><code>{`@page "/produtos"
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
}`}</code></pre>
      <p>
        A diretiva <code>@inject</code> recebe qualquer serviço registrado no DI container do ASP.NET — o mesmo container que você usa em Controllers e Minimal APIs.
      </p>

      <h2>Quando escolher Blazor Server?</h2>
      <ul>
        <li><strong>Aplicações internas</strong> (intranets, ERPs, painéis admin) onde a latência é baixa porque todo mundo está perto do servidor.</li>
        <li><strong>Quando o estado é pesado</strong> e você quer evitar transferi-lo para o cliente (regras de negócio sensíveis).</li>
        <li><strong>SEO e tempo de primeiro pixel</strong>: HTML chega pronto no primeiro request, ótimo para indexadores.</li>
        <li><strong>Desenvolvimento rápido:</strong> tudo é C# e roda no mesmo processo, sem build pipeline de JS.</li>
      </ul>
      <p>
        Não é uma boa quando: usuários estão dispersos pelo mundo (latência), o app precisa funcionar offline, ou você espera milhões de usuários simultâneos por servidor (cada um custa RAM).
      </p>

      <AlertBox type="warning" title="Cuidado com componentes pesados">
        Renderizar uma tabela de 10.000 linhas no servidor a cada clique mata a performance — todo o diff precisa ir pelo SignalR. Use virtualização (<code>&lt;Virtualize Items="..." /&gt;</code>) ou paginação.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>@rendermode InteractiveServer</code>:</strong> a página renderiza estática e os botões "não funcionam".</li>
        <li><strong>Modificar <code>List&lt;T&gt;</code> sem chamar <code>StateHasChanged()</code></strong> em código de fora da UI (como callbacks de timer).</li>
        <li><strong>Bloquear o thread:</strong> nunca use <code>.Result</code> ou <code>.Wait()</code> em métodos async — derruba o circuit.</li>
        <li><strong>Guardar dados sensíveis no estado do componente</strong> sem criptografia — qualquer admin com acesso ao processo enxerga.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Blazor Server = SPA escrita em C# com lógica e estado no servidor.</li>
        <li>Comunicação navegador ↔ servidor via <strong>SignalR</strong> (WebSocket).</li>
        <li>Componentes <code>.razor</code> misturam HTML, Razor e blocos <code>@code</code>.</li>
        <li><code>@rendermode InteractiveServer</code> ativa interatividade.</li>
        <li>Ótimo para apps internos; ruim para usuários remotos com latência alta.</li>
        <li>DI, serviços e ciclo de vida funcionam de forma familiar a quem vem do React/Vue.</li>
      </ul>
    </PageContainer>
  );
}
