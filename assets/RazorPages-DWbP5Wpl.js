import{j as e}from"./index-CzLAthD5.js";import{P as a,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(a,{title:"Razor Pages: páginas server-side com code-behind",subtitle:"Aprenda a construir sites tradicionais (HTML renderizado no servidor) com C# usando o modelo Razor Pages — simples, organizado e produtivo.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs("p",{children:["Nem toda aplicação web precisa ser uma SPA cheia de JavaScript. Quando você quer um site tradicional — formulários, login, blog, painel administrativo — onde cada clique manda uma requisição e o servidor responde com HTML pronto, o ",e.jsx("strong",{children:"Razor Pages"}),' é a opção mais simples e produtiva do ASP.NET Core. Pense nele como o "Wordpress dos C#-istas": você cria uma página, escreve um pouquinho de C# por trás dela, e está no ar.']}),e.jsx("h2",{children:'O que é "Razor"?'}),e.jsxs("p",{children:[e.jsx("strong",{children:"Razor"})," é a sintaxe de ",e.jsx("em",{children:"template"})," do ASP.NET. Ela permite misturar HTML com pequenos blocos de C# usando o caractere ",e.jsx("code",{children:"@"}),". O motor lê o arquivo, executa o C#, e devolve HTML puro para o navegador. Pense no ",e.jsx("code",{children:"@"}),' como uma "porta" — tudo depois dele é tratado como código C#, até o motor reconhecer que voltou para HTML.']}),e.jsx("h2",{children:"Habilitando Razor Pages"}),e.jsxs("p",{children:["Em ",e.jsx("code",{children:"Program.cs"}),", registre o serviço e mapeie as rotas:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();

var app = builder.Build();

app.UseStaticFiles();   // serve CSS, JS, imagens em wwwroot/
app.MapRazorPages();    // ativa o roteamento por arquivo

app.Run();`})}),e.jsxs("p",{children:["O comando ",e.jsx("code",{children:"dotnet new webapp -n MeuSite"})," já gera tudo isso e mais um layout pronto."]}),e.jsx("h2",{children:"O par .cshtml + .cshtml.cs"}),e.jsxs("p",{children:["Cada página é formada por ",e.jsx("strong",{children:"dois arquivos"})," com o mesmo nome: o ",e.jsx("code",{children:".cshtml"})," (HTML + Razor) e o ",e.jsx("code",{children:".cshtml.cs"})," (a classe C# por trás, chamada de ",e.jsx("em",{children:"code-behind"})," ou ",e.jsx("strong",{children:"PageModel"}),"). Eles ficam na pasta ",e.jsx("code",{children:"Pages/"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`Pages/
├─ Index.cshtml          → rota "/"
├─ Index.cshtml.cs
├─ Contato.cshtml        → rota "/Contato"
├─ Contato.cshtml.cs
└─ Produtos/
   ├─ Lista.cshtml       → rota "/Produtos/Lista"
   └─ Lista.cshtml.cs`})}),e.jsx("p",{children:"A estrutura de pastas vira a estrutura de URLs. Sem configurar rota nenhuma."}),e.jsx("h2",{children:"Anatomia de uma página completa"}),e.jsx("p",{children:"Veja um exemplo real de página de contato com formulário:"}),e.jsx("pre",{children:e.jsx("code",{children:`@* Pages/Contato.cshtml *@
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
</form>`})}),e.jsx("pre",{children:e.jsx("code",{children:`// Pages/Contato.cshtml.cs
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
}`})}),e.jsxs("p",{children:["Os ",e.jsx("strong",{children:"handlers"})," são métodos com prefixo convencionado: ",e.jsx("code",{children:"OnGet"})," para GET, ",e.jsx("code",{children:"OnPost"})," para POST. Você pode ter variantes nomeadas: ",e.jsx("code",{children:"OnPostExcluir"}),", ",e.jsx("code",{children:"OnPostSalvarRascunho"}),", e dispará-las com ",e.jsx("code",{children:'asp-page-handler="Excluir"'})," no botão."]}),e.jsx("h2",{children:"Diretivas Razor importantes"}),e.jsxs("p",{children:["Toda página começa com algumas diretivas (linhas com ",e.jsx("code",{children:"@"}),"):"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"@page"})," — obrigatório. Marca o arquivo como uma página roteável."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@model TipoDoPageModel"})," — diz qual classe code-behind está associada. Dá tipagem ao ",e.jsx("code",{children:"Model"})," dentro do template."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@using"})," — importa namespaces, como na linguagem C#."]}),e.jsxs("li",{children:[e.jsx("code",{children:"@inject"})," — injeta um serviço diretamente na página (útil para localização, configuração)."]}),e.jsxs("li",{children:[e.jsxs("code",{children:["@","{ ... }"]})," — bloco de código C# arbitrário (atribuir variáveis, etc.)."]})]}),e.jsx("h2",{children:"Tag Helpers: HTML com superpoderes"}),e.jsxs("p",{children:["Em vez de escrever ",e.jsx("code",{children:'<a href="/Produtos/Lista">'}),", você escreve ",e.jsx("code",{children:'<a asp-page="/Produtos/Lista">'}),". O Razor entende esses atributos especiais (",e.jsx("em",{children:"tag helpers"}),") e gera o HTML correto, validando em tempo de compilação se a página existe."]}),e.jsx("pre",{children:e.jsx("code",{children:`<a asp-page="/Produtos/Detalhe" asp-route-id="42">
    Ver produto
</a>
<!-- Renderiza: <a href="/Produtos/Detalhe?id=42">Ver produto</a> -->

<form asp-page="/Login" method="post">
    <input asp-for="Email" />
    <span asp-validation-for="Email"></span>
</form>`})}),e.jsxs("p",{children:["Tag helpers também cuidam de gerar tokens anti-forgery (",e.jsx("code",{children:"__RequestVerificationToken"}),"), exibir erros de validação e formatar datas/números no idioma certo."]}),e.jsx(o,{type:"info",title:"Razor Pages × MVC",children:'Razor Pages e MVC compartilham TODA a infraestrutura por baixo. A diferença é organizacional: em MVC você tem Controllers separados das Views; em Razor Pages, cada página agrupa o template e seu code-behind. Para sites focados em formulários, Razor Pages tende a ser mais conciso e menos propenso a "Controller gigante".'}),e.jsx("h2",{children:"Layouts e parciais"}),e.jsxs("p",{children:["Para evitar repetir o cabeçalho/rodapé em toda página, use um ",e.jsx("strong",{children:"layout"})," em ",e.jsx("code",{children:"Pages/Shared/_Layout.cshtml"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`<!DOCTYPE html>
<html>
<head><title>@ViewData["Title"] - Meu Site</title></head>
<body>
    <header>...</header>
    <main>
        @RenderBody()    @* aqui entra o conteúdo da página *@
    </main>
    <footer>...</footer>
</body>
</html>`})}),e.jsxs("p",{children:["Defina o layout padrão em ",e.jsx("code",{children:"Pages/_ViewStart.cshtml"})," com ",e.jsxs("code",{children:["@",'{ Layout = "_Layout"; }']}),". Para reaproveitar pedaços de HTML (cards, menus), use ",e.jsx("em",{children:"partial views"})," com ",e.jsx("code",{children:'<partial name="_MenuLateral" />'}),"."]}),e.jsxs(o,{type:"warning",title:"Não esqueça do antiforgery token",children:["O ASP.NET valida automaticamente um token oculto em todos os POSTs feitos pela tag ",e.jsx("code",{children:'<form method="post">'}),' — sem ele, você é vulnerável a CSRF. Os tag helpers já injetam isso para você. Se montar formulários "na mão" com ',e.jsx("code",{children:"<form>"})," puro, o token some e o POST é rejeitado."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer o ",e.jsx("code",{children:"@page"}),":"]})," o arquivo deixa de ser roteável e vira só uma view comum."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não usar ",e.jsx("code",{children:"[BindProperty]"})]})," nas propriedades do form — elas chegam vazias após o POST."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Trocar nomes de handlers:"})," só métodos começando com ",e.jsx("code",{children:"On"})," + verbo HTTP são chamados pelo framework."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Misturar lógica pesada no ",e.jsx("code",{children:".cshtml"}),":"]})," mantenha o template focado em apresentação; lógica vai no PageModel."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Razor Pages é o jeito mais simples de fazer sites server-rendered em ASP.NET Core."}),e.jsxs("li",{children:["Cada página tem um par ",e.jsx("code",{children:".cshtml"})," (template) + ",e.jsx("code",{children:".cshtml.cs"})," (PageModel)."]}),e.jsxs("li",{children:["Handlers: ",e.jsx("code",{children:"OnGet"}),", ",e.jsx("code",{children:"OnPost"}),", e variantes nomeadas como ",e.jsx("code",{children:"OnPostExcluir"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[BindProperty]"})," conecta o formulário a propriedades do PageModel."]}),e.jsxs("li",{children:["Tag helpers (",e.jsx("code",{children:"asp-for"}),", ",e.jsx("code",{children:"asp-page"}),") geram HTML seguro e validado em compilação."]}),e.jsx("li",{children:"Layouts e partials evitam repetição de marcação."})]})]})}export{i as default};
