import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinqIntro() {
  return (
    <PageContainer
      title="LINQ: consultando coleções como SQL"
      subtitle="Language-Integrated Query — uma das ideias mais bonitas do C#. Entenda o que é, para que serve e seus dois sabores de sintaxe."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine que você tem uma lista de 10 mil produtos e precisa: filtrar os que custam mais de R$ 100, ordenar por preço, agrupar por categoria e somar o estoque de cada grupo. Em código tradicional, isso vira dezenas de linhas com loops aninhados. Em <strong>LINQ</strong>, vira uma linha. LINQ (Language-Integrated Query, "consulta integrada à linguagem") é o sistema de C# que permite consultar qualquer coleção usando uma sintaxe parecida com SQL — só que <em>dentro</em> do código, com checagem do compilador e IntelliSense. É uma das ideias mais influentes do .NET.
      </p>

      <h2>O que é LINQ, de verdade?</h2>
      <p>
        LINQ não é uma biblioteca; é um <strong>conjunto de métodos de extensão</strong> declarados em <code>System.Linq</code> que operam sobre <code>IEnumerable&lt;T&gt;</code>. Toda coleção em C# (List, array, Dictionary, HashSet, string) implementa <code>IEnumerable&lt;T&gt;</code> — então toda coleção pode ser consultada com LINQ.
      </p>
      <pre><code>{`using System.Linq; // necessário em projetos antigos; em .NET 6+ é implícito

int[] numeros = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Pegar só os pares, em uma linha
var pares = numeros.Where(n => n % 2 == 0);

foreach (var p in pares)
    Console.WriteLine(p); // 2, 4, 6, 8, 10`}</code></pre>

      <AlertBox type="info" title="O que é IEnumerable<T>?">
        É a "interface" que diz "esta coisa pode ser percorrida com <code>foreach</code>". Pense nela como o passe livre que LINQ exige: se um tipo implementa IEnumerable, você ganha automaticamente todos os métodos LINQ. Listas, arrays, sets, dicionários — todos implementam.
      </AlertBox>

      <h2>Os dois sabores de sintaxe</h2>
      <p>
        LINQ vem em duas formas: <strong>method syntax</strong> (com pontos e lambdas) e <strong>query syntax</strong> (parecida com SQL). As duas geram código idêntico — escolha pelo gosto e pela legibilidade do caso.
      </p>
      <pre><code>{`var nums = new[] { 1, 2, 3, 4, 5, 6 };

// Method syntax (mais comum em C#)
var pares1 = nums
    .Where(n => n > 2)
    .Select(n => n * 10);

// Query syntax (mais legível para múltiplos joins)
var pares2 = from n in nums
             where n > 2
             select n * 10;

// Ambas produzem: 30, 40, 50, 60`}</code></pre>

      <h2>Os operadores essenciais</h2>
      <p>
        LINQ tem mais de 50 métodos, mas você precisa de uns 15 para 95% dos casos. Veja os pilares:
      </p>
      <pre><code>{`var pessoas = new[]
{
    new { Nome = "Ana", Idade = 28, Cidade = "SP" },
    new { Nome = "Bruno", Idade = 35, Cidade = "RJ" },
    new { Nome = "Carla", Idade = 22, Cidade = "SP" },
    new { Nome = "Diego", Idade = 41, Cidade = "MG" }
};

// Filtrar
var jovens = pessoas.Where(p => p.Idade < 30);

// Projetar (transformar)
var nomes = pessoas.Select(p => p.Nome);

// Ordenar
var ordemAlfa = pessoas.OrderBy(p => p.Nome);

// Agrupar
var porCidade = pessoas.GroupBy(p => p.Cidade);

// Agregar
int media = (int)pessoas.Average(p => p.Idade);
int total = pessoas.Count();
int maior = pessoas.Max(p => p.Idade);

// Buscar 1
var primeira = pessoas.First(p => p.Cidade == "SP");
var primeiraOuNull = pessoas.FirstOrDefault(p => p.Cidade == "BA");`}</code></pre>

      <h2>Lazy execution: a mágica por trás</h2>
      <p>
        Operadores LINQ como <code>Where</code>, <code>Select</code>, <code>OrderBy</code> <em>não executam imediatamente</em>. Eles devolvem uma <em>descrição</em> da consulta. A execução só acontece quando você itera (com <code>foreach</code>) ou força com <code>ToList</code>, <code>ToArray</code>, <code>Count</code>, <code>First</code>...
      </p>
      <pre><code>{`var lista = new List<int> { 1, 2, 3 };

var query = lista.Where(n =>
{
    Console.WriteLine($"Avaliando {n}");
    return n > 1;
});

Console.WriteLine("Antes do foreach");
foreach (var x in query) { /* aqui é quando roda! */ }
Console.WriteLine("Depois do foreach");

// Saída:
// Antes do foreach
// Avaliando 1
// Avaliando 2
// Avaliando 3
// Depois do foreach`}</code></pre>

      <AlertBox type="warning" title="Re-execução acidental">
        Como a query é "uma receita", iterar duas vezes a executa duas vezes. Se a fonte muda no meio (ex: você adicionou itens), o segundo resultado pode ser diferente. Para "congelar" o resultado, materialize com <code>.ToList()</code>.
      </AlertBox>

      <h2>LINQ to Objects vs LINQ to SQL/EF</h2>
      <p>
        Quando você usa LINQ sobre uma coleção em memória (<code>List</code>, array), é <strong>LINQ to Objects</strong> — os métodos rodam em C#. Quando você usa LINQ sobre um <code>IQueryable&lt;T&gt;</code> do Entity Framework, a mesma sintaxe é <em>traduzida para SQL</em> e enviada ao banco. A beleza é que o seu código se parece igual:
      </p>
      <pre><code>{`// Em memória (LINQ to Objects) — roda em C#
var caros = produtos.Where(p => p.Preco > 100).ToList();

// No banco (Entity Framework) — vira SQL automaticamente
var caros2 = await db.Produtos
    .Where(p => p.Preco > 100)
    .ToListAsync();
// SELECT * FROM Produtos WHERE Preco > 100`}</code></pre>

      <h2>Por que isso importa para iniciantes?</h2>
      <p>
        Aprender LINQ no início poupa centenas de linhas de loops por mês. Mais ainda: muda o jeito de pensar — você descreve <em>o que</em> quer (declarativo) em vez de <em>como</em> calcular (imperativo). Esse estilo é mais legível, mais testável e raramente sofre com bugs sutis de índice.
      </p>
      <pre><code>{`// Imperativo (como)
var caros = new List<Produto>();
foreach (var p in produtos)
    if (p.Preco > 100)
        caros.Add(p);
caros.Sort((a, b) => a.Preco.CompareTo(b.Preco));

// Declarativo com LINQ (o quê)
var caros2 = produtos
    .Where(p => p.Preco > 100)
    .OrderBy(p => p.Preco)
    .ToList();`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>using System.Linq;</code></strong> em projetos antigos — IntelliSense não mostra os métodos.</li>
        <li><strong>Iterar uma query múltiplas vezes</strong> sem materializar — pode reexecutar trabalho caro ou bater no banco várias vezes.</li>
        <li><strong>Misturar <code>First</code> com <code>FirstOrDefault</code></strong>: <code>First</code> lança exceção se não acha; <code>FirstOrDefault</code> devolve null/zero. Escolha conscientemente.</li>
        <li><strong>Achar que LINQ "é lento"</strong>: para a maioria dos casos é rápido o suficiente; o gargalo costuma ser I/O, não LINQ.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>LINQ é um conjunto de métodos de extensão para consultar coleções.</li>
        <li>Funciona sobre qualquer <code>IEnumerable&lt;T&gt;</code>.</li>
        <li>Tem dois sabores: method syntax (lambdas) e query syntax (SQL-like).</li>
        <li>É <strong>lazy</strong>: só executa quando iterado ou materializado.</li>
        <li>A mesma sintaxe funciona em memória ou no banco (via EF).</li>
      </ul>
    </PageContainer>
  );
}
