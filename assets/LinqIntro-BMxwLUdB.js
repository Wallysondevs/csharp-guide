import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(s,{title:"LINQ: consultando coleções como SQL",subtitle:"Language-Integrated Query — uma das ideias mais bonitas do C#. Entenda o que é, para que serve e seus dois sabores de sintaxe.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["Imagine que você tem uma lista de 10 mil produtos e precisa: filtrar os que custam mais de R$ 100, ordenar por preço, agrupar por categoria e somar o estoque de cada grupo. Em código tradicional, isso vira dezenas de linhas com loops aninhados. Em ",e.jsx("strong",{children:"LINQ"}),', vira uma linha. LINQ (Language-Integrated Query, "consulta integrada à linguagem") é o sistema de C# que permite consultar qualquer coleção usando uma sintaxe parecida com SQL — só que ',e.jsx("em",{children:"dentro"})," do código, com checagem do compilador e IntelliSense. É uma das ideias mais influentes do .NET."]}),e.jsx("h2",{children:"O que é LINQ, de verdade?"}),e.jsxs("p",{children:["LINQ não é uma biblioteca; é um ",e.jsx("strong",{children:"conjunto de métodos de extensão"})," declarados em ",e.jsx("code",{children:"System.Linq"})," que operam sobre ",e.jsx("code",{children:"IEnumerable<T>"}),". Toda coleção em C# (List, array, Dictionary, HashSet, string) implementa ",e.jsx("code",{children:"IEnumerable<T>"})," — então toda coleção pode ser consultada com LINQ."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Linq; // necessário em projetos antigos; em .NET 6+ é implícito

int[] numeros = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Pegar só os pares, em uma linha
var pares = numeros.Where(n => n % 2 == 0);

foreach (var p in pares)
    Console.WriteLine(p); // 2, 4, 6, 8, 10`})}),e.jsxs(o,{type:"info",title:"O que é IEnumerable<T>?",children:['É a "interface" que diz "esta coisa pode ser percorrida com ',e.jsx("code",{children:"foreach"}),'". Pense nela como o passe livre que LINQ exige: se um tipo implementa IEnumerable, você ganha automaticamente todos os métodos LINQ. Listas, arrays, sets, dicionários — todos implementam.']}),e.jsx("h2",{children:"Os dois sabores de sintaxe"}),e.jsxs("p",{children:["LINQ vem em duas formas: ",e.jsx("strong",{children:"method syntax"})," (com pontos e lambdas) e ",e.jsx("strong",{children:"query syntax"})," (parecida com SQL). As duas geram código idêntico — escolha pelo gosto e pela legibilidade do caso."]}),e.jsx("pre",{children:e.jsx("code",{children:`var nums = new[] { 1, 2, 3, 4, 5, 6 };

// Method syntax (mais comum em C#)
var pares1 = nums
    .Where(n => n > 2)
    .Select(n => n * 10);

// Query syntax (mais legível para múltiplos joins)
var pares2 = from n in nums
             where n > 2
             select n * 10;

// Ambas produzem: 30, 40, 50, 60`})}),e.jsx("h2",{children:"Os operadores essenciais"}),e.jsx("p",{children:"LINQ tem mais de 50 métodos, mas você precisa de uns 15 para 95% dos casos. Veja os pilares:"}),e.jsx("pre",{children:e.jsx("code",{children:`var pessoas = new[]
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
var primeiraOuNull = pessoas.FirstOrDefault(p => p.Cidade == "BA");`})}),e.jsx("h2",{children:"Lazy execution: a mágica por trás"}),e.jsxs("p",{children:["Operadores LINQ como ",e.jsx("code",{children:"Where"}),", ",e.jsx("code",{children:"Select"}),", ",e.jsx("code",{children:"OrderBy"})," ",e.jsx("em",{children:"não executam imediatamente"}),". Eles devolvem uma ",e.jsx("em",{children:"descrição"})," da consulta. A execução só acontece quando você itera (com ",e.jsx("code",{children:"foreach"}),") ou força com ",e.jsx("code",{children:"ToList"}),", ",e.jsx("code",{children:"ToArray"}),", ",e.jsx("code",{children:"Count"}),", ",e.jsx("code",{children:"First"}),"..."]}),e.jsx("pre",{children:e.jsx("code",{children:`var lista = new List<int> { 1, 2, 3 };

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
// Depois do foreach`})}),e.jsxs(o,{type:"warning",title:"Re-execução acidental",children:['Como a query é "uma receita", iterar duas vezes a executa duas vezes. Se a fonte muda no meio (ex: você adicionou itens), o segundo resultado pode ser diferente. Para "congelar" o resultado, materialize com ',e.jsx("code",{children:".ToList()"}),"."]}),e.jsx("h2",{children:"LINQ to Objects vs LINQ to SQL/EF"}),e.jsxs("p",{children:["Quando você usa LINQ sobre uma coleção em memória (",e.jsx("code",{children:"List"}),", array), é ",e.jsx("strong",{children:"LINQ to Objects"})," — os métodos rodam em C#. Quando você usa LINQ sobre um ",e.jsx("code",{children:"IQueryable<T>"})," do Entity Framework, a mesma sintaxe é ",e.jsx("em",{children:"traduzida para SQL"})," e enviada ao banco. A beleza é que o seu código se parece igual:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Em memória (LINQ to Objects) — roda em C#
var caros = produtos.Where(p => p.Preco > 100).ToList();

// No banco (Entity Framework) — vira SQL automaticamente
var caros2 = await db.Produtos
    .Where(p => p.Preco > 100)
    .ToListAsync();
// SELECT * FROM Produtos WHERE Preco > 100`})}),e.jsx("h2",{children:"Por que isso importa para iniciantes?"}),e.jsxs("p",{children:["Aprender LINQ no início poupa centenas de linhas de loops por mês. Mais ainda: muda o jeito de pensar — você descreve ",e.jsx("em",{children:"o que"})," quer (declarativo) em vez de ",e.jsx("em",{children:"como"})," calcular (imperativo). Esse estilo é mais legível, mais testável e raramente sofre com bugs sutis de índice."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Imperativo (como)
var caros = new List<Produto>();
foreach (var p in produtos)
    if (p.Preco > 100)
        caros.Add(p);
caros.Sort((a, b) => a.Preco.CompareTo(b.Preco));

// Declarativo com LINQ (o quê)
var caros2 = produtos
    .Where(p => p.Preco > 100)
    .OrderBy(p => p.Preco)
    .ToList();`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"using System.Linq;"})]})," em projetos antigos — IntelliSense não mostra os métodos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Iterar uma query múltiplas vezes"})," sem materializar — pode reexecutar trabalho caro ou bater no banco várias vezes."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Misturar ",e.jsx("code",{children:"First"})," com ",e.jsx("code",{children:"FirstOrDefault"})]}),": ",e.jsx("code",{children:"First"})," lança exceção se não acha; ",e.jsx("code",{children:"FirstOrDefault"})," devolve null/zero. Escolha conscientemente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'Achar que LINQ "é lento"'}),": para a maioria dos casos é rápido o suficiente; o gargalo costuma ser I/O, não LINQ."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"LINQ é um conjunto de métodos de extensão para consultar coleções."}),e.jsxs("li",{children:["Funciona sobre qualquer ",e.jsx("code",{children:"IEnumerable<T>"}),"."]}),e.jsx("li",{children:"Tem dois sabores: method syntax (lambdas) e query syntax (SQL-like)."}),e.jsxs("li",{children:["É ",e.jsx("strong",{children:"lazy"}),": só executa quando iterado ou materializado."]}),e.jsx("li",{children:"A mesma sintaxe funciona em memória ou no banco (via EF)."})]})]})}export{i as default};
