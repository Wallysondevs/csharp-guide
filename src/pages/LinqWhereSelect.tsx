import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinqWhereSelect() {
  return (
    <PageContainer
      title="LINQ: Where e Select fundamentais"
      subtitle="Os dois operadores que você usará todos os dias — filtrar e projetar coleções com lambdas."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Se LINQ fosse uma cozinha, <strong>Where</strong> seria o coador (deixa passar só o que você quer) e <strong>Select</strong> seria o liquidificador (transforma o que passou em outra coisa). Esses dois operadores aparecem em praticamente toda consulta LINQ que você vai escrever no resto da vida. Domine-os de verdade e 70% do LINQ está coberto. Este capítulo vai mostrar todas as variações úteis, com exemplos completos.
      </p>

      <h2>Where: filtrando com predicates</h2>
      <p>
        <code>Where</code> recebe uma <strong>lambda</strong> que devolve <code>bool</code> (chamada <em>predicate</em>) e devolve apenas os itens em que a lambda retorna <code>true</code>. Lembre que LINQ é <em>lazy</em>: nada é calculado até você iterar.
      </p>
      <pre><code>{`int[] numeros = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Pegar só os maiores que 5
var grandes = numeros.Where(n => n > 5);
foreach (var n in grandes)
    Console.WriteLine(n); // 6, 7, 8, 9, 10

// Predicate composto
var imparesGrandes = numeros.Where(n => n > 5 && n % 2 == 1);
// 7, 9`}</code></pre>

      <h2>Where com índice</h2>
      <p>
        Existe uma sobrecarga menos conhecida que dá acesso ao índice do item. Útil quando o critério depende da posição:
      </p>
      <pre><code>{`var letras = new[] { "a", "b", "c", "d", "e", "f" };

// Manter só as letras em índices pares (0, 2, 4)
var paresIdx = letras.Where((letra, indice) => indice % 2 == 0);
// "a", "c", "e"`}</code></pre>

      <h2>Encadeando vários Where</h2>
      <p>
        Você pode chamar <code>Where</code> várias vezes em sequência. Cada chamada filtra o resultado da anterior. Em performance, isso é equivalente a um único <code>Where</code> com <code>&amp;&amp;</code>, mas pode ficar mais legível dividido:
      </p>
      <pre><code>{`var pessoas = new[]
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

// Ambos: { Nome = Diego, ... }`}</code></pre>

      <AlertBox type="info" title="O que é uma lambda?">
        Uma <strong>lambda</strong> é uma função "anônima" escrita inline. <code>n =&gt; n &gt; 5</code> significa "para um parâmetro n, retorne se ele é maior que 5". A seta <code>=&gt;</code> separa parâmetros do corpo. Lambdas com mais de uma instrução usam chaves: <code>n =&gt; {`{ var x = n*2; return x > 10; }`}</code>.
      </AlertBox>

      <h2>Select: projetando (transformando)</h2>
      <p>
        <code>Select</code> aplica uma transformação a cada item e devolve uma sequência nova. O tipo de saída pode ser igual ou diferente do tipo de entrada.
      </p>
      <pre><code>{`var nums = new[] { 1, 2, 3, 4, 5 };

// Mesmo tipo: dobrar
var dobrados = nums.Select(n => n * 2);
// 2, 4, 6, 8, 10

// Tipo diferente: transformar em string
var textos = nums.Select(n => $"#{n}");
// "#1", "#2", ...

// Projetar em tipo anônimo (objeto sem classe nomeada)
var info = nums.Select(n => new { Original = n, Quadrado = n * n });
foreach (var x in info)
    Console.WriteLine($"{x.Original} -> {x.Quadrado}");`}</code></pre>

      <h2>Select com índice</h2>
      <p>
        Como <code>Where</code>, <code>Select</code> também tem versão com índice — útil para enumerar com numeração:
      </p>
      <pre><code>{`var nomes = new[] { "Ana", "Bruno", "Carla" };

var numerados = nomes.Select((nome, i) => $"{i + 1}. {nome}");
foreach (var item in numerados)
    Console.WriteLine(item);

// 1. Ana
// 2. Bruno
// 3. Carla`}</code></pre>

      <h2>Combinando Where e Select</h2>
      <p>
        A combinação clássica: filtrar + projetar. Note como o código fica autoexplicativo, lendo quase como inglês.
      </p>
      <pre><code>{`var produtos = new[]
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
// Leite, Café, Açúcar`}</code></pre>

      <AlertBox type="success" title="A ordem importa para performance">
        Coloque <code>Where</code> <em>antes</em> de operações caras como <code>Select</code> que faz lookup, ou antes de <code>OrderBy</code>. Filtrar primeiro reduz quantos itens precisam ser processados pelo resto do pipeline.
      </AlertBox>

      <h2>SelectMany: achatando coleções aninhadas</h2>
      <p>
        Quando cada item da sua coleção contém <em>outra</em> coleção dentro, <code>SelectMany</code> "achata" tudo em uma única sequência. Pense em uma lista de salas, onde cada sala tem alunos: você quer todos os alunos.
      </p>
      <pre><code>{`var salas = new[]
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
// Ana, Bia, Carlos, Diana, Eva`}</code></pre>

      <h2>Materializando o resultado</h2>
      <p>
        Lembre: o resultado de <code>Where</code>/<code>Select</code> é <code>IEnumerable&lt;T&gt;</code> — uma "receita" lazy. Para guardar como coleção concreta, encerre com <code>ToList()</code>, <code>ToArray()</code>, <code>ToHashSet()</code> ou <code>ToDictionary(...)</code>.
      </p>
      <pre><code>{`List<int> lista = nums.Where(n => n > 2).ToList();
int[] arr = nums.Select(n => n * n).ToArray();
HashSet<int> set = nums.Where(n => n % 2 == 0).ToHashSet();

// ToDictionary: precisa de chave (e valor opcional)
var dict = produtos.ToDictionary(p => p.Nome, p => p.Preco);
Console.WriteLine(dict["Café"]); // 25`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>ToList()</code></strong>: você passa uma "query" que será reexecutada toda vez que iterada.</li>
        <li><strong>Usar <code>Select</code> achando que filtra</strong>: <code>Select</code> sempre devolve a mesma quantidade de itens. Quem filtra é <code>Where</code>.</li>
        <li><strong>Modificar a fonte durante iteração</strong>: como em qualquer foreach, alterar a coleção subjacente enquanto a query está sendo enumerada estoura exceção.</li>
        <li><strong>Confundir <code>Select</code> com <code>SelectMany</code></strong>: o primeiro mantém a estrutura aninhada, o segundo achata um nível.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Where(predicate)</code> filtra; predicate é uma lambda <code>x =&gt; bool</code>.</li>
        <li><code>Select(projector)</code> transforma; projector é uma lambda <code>x =&gt; novoValor</code>.</li>
        <li>Ambos têm sobrecargas com índice.</li>
        <li><code>SelectMany</code> achata coleções aninhadas.</li>
        <li>Sempre filtre antes de projetar/ordenar para performance.</li>
        <li>Materialize com <code>ToList</code>/<code>ToArray</code> quando for usar mais de uma vez.</li>
      </ul>
    </PageContainer>
  );
}
