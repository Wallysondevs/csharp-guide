import{j as e}from"./index-CzLAthD5.js";import{P as s,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(s,{title:"Array vs List<T>: quando usar cada um",subtitle:"As duas coleções mais usadas em C#, suas diferenças de memória, performance e quando escolher cada uma.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs("p",{children:["Imagine que você precisa guardar uma lista de nomes de alunos. Em C#, existem duas formas clássicas de fazer isso: usar um ",e.jsx("strong",{children:"array"})," (vetor de tamanho fixo) ou usar uma ",e.jsx("strong",{children:"List<T>"}),' (lista dinâmica). Saber qual escolher é uma das primeiras decisões importantes da sua jornada — e a resposta nem sempre é "use List". Este capítulo dissecca os dois e mostra quando cada um brilha.']}),e.jsx("h2",{children:"O que é um array?"}),e.jsxs("p",{children:["Um ",e.jsx("strong",{children:"array"})," é um bloco contínuo de memória que guarda um número ",e.jsx("em",{children:"fixo"})," de elementos do mesmo tipo. Pense em uma cartela de ovos: ela tem espaço para 12 ovos, nem 11, nem 13. Se você quiser 24 ovos, precisa de outra cartela. Em C#, declarar um array exige saber o tamanho desde o início."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Array de inteiros com 5 posições, todas começando em 0
int[] numeros = new int[5];
numeros[0] = 10;
numeros[4] = 50;
// numeros[5] = 99; // ERRO: IndexOutOfRangeException em runtime

// Array já inicializado com valores
string[] dias = { "seg", "ter", "qua", "qui", "sex" };

Console.WriteLine(dias.Length); // 5
Console.WriteLine(dias[2]);     // qua`})}),e.jsxs("p",{children:["Note ",e.jsx("code",{children:"numeros.Length"}),": arrays têm uma propriedade ",e.jsx("code",{children:"Length"})," (não método). Eles são ",e.jsx("em",{children:"tipos de referência"})," (vivem no ",e.jsx("strong",{children:"heap"}),", a área de memória gerenciada pelo Garbage Collector), mas seu conteúdo é contíguo — todas as 5 posições estão lado a lado na memória, o que torna a leitura por índice extremamente rápida."]}),e.jsx("h2",{children:"O que é List<T>?"}),e.jsxs("p",{children:["A ",e.jsx("strong",{children:"List<T>"})," é uma coleção ",e.jsx("em",{children:"genérica"})," (o ",e.jsx("code",{children:"<T>"}),' significa "do tipo T", você escolhe) que cresce e encolhe sob demanda. Por baixo dos panos, ela usa um array — mas se esconde a complexidade: quando enche, ela aloca um array maior e copia tudo.']}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Collections.Generic;

// Lista vazia, capaz de guardar strings
List<string> alunos = new List<string>();
alunos.Add("Ana");
alunos.Add("Bruno");
alunos.Add("Carla");

// Inicializador de coleção (mais conciso)
List<int> idades = new() { 20, 30, 40 };

Console.WriteLine(alunos.Count);   // 3 (note: Count, não Length)
alunos.Remove("Bruno");
alunos.Insert(0, "Zé");            // insere no início
foreach (var nome in alunos)
    Console.WriteLine(nome);`})}),e.jsxs("p",{children:["A grande vantagem é a flexibilidade: ",e.jsx("code",{children:"Add"}),", ",e.jsx("code",{children:"Remove"}),", ",e.jsx("code",{children:"Insert"}),", ",e.jsx("code",{children:"Clear"}),'. A grande "pegadinha" é a propriedade ',e.jsx("code",{children:"Capacity"}),", que veremos a seguir."]}),e.jsx("h2",{children:"Capacity vs Count"}),e.jsxs("p",{children:["Toda ",e.jsx("code",{children:"List<T>"})," tem dois números: ",e.jsx("code",{children:"Count"})," (quantos itens estão de fato lá) e ",e.jsx("code",{children:"Capacity"})," (quantos cabem antes de precisar realocar). Quando ",e.jsx("code",{children:"Count"})," chega em ",e.jsx("code",{children:"Capacity"}),", a List dobra de tamanho — aloca novo array, copia tudo. Essa cópia custa O(n)."]}),e.jsx("pre",{children:e.jsx("code",{children:`var lista = new List<int>();
Console.WriteLine(lista.Capacity); // 0
lista.Add(1);
Console.WriteLine(lista.Capacity); // 4
for (int i = 0; i < 10; i++) lista.Add(i);
Console.WriteLine(lista.Capacity); // 16 (cresceu 4 -> 8 -> 16)

// Se você sabe o tamanho aproximado, pré-aloque:
var rapida = new List<int>(capacity: 1000);`})}),e.jsxs(a,{type:"info",title:"Dica de performance",children:["Pré-alocar a ",e.jsx("code",{children:"Capacity"})," quando você conhece (mesmo que aproximadamente) o tamanho final evita várias realocações e cópias. Para listas grandes, isso pode ser 5–10x mais rápido."]}),e.jsx("h2",{children:"Performance comparada"}),e.jsxs("p",{children:["Acesso por índice é O(1) em ambos — pode parecer surpreendente, mas List internamente é só um array. Adicionar no final é O(1) ",e.jsx("em",{children:"amortizado"})," em List (raras realocações dobrando o custo). Inserir/remover no meio é O(n) em ambos. Arrays não têm ",e.jsx("code",{children:"Add"}),', então para "crescer" você precisa criar um novo.']}),e.jsx("pre",{children:e.jsx("code",{children:`// Acesso indexado: idêntico
int x = numeros[3];
int y = lista[3];

// Iteração com foreach: igualmente rápida
foreach (var item in numeros) { /* ... */ }

// Para arrays "fixos" pequenos e quentes, prefira array:
// menos overhead, sem ponteiros extras.
Span<int> stackBuffer = stackalloc int[16];`})}),e.jsx("h2",{children:"Convertendo entre eles"}),e.jsx("p",{children:"Você raramente fica preso a uma escolha. As conversões são triviais e usadas o tempo todo:"}),e.jsx("pre",{children:e.jsx("code",{children:`int[] arr = { 1, 2, 3, 4 };
List<int> lista = arr.ToList();          // array -> list
int[] arr2 = lista.ToArray();            // list -> array

// Construindo List a partir de qualquer IEnumerable
var nomes = new List<string>(new[] { "Ana", "Bia" });`})}),e.jsxs(a,{type:"warning",title:"Cuidado com cópias",children:[e.jsx("code",{children:"ToList()"})," e ",e.jsx("code",{children:"ToArray()"})," ",e.jsx("strong",{children:"copiam"})," os dados. Se a coleção for grande, isso aloca memória nova. Em loops quentes, evite chamar essas conversões repetidamente."]}),e.jsx("h2",{children:"Quando escolher cada um"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Array"}),": tamanho conhecido e fixo, performance crítica, interoperabilidade com APIs (muitas APIs nativas pedem arrays), buffers temporários."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"List<T>"}),": na esmagadora maioria dos casos do dia a dia — quando o número de itens varia, quando você quer ",e.jsx("code",{children:"Add"}),"/",e.jsx("code",{children:"Remove"}),", quando você não sabe o tamanho final."]})]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"Length"})," e ",e.jsx("code",{children:"Count"})]}),": arrays usam ",e.jsx("code",{children:"Length"}),", List usa ",e.jsx("code",{children:"Count"}),". ",e.jsx("code",{children:"String"})," também usa ",e.jsx("code",{children:"Length"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Acessar índice inválido"}),": ambos lançam ",e.jsx("code",{children:"IndexOutOfRangeException"}),"/",e.jsx("code",{children:"ArgumentOutOfRangeException"}),". Sempre cheque ",e.jsx("code",{children:"i < coll.Count"})," antes."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Modificar a List dentro de um ",e.jsx("code",{children:"foreach"})]}),": dispara ",e.jsx("code",{children:"InvalidOperationException"}),". Use ",e.jsx("code",{children:"for"})," reverso ou ",e.jsx("code",{children:"RemoveAll"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Trocar tipo do array"}),": arrays são ",e.jsx("em",{children:"covariantes"})," (",e.jsx("code",{children:"object[] o = new string[] {...}"})," compila), mas atribuir um ",e.jsx("code",{children:"int"})," nele estoura em runtime. Prefira List sempre que possível."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Array tem tamanho fixo, memória contígua, propriedade ",e.jsx("code",{children:"Length"}),"."]}),e.jsxs("li",{children:["List<T> cresce dinamicamente, propriedade ",e.jsx("code",{children:"Count"})," e ",e.jsx("code",{children:"Capacity"}),"."]}),e.jsxs("li",{children:["Acesso por índice é O(1) em ambos; ",e.jsx("code",{children:"Add"})," é O(1) amortizado em List."]}),e.jsxs("li",{children:["Pré-alocar ",e.jsx("code",{children:"Capacity"})," evita realocações caras."]}),e.jsx("li",{children:"Use array para tamanhos fixos e perfomance; List para o dia a dia."})]})]})}export{i as default};
