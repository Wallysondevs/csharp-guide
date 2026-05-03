import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(r,{title:"LINQ: Where e Select fundamentais",subtitle:"Os dois operadores que você usará todos os dias — filtrar e projetar coleções com lambdas.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["Se LINQ fosse uma cozinha, ",e.jsx("strong",{children:"Where"})," seria o coador (deixa passar só o que você quer) e ",e.jsx("strong",{children:"Select"})," seria o liquidificador (transforma o que passou em outra coisa). Esses dois operadores aparecem em praticamente toda consulta LINQ que você vai escrever no resto da vida. Domine-os de verdade e 70% do LINQ está coberto. Este capítulo vai mostrar todas as variações úteis, com exemplos completos."]}),e.jsx("h2",{children:"Where: filtrando com predicates"}),e.jsxs("p",{children:[e.jsx("code",{children:"Where"})," recebe uma ",e.jsx("strong",{children:"lambda"})," que devolve ",e.jsx("code",{children:"bool"})," (chamada ",e.jsx("em",{children:"predicate"}),") e devolve apenas os itens em que a lambda retorna ",e.jsx("code",{children:"true"}),". Lembre que LINQ é ",e.jsx("em",{children:"lazy"}),": nada é calculado até você iterar."]}),e.jsx("pre",{children:e.jsx("code",{children:`int[] numeros = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Pegar só os maiores que 5
var grandes = numeros.Where(n => n > 5);
foreach (var n in grandes)
    Console.WriteLine(n); // 6, 7, 8, 9, 10

// Predicate composto
var imparesGrandes = numeros.Where(n => n > 5 && n % 2 == 1);
// 7, 9`})}),e.jsx("h2",{children:"Where com índice"}),e.jsx("p",{children:"Existe uma sobrecarga menos conhecida que dá acesso ao índice do item. Útil quando o critério depende da posição:"}),e.jsx("pre",{children:e.jsx("code",{children:`var letras = new[] { "a", "b", "c", "d", "e", "f" };

// Manter só as letras em índices pares (0, 2, 4)
var paresIdx = letras.Where((letra, indice) => indice % 2 == 0);
// "a", "c", "e"`})}),e.jsx("h2",{children:"Encadeando vários Where"}),e.jsxs("p",{children:["Você pode chamar ",e.jsx("code",{children:"Where"})," várias vezes em sequência. Cada chamada filtra o resultado da anterior. Em performance, isso é equivalente a um único ",e.jsx("code",{children:"Where"})," com ",e.jsx("code",{children:"&&"}),", mas pode ficar mais legível dividido:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var pessoas = new[]
{
    new { Nome = "Ana", Idade = 28, Ativo = true },
    new { Nome = "Bruno", Idade = 17, Ativo = true },
    new { Nome = "Carla", Idade = 45, Ativo = false },
    new { Nome = "Diego", Idade = 30, Ativo = true }
};

// Encadeado
var resultado = pessoas
    .Where(p => p.Ativo)
    .Where(p => p.Idade >= 18)
    .Where(p => p.Nome.StartsWith("D"));

// Equivalente em uma linha
var resultado2 = pessoas
    .Where(p => p.Ativo && p.Idade >= 18 && p.Nome.StartsWith("D"));

// Ambos: { Nome = Diego, ... }`})}),e.jsxs(a,{type:"info",title:"O que é uma lambda?",children:["Uma ",e.jsx("strong",{children:"lambda"}),' é uma função "anônima" escrita inline. ',e.jsx("code",{children:"n => n > 5"}),' significa "para um parâmetro n, retorne se ele é maior que 5". A seta ',e.jsx("code",{children:"=>"})," separa parâmetros do corpo. Lambdas com mais de uma instrução usam chaves: ",e.jsxs("code",{children:["n => ","{ var x = n*2; return x > 10; }"]}),"."]}),e.jsx("h2",{children:"Select: projetando (transformando)"}),e.jsxs("p",{children:[e.jsx("code",{children:"Select"})," aplica uma transformação a cada item e devolve uma sequência nova. O tipo de saída pode ser igual ou diferente do tipo de entrada."]}),e.jsx("pre",{children:e.jsx("code",{children:`var nums = new[] { 1, 2, 3, 4, 5 };

// Mesmo tipo: dobrar
var dobrados = nums.Select(n => n * 2);
// 2, 4, 6, 8, 10

// Tipo diferente: transformar em string
var textos = nums.Select(n => $"#{n}");
// "#1", "#2", ...

// Projetar em tipo anônimo (objeto sem classe nomeada)
var info = nums.Select(n => new { Original = n, Quadrado = n * n });
foreach (var x in info)
    Console.WriteLine($"{x.Original} -> {x.Quadrado}");`})}),e.jsx("h2",{children:"Select com índice"}),e.jsxs("p",{children:["Como ",e.jsx("code",{children:"Where"}),", ",e.jsx("code",{children:"Select"})," também tem versão com índice — útil para enumerar com numeração:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var nomes = new[] { "Ana", "Bruno", "Carla" };

var numerados = nomes.Select((nome, i) => $"{i + 1}. {nome}");
foreach (var item in numerados)
    Console.WriteLine(item);

// 1. Ana
// 2. Bruno
// 3. Carla`})}),e.jsx("h2",{children:"Combinando Where e Select"}),e.jsx("p",{children:"A combinação clássica: filtrar + projetar. Note como o código fica autoexplicativo, lendo quase como inglês."}),e.jsx("pre",{children:e.jsx("code",{children:`var produtos = new[]
{
    new { Nome = "Leite",  Preco = 5m,  EmEstoque = true },
    new { Nome = "Pão",    Preco = 1m,  EmEstoque = false },
    new { Nome = "Café",   Preco = 25m, EmEstoque = true },
    new { Nome = "Açúcar", Preco = 8m,  EmEstoque = true }
};

// Nomes dos produtos em estoque que custam mais de R$ 4
var resumo = produtos
    .Where(p => p.EmEstoque && p.Preco > 4)
    .Select(p => p.Nome)
    .ToList();

foreach (var nome in resumo)
    Console.WriteLine(nome);
// Leite, Café, Açúcar`})}),e.jsxs(a,{type:"success",title:"A ordem importa para performance",children:["Coloque ",e.jsx("code",{children:"Where"})," ",e.jsx("em",{children:"antes"})," de operações caras como ",e.jsx("code",{children:"Select"})," que faz lookup, ou antes de ",e.jsx("code",{children:"OrderBy"}),". Filtrar primeiro reduz quantos itens precisam ser processados pelo resto do pipeline."]}),e.jsx("h2",{children:"SelectMany: achatando coleções aninhadas"}),e.jsxs("p",{children:["Quando cada item da sua coleção contém ",e.jsx("em",{children:"outra"})," coleção dentro, ",e.jsx("code",{children:"SelectMany"}),' "achata" tudo em uma única sequência. Pense em uma lista de salas, onde cada sala tem alunos: você quer todos os alunos.']}),e.jsx("pre",{children:e.jsx("code",{children:`var salas = new[]
{
    new { Sala = "A", Alunos = new[] { "Ana", "Bia" } },
    new { Sala = "B", Alunos = new[] { "Carlos", "Diana" } },
    new { Sala = "C", Alunos = new[] { "Eva" } }
};

// Select daria IEnumerable<string[]> — uma lista de listas
// SelectMany dá IEnumerable<string> — todos os alunos juntos
var todos = salas.SelectMany(s => s.Alunos);

foreach (var nome in todos)
    Console.WriteLine(nome);
// Ana, Bia, Carlos, Diana, Eva`})}),e.jsx("h2",{children:"Materializando o resultado"}),e.jsxs("p",{children:["Lembre: o resultado de ",e.jsx("code",{children:"Where"}),"/",e.jsx("code",{children:"Select"})," é ",e.jsx("code",{children:"IEnumerable<T>"}),' — uma "receita" lazy. Para guardar como coleção concreta, encerre com ',e.jsx("code",{children:"ToList()"}),", ",e.jsx("code",{children:"ToArray()"}),", ",e.jsx("code",{children:"ToHashSet()"})," ou ",e.jsx("code",{children:"ToDictionary(...)"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`List<int> lista = nums.Where(n => n > 2).ToList();
int[] arr = nums.Select(n => n * n).ToArray();
HashSet<int> set = nums.Where(n => n % 2 == 0).ToHashSet();

// ToDictionary: precisa de chave (e valor opcional)
var dict = produtos.ToDictionary(p => p.Nome, p => p.Preco);
Console.WriteLine(dict["Café"]); // 25`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"ToList()"})]}),': você passa uma "query" que será reexecutada toda vez que iterada.']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"Select"})," achando que filtra"]}),": ",e.jsx("code",{children:"Select"})," sempre devolve a mesma quantidade de itens. Quem filtra é ",e.jsx("code",{children:"Where"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Modificar a fonte durante iteração"}),": como em qualquer foreach, alterar a coleção subjacente enquanto a query está sendo enumerada estoura exceção."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"Select"})," com ",e.jsx("code",{children:"SelectMany"})]}),": o primeiro mantém a estrutura aninhada, o segundo achata um nível."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Where(predicate)"})," filtra; predicate é uma lambda ",e.jsx("code",{children:"x => bool"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Select(projector)"})," transforma; projector é uma lambda ",e.jsx("code",{children:"x => novoValor"}),"."]}),e.jsx("li",{children:"Ambos têm sobrecargas com índice."}),e.jsxs("li",{children:[e.jsx("code",{children:"SelectMany"})," achata coleções aninhadas."]}),e.jsx("li",{children:"Sempre filtre antes de projetar/ordenar para performance."}),e.jsxs("li",{children:["Materialize com ",e.jsx("code",{children:"ToList"}),"/",e.jsx("code",{children:"ToArray"})," quando for usar mais de uma vez."]})]})]})}export{n as default};
