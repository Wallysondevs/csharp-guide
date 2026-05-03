import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CollectionExpressions() {
  return (
    <PageContainer
      title="Collection expressions: literais para coleções (C# 12)"
      subtitle="Uma sintaxe única que serve para arrays, listas, spans e qualquer coleção compatível — com spread e ótima performance."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <p>
        Antes do C# 12, criar uma lista, um array ou um span pequeno exigia sintaxes diferentes: <code>new int[] {`{ 1, 2, 3 }`}</code>, <code>new List&lt;int&gt; {`{ 1, 2, 3 }`}</code>, <code>stackalloc int[] {`{ 1, 2, 3 }`}</code>... Cada coleção tinha sua "ladainha". O C# 12 introduziu as <strong>collection expressions</strong>: uma sintaxe única, com colchetes <code>[]</code>, que se adapta ao tipo do destino. Pense em colchetes como <em>uma caixa universal</em> — o conteúdo é o mesmo, mas o "formato da embalagem" depende do que você vai colocar dentro.
      </p>

      <h2>A sintaxe básica</h2>
      <p>
        Você escreve <code>[a, b, c]</code> e o compilador escolhe o construtor adequado conforme o tipo declarado da variável (esse mecanismo se chama <strong>target-typing</strong>):
      </p>
      <pre><code>{`int[] arr = [1, 2, 3];                 // gera array de int
List<int> lista = [1, 2, 3];           // gera List<int>
ReadOnlySpan<int> span = [1, 2, 3];    // gera span otimizado
HashSet<string> set = ["a", "b", "c"]; // gera HashSet<string>
IEnumerable<int> enu = [1, 2, 3];      // gera coleção apropriada (array)`}</code></pre>
      <p>
        A vantagem é dupla: o código fica mais curto e mais legível, e fica trivial trocar o tipo da variável sem reescrever o lado direito. Quer mudar de <code>List&lt;int&gt;</code> para <code>int[]</code>? Mude só a declaração.
      </p>

      <h2>Spread com <code>..</code>: combinando coleções</h2>
      <p>
        O operador <strong>spread</strong> (<code>..</code>) "despeja" os elementos de uma coleção dentro de outra. Pense em despejar uma garrafa em um copo:
      </p>
      <pre><code>{`int[] primeiros = [1, 2, 3];
int[] ultimos = [8, 9, 10];

// Combina dois arrays e adiciona elementos no meio
int[] todos = [..primeiros, 4, 5, 6, 7, ..ultimos];
// Resultado: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Funciona com qualquer IEnumerable
var fonte = Enumerable.Range(100, 3);   // 100, 101, 102
int[] mix = [0, ..fonte, 999];           // [0, 100, 101, 102, 999]`}</code></pre>
      <p>
        Você pode usar quantos spreads quiser, e misturar com elementos individuais em qualquer ordem. O compilador gera código que pré-aloca o tamanho exato quando possível, evitando realocações.
      </p>

      <AlertBox type="info" title="Equivalente a Concat?">
        Funcionalmente parecido com <code>Enumerable.Concat</code>, mas as collection expressions com spread são mais eficientes: o compilador conhece o tamanho final em tempo de compilação para fontes de tamanho conhecido (arrays, listas) e aloca uma vez só.
      </AlertBox>

      <h2>Coleção vazia</h2>
      <p>
        Para criar uma coleção vazia, basta <code>[]</code>. Substitui idiomas como <code>Array.Empty&lt;T&gt;()</code> e <code>new List&lt;T&gt;()</code>:
      </p>
      <pre><code>{`int[] vazio = [];
List<string> semNomes = [];
ReadOnlySpan<byte> bytes = [];

// Em retornos:
public IReadOnlyList<int> Ids() => [];   // não aloca em alguns casos`}</code></pre>

      <h2>Em métodos genéricos</h2>
      <p>
        Collection expressions também funcionam quando o tipo é um parâmetro genérico — desde que esse parâmetro seja de uma coleção suportada:
      </p>
      <pre><code>{`public static T[] Concat<T>(T[] a, T[] b) => [..a, ..b];

public static void Imprimir<T>(IEnumerable<T> itens) {
    foreach (var x in itens) Console.WriteLine(x);
}

Imprimir<int>([10, 20, 30]);   // funciona
Imprimir(["a", "b"]);          // T inferido como string`}</code></pre>

      <h2>Tipos suportados</h2>
      <p>
        O compilador sabe gerar para uma lista pré-definida de tipos:
      </p>
      <table>
        <thead><tr><th>Tipo destino</th><th>Como é construído</th></tr></thead>
        <tbody>
          <tr><td><code>T[]</code></td><td>Array com tamanho exato.</td></tr>
          <tr><td><code>List&lt;T&gt;</code></td><td><code>new List&lt;T&gt;</code> + <code>Add</code>.</td></tr>
          <tr><td><code>Span&lt;T&gt;</code>, <code>ReadOnlySpan&lt;T&gt;</code></td><td>Frequentemente alocado em pilha (<code>stackalloc</code>).</td></tr>
          <tr><td><code>IEnumerable&lt;T&gt;</code>, <code>IReadOnlyList&lt;T&gt;</code>, <code>IReadOnlyCollection&lt;T&gt;</code></td><td>Array internamente.</td></tr>
          <tr><td><code>HashSet&lt;T&gt;</code>, <code>Queue&lt;T&gt;</code>, <code>Stack&lt;T&gt;</code> e similares</td><td>Construtor com capacidade + <code>Add</code>/<code>Enqueue</code>/<code>Push</code>.</td></tr>
          <tr><td>Tipos com <code>[CollectionBuilder(...)]</code></td><td>Você pode marcar suas próprias coleções para suportar a sintaxe.</td></tr>
        </tbody>
      </table>

      <h2>Performance: por que é melhor que o antigo</h2>
      <p>
        Quando o compilador conhece o tamanho final, ele aloca o array com a capacidade certa de uma vez só. Para <code>Span</code> de itens primitivos, ele pode usar <code>stackalloc</code> evitando alocação no heap. Compare:
      </p>
      <pre><code>{`// Antes: aloca com capacidade default e pode realocar várias vezes
var antes = new List<int>();
antes.Add(1); antes.Add(2); antes.Add(3);

// Agora: aloca exatamente o necessário
List<int> agora = [1, 2, 3];

// Para spans pequenos, sem alocação no heap
ReadOnlySpan<int> chaves = [10, 20, 30];   // tipicamente stackalloc`}</code></pre>

      <AlertBox type="warning" title="Não confunda com pattern matching">
        A sintaxe <code>[1, 2, 3]</code> aparece em dois lugares no C# moderno:<br/>
        — Em <strong>expressões</strong>: <em>cria</em> uma coleção (collection expression).<br/>
        — Em <code>switch</code>/<code>is</code>: <em>casa</em> contra uma coleção (list pattern, do C# 11). Ex.: <code>if (arr is [1, _, 3])</code>.
        São primos próximos mas servem propósitos opostos.
      </AlertBox>

      <h2>Tornando seu tipo compatível</h2>
      <p>
        Você pode permitir collection expressions na sua própria coleção implementando o atributo <code>[CollectionBuilder]</code>:
      </p>
      <pre><code>{`using System.Runtime.CompilerServices;

[CollectionBuilder(typeof(MinhaListaBuilder), "Create")]
public class MinhaLista<T> {
    private readonly T[] _itens;
    internal MinhaLista(T[] itens) { _itens = itens; }
    public T this[int i] => _itens[i];
    public int Count => _itens.Length;
}

public static class MinhaListaBuilder {
    public static MinhaLista<T> Create<T>(ReadOnlySpan<T> itens) =>
        new MinhaLista<T>(itens.ToArray());
}

// Agora a sintaxe funciona:
MinhaLista<int> ml = [1, 2, 3];`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar com <code>var</code>:</strong> <code>var x = [1, 2, 3];</code> NÃO compila — não há tipo declarado para o target-typing inferir.</li>
        <li><strong>Spread de tipo errado:</strong> <code>..</code> exige um <code>IEnumerable&lt;T&gt;</code> compatível com o elemento da coleção destino. Misturar tipos dá erro.</li>
        <li><strong>Esperar <code>Dictionary</code>:</strong> ainda NÃO há sintaxe oficial de collection expression para dicionários (esperada para versões futuras).</li>
        <li><strong>Confundir <code>[]</code> vazio com <code>null</code>:</strong> <code>[]</code> sempre cria uma coleção vazia, nunca <code>null</code>. Use <code>null</code> explicitamente quando quiser ausência.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>[a, b, c]</code> serve para arrays, listas, spans, hashsets e mais.</li>
        <li>O tipo é decidido por <em>target-typing</em>: declare a variável e o compilador escolhe.</li>
        <li>Spread <code>..</code> combina coleções de forma eficiente.</li>
        <li>Performance: alocação exata, possível <code>stackalloc</code> para spans.</li>
        <li>Você pode habilitar a sintaxe em seus tipos via <code>[CollectionBuilder]</code>.</li>
      </ul>
    </PageContainer>
  );
}
