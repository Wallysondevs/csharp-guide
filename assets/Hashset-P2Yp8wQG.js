import{j as e}from"./index-CzLAthD5.js";import{P as o,A as s}from"./AlertBox-CWJo3ar5.js";function r(){return e.jsxs(o,{title:"HashSet<T>: conjuntos sem duplicatas",subtitle:"A coleção que garante itens únicos e oferece operações de conjunto (união, interseção, diferença) com lookup O(1).",difficulty:"iniciante",timeToRead:"11 min",children:[e.jsxs("p",{children:["Imagine uma lista de convidados de um casamento: cada nome só pode aparecer uma vez, e quando alguém chega na porta, o segurança precisa verificar instantaneamente se o nome consta. Essa é exatamente a função do ",e.jsx("strong",{children:"HashSet<T>"})," em C#: uma coleção que ",e.jsx("em",{children:"não admite duplicatas"}),' e que responde "este item já está aqui?" em tempo constante (O(1)). Por trás, ele usa a mesma técnica do Dictionary — ',e.jsx("em",{children:"hashing"})," — mas guarda só as chaves, sem valores associados."]}),e.jsx("h2",{children:"Criando e adicionando"}),e.jsxs("p",{children:["O método ",e.jsx("code",{children:"Add"})," tem um detalhe importante: ele devolve um ",e.jsx("code",{children:"bool"})," que indica se a inserção realmente ocorreu. ",e.jsx("code",{children:"true"})," = item novo; ",e.jsx("code",{children:"false"})," = já existia, foi ignorado."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Collections.Generic;

var unicos = new HashSet<string>();
bool inserido1 = unicos.Add("ana");    // true
bool inserido2 = unicos.Add("bruno");  // true
bool inserido3 = unicos.Add("ana");    // false (duplicata)

Console.WriteLine(unicos.Count); // 2

// Inicializador funciona igual à List
var pares = new HashSet<int> { 2, 4, 6, 8, 4, 2 };
Console.WriteLine(pares.Count); // 4 (duplicatas descartadas)`})}),e.jsx("h2",{children:"O caso clássico: deduplicação"}),e.jsx("p",{children:"Uma das aplicações mais comuns é remover repetições de uma sequência. Você pode passar a coleção original direto para o construtor:"}),e.jsx("pre",{children:e.jsx("code",{children:`var emails = new List<string>
{
    "a@x.com", "b@x.com", "a@x.com", "c@x.com", "b@x.com"
};

// Construtor aceita IEnumerable<T> e descarta duplicatas
var unicos = new HashSet<string>(emails);
Console.WriteLine(unicos.Count); // 3

// Equivalente em LINQ (mas cria um IEnumerable preguiçoso)
var distintos = emails.Distinct().ToList();`})}),e.jsxs(s,{type:"info",title:"HashSet vs Distinct()",children:["Ambos servem para remover duplicatas, mas têm casos de uso diferentes. Use ",e.jsx("code",{children:"HashSet"})," quando você vai ",e.jsx("em",{children:"consultar muitas vezes"}),' "este item existe?". Use ',e.jsx("code",{children:"Distinct()"})," quando você só quer iterar uma única vez por valores únicos."]}),e.jsx("h2",{children:"Operações de conjunto: união, interseção, diferença"}),e.jsxs("p",{children:["Aqui o HashSet brilha: ele tem métodos para fazer aritmética de conjuntos como em matemática. Todos modificam o set ",e.jsx("em",{children:"chamador"})," in-place."]}),e.jsx("pre",{children:e.jsx("code",{children:`var a = new HashSet<int> { 1, 2, 3, 4 };
var b = new HashSet<int> { 3, 4, 5, 6 };

// União: a fica com tudo de a + tudo de b (sem duplicatas)
var uniao = new HashSet<int>(a);
uniao.UnionWith(b);            // {1,2,3,4,5,6}

// Interseção: só os que estão em ambos
var inter = new HashSet<int>(a);
inter.IntersectWith(b);        // {3,4}

// Diferença: a sem os que estão em b
var dif = new HashSet<int>(a);
dif.ExceptWith(b);             // {1,2}

// Diferença simétrica: o que está em só um dos dois
var sim = new HashSet<int>(a);
sim.SymmetricExceptWith(b);    // {1,2,5,6}`})}),e.jsx("h2",{children:"Verificando relações entre conjuntos"}),e.jsxs("p",{children:["Além das operações que modificam, há métodos de ",e.jsx("em",{children:"consulta"})," que devolvem bool, úteis para checar se um conjunto contém outro:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var todos = new HashSet<string> { "ler", "escrever", "executar" };
var meus = new HashSet<string> { "ler", "executar" };

bool eSub = meus.IsSubsetOf(todos);     // true
bool eSuper = todos.IsSupersetOf(meus); // true
bool sobrepoe = meus.Overlaps(todos);   // true
bool igual = meus.SetEquals(todos);     // false`})}),e.jsx("h2",{children:"Performance e Contains O(1)"}),e.jsxs("p",{children:["O método ",e.jsx("code",{children:"Contains"})," é o ponto forte: ele usa hash, então é O(1) ",e.jsx("em",{children:"amortizado"}),". Comparado a ",e.jsx("code",{children:"List.Contains"})," (que é O(n)), em coleções grandes a diferença é gritante."]}),e.jsx("pre",{children:e.jsx("code",{children:`var lista = Enumerable.Range(0, 1_000_000).ToList();
var set = new HashSet<int>(lista);

// Lento: percorre até achar (pior caso, 1M comparações)
bool emLista = lista.Contains(999_999);

// Rápido: 1 cálculo de hash
bool emSet = set.Contains(999_999);

// Em loops com muitas verificações de existência,
// converter para HashSet é uma otimização clássica.`})}),e.jsx("h2",{children:"Igualdade customizada com IEqualityComparer"}),e.jsxs("p",{children:["O HashSet usa ",e.jsx("code",{children:"Equals"})," e ",e.jsx("code",{children:"GetHashCode"})," do tipo. Para classes próprias, você pode passar um ",e.jsx("strong",{children:"IEqualityComparer<T>"})," que define uma regra alternativa — útil para comparar strings ignorando caixa, por exemplo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Set de strings que ignora maiúsculas/minúsculas
var nomes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
nomes.Add("Ana");
nomes.Add("ANA");      // já existe (case insensitive)
Console.WriteLine(nomes.Count); // 1`})}),e.jsxs(s,{type:"warning",title:"Tipos próprios precisam de igualdade correta",children:["Para usar uma classe sua em ",e.jsx("code",{children:"HashSet<T>"}),", ela precisa implementar ",e.jsx("code",{children:"IEquatable<T>"})," ou sobrescrever ",e.jsx("code",{children:"Equals"}),"+",e.jsx("code",{children:"GetHashCode"}),". Sem isso, dois objetos com mesmos valores serão considerados diferentes (igualdade por referência). ",e.jsx("strong",{children:"Records"})," resolvem isso automaticamente."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar ordem definida"}),": HashSet não preserva a ordem de inserção. Se você precisa, use ",e.jsx("code",{children:"List<T>"})," + verificação manual ou um ",e.jsx("code",{children:"OrderedSet"})," (não existe nativo)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer que Add devolve bool"}),": o retorno é útil para detectar duplicatas; ignorá-lo perde uma oportunidade."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar com tipos mutáveis"}),': se você muda o objeto depois de inseri-lo, o hash pode mudar e o item "some" do set.']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"UnionWith"})," com criar novo set"]}),": ele ",e.jsx("em",{children:"modifica"})," o chamador. Se você quer manter o original intacto, copie antes: ",e.jsx("code",{children:"new HashSet<int>(a)"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"HashSet<T> guarda valores únicos com lookup O(1)."}),e.jsxs("li",{children:[e.jsx("code",{children:"Add"})," devolve ",e.jsx("code",{children:"true"}),"/",e.jsx("code",{children:"false"})," indicando inserção."]}),e.jsxs("li",{children:["Operações de conjunto: ",e.jsx("code",{children:"UnionWith"}),", ",e.jsx("code",{children:"IntersectWith"}),", ",e.jsx("code",{children:"ExceptWith"}),", ",e.jsx("code",{children:"SymmetricExceptWith"}),"."]}),e.jsxs("li",{children:["Comparações: ",e.jsx("code",{children:"IsSubsetOf"}),", ",e.jsx("code",{children:"IsSupersetOf"}),", ",e.jsx("code",{children:"Overlaps"}),", ",e.jsx("code",{children:"SetEquals"}),"."]}),e.jsxs("li",{children:["Para chaves customizadas, implemente ",e.jsx("code",{children:"IEquatable<T>"})," ou use record."]})]})]})}export{r as default};
