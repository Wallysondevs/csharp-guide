import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function r(){return e.jsxs(s,{title:"Top-level statements: o C# moderno sem cerimônia",subtitle:"A sintaxe enxuta introduzida no C# 9 que deixa scripts e protótipos com cara de Python.",difficulty:"iniciante",timeToRead:"10 min",children:[e.jsxs("p",{children:['Por quase 20 anos, o "Olá, Mundo!" em C# exigiu seis linhas de andaime: ',e.jsx("code",{children:"using"}),", ",e.jsx("code",{children:"namespace"}),", ",e.jsx("code",{children:"class"}),", ",e.jsx("code",{children:"Main"}),"... Em 2020, o C# 9 mudou isso com um recurso simples e libertador chamado ",e.jsx("strong",{children:"top-level statements"}),' — "instruções de nível superior". Agora você pode escrever um programa inteiro como se fosse um script, sem nenhuma classe à vista. Pense nisso como a Microsoft finalmente aceitando que ',e.jsx("em",{children:"nem todo programa precisa parecer um sistema corporativo"}),"."]}),e.jsx("h2",{children:"Antes e depois"}),e.jsx("p",{children:"O contraste é a melhor forma de entender a vantagem. À esquerda, o C# clássico. À direita, o moderno:"}),e.jsx("pre",{children:e.jsx("code",{children:`// ===== Estilo clássico (C# 1.0 a 8.0) =====
using System;

namespace MeuApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Olá!");
        }
    }
}

// ===== Estilo top-level (C# 9+) =====
Console.WriteLine("Olá!");`})}),e.jsxs("p",{children:["Sim, é só isso. ",e.jsx("em",{children:"Uma única linha"})," faz o trabalho das dez anteriores. E não há mágica obscura: o compilador gera por baixo dos panos exatamente o equivalente clássico — uma classe escondida (chamada internamente ",e.jsx("code",{children:"Program"}),") com um método ",e.jsx("code",{children:"Main"})," escondido. Você apenas não precisa ",e.jsx("em",{children:"escrevê-la"}),"."]}),e.jsx("h2",{children:"Como funciona por trás"}),e.jsx("p",{children:"Quando o compilador Roslyn vê um arquivo com instruções no topo (sem estar dentro de uma classe), ele cria automaticamente:"}),e.jsx("pre",{children:e.jsx("code",{children:`// Você escreve:
Console.WriteLine("Olá");
int x = 10;
Console.WriteLine(x * 2);

// O compilador gera o equivalente a:
internal class Program
{
    private static void <Main>$(string[] args)
    {
        Console.WriteLine("Olá");
        int x = 10;
        Console.WriteLine(x * 2);
    }
}`})}),e.jsxs("p",{children:["O nome estranho ",e.jsx("code",{children:"<Main>$"})," é proposital — não pode colidir com nenhum método que ",e.jsx("em",{children:"você"})," escreva, porque ",e.jsx("code",{children:"<"})," e ",e.jsx("code",{children:"$"})," não são caracteres válidos em identificadores normais. Esperto."]}),e.jsxs("h2",{children:["O parâmetro ",e.jsx("code",{children:"args"})," (implícito)"]}),e.jsxs("p",{children:["No estilo clássico, ",e.jsx("code",{children:"Main"})," recebe ",e.jsx("code",{children:"string[] args"}),". No top-level, esse parâmetro ",e.jsx("strong",{children:"existe implicitamente"})," com o nome ",e.jsx("code",{children:"args"}),". Você usa direto:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Program.cs
if (args.Length == 0)
{
    Console.WriteLine("Nenhum argumento passado.");
    return;
}

Console.WriteLine($"Recebi {args.Length} argumentos:");
foreach (var arg in args)
{
    Console.WriteLine($"  - {arg}");
}`})}),e.jsx("pre",{children:e.jsx("code",{children:`# Rodando:
dotnet run -- alpha beta gama

# Saída:
# Recebi 3 argumentos:
#   - alpha
#   - beta
#   - gama`})}),e.jsx("h2",{children:"Async no nível raiz"}),e.jsxs("p",{children:["Outra surpresa boa: você pode usar ",e.jsx("code",{children:"await"})," diretamente, sem precisar declarar um método ",e.jsx("code",{children:"async Task Main"}),". O compilador detecta e ajusta o tipo de retorno automaticamente."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Net.Http;

// await no topo do arquivo, sem boilerplate
var http = new HttpClient();
var html = await http.GetStringAsync("https://example.com");
Console.WriteLine($"Recebi {html.Length} caracteres do servidor.");`})}),e.jsxs("p",{children:["Para iniciantes: ",e.jsx("strong",{children:"async/await"})," é o mecanismo do C# para tarefas assíncronas (que demoram, como ler arquivo ou chamar a internet) sem travar a aplicação. Detalhamos em outro capítulo. Por enquanto, saiba que ",e.jsx("em",{children:"é possível"})," e que isso seria impossível na sintaxe clássica antes do C# 7.1."]}),e.jsxs(o,{type:"info",title:"Retorno e código de saída",children:["Você pode usar ",e.jsx("code",{children:"return 42;"})," no topo do arquivo, e ele se torna o ",e.jsx("em",{children:"exit code"})," do processo (útil em scripts). Sem ",e.jsx("code",{children:"return"}),", o exit code é 0."]}),e.jsx("h2",{children:"Definindo classes no mesmo arquivo"}),e.jsxs("p",{children:["Mesmo usando top-level, você pode declarar classes ",e.jsx("em",{children:"auxiliares"})," abaixo das instruções. A regra é: instruções primeiro, declarações de tipo depois."]}),e.jsx("pre",{children:e.jsx("code",{children:`Console.WriteLine("Iniciando o sistema...");

var conta = new ContaBancaria("Maria", 1000);
conta.Sacar(300);
Console.WriteLine($"Saldo final: {conta.Saldo:C}");

// Classes auxiliares vêm DEPOIS dos statements
class ContaBancaria
{
    public string Titular { get; }
    public decimal Saldo { get; private set; }

    public ContaBancaria(string titular, decimal saldoInicial)
    {
        Titular = titular;
        Saldo = saldoInicial;
    }

    public void Sacar(decimal valor)
    {
        if (valor > Saldo) throw new InvalidOperationException("Saldo insuficiente");
        Saldo -= valor;
    }
}`})}),e.jsx("h2",{children:"Quando NÃO usar top-level"}),e.jsx("p",{children:"Top-level statements são geniais para começar, scripts, CLIs simples e protótipos. Mas têm limites importantes:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Apenas um arquivo"})," por projeto pode usar top-level. Se dois arquivos têm instruções no topo, erro de compilação CS8802."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bibliotecas (classlib)"})," não fazem sentido com top-level — bibliotecas não têm ponto de entrada."]}),e.jsxs("li",{children:["Em ",e.jsx("strong",{children:"aplicações empresariais"})," grandes, muitos times preferem o ",e.jsx("code",{children:"Main"})," explícito por consistência e por facilitar testes (passar argumentos sintéticos, mockar dependências)."]}),e.jsxs("li",{children:["Frameworks como ",e.jsx("strong",{children:"ASP.NET Core"}),", no entanto, abraçaram o estilo: o template padrão hoje começa com top-level e ",e.jsx("code",{children:"WebApplication.CreateBuilder(args)"}),"."]})]}),e.jsxs(o,{type:"warning",title:"Erro CS8802",children:["Mensagem: ",e.jsx("em",{children:'"Only one compilation unit can have top-level statements."'})," Solução: deixe apenas um arquivo com instruções no topo; demais arquivos devem ter classes/métodos comuns."]}),e.jsx("h2",{children:"Como o template moderno se parece"}),e.jsxs("p",{children:["Quando você roda ",e.jsx("code",{children:"dotnet new console"})," em .NET 6 ou superior, o ",e.jsx("code",{children:"Program.cs"})," gerado é literalmente:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");`})}),e.jsx("p",{children:"Apenas duas linhas — uma é comentário. Compare com o template anterior ao .NET 6, que tinha 11 linhas com namespace e classe."}),e.jsx("h2",{children:"Migrando do clássico para top-level"}),e.jsx("p",{children:"Se você herdar um projeto antigo, dá para modernizar:"}),e.jsx("pre",{children:e.jsx("code",{children:`// Antes (clássico)
namespace MeuApp;
class Program {
    static void Main(string[] args) {
        var url = args.Length > 0 ? args[0] : "https://example.com";
        Console.WriteLine($"Acessando {url}");
    }
}

// Depois (top-level)
var url = args.Length > 0 ? args[0] : "https://example.com";
Console.WriteLine($"Acessando {url}");`})}),e.jsxs("p",{children:["Apague ",e.jsx("code",{children:"namespace"}),", ",e.jsx("code",{children:"class"})," e ",e.jsx("code",{children:"Main"}),"; mantenha apenas o conteúdo do método. Funcionalmente idêntico, visualmente muito mais limpo."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Definir uma classe acima das instruções:"})," em top-level, todas as classes ficam ",e.jsx("em",{children:"abaixo"}),". Inverter dá erro de sintaxe."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"return"})," em método com retorno void implícito:"]})," sem problema; mas se misturar ",e.jsx("code",{children:"return 0;"})," e ",e.jsx("code",{children:"return;"}),", o compilador reclama."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar declarar ",e.jsx("code",{children:"static void Main"})," manualmente"]})," em outro arquivo do mesmo projeto: gera duplicidade de pontos de entrada."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Top-level statements existem desde C# 9 (.NET 5)."}),e.jsxs("li",{children:["Eliminam ",e.jsx("code",{children:"using"}),", ",e.jsx("code",{children:"namespace"}),", ",e.jsx("code",{children:"class"})," e ",e.jsx("code",{children:"Main"})," visualmente."]}),e.jsxs("li",{children:["O parâmetro ",e.jsx("code",{children:"args"})," está disponível implicitamente."]}),e.jsxs("li",{children:[e.jsx("code",{children:"await"})," funciona direto no topo, sem ceremônia."]}),e.jsx("li",{children:"Apenas um arquivo por projeto pode usar."}),e.jsx("li",{children:"Para apps grandes ou bibliotecas, prefira o estilo clássico explícito."})]})]})}export{r as default};
