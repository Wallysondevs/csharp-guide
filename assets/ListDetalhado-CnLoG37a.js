import{j as e}from"./index-CzLAthD5.js";import{P as i,A as o}from"./AlertBox-CWJo3ar5.js";function a(){return e.jsxs(i,{title:"List<T>: o canivete suíço das coleções",subtitle:"Domine os métodos mais úteis de List<T> — Add, Remove, Sort, Find, RemoveAll, ForEach e companhia.",difficulty:"iniciante",timeToRead:"14 min",children:[e.jsxs("p",{children:["A ",e.jsx("strong",{children:"List<T>"}),' é a estrutura de dados mais utilizada em código C# do mundo real. Ela é o "canivete suíço" das coleções: tem ferramenta para quase tudo. Neste capítulo vamos passar pelos seus métodos essenciais com exemplos curtos e completos. Pense nisso como um tour pelas funcionalidades de um carro novo — não é teoria, é o que você vai usar todos os dias.']}),e.jsx("h2",{children:"Adicionando elementos: Add e AddRange"}),e.jsxs("p",{children:[e.jsx("code",{children:"Add"})," insere um item no final. ",e.jsx("code",{children:"AddRange"})," insere todos os itens de outra coleção, de uma vez só, mais eficiente que vários ",e.jsx("code",{children:"Add"})," em loop porque pré-aloca espaço."]}),e.jsx("pre",{children:e.jsx("code",{children:`var alunos = new List<string>();
alunos.Add("Ana");
alunos.Add("Bruno");

// AddRange aceita qualquer IEnumerable<T>
alunos.AddRange(new[] { "Carla", "Diego" });

// Insert põe num índice específico (O(n) por causa do shift)
alunos.Insert(0, "Zé");

Console.WriteLine(string.Join(", ", alunos));
// Zé, Ana, Bruno, Carla, Diego`})}),e.jsx("h2",{children:"Removendo: Remove, RemoveAt, RemoveAll, Clear"}),e.jsxs("p",{children:["Há quatro formas principais de remover. ",e.jsx("code",{children:"Remove(item)"})," tira a ",e.jsx("em",{children:"primeira"})," ocorrência (devolve ",e.jsx("code",{children:"bool"})," indicando se achou). ",e.jsx("code",{children:"RemoveAt(i)"})," tira pelo índice. ",e.jsx("code",{children:"RemoveAll(predicado)"})," tira todos que satisfazem uma condição — esse é o mais poderoso. ",e.jsx("code",{children:"Clear"})," esvazia tudo."]}),e.jsx("pre",{children:e.jsx("code",{children:`var nums = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8 };

nums.Remove(3);      // tira o primeiro 3 -> [1,2,4,5,6,7,8]
nums.RemoveAt(0);    // tira o índice 0 -> [2,4,5,6,7,8]

// RemoveAll com lambda: tira todos os pares
int removidos = nums.RemoveAll(x => x % 2 == 0);
Console.WriteLine($"Removidos: {removidos}"); // 4
// Sobrou: [5, 7]

nums.Clear();        // esvazia
Console.WriteLine(nums.Count); // 0`})}),e.jsxs(o,{type:"info",title:"O que é um predicate?",children:["Um ",e.jsx("strong",{children:"predicate"})," é uma função que recebe um item e devolve ",e.jsx("code",{children:"true"})," ou ",e.jsx("code",{children:"false"}),". Em C# expressamos como uma ",e.jsx("em",{children:"lambda"}),": ",e.jsx("code",{children:"x => x > 10"}),' significa "para cada x, é verdade que x é maior que 10?". Você usa muito ao filtrar coleções.']}),e.jsx("h2",{children:"Buscando: Contains, IndexOf, Find, FindAll"}),e.jsxs("p",{children:[e.jsx("code",{children:"Contains(item)"})," devolve ",e.jsx("code",{children:"true"}),"/",e.jsx("code",{children:"false"})," e percorre a lista (O(n)). ",e.jsx("code",{children:"IndexOf"})," devolve o índice ou ",e.jsx("code",{children:"-1"}),". ",e.jsx("code",{children:"Find"})," e ",e.jsx("code",{children:"FindAll"})," aceitam um predicate e devolvem o primeiro match (ou ",e.jsx("code",{children:"default"}),") e todos os matches."]}),e.jsx("pre",{children:e.jsx("code",{children:`var pessoas = new List<string> { "Ana", "Bruno", "Bia", "Carlos" };

bool temBia = pessoas.Contains("Bia");  // true
int idx = pessoas.IndexOf("Bruno");     // 1

// Primeiro nome que começa com B
string? primeiro = pessoas.Find(p => p.StartsWith("B"));
Console.WriteLine(primeiro); // Bruno

// Todos os nomes começando com B
List<string> todos = pessoas.FindAll(p => p.StartsWith("B"));
Console.WriteLine(string.Join(", ", todos)); // Bruno, Bia`})}),e.jsx("h2",{children:"Ordenando: Sort e IComparer"}),e.jsxs("p",{children:[e.jsx("code",{children:"Sort()"})," sem argumentos ordena pela ordem natural (números crescente, strings alfabético). Para regras customizadas, passe uma lambda ",e.jsx("code",{children:"Comparison<T>"})," ou implemente ",e.jsx("code",{children:"IComparer<T>"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`var idades = new List<int> { 30, 10, 50, 20 };
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
// [(Pão,1), (Leite,5), (Café,20)]`})}),e.jsxs(o,{type:"warning",title:"Sort modifica a lista",children:[e.jsx("code",{children:"Sort()"})," ordena ",e.jsx("em",{children:"in-place"})," (altera a própria lista). Se você precisa preservar a original, use LINQ: ",e.jsx("code",{children:"var ordenada = lista.OrderBy(x => x).ToList();"}),"."]}),e.jsx("h2",{children:"ForEach e iteração"}),e.jsxs("p",{children:[e.jsx("code",{children:"ForEach"})," aceita uma ",e.jsx("code",{children:"Action<T>"})," (lambda sem retorno) e aplica em cada item. É um atalho para um ",e.jsx("code",{children:"foreach"})," tradicional, embora muitos prefiram o ",e.jsx("code",{children:"foreach"})," normal por flexibilidade (permite ",e.jsx("code",{children:"break"}),", ",e.jsx("code",{children:"continue"}),")."]}),e.jsx("pre",{children:e.jsx("code",{children:`var lista = new List<int> { 1, 2, 3 };

// Usando ForEach (método de List<T>)
lista.ForEach(x => Console.WriteLine(x * 10));

// Equivalente com foreach tradicional
foreach (var x in lista)
    Console.WriteLine(x * 10);`})}),e.jsx("h2",{children:"Capacity: a otimização escondida"}),e.jsxs("p",{children:["Toda ",e.jsx("code",{children:"List<T>"})," tem um array interno cujo tamanho é a ",e.jsx("code",{children:"Capacity"}),". Quando você pré-conhece o tamanho, informe no construtor — economiza realocações."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Sem pré-alocação: cresce 0 -> 4 -> 8 -> 16 -> 32...
var lenta = new List<int>();
for (int i = 0; i < 1_000_000; i++) lenta.Add(i);

// Com pré-alocação: zero realocações
var rapida = new List<int>(capacity: 1_000_000);
for (int i = 0; i < 1_000_000; i++) rapida.Add(i);

// Reduzir capacidade após carga (libera memória ociosa)
rapida.TrimExcess();`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Modificar a lista dentro de ",e.jsx("code",{children:"foreach"})]}),": causa ",e.jsx("code",{children:"InvalidOperationException"}),". Use ",e.jsx("code",{children:"RemoveAll"}),", ou itere com ",e.jsx("code",{children:"for"})," reverso."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer que ",e.jsx("code",{children:"Find"})," devolve ",e.jsx("code",{children:"default"})]})," se não achar — para tipos de referência, isso é ",e.jsx("code",{children:"null"}),"; cuide para não fazer NullReference."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"Contains"})," em loops grandes"]}),": cada chamada é O(n). Para muitas buscas, considere um ",e.jsx("code",{children:"HashSet<T>"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"Remove(int)"})," com ",e.jsx("code",{children:"RemoveAt(int)"})]}),": em ",e.jsx("code",{children:"List<int>"}),", ",e.jsx("code",{children:"Remove(3)"})," tira o ",e.jsx("em",{children:"valor"})," 3, não o índice 3. Cuidado."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Add"}),", ",e.jsx("code",{children:"AddRange"}),", ",e.jsx("code",{children:"Insert"})," para inserir."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Remove"}),", ",e.jsx("code",{children:"RemoveAt"}),", ",e.jsx("code",{children:"RemoveAll(predicate)"}),", ",e.jsx("code",{children:"Clear"})," para remover."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Contains"}),", ",e.jsx("code",{children:"IndexOf"}),", ",e.jsx("code",{children:"Find"}),", ",e.jsx("code",{children:"FindAll"})," para buscar."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Sort"})," ordena in-place; passe lambda para regras customizadas."]}),e.jsxs("li",{children:["Pré-alocar ",e.jsx("code",{children:"Capacity"})," em listas grandes melhora performance."]})]})]})}export{a as default};
