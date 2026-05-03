import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TopLevelStatements() {
  return (
    <PageContainer
      title="Top-level statements: o C# moderno sem cerimônia"
      subtitle="A sintaxe enxuta introduzida no C# 9 que deixa scripts e protótipos com cara de Python."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Por quase 20 anos, o "Olá, Mundo!" em C# exigiu seis linhas de andaime: <code>using</code>, <code>namespace</code>, <code>class</code>, <code>Main</code>... Em 2020, o C# 9 mudou isso com um recurso simples e libertador chamado <strong>top-level statements</strong> — "instruções de nível superior". Agora você pode escrever um programa inteiro como se fosse um script, sem nenhuma classe à vista. Pense nisso como a Microsoft finalmente aceitando que <em>nem todo programa precisa parecer um sistema corporativo</em>.
      </p>

      <h2>Antes e depois</h2>
      <p>
        O contraste é a melhor forma de entender a vantagem. À esquerda, o C# clássico. À direita, o moderno:
      </p>
      <pre><code>{`// ===== Estilo clássico (C# 1.0 a 8.0) =====
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
Console.WriteLine("Olá!");`}</code></pre>
      <p>
        Sim, é só isso. <em>Uma única linha</em> faz o trabalho das dez anteriores. E não há mágica obscura: o compilador gera por baixo dos panos exatamente o equivalente clássico — uma classe escondida (chamada internamente <code>Program</code>) com um método <code>Main</code> escondido. Você apenas não precisa <em>escrevê-la</em>.
      </p>

      <h2>Como funciona por trás</h2>
      <p>
        Quando o compilador Roslyn vê um arquivo com instruções no topo (sem estar dentro de uma classe), ele cria automaticamente:
      </p>
      <pre><code>{`// Você escreve:
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
}`}</code></pre>
      <p>
        O nome estranho <code>&lt;Main&gt;$</code> é proposital — não pode colidir com nenhum método que <em>você</em> escreva, porque <code>&lt;</code> e <code>$</code> não são caracteres válidos em identificadores normais. Esperto.
      </p>

      <h2>O parâmetro <code>args</code> (implícito)</h2>
      <p>
        No estilo clássico, <code>Main</code> recebe <code>string[] args</code>. No top-level, esse parâmetro <strong>existe implicitamente</strong> com o nome <code>args</code>. Você usa direto:
      </p>
      <pre><code>{`// Program.cs
if (args.Length == 0)
{
    Console.WriteLine("Nenhum argumento passado.");
    return;
}

Console.WriteLine($"Recebi {args.Length} argumentos:");
foreach (var arg in args)
{
    Console.WriteLine($"  - {arg}");
}`}</code></pre>
      <pre><code>{`# Rodando:
dotnet run -- alpha beta gama

# Saída:
# Recebi 3 argumentos:
#   - alpha
#   - beta
#   - gama`}</code></pre>

      <h2>Async no nível raiz</h2>
      <p>
        Outra surpresa boa: você pode usar <code>await</code> diretamente, sem precisar declarar um método <code>async Task Main</code>. O compilador detecta e ajusta o tipo de retorno automaticamente.
      </p>
      <pre><code>{`using System.Net.Http;

// await no topo do arquivo, sem boilerplate
var http = new HttpClient();
var html = await http.GetStringAsync("https://example.com");
Console.WriteLine($"Recebi {html.Length} caracteres do servidor.");`}</code></pre>
      <p>
        Para iniciantes: <strong>async/await</strong> é o mecanismo do C# para tarefas assíncronas (que demoram, como ler arquivo ou chamar a internet) sem travar a aplicação. Detalhamos em outro capítulo. Por enquanto, saiba que <em>é possível</em> e que isso seria impossível na sintaxe clássica antes do C# 7.1.
      </p>

      <AlertBox type="info" title="Retorno e código de saída">
        Você pode usar <code>return 42;</code> no topo do arquivo, e ele se torna o <em>exit code</em> do processo (útil em scripts). Sem <code>return</code>, o exit code é 0.
      </AlertBox>

      <h2>Definindo classes no mesmo arquivo</h2>
      <p>
        Mesmo usando top-level, você pode declarar classes <em>auxiliares</em> abaixo das instruções. A regra é: instruções primeiro, declarações de tipo depois.
      </p>
      <pre><code>{`Console.WriteLine("Iniciando o sistema...");

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
}`}</code></pre>

      <h2>Quando NÃO usar top-level</h2>
      <p>
        Top-level statements são geniais para começar, scripts, CLIs simples e protótipos. Mas têm limites importantes:
      </p>
      <ul>
        <li><strong>Apenas um arquivo</strong> por projeto pode usar top-level. Se dois arquivos têm instruções no topo, erro de compilação CS8802.</li>
        <li><strong>Bibliotecas (classlib)</strong> não fazem sentido com top-level — bibliotecas não têm ponto de entrada.</li>
        <li>Em <strong>aplicações empresariais</strong> grandes, muitos times preferem o <code>Main</code> explícito por consistência e por facilitar testes (passar argumentos sintéticos, mockar dependências).</li>
        <li>Frameworks como <strong>ASP.NET Core</strong>, no entanto, abraçaram o estilo: o template padrão hoje começa com top-level e <code>WebApplication.CreateBuilder(args)</code>.</li>
      </ul>

      <AlertBox type="warning" title="Erro CS8802">
        Mensagem: <em>"Only one compilation unit can have top-level statements."</em> Solução: deixe apenas um arquivo com instruções no topo; demais arquivos devem ter classes/métodos comuns.
      </AlertBox>

      <h2>Como o template moderno se parece</h2>
      <p>
        Quando você roda <code>dotnet new console</code> em .NET 6 ou superior, o <code>Program.cs</code> gerado é literalmente:
      </p>
      <pre><code>{`// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");`}</code></pre>
      <p>
        Apenas duas linhas — uma é comentário. Compare com o template anterior ao .NET 6, que tinha 11 linhas com namespace e classe.
      </p>

      <h2>Migrando do clássico para top-level</h2>
      <p>
        Se você herdar um projeto antigo, dá para modernizar:
      </p>
      <pre><code>{`// Antes (clássico)
namespace MeuApp;
class Program {
    static void Main(string[] args) {
        var url = args.Length > 0 ? args[0] : "https://example.com";
        Console.WriteLine($"Acessando {url}");
    }
}

// Depois (top-level)
var url = args.Length > 0 ? args[0] : "https://example.com";
Console.WriteLine($"Acessando {url}");`}</code></pre>
      <p>
        Apague <code>namespace</code>, <code>class</code> e <code>Main</code>; mantenha apenas o conteúdo do método. Funcionalmente idêntico, visualmente muito mais limpo.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Definir uma classe acima das instruções:</strong> em top-level, todas as classes ficam <em>abaixo</em>. Inverter dá erro de sintaxe.</li>
        <li><strong>Usar <code>return</code> em método com retorno void implícito:</strong> sem problema; mas se misturar <code>return 0;</code> e <code>return;</code>, o compilador reclama.</li>
        <li><strong>Tentar declarar <code>static void Main</code> manualmente</strong> em outro arquivo do mesmo projeto: gera duplicidade de pontos de entrada.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Top-level statements existem desde C# 9 (.NET 5).</li>
        <li>Eliminam <code>using</code>, <code>namespace</code>, <code>class</code> e <code>Main</code> visualmente.</li>
        <li>O parâmetro <code>args</code> está disponível implicitamente.</li>
        <li><code>await</code> funciona direto no topo, sem ceremônia.</li>
        <li>Apenas um arquivo por projeto pode usar.</li>
        <li>Para apps grandes ou bibliotecas, prefira o estilo clássico explícito.</li>
      </ul>
    </PageContainer>
  );
}
