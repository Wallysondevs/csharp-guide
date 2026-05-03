import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function RazorPages() {
  return (
    <PageContainer
      title="Razor Pages: páginas server-side com code-behind"
      subtitle="Aprenda a construir sites tradicionais (HTML renderizado no servidor) com C# usando o modelo Razor Pages — simples, organizado e produtivo."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Nem toda aplicação web precisa ser uma SPA cheia de JavaScript. Quando você quer um site tradicional — formulários, login, blog, painel administrativo — onde cada clique manda uma requisição e o servidor responde com HTML pronto, o <strong>Razor Pages</strong> é a opção mais simples e produtiva do ASP.NET Core. Pense nele como o "Wordpress dos C#-istas": você cria uma página, escreve um pouquinho de C# por trás dela, e está no ar.
      </p>

      <h2>O que é "Razor"?</h2>
      <p>
        <strong>Razor</strong> é a sintaxe de <em>template</em> do ASP.NET. Ela permite misturar HTML com pequenos blocos de C# usando o caractere <code>@</code>. O motor lê o arquivo, executa o C#, e devolve HTML puro para o navegador. Pense no <code>@</code> como uma "porta" — tudo depois dele é tratado como código C#, até o motor reconhecer que voltou para HTML.
      </p>

      <h2>Habilitando Razor Pages</h2>
      <p>
        Em <code>Program.cs</code>, registre o serviço e mapeie as rotas:
      </p>
      <pre><code>{`var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();

var app = builder.Build();

app.UseStaticFiles();   // serve CSS, JS, imagens em wwwroot/
app.MapRazorPages();    // ativa o roteamento por arquivo

app.Run();`}</code></pre>
      <p>
        O comando <code>dotnet new webapp -n MeuSite</code> já gera tudo isso e mais um layout pronto.
      </p>

      <h2>O par .cshtml + .cshtml.cs</h2>
      <p>
        Cada página é formada por <strong>dois arquivos</strong> com o mesmo nome: o <code>.cshtml</code> (HTML + Razor) e o <code>.cshtml.cs</code> (a classe C# por trás, chamada de <em>code-behind</em> ou <strong>PageModel</strong>). Eles ficam na pasta <code>Pages/</code>:
      </p>
      <pre><code>{`Pages/
├─ Index.cshtml          → rota "/"
├─ Index.cshtml.cs
├─ Contato.cshtml        → rota "/Contato"
├─ Contato.cshtml.cs
└─ Produtos/
   ├─ Lista.cshtml       → rota "/Produtos/Lista"
   └─ Lista.cshtml.cs`}</code></pre>
      <p>
        A estrutura de pastas vira a estrutura de URLs. Sem configurar rota nenhuma.
      </p>

      <h2>Anatomia de uma página completa</h2>
      <p>
        Veja um exemplo real de página de contato com formulário:
      </p>
      <pre><code>{`@* Pages/Contato.cshtml *@
@page
@model ContatoModel
@{
    ViewData["Title"] = "Fale conosco";
}

<h1>@ViewData["Title"]</h1>

@if (Model.EnviadoComSucesso)
{
    <p class="alert alert-success">Mensagem recebida, obrigado!</p>
}

<form method="post">
    <label asp-for="Form.Nome"></label>
    <input asp-for="Form.Nome" class="form-control" />
    <span asp-validation-for="Form.Nome" class="text-danger"></span>

    <label asp-for="Form.Mensagem"></label>
    <textarea asp-for="Form.Mensagem" class="form-control"></textarea>

    <button type="submit">Enviar</button>
</form>`}</code></pre>
      <pre><code>{`// Pages/Contato.cshtml.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;

public class ContatoModel : PageModel
{
    public bool EnviadoComSucesso { get; private set; }

    [BindProperty]                       // O formulário preenche essa propriedade
    public ContatoForm Form { get; set; } = new();

    public void OnGet()
    {
        // Executado quando o navegador faz GET /Contato
    }

    public IActionResult OnPost()
    {
        // Executado quando o formulário é enviado (POST /Contato)
        if (!ModelState.IsValid) return Page();

        // ... salvar/enviar email aqui ...
        EnviadoComSucesso = true;
        ModelState.Clear();
        Form = new();
        return Page();
    }
}

public class ContatoForm
{
    [Required, StringLength(80)]
    public string Nome { get; set; } = "";

    [Required, StringLength(2000, MinimumLength = 10)]
    public string Mensagem { get; set; } = "";
}`}</code></pre>
      <p>
        Os <strong>handlers</strong> são métodos com prefixo convencionado: <code>OnGet</code> para GET, <code>OnPost</code> para POST. Você pode ter variantes nomeadas: <code>OnPostExcluir</code>, <code>OnPostSalvarRascunho</code>, e dispará-las com <code>asp-page-handler="Excluir"</code> no botão.
      </p>

      <h2>Diretivas Razor importantes</h2>
      <p>
        Toda página começa com algumas diretivas (linhas com <code>@</code>):
      </p>
      <ul>
        <li><code>@page</code> — obrigatório. Marca o arquivo como uma página roteável.</li>
        <li><code>@model TipoDoPageModel</code> — diz qual classe code-behind está associada. Dá tipagem ao <code>Model</code> dentro do template.</li>
        <li><code>@using</code> — importa namespaces, como na linguagem C#.</li>
        <li><code>@inject</code> — injeta um serviço diretamente na página (útil para localização, configuração).</li>
        <li><code>@{`{ ... }`}</code> — bloco de código C# arbitrário (atribuir variáveis, etc.).</li>
      </ul>

      <h2>Tag Helpers: HTML com superpoderes</h2>
      <p>
        Em vez de escrever <code>&lt;a href="/Produtos/Lista"&gt;</code>, você escreve <code>&lt;a asp-page="/Produtos/Lista"&gt;</code>. O Razor entende esses atributos especiais (<em>tag helpers</em>) e gera o HTML correto, validando em tempo de compilação se a página existe.
      </p>
      <pre><code>{`<a asp-page="/Produtos/Detalhe" asp-route-id="42">
    Ver produto
</a>
<!-- Renderiza: <a href="/Produtos/Detalhe?id=42">Ver produto</a> -->

<form asp-page="/Login" method="post">
    <input asp-for="Email" />
    <span asp-validation-for="Email"></span>
</form>`}</code></pre>
      <p>
        Tag helpers também cuidam de gerar tokens anti-forgery (<code>__RequestVerificationToken</code>), exibir erros de validação e formatar datas/números no idioma certo.
      </p>

      <AlertBox type="info" title="Razor Pages × MVC">
        Razor Pages e MVC compartilham TODA a infraestrutura por baixo. A diferença é organizacional: em MVC você tem Controllers separados das Views; em Razor Pages, cada página agrupa o template e seu code-behind. Para sites focados em formulários, Razor Pages tende a ser mais conciso e menos propenso a "Controller gigante".
      </AlertBox>

      <h2>Layouts e parciais</h2>
      <p>
        Para evitar repetir o cabeçalho/rodapé em toda página, use um <strong>layout</strong> em <code>Pages/Shared/_Layout.cshtml</code>:
      </p>
      <pre><code>{`<!DOCTYPE html>
<html>
<head><title>@ViewData["Title"] - Meu Site</title></head>
<body>
    <header>...</header>
    <main>
        @RenderBody()    @* aqui entra o conteúdo da página *@
    </main>
    <footer>...</footer>
</body>
</html>`}</code></pre>
      <p>
        Defina o layout padrão em <code>Pages/_ViewStart.cshtml</code> com <code>@{`{ Layout = "_Layout"; }`}</code>. Para reaproveitar pedaços de HTML (cards, menus), use <em>partial views</em> com <code>&lt;partial name="_MenuLateral" /&gt;</code>.
      </p>

      <AlertBox type="warning" title="Não esqueça do antiforgery token">
        O ASP.NET valida automaticamente um token oculto em todos os POSTs feitos pela tag <code>&lt;form method="post"&gt;</code> — sem ele, você é vulnerável a CSRF. Os tag helpers já injetam isso para você. Se montar formulários "na mão" com <code>&lt;form&gt;</code> puro, o token some e o POST é rejeitado.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>@page</code>:</strong> o arquivo deixa de ser roteável e vira só uma view comum.</li>
        <li><strong>Não usar <code>[BindProperty]</code></strong> nas propriedades do form — elas chegam vazias após o POST.</li>
        <li><strong>Trocar nomes de handlers:</strong> só métodos começando com <code>On</code> + verbo HTTP são chamados pelo framework.</li>
        <li><strong>Misturar lógica pesada no <code>.cshtml</code>:</strong> mantenha o template focado em apresentação; lógica vai no PageModel.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Razor Pages é o jeito mais simples de fazer sites server-rendered em ASP.NET Core.</li>
        <li>Cada página tem um par <code>.cshtml</code> (template) + <code>.cshtml.cs</code> (PageModel).</li>
        <li>Handlers: <code>OnGet</code>, <code>OnPost</code>, e variantes nomeadas como <code>OnPostExcluir</code>.</li>
        <li><code>[BindProperty]</code> conecta o formulário a propriedades do PageModel.</li>
        <li>Tag helpers (<code>asp-for</code>, <code>asp-page</code>) geram HTML seguro e validado em compilação.</li>
        <li>Layouts e partials evitam repetição de marcação.</li>
      </ul>
    </PageContainer>
  );
}
