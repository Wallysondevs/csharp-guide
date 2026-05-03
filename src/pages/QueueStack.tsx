import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function QueueStack() {
  return (
    <PageContainer
      title="Queue<T> e Stack<T>: filas e pilhas"
      subtitle="Duas estruturas clássicas: a fila do banco (FIFO) e a pilha de pratos (LIFO). Quando e como usar cada uma."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Se você já esperou em uma fila de banco, entendeu <strong>FIFO</strong> (First In, First Out): o primeiro a chegar é o primeiro a ser atendido. Se já lavou uma pilha de pratos, entendeu <strong>LIFO</strong> (Last In, First Out): o último prato colocado é o primeiro a sair. C# oferece duas coleções genéricas que implementam exatamente esses comportamentos: <code>Queue&lt;T&gt;</code> e <code>Stack&lt;T&gt;</code>. Elas são fundamentais para algoritmos clássicos como busca em grafos, processamento de tarefas e desfazer/refazer.
      </p>

      <h2>Queue&lt;T&gt;: a fila</h2>
      <p>
        Uma <strong>Queue</strong> insere no final e remove do começo. Os métodos centrais são três:
      </p>
      <ul>
        <li><code>Enqueue(item)</code>: enfileira no final.</li>
        <li><code>Dequeue()</code>: remove e devolve o primeiro.</li>
        <li><code>Peek()</code>: olha o primeiro sem remover.</li>
      </ul>
      <pre><code>{`using System.Collections.Generic;

var atendimento = new Queue<string>();
atendimento.Enqueue("Ana");
atendimento.Enqueue("Bruno");
atendimento.Enqueue("Carla");

Console.WriteLine(atendimento.Peek());    // "Ana" (não remove)
Console.WriteLine(atendimento.Count);     // 3

string proximo = atendimento.Dequeue();   // "Ana" sai
Console.WriteLine(proximo);
Console.WriteLine(atendimento.Count);     // 2

// Iteração não destrutiva
foreach (var nome in atendimento)
    Console.WriteLine(nome); // Bruno, Carla`}</code></pre>

      <h2>Stack&lt;T&gt;: a pilha</h2>
      <p>
        Uma <strong>Stack</strong> insere e remove pelo topo. Os métodos análogos são:
      </p>
      <ul>
        <li><code>Push(item)</code>: empilha no topo.</li>
        <li><code>Pop()</code>: remove e devolve o topo.</li>
        <li><code>Peek()</code>: olha o topo sem remover.</li>
      </ul>
      <pre><code>{`var pratos = new Stack<string>();
pratos.Push("prato1");
pratos.Push("prato2");
pratos.Push("prato3");

Console.WriteLine(pratos.Peek()); // "prato3" (último entrou)
Console.WriteLine(pratos.Pop());  // "prato3" sai
Console.WriteLine(pratos.Pop());  // "prato2"
Console.WriteLine(pratos.Count);  // 1`}</code></pre>

      <AlertBox type="info" title="TryDequeue e TryPop">
        Em .NET moderno, ambos têm versões "Try" que não lançam exceção quando vazias: <code>queue.TryDequeue(out var item)</code> e <code>stack.TryPop(out var item)</code>. Use-as para evitar verificações manuais de <code>Count &gt; 0</code>.
      </AlertBox>

      <h2>Caso real: undo/redo com duas pilhas</h2>
      <p>
        Editores de texto, ferramentas de desenho e IDEs usam <strong>duas pilhas</strong> para implementar desfazer/refazer. Cada ação vai para a pilha de undo. Quando você desfaz, o item sai do undo e vai para o redo.
      </p>
      <pre><code>{`var undo = new Stack<string>();
var redo = new Stack<string>();

void Digitar(string letra)
{
    undo.Push(letra);
    redo.Clear(); // nova ação invalida o redo
}

void Desfazer()
{
    if (undo.TryPop(out var ultima))
        redo.Push(ultima);
}

void Refazer()
{
    if (redo.TryPop(out var ultima))
        undo.Push(ultima);
}

Digitar("o");
Digitar("l");
Digitar("a");
Desfazer();   // tira "a", joga no redo
Console.WriteLine(undo.Count); // 2
Console.WriteLine(redo.Count); // 1`}</code></pre>

      <h2>Caso real: BFS com Queue, DFS com Stack</h2>
      <p>
        Em algoritmos de grafos, <strong>BFS</strong> (Breadth-First Search, busca em largura) usa uma Queue para visitar vértices nível a nível. <strong>DFS</strong> (Depth-First Search, busca em profundidade) usa uma Stack (ou recursão, que é uma stack implícita) para descer o mais fundo possível antes de voltar.
      </p>
      <pre><code>{`// BFS simplificado: percorre lista de adjacência
var grafo = new Dictionary<int, List<int>>
{
    [1] = new() { 2, 3 },
    [2] = new() { 4 },
    [3] = new() { 4, 5 },
    [4] = new(),
    [5] = new()
};

void Bfs(int inicio)
{
    var fila = new Queue<int>();
    var visitados = new HashSet<int>();
    fila.Enqueue(inicio);
    visitados.Add(inicio);

    while (fila.Count > 0)
    {
        int atual = fila.Dequeue();
        Console.WriteLine($"Visitei {atual}");
        foreach (var vizinho in grafo[atual])
            if (visitados.Add(vizinho)) // Add devolve false se já existe
                fila.Enqueue(vizinho);
    }
}

Bfs(1); // 1, 2, 3, 4, 5 (em ordem de nível)`}</code></pre>

      <h2>Caso real: processamento de tarefas</h2>
      <p>
        Muitos sistemas de filas (jobs em background, mensagens HTTP, eventos) começam com uma simples <code>Queue&lt;T&gt;</code> em memória antes de evoluir para uma fila distribuída como RabbitMQ. O conceito é o mesmo:
      </p>
      <pre><code>{`var tarefas = new Queue<Action>();

tarefas.Enqueue(() => Console.WriteLine("Enviar email"));
tarefas.Enqueue(() => Console.WriteLine("Gerar PDF"));
tarefas.Enqueue(() => Console.WriteLine("Atualizar índice"));

while (tarefas.TryDequeue(out var trabalho))
    trabalho.Invoke();`}</code></pre>

      <AlertBox type="warning" title="Não são thread-safe">
        Tanto <code>Queue&lt;T&gt;</code> quanto <code>Stack&lt;T&gt;</code> não suportam acesso concorrente seguro. Para multi-thread, use <code>ConcurrentQueue&lt;T&gt;</code> ou <code>ConcurrentStack&lt;T&gt;</code> do namespace <code>System.Collections.Concurrent</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Chamar <code>Dequeue</code>/<code>Pop</code> em coleção vazia</strong>: lança <code>InvalidOperationException</code>. Use <code>TryDequeue</code>/<code>TryPop</code>.</li>
        <li><strong>Confundir Queue com Stack</strong>: a regra é "fila do banco vs pilha de pratos". Se a ordem importa, escolha conscientemente.</li>
        <li><strong>Iterar e modificar ao mesmo tempo</strong>: tanto <code>foreach</code> quanto modificar via <code>Enqueue</code>/<code>Push</code> dentro do laço dispara <code>InvalidOperationException</code>.</li>
        <li><strong>Esperar acesso por índice</strong>: nem Queue nem Stack expõem indexer. Se você precisa, está usando a coleção errada — use List.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Queue = FIFO; métodos: <code>Enqueue</code>, <code>Dequeue</code>, <code>Peek</code>.</li>
        <li>Stack = LIFO; métodos: <code>Push</code>, <code>Pop</code>, <code>Peek</code>.</li>
        <li>Use <code>TryDequeue</code>/<code>TryPop</code> para evitar exceções com coleção vazia.</li>
        <li>BFS usa Queue; DFS usa Stack; undo/redo usa duas Stacks.</li>
        <li>Para concorrência, use as versões em <code>System.Collections.Concurrent</code>.</li>
      </ul>
    </PageContainer>
  );
}
