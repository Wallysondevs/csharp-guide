import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(r,{title:"Tipos por referência: string, object, classes, arrays",subtitle:"Como o C# guarda objetos no heap, por que a atribuição entre eles compartilha estado e como comparar referências corretamente.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:['Imagine que cada objeto grande do seu programa — uma lista, um cliente, uma string — mora em uma "casa" em algum lugar da cidade (o ',e.jsx("strong",{children:"heap"}),", uma área grande de memória administrada pelo .NET). Sua variável não é a casa em si: é apenas o ",e.jsx("em",{children:"endereço"})," escrito em um pedaço de papel. Quando você passa o papel para outra pessoa, ambas leem o mesmo endereço — e portanto enxergam a mesma casa. Esse é o princípio dos ",e.jsx("strong",{children:"tipos por referência"}),' em C#, e entender isso evita quase todos os bugs de "por que minha lista mudou sozinha?".']}),e.jsx("h2",{children:"Onde cada tipo vive"}),e.jsxs("p",{children:["Os ",e.jsx("em",{children:"tipos por valor"})," (capítulo anterior) ficam, em geral, na ",e.jsx("strong",{children:"pilha"})," (",e.jsx("em",{children:"stack"}),"): uma região rápida e pequena, que o programa usa enquanto métodos estão executando. Já os ",e.jsx("em",{children:"tipos por referência"})," ficam no ",e.jsx("strong",{children:"heap"}),": uma região maior, gerenciada pelo ",e.jsx("strong",{children:"Garbage Collector (GC)"}),", que automaticamente libera memória quando ninguém aponta mais para o objeto."]}),e.jsx("pre",{children:e.jsx("code",{children:`// 'pessoa' está na pilha, mas o objeto Pessoa em si vive no heap.
// 'pessoa' guarda apenas o endereço do objeto.
Pessoa pessoa = new Pessoa { Nome = "Ana" };

// O array em si vive no heap; 'numeros' é o ponteiro.
int[] numeros = new int[] { 1, 2, 3 };

// String também é referência (apesar de parecer primitiva).
string texto = "Olá";`})}),e.jsx("h2",{children:"Atribuição copia o ponteiro, não o objeto"}),e.jsxs("p",{children:["Esta é a diferença fundamental para iniciantes. Quando você atribui uma variável de referência a outra, está copiando o ",e.jsx("em",{children:"endereço"}),". As duas variáveis passam a apontar para o ",e.jsx("strong",{children:"mesmo"})," objeto."]}),e.jsx("pre",{children:e.jsx("code",{children:`int[] a = { 1, 2, 3 };
int[] b = a;          // b aponta para o MESMO array que a
b[0] = 999;
Console.WriteLine(a[0]);  // 999 (!)

// Se eu quiser uma cópia de verdade, preciso pedir explicitamente:
int[] c = (int[])a.Clone();
c[0] = 0;
Console.WriteLine(a[0]);  // continua 999, c é independente`})}),e.jsxs(a,{type:"warning",title:"Cuidado ao passar para métodos",children:["Quando você passa uma lista ou objeto para um método, o método pode ",e.jsx("strong",{children:"modificar o conteúdo"}),' e essas mudanças serão vistas por quem chamou. Isso é poderoso, mas surpreende quem espera o comportamento de "valor".']}),e.jsxs("h2",{children:[e.jsx("code",{children:"null"}),": a ausência de referência"]}),e.jsxs("p",{children:['Como uma variável de referência guarda um endereço, ela pode também guardar um endereço "vazio": ',e.jsx("code",{children:"null"}),". Tentar acessar membros de uma referência ",e.jsx("code",{children:"null"})," lança a famigerada ",e.jsx("code",{children:"NullReferenceException"})," — provavelmente o erro mais comum em todo programa C#."]}),e.jsx("pre",{children:e.jsx("code",{children:`string nome = null;
// int n = nome.Length; // CRASH: NullReferenceException

// Defesa moderna: nullable reference types (C# 8+)
string? talvezNome = null;          // ? marca que pode ser null
int n = talvezNome?.Length ?? 0;    // ?. e ?? evitam o crash

// Pattern matching também ajuda:
if (talvezNome is { } valor) {
    Console.WriteLine(valor.Length);
}`})}),e.jsxs("p",{children:["Em projetos modernos, ative ",e.jsx("code",{children:"<Nullable>enable</Nullable>"})," no ",e.jsx("code",{children:".csproj"}),": o compilador passa a avisar quando você arrisca usar ",e.jsx("code",{children:"null"})," sem checar."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"=="})," vs ",e.jsx("code",{children:"Equals"})," vs ",e.jsx("code",{children:"ReferenceEquals"})]}),e.jsxs("p",{children:["Para tipos por valor, ",e.jsx("code",{children:"=="})," compara conteúdo. Para tipos por referência, o significado depende do tipo: por padrão compara endereços, mas pode ser ",e.jsx("em",{children:"sobrescrito"})," para comparar conteúdo. Quem domina essa diferença evita bugs sutis."]}),e.jsx("pre",{children:e.jsx("code",{children:`string a = "Olá";
string b = "Ol" + "á";        // string sobrescreve == para comparar texto
Console.WriteLine(a == b);                  // True
Console.WriteLine(a.Equals(b));             // True
Console.WriteLine(object.ReferenceEquals(a, b)); // True/False (depende do interning)

// Para uma classe SUA, sem sobrescrever Equals:
class Cliente { public string Nome; }
var c1 = new Cliente { Nome = "Ana" };
var c2 = new Cliente { Nome = "Ana" };
Console.WriteLine(c1 == c2);          // False — endereços diferentes
Console.WriteLine(c1.Equals(c2));     // False — comportamento padrão herdado de object`})}),e.jsxs("p",{children:["Para forçar comparação por conteúdo nas suas classes, sobrescreva ",e.jsx("code",{children:"Equals"})," e ",e.jsx("code",{children:"GetHashCode"})," (ou use ",e.jsx("code",{children:"record"}),", que faz isso automaticamente)."]}),e.jsxs("h2",{children:["O caso especial da ",e.jsx("code",{children:"string"})]}),e.jsxs("p",{children:[e.jsx("code",{children:"string"})," é tipo por referência, mas se comporta como valor em vários aspectos: é ",e.jsx("strong",{children:"imutável"}),' (qualquer "modificação" cria uma nova string) e o ',e.jsx("code",{children:"=="})," compara conteúdo. Internamente, o .NET até reaproveita strings literais idênticas (",e.jsx("em",{children:"string interning"}),"), economizando memória."]}),e.jsx("pre",{children:e.jsx("code",{children:`string s1 = "abc";
string s2 = "abc";
Console.WriteLine(object.ReferenceEquals(s1, s2)); // geralmente True (interning)

string s3 = string.Concat("a", "bc");
Console.WriteLine(s1 == s3);                       // True (mesmo conteúdo)
Console.WriteLine(object.ReferenceEquals(s1, s3)); // False (objetos diferentes)`})}),e.jsx("h2",{children:"Classes e arrays como exemplos canônicos"}),e.jsxs("p",{children:["Toda ",e.jsx("code",{children:"class"})," que você criar é tipo por referência. Toda ",e.jsx("code",{children:"struct"})," é tipo por valor. Arrays — mesmo de ",e.jsx("code",{children:"int"})," — são ",e.jsx("strong",{children:"sempre"})," tipos por referência (o array em si vive no heap, ainda que seus elementos sejam ",e.jsx("code",{children:"int"}),")."]}),e.jsx("pre",{children:e.jsx("code",{children:`class Conta {
    public decimal Saldo { get; set; }
}

void Sacar(Conta c, decimal valor) {
    c.Saldo -= valor;   // modifica o objeto original
}

var minha = new Conta { Saldo = 1000 };
Sacar(minha, 200);
Console.WriteLine(minha.Saldo); // 800`})}),e.jsxs(a,{type:"info",title:"Garbage Collector em uma frase",children:["O GC roda automaticamente e libera objetos do heap quando nenhuma variável aponta mais para eles. Você não precisa chamar ",e.jsx("code",{children:"delete"})," nem ",e.jsx("code",{children:"free"})," — diferente de C/C++."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:[e.jsx("code",{children:"NullReferenceException"}),":"]})," tentar usar variável que ainda é ",e.jsx("code",{children:"null"}),". Sempre cheque com ",e.jsx("code",{children:"?."})," ou ",e.jsx("code",{children:"if (x is not null)"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Modificar uma lista compartilhada sem perceber:"})," dois métodos guardando referência à mesma ",e.jsx("code",{children:"List<T>"}),". Documente bem ou clone antes de passar."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esperar que ",e.jsx("code",{children:"=="})," compare conteúdo em classes próprias:"]})," compare via ",e.jsx("code",{children:"Equals"})," sobrescrito ou use ",e.jsx("code",{children:"record"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confundir array de struct com array por valor:"})," o array é referência mesmo que seus elementos sejam tipo por valor."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:'Tipos por referência vivem no heap; a variável é só o "endereço".'}),e.jsx("li",{children:"Atribuir uma referência copia o ponteiro — ambos enxergam o mesmo objeto."}),e.jsxs("li",{children:[e.jsx("code",{children:"null"})," é a ausência de referência; acessá-la lança ",e.jsx("code",{children:"NullReferenceException"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"=="})," e ",e.jsx("code",{children:"Equals"})," podem comparar referência ou conteúdo, dependendo do tipo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ReferenceEquals"})," garante comparação de endereços, ignorando sobrescritas."]}),e.jsxs("li",{children:[e.jsx("code",{children:"string"})," é referência, mas imutável e com ",e.jsx("code",{children:"=="})," que compara texto."]})]})]})}export{n as default};
