import{j as e}from"./index-CzLAthD5.js";import{P as s,A as i}from"./AlertBox-CWJo3ar5.js";function a(){return e.jsxs(s,{title:"LinkedList<T>: lista duplamente encadeada",subtitle:"A coleção de nós conectados por ponteiros — quando ela ganha de List<T> e quando perde feio.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:["Imagine uma sequência de vagões de trem, cada um conectado ao próximo por um engate. Se você quer adicionar um vagão no meio, só precisa desconectar dois engates e conectar dois novos — sem mover nenhum outro vagão. Essa é a ideia da ",e.jsx("strong",{children:"LinkedList<T>"}),": uma ",e.jsx("em",{children:"lista duplamente encadeada"})," onde cada elemento (chamado ",e.jsx("strong",{children:"nó"}),") guarda referências para o anterior e o próximo. Isso torna inserções e remoções no meio extremamente rápidas — desde que você já tenha o nó em mãos."]}),e.jsx("h2",{children:"Estrutura: o que é um LinkedListNode"}),e.jsxs("p",{children:["Diferente da ",e.jsx("code",{children:"List<T>"}),", que internamente é um array, a LinkedList trabalha com objetos chamados ",e.jsx("code",{children:"LinkedListNode<T>"}),". Cada nó tem três coisas: o valor, o nó anterior (",e.jsx("code",{children:"Previous"}),") e o próximo (",e.jsx("code",{children:"Next"}),")."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Collections.Generic;

var lista = new LinkedList<string>();
lista.AddLast("Ana");
lista.AddLast("Bruno");
lista.AddLast("Carla");

// First e Last devolvem o nó (não o valor)
LinkedListNode<string>? primeiro = lista.First;
Console.WriteLine(primeiro!.Value); // "Ana"
Console.WriteLine(primeiro.Next!.Value); // "Bruno"

Console.WriteLine(lista.Count); // 3`})}),e.jsx("h2",{children:"Inserindo: AddFirst, AddLast, AddBefore, AddAfter"}),e.jsxs("p",{children:["Adicionar nas pontas é O(1): a lista mantém ponteiros para o primeiro e último nó. Adicionar em qualquer outra posição também é O(1) — ",e.jsx("em",{children:"se você já tiver o nó de referência"}),". Achar esse nó, claro, é O(n)."]}),e.jsx("pre",{children:e.jsx("code",{children:`var fila = new LinkedList<int>();
fila.AddLast(10);              // [10]
fila.AddLast(30);              // [10,30]
fila.AddFirst(5);              // [5,10,30]

LinkedListNode<int> no10 = fila.Find(10)!; // O(n) para achar
fila.AddAfter(no10, 20);       // [5,10,20,30]
fila.AddBefore(no10, 7);       // [5,7,10,20,30]

foreach (var x in fila) Console.Write($"{x} ");
// 5 7 10 20 30`})}),e.jsxs(i,{type:"info",title:"Por que ‘duplamente’ encadeada?",children:["Existem listas ",e.jsx("em",{children:"simplesmente"})," encadeadas (cada nó só conhece o próximo) e ",e.jsx("em",{children:"duplamente"})," encadeadas (cada nó conhece o anterior também). A versão dupla custa um pouco mais de memória, mas permite percorrer em ambas as direções e remover qualquer nó em O(1) — por isso o .NET escolheu a dupla."]}),e.jsx("h2",{children:"Removendo: por valor ou por nó"}),e.jsxs("p",{children:[e.jsx("code",{children:"Remove(valor)"})," percorre buscando — O(n). ",e.jsx("code",{children:"Remove(no)"}),", recebendo o nó, é O(1). Use a versão por nó sempre que possível."]}),e.jsx("pre",{children:e.jsx("code",{children:`var nums = new LinkedList<int>();
foreach (var n in new[] { 1, 2, 3, 4, 5 }) nums.AddLast(n);

LinkedListNode<int> no3 = nums.Find(3)!;
nums.Remove(no3);              // O(1) — só ajusta dois ponteiros

nums.RemoveFirst();            // tira o primeiro
nums.RemoveLast();             // tira o último

foreach (var x in nums) Console.Write($"{x} "); // 2 4`})}),e.jsx("h2",{children:"Comparação com List<T>"}),e.jsx("p",{children:"Aqui está a tabela mental que todo dev deveria ter na cabeça antes de escolher LinkedList:"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Operação"}),e.jsx("th",{children:"List<T>"}),e.jsx("th",{children:"LinkedList<T>"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Acesso por índice"}),e.jsx("td",{children:"O(1)"}),e.jsx("td",{children:"O(n)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Add no final"}),e.jsx("td",{children:"O(1) amortizado"}),e.jsx("td",{children:"O(1)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Add no início"}),e.jsx("td",{children:"O(n) — shift"}),e.jsx("td",{children:"O(1)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Add no meio (com nó)"}),e.jsx("td",{children:"O(n)"}),e.jsx("td",{children:"O(1)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Buscar valor"}),e.jsx("td",{children:"O(n)"}),e.jsx("td",{children:"O(n)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Cache locality"}),e.jsx("td",{children:"Excelente"}),e.jsx("td",{children:"Ruim"})]})]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// Em código real, List<T> quase sempre vence a LinkedList
// para coleções pequenas e médias, mesmo em inserções no meio,
// porque a memória contígua aproveita o cache do CPU.

var lista = new List<int>(capacity: 1_000_000);
for (int i = 0; i < 1_000_000; i++) lista.Add(i);
// Quase sempre mais rápida que LinkedList para iteração.`})}),e.jsxs(i,{type:"warning",title:"LinkedList raramente é a melhor escolha",children:["Em benchmarks reais, ",e.jsx("code",{children:"List<T>"})," ganha da ",e.jsx("code",{children:"LinkedList<T>"})," em quase todos os cenários — porque CPUs modernas adoram memória contígua (cache). Use LinkedList só quando você ",e.jsx("em",{children:"realmente"})," faz muitas inserções/remoções no meio segurando referência ao nó."]}),e.jsx("h2",{children:"Casos de uso legítimos"}),e.jsx("p",{children:"Apesar de rara, a LinkedList tem nichos onde brilha:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Cache LRU"})," (Least Recently Used): combina ",e.jsx("code",{children:"Dictionary"})," apontando para nós da LinkedList; mover um item para o topo é O(1)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Filas de prioridade simples"})," com inserção ordenada quando você já tem o nó vizinho."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Estruturas que precisam de iteração reversa frequente"})," a partir de um nó arbitrário."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// Esqueleto simplificado de um cache LRU
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
}`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar acesso por índice"}),": ",e.jsx("code",{children:"lista[3]"})," não existe em LinkedList — porque seria O(n) e enganoso."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Buscar valor para depois remover"}),": ",e.jsx("code",{children:"Find"})," + ",e.jsx("code",{children:"Remove(no)"})," custa O(n) total. Não é melhor que ",e.jsx("code",{children:"Remove(valor)"})," — só faça se você já tem o nó por outro caminho."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confundir Value com o nó"}),": ",e.jsx("code",{children:"First"})," devolve o ",e.jsx("code",{children:"LinkedListNode<T>"}),", não o valor. Use ",e.jsx("code",{children:"First.Value"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar quando List basta"}),": a maioria dos códigos com LinkedList ficaria mais simples e rápida com List."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"LinkedList<T> é uma lista duplamente encadeada de nós."}),e.jsx("li",{children:"Insert/Remove em qualquer posição é O(1) — se você tem o nó."}),e.jsx("li",{children:"Não tem acesso por índice; busca é O(n) como List."}),e.jsx("li",{children:"Memória não-contígua = cache ruim; List geralmente ganha."}),e.jsx("li",{children:"Caso clássico: cache LRU com Dictionary + LinkedList."})]})]})}export{a as default};
