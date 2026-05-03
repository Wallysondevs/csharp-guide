import{j as e}from"./index-CzLAthD5.js";import{P as s,A as r}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(s,{title:"Path e Directory: manipulando caminhos e pastas",subtitle:"Como construir caminhos de arquivo de forma segura e percorrer diretórios de modo eficiente.",difficulty:"iniciante",timeToRead:"11 min",children:[e.jsxs("p",{children:["Manipular caminhos de arquivo parece simples — basta concatenar strings, certo? ",e.jsx("strong",{children:"Errado."})," Windows usa ",e.jsx("code",{children:"\\"}),", Linux e macOS usam ",e.jsx("code",{children:"/"}),". Existem caminhos relativos, absolutos, com barra no fim, sem barra, com espaços, com acentos. Para resolver tudo isso de forma portável, o .NET oferece duas classes estáticas no namespace ",e.jsx("code",{children:"System.IO"}),": ",e.jsx("strong",{children:"Path"})," (manipula ",e.jsx("em",{children:"strings"})," de caminho) e ",e.jsx("strong",{children:"Directory"})," (manipula ",e.jsx("em",{children:"pastas reais"})," no disco). Pense em ",e.jsx("code",{children:"Path"})," como uma calculadora de caminhos, e em ",e.jsx("code",{children:"Directory"})," como o gerente do sistema de arquivos."]}),e.jsx("h2",{children:"Path: combinando caminhos com segurança"}),e.jsxs("p",{children:["Nunca, ",e.jsx("em",{children:"nunca"})," faça ",e.jsx("code",{children:'"pasta" + "/" + "arquivo.txt"'}),". Use ",e.jsx("code",{children:"Path.Combine"}),", que resolve o separador correto do sistema operacional e remove barras duplicadas:"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.IO;

// Combina segmentos de forma portável
string caminho = Path.Combine("dados", "usuarios", "alice.json");
// No Windows: "dados\\usuarios\\alice.json"
// No Linux:   "dados/usuarios/alice.json"

// Aceita N argumentos
string log = Path.Combine(Environment.CurrentDirectory, "logs", "app.log");`})}),e.jsxs("p",{children:["Outra coisa importante: se um dos segmentos for ",e.jsx("em",{children:"absoluto"}),", ele ",e.jsx("strong",{children:"descarta"})," o que veio antes. Isso é proposital, mas confunde:"]}),e.jsx("pre",{children:e.jsx("code",{children:`Path.Combine("/etc", "/usr/local"); // -> "/usr/local"
Path.Combine("C:\\\\app", "config"); // -> "C:\\\\app\\\\config"`})}),e.jsx("h2",{children:"Extraindo partes do caminho"}),e.jsxs("p",{children:[e.jsx("code",{children:"Path"})," tem dezenas de métodos de inspeção. Os essenciais:"]}),e.jsx("pre",{children:e.jsx("code",{children:`string p = "/home/maria/relatorio_2025.pdf";

Path.GetFileName(p);              // "relatorio_2025.pdf"
Path.GetFileNameWithoutExtension(p); // "relatorio_2025"
Path.GetExtension(p);             // ".pdf"
Path.GetDirectoryName(p);         // "/home/maria"
Path.GetFullPath("relativo.txt"); // resolve para absoluto
Path.IsPathRooted(p);             // true (começa com /)

// Trocar a extensão preservando o resto
Path.ChangeExtension(p, ".docx"); // "/home/maria/relatorio_2025.docx"`})}),e.jsxs("p",{children:["Esses métodos são ",e.jsx("strong",{children:"puramente textuais"})," — não tocam no disco e não verificam se o arquivo existe. Eles servem para você manipular caminhos como dados."]}),e.jsxs(r,{type:"info",title:"Caminhos temporários e do usuário",children:["Use ",e.jsx("code",{children:"Path.GetTempPath()"})," para a pasta temporária do sistema (",e.jsx("code",{children:"/tmp"})," no Linux, ",e.jsx("code",{children:"%TEMP%"})," no Windows) e ",e.jsx("code",{children:"Path.GetTempFileName()"})," para criar um arquivo temporário com nome único. Para a pasta home do usuário, use ",e.jsx("code",{children:"Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)"}),"."]}),e.jsx("h2",{children:"Directory: criando, removendo, listando"}),e.jsxs("p",{children:["Enquanto ",e.jsx("code",{children:"Path"})," mexe com strings, ",e.jsx("code",{children:"Directory"})," efetivamente ",e.jsx("em",{children:"cria"}),", ",e.jsx("em",{children:"apaga"})," e ",e.jsx("em",{children:"lista"})," pastas:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Cria pasta (e todas as intermediárias) — não falha se já existir
Directory.CreateDirectory("/var/app/dados/2025/01");

// Verificar existência
bool existe = Directory.Exists("/var/app");

// Remover (recursive: true apaga tudo dentro também — CUIDADO)
Directory.Delete("/tmp/cache_velho", recursive: true);

// Mover/renomear
Directory.Move("dados_antigos", "dados_v1");

// Pasta atual de trabalho
string atual = Directory.GetCurrentDirectory();
Directory.SetCurrentDirectory("/home/usuario");`})}),e.jsx("h2",{children:"EnumerateFiles vs GetFiles"}),e.jsxs("p",{children:["Para listar arquivos dentro de uma pasta há dois métodos parecidos, mas com diferença ",e.jsx("strong",{children:"crucial"})," em performance:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"GetFiles"}),": retorna um ",e.jsx("code",{children:"string[]"})," com ",e.jsx("em",{children:"todos"})," os caminhos. Tem que percorrer tudo antes de devolver — se a pasta tem 500 mil arquivos, sua aplicação trava por segundos."]}),e.jsxs("li",{children:[e.jsx("code",{children:"EnumerateFiles"}),": retorna um ",e.jsx("code",{children:"IEnumerable<string>"})," que produz cada arquivo ",e.jsx("em",{children:"conforme você itera"}),". Você pode parar no meio, filtrar, paginar."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// Listar arquivos .log da pasta atual (não recursivo)
foreach (var arq in Directory.EnumerateFiles(".", "*.log"))
{
    Console.WriteLine(arq);
}

// Buscar recursivamente todos os .cs em /projeto
var fontes = Directory.EnumerateFiles(
    "/projeto",
    "*.cs",
    SearchOption.AllDirectories);

// Pegar só os 10 primeiros — sem percorrer o resto
var amostra = fontes.Take(10).ToList();`})}),e.jsxs(r,{type:"warning",title:"Use EnumerateFiles por padrão",children:["Quase sempre que você for iterar resultados, prefira ",e.jsx("code",{children:"EnumerateFiles"}),"/",e.jsx("code",{children:"EnumerateDirectories"}),". Use ",e.jsx("code",{children:"GetFiles"})," apenas se realmente precisa do array completo na memória."]}),e.jsx("h2",{children:"Filtros e padrões glob"}),e.jsxs("p",{children:["O segundo argumento aceita um ",e.jsx("em",{children:"search pattern"})," simples (não é regex):"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"*"})," casa zero ou mais caracteres."]}),e.jsxs("li",{children:[e.jsx("code",{children:"?"})," casa exatamente um caractere."]}),e.jsxs("li",{children:["Sem extensão? Use ",e.jsx("code",{children:'"*"'}),". Para múltiplas extensões, faça duas chamadas e concatene."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`var imagens = Directory.EnumerateFiles("fotos", "*.*", SearchOption.AllDirectories)
    .Where(f => f.EndsWith(".jpg") || f.EndsWith(".png"))
    .ToList();`})}),e.jsx("h2",{children:"EnumerationOptions: controle fino"}),e.jsxs("p",{children:["Desde .NET Core 2.1, você pode passar um ",e.jsx("code",{children:"EnumerationOptions"})," com flags como ",e.jsx("code",{children:"IgnoreInaccessible"})," (não estoura erro em pasta sem permissão), ",e.jsx("code",{children:"RecurseSubdirectories"}),", ",e.jsx("code",{children:"MaxRecursionDepth"})," e ",e.jsx("code",{children:"MatchCasing"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`var opcoes = new EnumerationOptions
{
    RecurseSubdirectories = true,
    IgnoreInaccessible = true,
    MaxRecursionDepth = 3
};

foreach (var f in Directory.EnumerateFiles("/", "*.conf", opcoes))
{
    Console.WriteLine(f);
}`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Concatenar com ",e.jsx("code",{children:"+"}),":"]})," gera caminhos não-portáveis e barras duplicadas. Use ",e.jsx("code",{children:"Path.Combine"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer de checar existência antes de ",e.jsx("code",{children:"Delete"}),":"]})," em algumas versões antigas estoura. ",e.jsx("code",{children:"Directory.CreateDirectory"})," é seguro chamar em pasta existente, mas ",e.jsx("code",{children:"Delete"})," não."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"GetFiles"})," em pasta gigante:"]})," trava o app. Prefira ",e.jsx("code",{children:"EnumerateFiles"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não tratar ",e.jsx("code",{children:"UnauthorizedAccessException"}),":"]})," em recursão pode aparecer em qualquer pasta protegida. Use ",e.jsx("code",{children:"IgnoreInaccessible = true"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Path"})," manipula strings de caminho de forma portável; não toca no disco."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Path.Combine"}),", ",e.jsx("code",{children:"GetFileName"}),", ",e.jsx("code",{children:"GetExtension"}),", ",e.jsx("code",{children:"ChangeExtension"})," são essenciais."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Directory"})," cria, apaga, move e lista pastas reais."]}),e.jsxs("li",{children:[e.jsx("code",{children:"EnumerateFiles"})," é preguiçoso e eficiente; ",e.jsx("code",{children:"GetFiles"})," carrega tudo em memória."]}),e.jsxs("li",{children:[e.jsx("code",{children:"EnumerationOptions"})," permite recursão segura com filtros avançados."]})]})]})}export{i as default};
