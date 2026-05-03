import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinqAggregates() {
  return (
    <PageContainer
      title="LINQ: Sum, Average, Count, Aggregate"
      subtitle="Como reduzir uma coleção inteira a um único valor — somar, contar, achar máximo, ou criar sua própria operação."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Pense em uma planilha de Excel: você tem uma coluna de valores e na última célula coloca <code>=SOMA(...)</code> ou <code>=MÉDIA(...)</code>. As <strong>funções de agregação</strong> em LINQ fazem exatamente isso para coleções em código C#: pegam vários itens e devolvem <em>um único</em> resultado. Este capítulo cobre as agregadoras prontas (<code>Sum</code>, <code>Average</code>, <code>Min</code>, <code>Max</code>, <code>Count</code>, <code>Any</code>, <code>All</code>) e a poderosa <code>Aggregate</code>, que permite criar reduções customizadas.
      </p>

      <h2>Sum, Average, Min e Max</h2>
      <p>
        Esses quatro métodos só funcionam diretamente em coleções de números (<code>int</code>, <code>decimal</code>, <code>double</code>...). Quando você tem uma coleção de objetos, passa um <strong>seletor</strong> dizendo qual propriedade somar.
      </p>
      <pre><code>{`record Produto(string Nome, decimal Preco, int Estoque);

var produtos = new[] {
    new Produto("Caneta", 2.50m, 100),
    new Produto("Caderno", 15.00m, 30),
    new Produto("Livro",  45.00m, 10)
};

decimal total   = produtos.Sum(p => p.Preco);       // 62,50
decimal media   = produtos.Average(p => p.Preco);   // 20,83...
decimal maisCar = produtos.Max(p => p.Preco);       // 45,00
decimal maisBar = produtos.Min(p => p.Preco);       // 2,50

// MaxBy / MinBy retornam o OBJETO inteiro (C# 6+ no .NET 6+):
Produto produtoMaisCaro = produtos.MaxBy(p => p.Preco)!;
Console.WriteLine(produtoMaisCaro.Nome); // Livro`}</code></pre>
      <p>
        Note a diferença: <code>Max</code> devolve o <em>valor</em> máximo (45,00); <code>MaxBy</code> devolve o <em>objeto</em> que tem esse máximo. Em códigos modernos, prefira <code>MaxBy</code>/<code>MinBy</code>.
      </p>

      <h2>Count e LongCount</h2>
      <p>
        <code>Count()</code> sem argumento conta todos os elementos. Com um <strong>predicado</strong> (uma função que devolve <code>bool</code>), conta só os que satisfazem a condição — é o jeito idiomático de "quantos itens cumprem X".
      </p>
      <pre><code>{`int totalProdutos     = produtos.Count();
int produtosEmFalta   = produtos.Count(p => p.Estoque == 0);
int produtosCaros     = produtos.Count(p => p.Preco > 20m);

// LongCount serve para coleções gigantes (> 2 bilhões),
// onde o int normal estouraria.
long contagem = enormeColecao.LongCount();`}</code></pre>

      <AlertBox type="warning" title="Cuidado com Count() em IEnumerable">
        Se a coleção é um <code>IEnumerable&lt;T&gt;</code> "puro" (sem ser uma <code>List</code> ou um <code>Array</code>), <code>Count()</code> percorre todos os elementos para contar. Para grandes coleções, prefira armazenar em <code>List</code> antes ou use <code>Any()</code> quando só precisar saber se existe ao menos um item.
      </AlertBox>

      <h2>Any e All</h2>
      <p>
        Estes dois devolvem <code>bool</code> e respondem perguntas de "existe?" / "todos?":
      </p>
      <pre><code>{`bool temFalta    = produtos.Any(p => p.Estoque == 0);   // false
bool temItens    = produtos.Any();                       // true
bool todosCaros  = produtos.All(p => p.Preco > 1m);      // true
bool todosFalta  = produtos.All(p => p.Estoque == 0);    // false

// Any() é MUITO mais barato que Count() > 0 porque para
// no primeiro elemento encontrado.
if (lista.Any()) { /* ... */ }      // ✅ idiomático
if (lista.Count() > 0) { /* ... */ } // ❌ percorre tudo se IEnumerable`}</code></pre>

      <h2>Aggregate: faça sua própria redução</h2>
      <p>
        <code>Aggregate</code> é a "navalha suíça" das agregações. Ele recebe um <strong>acumulador</strong> e uma função que combina o acumulador com cada elemento. É o equivalente de <code>reduce</code> em JavaScript ou <code>foldl</code> em linguagens funcionais.
      </p>
      <pre><code>{`int[] numeros = { 1, 2, 3, 4, 5 };

// Sem semente: primeiro elemento vira o acumulador inicial
int soma = numeros.Aggregate((acc, n) => acc + n);   // 15

// Com semente (valor inicial explícito) — preferido:
int soma2 = numeros.Aggregate(0, (acc, n) => acc + n); // 15

// Com semente E projeção final:
string lista = numeros.Aggregate(
    seed: new System.Text.StringBuilder(),
    func: (sb, n) => sb.Append(n).Append(','),
    resultSelector: sb => sb.ToString().TrimEnd(','));
// "1,2,3,4,5"

// Exemplo prático: produto fatorial
int fat = Enumerable.Range(1, 5).Aggregate(1, (a, n) => a * n); // 120`}</code></pre>
      <p>
        A versão sem semente <strong>lança exceção</strong> se a coleção estiver vazia. A versão com semente devolve a própria semente nesse caso — sempre prefira a versão com semente em código de produção.
      </p>

      <h2>Performance: o que o iniciante precisa saber</h2>
      <p>
        Cada agregadora percorre a coleção <strong>uma vez</strong>. Mas se você encadear várias (<code>lista.Sum() + lista.Count() + lista.Average()</code>), está percorrendo três vezes. Para coleções grandes, materialize em <code>List</code> e, se possível, calcule tudo num único <code>Aggregate</code>.
      </p>
      <pre><code>{`// 3 passes:
var s = lista.Sum();
var c = lista.Count();
var m = (double)s / c;

// 1 pass:
var (soma, qtd) = lista.Aggregate(
    (Soma: 0L, Qtd: 0),
    (acc, n) => (acc.Soma + n, acc.Qtd + 1));
double media = qtd == 0 ? 0 : (double)soma / qtd;`}</code></pre>

      <AlertBox type="info" title="Average com inteiros">
        <code>new[]{`{1,2,3}`}.Average()</code> devolve <code>double</code> (2.0), não <code>int</code>. Já <code>Sum</code> sobre <code>int[]</code> devolve <code>int</code>, e <strong>pode estourar</strong> silenciosamente — use <code>.Select(x =&gt; (long)x).Sum()</code> em coleções enormes.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Chamar <code>Average</code> em coleção vazia</strong> — lança <code>InvalidOperationException</code>. Verifique com <code>Any()</code> antes.</li>
        <li><strong>Usar <code>Count() &gt; 0</code></strong> em vez de <code>Any()</code> — desperdício em coleções não-materializadas.</li>
        <li><strong>Esquecer overflow no <code>Sum</code></strong> de <code>int</code> — vira número negativo silenciosamente.</li>
        <li><strong>Confundir <code>Max</code> com <code>MaxBy</code></strong> — o primeiro devolve o valor, o segundo o objeto.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Sum</code>, <code>Average</code>, <code>Min</code>, <code>Max</code> reduzem uma coleção numérica a um valor.</li>
        <li><code>MinBy</code>/<code>MaxBy</code> devolvem o objeto inteiro, não o valor.</li>
        <li><code>Count(predicado)</code> conta itens que satisfazem uma condição.</li>
        <li><code>Any</code>/<code>All</code> respondem "existe algum?" / "todos cumprem?".</li>
        <li><code>Aggregate</code> permite reduções customizadas; sempre passe a semente.</li>
        <li>Cada agregadora percorre a coleção uma vez — encadear várias custa caro.</li>
      </ul>
    </PageContainer>
  );
}
