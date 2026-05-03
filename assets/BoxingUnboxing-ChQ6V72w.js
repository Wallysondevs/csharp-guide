import{j as e}from"./index-CzLAthD5.js";import{P as a,A as o}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(a,{title:"Boxing e unboxing: o custo escondido",subtitle:"Aprenda como value types ganham uma 'caixa' no heap quando viram object — e como evitar essa armadilha de performance.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:["Em C#, todo tipo — inclusive ",e.jsx("code",{children:"int"}),", ",e.jsx("code",{children:"bool"}),", ",e.jsx("code",{children:"DateTime"})," — herda, no fim das contas, de ",e.jsx("code",{children:"object"}),". Isso parece inocente, mas tem uma consequência fascinante: quando você atribui um value type a uma variável de tipo ",e.jsx("code",{children:"object"}),' (ou a uma interface), o runtime precisa "embrulhar" aquele valor em uma caixa no heap para que ele se comporte como um objeto. Esse embrulho se chama ',e.jsx("strong",{children:"boxing"}),"; o processo inverso é o ",e.jsx("strong",{children:"unboxing"}),". Pense em pegar uma moeda solta e colocá-la dentro de um pequeno cofre só para passá-la a alguém que só aceita cofres."]}),e.jsx("h2",{children:"Vendo o boxing acontecer"}),e.jsx("p",{children:"Tudo o que é necessário é uma atribuição. O compilador insere a operação automaticamente, sem aviso visual. O CLR (Common Language Runtime, o motor de execução do .NET) aloca um pequeno objeto no heap, copia o valor para dentro e devolve a referência."}),e.jsx("pre",{children:e.jsx("code",{children:`int n = 42;
object o = n;        // BOXING — n vira uma "caixa" no heap

Console.WriteLine(o);          // 42
Console.WriteLine(o is int);   // True

int m = (int)o;      // UNBOXING — precisa cast EXPLÍCITO
Console.WriteLine(m); // 42`})}),e.jsxs("p",{children:['O boxing acontece silenciosamente. O unboxing exige cast explícito porque o compilador quer que você confirme: "sim, eu sei que dentro dessa caixa há um ',e.jsx("code",{children:"int"}),'". Se a caixa contiver outro tipo, o cast lança ',e.jsx("code",{children:"InvalidCastException"})," em runtime."]}),e.jsxs(o,{type:"warning",title:"Cast errado, exceção certa",children:["Tentar fazer ",e.jsx("code",{children:"(long)o"})," quando ",e.jsx("code",{children:"o"})," guarda um ",e.jsx("code",{children:"int"})," dá ",e.jsx("code",{children:"InvalidCastException"})," — não importa que ",e.jsx("code",{children:"long"})," caiba no ",e.jsx("code",{children:"int"}),". Unboxing exige o tipo ",e.jsx("strong",{children:"exato"}),"."]}),e.jsx("h2",{children:"Onde o boxing aparece sem você perceber"}),e.jsxs("p",{children:["Pode parecer raro, mas situações cotidianas escondem boxing. Antes dos generics (C# 1.0), quase toda coleção causava boxing, e era a principal razão de programas em ",e.jsx("code",{children:"ArrayList"})," serem lentos com números."]}),e.jsx("pre",{children:e.jsx("code",{children:`// 1) Coleções não-genéricas (PRÉ-2005)
var lista = new System.Collections.ArrayList();
lista.Add(1);   // BOX
lista.Add(2);   // BOX
int soma = (int)lista[0] + (int)lista[1];   // 2 UNBOX

// 2) Interpolação chamando ToString em struct -> normalmente OK,
//    mas em formatos string.Format antigos, via 'object[] args':
string s = string.Format("{0} + {1} = {2}", 1, 2, 3);  // 3 BOX

// 3) Implementar interface em struct e chamar via interface:
interface IIncrementavel { void Incrementar(); }
struct Contador : IIncrementavel {
    public int Valor;
    public void Incrementar() => Valor++;
}
IIncrementavel c = new Contador();   // BOX
c.Incrementar();                     // age na caixa, não no original

// 4) Arrays de object:
object[] caixa = new object[] { 1, 2.5, true };  // 3 BOX`})}),e.jsx("h2",{children:"Por que é caro?"}),e.jsxs("p",{children:["Cada boxing faz três coisas: aloca memória no heap (não é gratuito), copia o valor, e produz lixo que mais tarde o GC precisará coletar. Em ",e.jsx("em",{children:"loops quentes"})," (executados milhões de vezes), isso destrói a performance e aumenta as pausas de coleta."]}),e.jsx("pre",{children:e.jsx("code",{children:`// PÉSSIMO: 1 milhão de boxes
ArrayList nums = new();
for (int i = 0; i < 1_000_000; i++) {
    nums.Add(i);   // BOX
}
long total = 0;
foreach (object o in nums) total += (int)o;   // UNBOX

// BOM: zero box graças aos generics
List<int> nums2 = new();
for (int i = 0; i < 1_000_000; i++) nums2.Add(i);
long total2 = 0;
foreach (int n in nums2) total2 += n;`})}),e.jsx("p",{children:"Em medições reais a versão genérica costuma ser várias vezes mais rápida e usar muito menos memória. Generics, introduzidos no C# 2.0, foram criados em parte para resolver exatamente esse problema."}),e.jsx("h2",{children:"Como os generics evitam boxing"}),e.jsxs("p",{children:["Em ",e.jsx("code",{children:"List<T>"}),", quando ",e.jsx("code",{children:"T"})," é ",e.jsx("code",{children:"int"}),", o JIT (compilador Just-In-Time) gera uma versão especializada que armazena ",e.jsx("code",{children:"int"})," diretamente, sem caixa. Isso vale para qualquer struct passada a um genérico, desde que você não a converta para ",e.jsx("code",{children:"object"})," ou interface por dentro do método."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Sem boxing: T é especializado pelo JIT
T Maximo<T>(T a, T b) where T : IComparable<T>
    => a.CompareTo(b) >= 0 ? a : b;

int maior = Maximo(3, 7);            // sem boxing
DateTime d  = Maximo(DateTime.Now, DateTime.Today);

// COM boxing acidental:
object Pior(object a, object b) =>
    ((IComparable)a).CompareTo(b) >= 0 ? a : b;`})}),e.jsxs(o,{type:"info",title:"As constraints importam",children:["Sem ",e.jsx("code",{children:"where T : IComparable<T>"}),", você precisaria fazer cast para a interface — o que ",e.jsx("em",{children:"causaria boxing"})," em structs. As ",e.jsx("em",{children:"constraints genéricas"})," permitem chamar métodos da interface sem boxing, porque o JIT sabe que ",e.jsx("code",{children:"T"})," implementa."]}),e.jsx("h2",{children:"Truques para detectar e remover boxing"}),e.jsxs("p",{children:["Existem algumas técnicas práticas. Use ",e.jsx("strong",{children:"Visual Studio diagnostics"}),", ",e.jsx("em",{children:"BenchmarkDotNet"})," ou simplesmente leia o código com olhar de detetive procurando por ",e.jsx("code",{children:"object"}),", interfaces sobre struct, ou APIs antigas."]}),e.jsx("pre",{children:e.jsx("code",{children:`// 1) Em structs, sobrecarregue Equals/GetHashCode para evitar
//    boxing quando coleções genéricas comparam.
public readonly struct Cep : IEquatable<Cep> {
    public readonly int Valor;
    public Cep(int v) => Valor = v;
    public bool Equals(Cep other) => Valor == other.Valor;
    public override bool Equals(object? obj) => obj is Cep c && Equals(c);
    public override int GetHashCode() => Valor;
}

// 2) Use string interpolation em vez de string.Format quando possível;
//    o compilador moderno usa um handler que evita boxing primitivo.
int idade = 30;
string txt = $"Tem {idade} anos";   // sem boxing em .NET 6+

// 3) Cuidado ao guardar struct em System.Collections (não-genérica) ou
//    em campos do tipo object — quase sempre é desnecessário hoje.`})}),e.jsx("h2",{children:"Quando boxing não é problema"}),e.jsxs("p",{children:["Não saia paranóico. Boxing custa pouco em chamadas isoladas e a JIT do .NET moderno é muito eficiente. O problema é em ",e.jsx("strong",{children:"caminhos quentes"})," (parsing, renderização, jogos, cálculo numérico) ou quando milhões de objetos pequenos são criados. Para um botão clicado uma vez por minuto, ignore — clareza vale mais."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"ArrayList"})," ou ",e.jsx("code",{children:"Hashtable"})," em código novo:"]})," são pré-genéricos, causam boxing e perdem segurança de tipo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Implementar interface em struct e chamar via interface:"})," causa boxing. Pode ser intencional (polimorfismo), mas saiba o custo."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer de implementar ",e.jsx("code",{children:"IEquatable<T>"})," em struct:"]})," coleções genéricas caem no ",e.jsx("code",{children:"Equals(object)"})," herdado, fazendo boxing."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Comparar struct com ",e.jsx("code",{children:"=="})," via ",e.jsx("code",{children:"object"}),":"]})," compara identidade entre caixas — quase sempre ",e.jsx("code",{children:"false"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tratar ",e.jsx("code",{children:"InvalidCastException"})," em vez de prevenir:"]})," use ",e.jsx("code",{children:"is"})," e padrões para checar antes de unboxar."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Boxing converte um value type em ",e.jsx("code",{children:"object"})," alocando uma caixa no heap."]}),e.jsx("li",{children:"Unboxing extrai o valor e exige cast com tipo exato."}),e.jsxs("li",{children:["É o custo escondido por trás de ",e.jsx("code",{children:"ArrayList"}),", interfaces sobre struct e parâmetros ",e.jsx("code",{children:"object"}),"."]}),e.jsx("li",{children:"Generics evitam boxing porque o JIT especializa o código para o tipo concreto."}),e.jsxs("li",{children:["Implemente ",e.jsx("code",{children:"IEquatable<T>"})," em structs personalizadas."]}),e.jsx("li",{children:"Preocupe-se em loops quentes; em código frio, clareza ganha."})]})]})}export{s as default};
