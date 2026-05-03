import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ListDetalhado() {
  return (
    <PageContainer
      title="List<T>: o canivete suíço das coleções"
      subtitle="Domine os métodos mais úteis de List<T> — Add, Remove, Sort, Find, RemoveAll, ForEach e companhia."
      difficulty="iniciante"
      timeToRead="14 min"
    >
      <p>
        A <strong>List&lt;T&gt;</strong> é a estrutura de dados mais utilizada em código C# do mundo real. Ela é o "canivete suíço" das coleções: tem ferramenta para quase tudo. Neste capítulo vamos passar pelos seus métodos essenciais com exemplos curtos e completos. Pense nisso como um tour pelas funcionalidades de um carro novo — não é teoria, é o que você vai usar todos os dias.
      </p>

      <h2>Adicionando elementos: Add e AddRange</h2>
      <p>
        <code>Add</code> insere um item no final. <code>AddRange</code> insere todos os itens de outra coleção, de uma vez só, mais eficiente que vários <code>Add</code> em loop porque pré-aloca espaço.
      </p>
      <pre><code>{`var alunos = new List<string>();
alunos.Add("Ana");
alunos.Add("Bruno");

// AddRange aceita qualquer IEnumerable<T>
alunos.AddRange(new[] { "Carla", "Diego" });

// Insert põe num índice específico (O(n) por causa do shift)
alunos.Insert(0, "Zé");

Console.WriteLine(string.Join(", ", alunos));
// Zé, Ana, Bruno, Carla, Diego`}</code></pre>

      <h2>Removendo: Remove, RemoveAt, RemoveAll, Clear</h2>
      <p>
        Há quatro formas principais de remover. <code>Remove(item)</code> tira a <em>primeira</em> ocorrência (devolve <code>bool</code> indicando se achou). <code>RemoveAt(i)</code> tira pelo índice. <code>RemoveAll(predicado)</code> tira todos que satisfazem uma condição — esse é o mais poderoso. <code>Clear</code> esvazia tudo.
      </p>
      <pre><code>{`var nums = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8 };

nums.Remove(3);      // tira o primeiro 3 -> [1,2,4,5,6,7,8]
nums.RemoveAt(0);    // tira o índice 0 -> [2,4,5,6,7,8]

// RemoveAll com lambda: tira todos os pares
int removidos = nums.RemoveAll(x => x % 2 == 0);
Console.WriteLine($"Removidos: {removidos}"); // 4
// Sobrou: [5, 7]

nums.Clear();        // esvazia
Console.WriteLine(nums.Count); // 0`}</code></pre>

      <AlertBox type="info" title="O que é um predicate?">
        Um <strong>predicate</strong> é uma função que recebe um item e devolve <code>true</code> ou <code>false</code>. Em C# expressamos como uma <em>lambda</em>: <code>x =&gt; x &gt; 10</code> significa "para cada x, é verdade que x é maior que 10?". Você usa muito ao filtrar coleções.
      </AlertBox>

      <h2>Buscando: Contains, IndexOf, Find, FindAll</h2>
      <p>
        <code>Contains(item)</code> devolve <code>true</code>/<code>false</code> e percorre a lista (O(n)). <code>IndexOf</code> devolve o índice ou <code>-1</code>. <code>Find</code> e <code>FindAll</code> aceitam um predicate e devolvem o primeiro match (ou <code>default</code>) e todos os matches.
      </p>
      <pre><code>{`var pessoas = new List<string> { "Ana", "Bruno", "Bia", "Carlos" };

bool temBia = pessoas.Contains("Bia");  // true
int idx = pessoas.IndexOf("Bruno");     // 1

// Primeiro nome que começa com B
string? primeiro = pessoas.Find(p => p.StartsWith("B"));
Console.WriteLine(primeiro); // Bruno

// Todos os nomes começando com B
List<string> todos = pessoas.FindAll(p => p.StartsWith("B"));
Console.WriteLine(string.Join(", ", todos)); // Bruno, Bia`}</code></pre>

      <h2>Ordenando: Sort e IComparer</h2>
      <p>
        <code>Sort()</code> sem argumentos ordena pela ordem natural (números crescente, strings alfabético). Para regras customizadas, passe uma lambda <code>Comparison&lt;T&gt;</code> ou implemente <code>IComparer&lt;T&gt;</code>.
      </p>
      <pre><code>{`var idades = new List<int> { 30, 10, 50, 20 };
idades.Sort();
// [10, 20, 30, 50]

// Decrescente via lambda
idades.Sort((a, b) => b.CompareTo(a));
// [50, 30, 20, 10]

// Ordenando lista de objetos por uma propriedade
var produtos = new List<(string Nome, decimal Preco)>
{
    ("Leite", 5m), ("Pão", 1m), ("Café", 20m)
};
produtos.Sort((p1, p2) => p1.Preco.CompareTo(p2.Preco));
// [(Pão,1), (Leite,5), (Café,20)]`}</code></pre>

      <AlertBox type="warning" title="Sort modifica a lista">
        <code>Sort()</code> ordena <em>in-place</em> (altera a própria lista). Se você precisa preservar a original, use LINQ: <code>var ordenada = lista.OrderBy(x =&gt; x).ToList();</code>.
      </AlertBox>

      <h2>ForEach e iteração</h2>
      <p>
        <code>ForEach</code> aceita uma <code>Action&lt;T&gt;</code> (lambda sem retorno) e aplica em cada item. É um atalho para um <code>foreach</code> tradicional, embora muitos prefiram o <code>foreach</code> normal por flexibilidade (permite <code>break</code>, <code>continue</code>).
      </p>
      <pre><code>{`var lista = new List<int> { 1, 2, 3 };

// Usando ForEach (método de List<T>)
lista.ForEach(x => Console.WriteLine(x * 10));

// Equivalente com foreach tradicional
foreach (var x in lista)
    Console.WriteLine(x * 10);`}</code></pre>

      <h2>Capacity: a otimização escondida</h2>
      <p>
        Toda <code>List&lt;T&gt;</code> tem um array interno cujo tamanho é a <code>Capacity</code>. Quando você pré-conhece o tamanho, informe no construtor — economiza realocações.
      </p>
      <pre><code>{`// Sem pré-alocação: cresce 0 -> 4 -> 8 -> 16 -> 32...
var lenta = new List<int>();
for (int i = 0; i < 1_000_000; i++) lenta.Add(i);

// Com pré-alocação: zero realocações
var rapida = new List<int>(capacity: 1_000_000);
for (int i = 0; i < 1_000_000; i++) rapida.Add(i);

// Reduzir capacidade após carga (libera memória ociosa)
rapida.TrimExcess();`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Modificar a lista dentro de <code>foreach</code></strong>: causa <code>InvalidOperationException</code>. Use <code>RemoveAll</code>, ou itere com <code>for</code> reverso.</li>
        <li><strong>Esquecer que <code>Find</code> devolve <code>default</code></strong> se não achar — para tipos de referência, isso é <code>null</code>; cuide para não fazer NullReference.</li>
        <li><strong>Usar <code>Contains</code> em loops grandes</strong>: cada chamada é O(n). Para muitas buscas, considere um <code>HashSet&lt;T&gt;</code>.</li>
        <li><strong>Confundir <code>Remove(int)</code> com <code>RemoveAt(int)</code></strong>: em <code>List&lt;int&gt;</code>, <code>Remove(3)</code> tira o <em>valor</em> 3, não o índice 3. Cuidado.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Add</code>, <code>AddRange</code>, <code>Insert</code> para inserir.</li>
        <li><code>Remove</code>, <code>RemoveAt</code>, <code>RemoveAll(predicate)</code>, <code>Clear</code> para remover.</li>
        <li><code>Contains</code>, <code>IndexOf</code>, <code>Find</code>, <code>FindAll</code> para buscar.</li>
        <li><code>Sort</code> ordena in-place; passe lambda para regras customizadas.</li>
        <li>Pré-alocar <code>Capacity</code> em listas grandes melhora performance.</li>
      </ul>
    </PageContainer>
  );
}
