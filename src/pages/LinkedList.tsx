import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinkedList() {
  return (
    <PageContainer
      title="LinkedList<T>: lista duplamente encadeada"
      subtitle="A coleção de nós conectados por ponteiros — quando ela ganha de List<T> e quando perde feio."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Imagine uma sequência de vagões de trem, cada um conectado ao próximo por um engate. Se você quer adicionar um vagão no meio, só precisa desconectar dois engates e conectar dois novos — sem mover nenhum outro vagão. Essa é a ideia da <strong>LinkedList&lt;T&gt;</strong>: uma <em>lista duplamente encadeada</em> onde cada elemento (chamado <strong>nó</strong>) guarda referências para o anterior e o próximo. Isso torna inserções e remoções no meio extremamente rápidas — desde que você já tenha o nó em mãos.
      </p>

      <h2>Estrutura: o que é um LinkedListNode</h2>
      <p>
        Diferente da <code>List&lt;T&gt;</code>, que internamente é um array, a LinkedList trabalha com objetos chamados <code>LinkedListNode&lt;T&gt;</code>. Cada nó tem três coisas: o valor, o nó anterior (<code>Previous</code>) e o próximo (<code>Next</code>).
      </p>
      <pre><code>{`using System.Collections.Generic;

var lista = new LinkedList<string>();
lista.AddLast("Ana");
lista.AddLast("Bruno");
lista.AddLast("Carla");

// First e Last devolvem o nó (não o valor)
LinkedListNode<string>? primeiro = lista.First;
Console.WriteLine(primeiro!.Value); // "Ana"
Console.WriteLine(primeiro.Next!.Value); // "Bruno"

Console.WriteLine(lista.Count); // 3`}</code></pre>

      <h2>Inserindo: AddFirst, AddLast, AddBefore, AddAfter</h2>
      <p>
        Adicionar nas pontas é O(1): a lista mantém ponteiros para o primeiro e último nó. Adicionar em qualquer outra posição também é O(1) — <em>se você já tiver o nó de referência</em>. Achar esse nó, claro, é O(n).
      </p>
      <pre><code>{`var fila = new LinkedList<int>();
fila.AddLast(10);              // [10]
fila.AddLast(30);              // [10,30]
fila.AddFirst(5);              // [5,10,30]

LinkedListNode<int> no10 = fila.Find(10)!; // O(n) para achar
fila.AddAfter(no10, 20);       // [5,10,20,30]
fila.AddBefore(no10, 7);       // [5,7,10,20,30]

foreach (var x in fila) Console.Write($"{x} ");
// 5 7 10 20 30`}</code></pre>

      <AlertBox type="info" title="Por que ‘duplamente’ encadeada?">
        Existem listas <em>simplesmente</em> encadeadas (cada nó só conhece o próximo) e <em>duplamente</em> encadeadas (cada nó conhece o anterior também). A versão dupla custa um pouco mais de memória, mas permite percorrer em ambas as direções e remover qualquer nó em O(1) — por isso o .NET escolheu a dupla.
      </AlertBox>

      <h2>Removendo: por valor ou por nó</h2>
      <p>
        <code>Remove(valor)</code> percorre buscando — O(n). <code>Remove(no)</code>, recebendo o nó, é O(1). Use a versão por nó sempre que possível.
      </p>
      <pre><code>{`var nums = new LinkedList<int>();
foreach (var n in new[] { 1, 2, 3, 4, 5 }) nums.AddLast(n);

LinkedListNode<int> no3 = nums.Find(3)!;
nums.Remove(no3);              // O(1) — só ajusta dois ponteiros

nums.RemoveFirst();            // tira o primeiro
nums.RemoveLast();             // tira o último

foreach (var x in nums) Console.Write($"{x} "); // 2 4`}</code></pre>

      <h2>Comparação com List&lt;T&gt;</h2>
      <p>
        Aqui está a tabela mental que todo dev deveria ter na cabeça antes de escolher LinkedList:
      </p>
      <table>
        <thead><tr><th>Operação</th><th>List&lt;T&gt;</th><th>LinkedList&lt;T&gt;</th></tr></thead>
        <tbody>
          <tr><td>Acesso por índice</td><td>O(1)</td><td>O(n)</td></tr>
          <tr><td>Add no final</td><td>O(1) amortizado</td><td>O(1)</td></tr>
          <tr><td>Add no início</td><td>O(n) — shift</td><td>O(1)</td></tr>
          <tr><td>Add no meio (com nó)</td><td>O(n)</td><td>O(1)</td></tr>
          <tr><td>Buscar valor</td><td>O(n)</td><td>O(n)</td></tr>
          <tr><td>Cache locality</td><td>Excelente</td><td>Ruim</td></tr>
        </tbody>
      </table>
      <pre><code>{`// Em código real, List<T> quase sempre vence a LinkedList
// para coleções pequenas e médias, mesmo em inserções no meio,
// porque a memória contígua aproveita o cache do CPU.

var lista = new List<int>(capacity: 1_000_000);
for (int i = 0; i < 1_000_000; i++) lista.Add(i);
// Quase sempre mais rápida que LinkedList para iteração.`}</code></pre>

      <AlertBox type="warning" title="LinkedList raramente é a melhor escolha">
        Em benchmarks reais, <code>List&lt;T&gt;</code> ganha da <code>LinkedList&lt;T&gt;</code> em quase todos os cenários — porque CPUs modernas adoram memória contígua (cache). Use LinkedList só quando você <em>realmente</em> faz muitas inserções/remoções no meio segurando referência ao nó.
      </AlertBox>

      <h2>Casos de uso legítimos</h2>
      <p>
        Apesar de rara, a LinkedList tem nichos onde brilha:
      </p>
      <ul>
        <li><strong>Cache LRU</strong> (Least Recently Used): combina <code>Dictionary</code> apontando para nós da LinkedList; mover um item para o topo é O(1).</li>
        <li><strong>Filas de prioridade simples</strong> com inserção ordenada quando você já tem o nó vizinho.</li>
        <li><strong>Estruturas que precisam de iteração reversa frequente</strong> a partir de um nó arbitrário.</li>
      </ul>
      <pre><code>{`// Esqueleto simplificado de um cache LRU
public class LruCache<K, V> where K : notnull
{
    private readonly int _max;
    private readonly Dictionary<K, LinkedListNode<(K Key, V Value)>> _map = new();
    private readonly LinkedList<(K Key, V Value)> _ordem = new();

    public LruCache(int max) => _max = max;

    public V? Get(K key)
    {
        if (_map.TryGetValue(key, out var no))
        {
            _ordem.Remove(no);              // O(1)
            _ordem.AddFirst(no);            // marca como recente
            return no.Value.Value;
        }
        return default;
    }

    public void Put(K key, V value)
    {
        if (_map.TryGetValue(key, out var existente))
            _ordem.Remove(existente);
        else if (_map.Count >= _max)
        {
            var velho = _ordem.Last!;       // descarta o menos usado
            _ordem.RemoveLast();
            _map.Remove(velho.Value.Key);
        }
        var no = _ordem.AddFirst((key, value));
        _map[key] = no;
    }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar acesso por índice</strong>: <code>lista[3]</code> não existe em LinkedList — porque seria O(n) e enganoso.</li>
        <li><strong>Buscar valor para depois remover</strong>: <code>Find</code> + <code>Remove(no)</code> custa O(n) total. Não é melhor que <code>Remove(valor)</code> — só faça se você já tem o nó por outro caminho.</li>
        <li><strong>Confundir Value com o nó</strong>: <code>First</code> devolve o <code>LinkedListNode&lt;T&gt;</code>, não o valor. Use <code>First.Value</code>.</li>
        <li><strong>Usar quando List basta</strong>: a maioria dos códigos com LinkedList ficaria mais simples e rápida com List.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>LinkedList&lt;T&gt; é uma lista duplamente encadeada de nós.</li>
        <li>Insert/Remove em qualquer posição é O(1) — se você tem o nó.</li>
        <li>Não tem acesso por índice; busca é O(n) como List.</li>
        <li>Memória não-contígua = cache ruim; List geralmente ganha.</li>
        <li>Caso clássico: cache LRU com Dictionary + LinkedList.</li>
      </ul>
    </PageContainer>
  );
}
