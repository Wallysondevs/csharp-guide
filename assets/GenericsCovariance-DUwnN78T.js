import{j as e}from"./index-CzLAthD5.js";import{P as o,A as r}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(o,{title:"Covariância e contravariância em generics",subtitle:"Por que IEnumerable<string> pode virar IEnumerable<object>, mas List<string> não pode virar List<object>.",difficulty:"avancado",timeToRead:"13 min",children:[e.jsxs("p",{children:['Imagine uma caixa de "frutas". Você espera poder colocar maçãs nela, certo? E uma caixa de "maçãs"... ela ',e.jsx("em",{children:"é"})," uma caixa de frutas? Em programação, essa pergunta tem três respostas dependendo do uso: ",e.jsx("strong",{children:"covariância"})," (sim, em uma direção), ",e.jsx("strong",{children:"contravariância"})," (sim, na direção oposta) e ",e.jsx("strong",{children:"invariância"})," (não, são tipos completamente distintos). Esse capítulo explica como o C# trata isso em interfaces e delegates genéricos com as palavras-chave ",e.jsx("code",{children:"out"})," e ",e.jsx("code",{children:"in"}),"."]}),e.jsx("h2",{children:"O ponto de partida: invariância"}),e.jsxs("p",{children:["Por padrão, generics em C# são ",e.jsx("strong",{children:"invariantes"}),": ",e.jsx("code",{children:"List<string>"})," não é considerado nem subtipo nem supertipo de ",e.jsx("code",{children:"List<object>"}),", mesmo que ",e.jsx("code",{children:"string"})," seja subtipo de ",e.jsx("code",{children:"object"}),". O motivo é prudência:"]}),e.jsx("pre",{children:e.jsx("code",{children:`List<string> nomes = new() { "Ana", "Bruno" };
// List<object> objs = nomes;  // ERRO de compilação CS0029

// Imagine se fosse permitido:
//   objs.Add(42);              // 42 é object, mas a lista REAL é de string!
//   string primeiro = nomes[0]; // CRASH: 42 não é string`})}),e.jsxs("p",{children:["Se atribuir ",e.jsx("code",{children:"List<string>"})," a uma variável ",e.jsx("code",{children:"List<object>"})," fosse permitido, alguém poderia adicionar qualquer coisa nela e quebrar o tipo original. O compilador proíbe para te proteger."]}),e.jsxs("h2",{children:["Covariância com ",e.jsx("code",{children:"out"}),": ",e.jsx("em",{children:"só leitura"})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Covariância"}),' ("co" = junto, na mesma direção da hierarquia) significa: se ',e.jsx("code",{children:"Filho"})," deriva de ",e.jsx("code",{children:"Pai"}),", então ",e.jsx("code",{children:"Generico<Filho>"})," pode ser tratado como ",e.jsx("code",{children:"Generico<Pai>"}),". O C# permite isso ",e.jsx("em",{children:"apenas"})," quando ",e.jsx("code",{children:"T"})," aparece ",e.jsx("em",{children:"somente como saída"})," — você lê ",e.jsx("code",{children:"T"}),", mas nunca passa ",e.jsx("code",{children:"T"})," de entrada. A palavra-chave é ",e.jsx("code",{children:"out"})," na declaração da interface:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// IEnumerable<out T> é covariante porque só DEVOLVE T (no foreach)
public interface IEnumerable<out T> {
    IEnumerator<T> GetEnumerator();
}

IEnumerable<string> nomes = new[] { "Ana", "Bruno" };
IEnumerable<object> objs = nomes;   // OK! covariância

foreach (object o in objs) {        // só leitura, seguro
    Console.WriteLine(o);
}`})}),e.jsxs("p",{children:['É seguro porque, mesmo que você "veja" os elementos como ',e.jsx("code",{children:"object"}),", eles continuam sendo ",e.jsx("code",{children:"string"})," internamente — e tudo que você quer fazer é ",e.jsx("em",{children:"obter"}),", nunca ",e.jsx("em",{children:"adicionar"}),"."]}),e.jsxs(r,{type:"info",title:"Mnemônico: out = out",children:[e.jsx("code",{children:"out"}),' em variância significa "T sai" — só aparece em posição de retorno. ',e.jsx("code",{children:"in"}),' significa "T entra" — só aparece como parâmetro. Se T aparece nos dois lados (como em ',e.jsx("code",{children:"List<T>"}),"), o tipo é necessariamente ",e.jsx("strong",{children:"invariante"}),"."]}),e.jsxs("h2",{children:["Contravariância com ",e.jsx("code",{children:"in"}),": ",e.jsx("em",{children:"só escrita/consumo"})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Contravariância"})," é o contrário: se ",e.jsx("code",{children:"Filho"})," deriva de ",e.jsx("code",{children:"Pai"}),", então ",e.jsx("code",{children:"Generico<Pai>"})," pode ser tratado como ",e.jsx("code",{children:"Generico<Filho>"}),'. Parece estranho à primeira vista! Mas faz sentido para "consumidores" — algo que recebe ',e.jsx("code",{children:"T"})," como entrada. Um consumidor de ",e.jsx("code",{children:"Animal"})," claramente também consegue lidar com ",e.jsx("code",{children:"Cachorro"})," (já que cachorro é animal). A keyword é ",e.jsx("code",{children:"in"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`// IComparer<in T> é contravariante porque só CONSOME T (no Compare)
public interface IComparer<in T> {
    int Compare(T x, T y);
}

// Comparador de objetos (compara por hash, ToString, etc.)
IComparer<object> comparadorObjetos = Comparer<object>.Create(
    (a, b) => a.ToString()!.CompareTo(b.ToString())
);

// Posso usá-lo onde preciso comparar strings (string deriva de object)
IComparer<string> comparadorStrings = comparadorObjetos;  // OK! contravariância

string[] arr = { "banana", "ana", "carlos" };
Array.Sort(arr, comparadorStrings);
Console.WriteLine(string.Join(", ", arr));  // ana, banana, carlos`})}),e.jsxs("h2",{children:["Por que ",e.jsx("code",{children:"List<T>"})," não pode ter variância"]}),e.jsxs("p",{children:[e.jsx("code",{children:"List<T>"})," tem o método ",e.jsx("code",{children:"void Add(T item)"})," (T como entrada) ",e.jsx("em",{children:"e"})," ",e.jsx("code",{children:"T this[int]"})," (T como saída). Como T aparece nos dois lados, não há marcação ",e.jsx("code",{children:"in"})," nem ",e.jsx("code",{children:"out"})," que seja segura — ela permanece invariante. Esse é um ",e.jsx("strong",{children:"princípio fundamental"}),": variância só vale para interfaces e delegates onde você consegue restringir o uso de T a ",e.jsx("em",{children:"uma única direção"}),"."]}),e.jsx("h2",{children:"Exemplos do framework"}),e.jsx("p",{children:"Veja como a BCL (Base Class Library do .NET) marca variância em tipos cotidianos:"}),e.jsx("pre",{children:e.jsx("code",{children:`// Covariantes (out T): você consome dados produzidos
public interface IEnumerable<out T> { /* ... */ }
public interface IReadOnlyList<out T> { /* ... */ }
public interface IReadOnlyCollection<out T> { /* ... */ }
public delegate TResult Func<out TResult>();

// Contravariantes (in T): você fornece T para serem consumidos
public interface IComparer<in T> { /* ... */ }
public interface IEqualityComparer<in T> { /* ... */ }
public delegate void Action<in T>(T arg);

// Invariantes (não anotadas): leem E escrevem T
public interface ICollection<T> { /* tem Add(T) e Count */ }
public interface IList<T> { /* tem indexer get e set */ }
public class List<T> { /* idem */ }`})}),e.jsx("h2",{children:"Variância em delegates"}),e.jsxs("p",{children:[e.jsx("code",{children:"Func<T, TResult>"})," e ",e.jsx("code",{children:"Action<T>"})," são delegates genéricos extremamente comuns (usados em LINQ e callbacks). Note como suas anotações combinam:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Func<in T, out TResult>: T entra (contravariante), TResult sai (covariante)
Func<object, string> obj2str = o => o?.ToString() ?? "";

// Posso atribuir a Func<string, object> graças à variância:
//   - 'string' (mais derivado) entra onde se aceitava 'object'  -> contravariância em T
//   - 'object' (menos derivado) sai onde se prometia 'string'    -> covariância em TResult
Func<string, object> s2obj = obj2str;

object resultado = s2obj("ola");`})}),e.jsxs(r,{type:"warning",title:"Variância só funciona com tipos de referência",children:["Variância em C# se aplica somente quando os tipos envolvidos são ",e.jsx("em",{children:"reference types"}),". Você ",e.jsx("em",{children:"não"})," pode atribuir ",e.jsx("code",{children:"IEnumerable<int>"})," a ",e.jsx("code",{children:"IEnumerable<object>"}),", porque iria exigir boxing implícito de cada elemento — e o compilador prefere ser explícito sobre conversões custosas."]}),e.jsx("h2",{children:"Criando interfaces variantes próprias"}),e.jsxs("p",{children:["Você pode marcar suas próprias interfaces com ",e.jsx("code",{children:"in"}),"/",e.jsx("code",{children:"out"}),", desde que o uso de T respeite a regra:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Produtor de itens (covariante) — só devolve T
public interface IProdutor<out T> {
    T Proximo();
    IEnumerable<T> Todos();
}

// Consumidor de itens (contravariante) — só recebe T
public interface IConsumidor<in T> {
    void Receber(T item);
    void Validar(T item);
}

public class FabricaCachorros : IProdutor<Cachorro> { /*...*/ }
IProdutor<Animal> p = new FabricaCachorros();   // OK, covariância

public class LogadorAnimal : IConsumidor<Animal> { /*...*/ }
IConsumidor<Cachorro> c = new LogadorAnimal();  // OK, contravariância`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar covariar ",e.jsx("code",{children:"List<T>"}),":"]})," não é variante. Use ",e.jsx("code",{children:"IEnumerable<T>"})," ou ",e.jsx("code",{children:"IReadOnlyList<T>"})," nas assinaturas públicas se quiser passar uma lista de derivados."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Marcar ",e.jsx("code",{children:"out T"})," e usar T como parâmetro:"]})," erro de compilação. Saída só, nada de entrada."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar variância com value types:"})," ",e.jsx("code",{children:"IEnumerable<int>"})," NÃO vira ",e.jsx("code",{children:"IEnumerable<object>"})," — exigiria boxing."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confundir covariância de array (legada e perigosa):"})," ",e.jsx("code",{children:"string[]"})," pode ser tratado como ",e.jsx("code",{children:"object[]"})," historicamente, mas atribuir ",e.jsx("code",{children:"objs[0] = 42"})," joga ",e.jsx("code",{children:"ArrayTypeMismatchException"})," em runtime. Prefira ",e.jsx("code",{children:"IReadOnlyList<T>"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Achar que toda interface deveria ter variância:"}),' só faz sentido onde T é genuinamente "puro produtor" ou "puro consumidor".']})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Generics em C# são ",e.jsx("strong",{children:"invariantes por padrão"})," — segurança em primeiro lugar."]}),e.jsxs("li",{children:[e.jsx("code",{children:"out T"}),": covariante. ",e.jsx("code",{children:"Generico<Derivado>"})," vira ",e.jsx("code",{children:"Generico<Base>"}),". T só pode aparecer como saída."]}),e.jsxs("li",{children:[e.jsx("code",{children:"in T"}),": contravariante. ",e.jsx("code",{children:"Generico<Base>"})," vira ",e.jsx("code",{children:"Generico<Derivado>"}),". T só pode aparecer como entrada."]}),e.jsx("li",{children:"Variância só funciona em interfaces e delegates, e só com tipos de referência."}),e.jsxs("li",{children:["Exemplos clássicos: ",e.jsx("code",{children:"IEnumerable<out T>"}),", ",e.jsx("code",{children:"IComparer<in T>"}),", ",e.jsx("code",{children:"Func<in T, out TResult>"}),"."]})]})]})}export{n as default};
