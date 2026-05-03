import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(r,{title:"Queue<T> e Stack<T>: filas e pilhas",subtitle:"Duas estruturas clássicas: a fila do banco (FIFO) e a pilha de pratos (LIFO). Quando e como usar cada uma.",difficulty:"iniciante",timeToRead:"11 min",children:[e.jsxs("p",{children:["Se você já esperou em uma fila de banco, entendeu ",e.jsx("strong",{children:"FIFO"})," (First In, First Out): o primeiro a chegar é o primeiro a ser atendido. Se já lavou uma pilha de pratos, entendeu ",e.jsx("strong",{children:"LIFO"})," (Last In, First Out): o último prato colocado é o primeiro a sair. C# oferece duas coleções genéricas que implementam exatamente esses comportamentos: ",e.jsx("code",{children:"Queue<T>"})," e ",e.jsx("code",{children:"Stack<T>"}),". Elas são fundamentais para algoritmos clássicos como busca em grafos, processamento de tarefas e desfazer/refazer."]}),e.jsx("h2",{children:"Queue<T>: a fila"}),e.jsxs("p",{children:["Uma ",e.jsx("strong",{children:"Queue"})," insere no final e remove do começo. Os métodos centrais são três:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Enqueue(item)"}),": enfileira no final."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Dequeue()"}),": remove e devolve o primeiro."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Peek()"}),": olha o primeiro sem remover."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Collections.Generic;

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
    Console.WriteLine(nome); // Bruno, Carla`})}),e.jsx("h2",{children:"Stack<T>: a pilha"}),e.jsxs("p",{children:["Uma ",e.jsx("strong",{children:"Stack"})," insere e remove pelo topo. Os métodos análogos são:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Push(item)"}),": empilha no topo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Pop()"}),": remove e devolve o topo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Peek()"}),": olha o topo sem remover."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`var pratos = new Stack<string>();
pratos.Push("prato1");
pratos.Push("prato2");
pratos.Push("prato3");

Console.WriteLine(pratos.Peek()); // "prato3" (último entrou)
Console.WriteLine(pratos.Pop());  // "prato3" sai
Console.WriteLine(pratos.Pop());  // "prato2"
Console.WriteLine(pratos.Count);  // 1`})}),e.jsxs(o,{type:"info",title:"TryDequeue e TryPop",children:['Em .NET moderno, ambos têm versões "Try" que não lançam exceção quando vazias: ',e.jsx("code",{children:"queue.TryDequeue(out var item)"})," e ",e.jsx("code",{children:"stack.TryPop(out var item)"}),". Use-as para evitar verificações manuais de ",e.jsx("code",{children:"Count > 0"}),"."]}),e.jsx("h2",{children:"Caso real: undo/redo com duas pilhas"}),e.jsxs("p",{children:["Editores de texto, ferramentas de desenho e IDEs usam ",e.jsx("strong",{children:"duas pilhas"})," para implementar desfazer/refazer. Cada ação vai para a pilha de undo. Quando você desfaz, o item sai do undo e vai para o redo."]}),e.jsx("pre",{children:e.jsx("code",{children:`var undo = new Stack<string>();
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
Console.WriteLine(redo.Count); // 1`})}),e.jsx("h2",{children:"Caso real: BFS com Queue, DFS com Stack"}),e.jsxs("p",{children:["Em algoritmos de grafos, ",e.jsx("strong",{children:"BFS"})," (Breadth-First Search, busca em largura) usa uma Queue para visitar vértices nível a nível. ",e.jsx("strong",{children:"DFS"})," (Depth-First Search, busca em profundidade) usa uma Stack (ou recursão, que é uma stack implícita) para descer o mais fundo possível antes de voltar."]}),e.jsx("pre",{children:e.jsx("code",{children:`// BFS simplificado: percorre lista de adjacência
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

Bfs(1); // 1, 2, 3, 4, 5 (em ordem de nível)`})}),e.jsx("h2",{children:"Caso real: processamento de tarefas"}),e.jsxs("p",{children:["Muitos sistemas de filas (jobs em background, mensagens HTTP, eventos) começam com uma simples ",e.jsx("code",{children:"Queue<T>"})," em memória antes de evoluir para uma fila distribuída como RabbitMQ. O conceito é o mesmo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var tarefas = new Queue<Action>();

tarefas.Enqueue(() => Console.WriteLine("Enviar email"));
tarefas.Enqueue(() => Console.WriteLine("Gerar PDF"));
tarefas.Enqueue(() => Console.WriteLine("Atualizar índice"));

while (tarefas.TryDequeue(out var trabalho))
    trabalho.Invoke();`})}),e.jsxs(o,{type:"warning",title:"Não são thread-safe",children:["Tanto ",e.jsx("code",{children:"Queue<T>"})," quanto ",e.jsx("code",{children:"Stack<T>"})," não suportam acesso concorrente seguro. Para multi-thread, use ",e.jsx("code",{children:"ConcurrentQueue<T>"})," ou ",e.jsx("code",{children:"ConcurrentStack<T>"})," do namespace ",e.jsx("code",{children:"System.Collections.Concurrent"}),"."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Chamar ",e.jsx("code",{children:"Dequeue"}),"/",e.jsx("code",{children:"Pop"})," em coleção vazia"]}),": lança ",e.jsx("code",{children:"InvalidOperationException"}),". Use ",e.jsx("code",{children:"TryDequeue"}),"/",e.jsx("code",{children:"TryPop"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confundir Queue com Stack"}),': a regra é "fila do banco vs pilha de pratos". Se a ordem importa, escolha conscientemente.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Iterar e modificar ao mesmo tempo"}),": tanto ",e.jsx("code",{children:"foreach"})," quanto modificar via ",e.jsx("code",{children:"Enqueue"}),"/",e.jsx("code",{children:"Push"})," dentro do laço dispara ",e.jsx("code",{children:"InvalidOperationException"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar acesso por índice"}),": nem Queue nem Stack expõem indexer. Se você precisa, está usando a coleção errada — use List."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Queue = FIFO; métodos: ",e.jsx("code",{children:"Enqueue"}),", ",e.jsx("code",{children:"Dequeue"}),", ",e.jsx("code",{children:"Peek"}),"."]}),e.jsxs("li",{children:["Stack = LIFO; métodos: ",e.jsx("code",{children:"Push"}),", ",e.jsx("code",{children:"Pop"}),", ",e.jsx("code",{children:"Peek"}),"."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"TryDequeue"}),"/",e.jsx("code",{children:"TryPop"})," para evitar exceções com coleção vazia."]}),e.jsx("li",{children:"BFS usa Queue; DFS usa Stack; undo/redo usa duas Stacks."}),e.jsxs("li",{children:["Para concorrência, use as versões em ",e.jsx("code",{children:"System.Collections.Concurrent"}),"."]})]})]})}export{s as default};
