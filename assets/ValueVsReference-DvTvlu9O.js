import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"Value type vs Reference type: a diferença que importa",subtitle:"Entenda o que muda na memória, na cópia, na igualdade e na performance — e nunca mais se confunda com bugs estranhos.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:["Toda variável em C# pertence a uma de duas grandes famílias: ",e.jsx("strong",{children:"tipos por valor"})," (value types) ou ",e.jsx("strong",{children:"tipos por referência"})," (reference types). Saber a diferença é parecido com saber a diferença entre ",e.jsx("em",{children:"entregar uma fotocópia de um documento"})," e ",e.jsx("em",{children:"entregar o endereço da gaveta onde o original está guardado"}),". Parece detalhe, mas muda como o código se comporta quando você atribui, passa para método, compara e armazena. Este capítulo dá nome aos bois e te tira de armadilhas comuns."]}),e.jsx("h2",{children:"O que é cada um"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Tipos por valor"})," incluem todos os ",e.jsx("code",{children:"int"}),", ",e.jsx("code",{children:"double"}),", ",e.jsx("code",{children:"bool"}),", ",e.jsx("code",{children:"char"}),", ",e.jsx("code",{children:"DateTime"}),", todos os ",e.jsx("code",{children:"enum"})," e todas as ",e.jsx("code",{children:"struct"}),". Eles armazenam o conteúdo ",e.jsx("em",{children:"diretamente"})," na variável. ",e.jsx("strong",{children:"Tipos por referência"})," incluem todas as ",e.jsx("code",{children:"class"}),", ",e.jsx("code",{children:"interface"}),", ",e.jsx("code",{children:"delegate"}),", ",e.jsx("code",{children:"string"})," e arrays — a variável guarda apenas um ",e.jsx("em",{children:"endereço"})," apontando para o objeto, que mora em outra área de memória."]}),e.jsx("pre",{children:e.jsx("code",{children:`int x = 10;              // value type — '10' está dentro de x
string s = "Olá";        // reference type — s guarda endereço do texto
DateTime d = DateTime.Now; // value type (struct)
List<int> nums = new();  // reference type (class)`})}),e.jsx("h2",{children:"Stack vs Heap (de forma conceitual)"}),e.jsxs("p",{children:['Tradicionalmente se diz: "value types vivem no ',e.jsx("em",{children:"stack"})," e reference types no ",e.jsx("em",{children:"heap"}),'". Isso é uma simplificação útil, mas não é uma regra rígida (campos de struct dentro de uma classe vão para o heap, por exemplo). O que importa entender é o conceito:']}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Stack"})," é uma pilha de memória rápida, organizada por escopo. Quando o método termina, tudo que estava lá some automaticamente. É como uma pilha de pratos: você empilha quando chama um método, desempilha quando ele retorna."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Heap"})," é uma área grande e flexível, gerenciada pelo ",e.jsx("strong",{children:"Garbage Collector"})," (GC) — um sistema do .NET que acompanha quem ainda usa cada objeto e libera o que ninguém mais aponta. Reference types vivem aqui."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// Visualização mental ao executar:
//   void M() {
//       int n = 42;                      // STACK: [n=42]
//       Pessoa p = new Pessoa("Ana");    // STACK: [p=0xABC]   HEAP: 0xABC -> {Nome="Ana"}
//   }
// Ao sair de M(): stack desaparece. O objeto Pessoa fica no heap até o GC
// perceber que ninguém mais o referencia, e então o coleta.`})}),e.jsxs(a,{type:"info",title:"Termo: Garbage Collector",children:["O ",e.jsx("strong",{children:"GC"})," é um faxineiro automático que de tempos em tempos varre o heap, encontra objetos sem referências vivas e libera essa memória. Você não precisa fazer ",e.jsx("code",{children:"delete"})," nem ",e.jsx("code",{children:"free"})," como em C/C++."]}),e.jsx("h2",{children:"Cópia: a regra que muda tudo"}),e.jsxs("p",{children:["Atribuir um value type ",e.jsx("em",{children:"copia o conteúdo"}),". Atribuir um reference type ",e.jsx("em",{children:"copia só o endereço"}),". Veja o impacto:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// VALUE TYPE
int a = 5;
int b = a;
b = 99;
Console.WriteLine(a);   // 5  — a não muda

// REFERENCE TYPE
class Caixa { public int Valor; }
var x = new Caixa { Valor = 5 };
var y = x;              // y aponta para a MESMA caixa
y.Valor = 99;
Console.WriteLine(x.Valor);  // 99  — x e y olham para o mesmo objeto`})}),e.jsxs("p",{children:['É exatamente daqui que vêm os bugs clássicos do tipo "alterei o item da lista e ele mudou em outro lugar do programa". A solução é entender que você não tem dois objetos — tem duas ',e.jsx("em",{children:"variáveis"})," apontando para um só."]}),e.jsx("h2",{children:"Passagem para método"}),e.jsxs("p",{children:["A regra de cópia se aplica também aos parâmetros. Por padrão, value types entram ",e.jsx("em",{children:"por valor"})," (o método recebe uma cópia) e reference types entram ",e.jsx("em",{children:"por referência ao endereço"})," (o método pode mexer no objeto original, mas ",e.jsx("strong",{children:"não"})," pode trocar a referência que o chamador mantém)."]}),e.jsx("pre",{children:e.jsx("code",{children:`void IncrementarValor(int n) { n++; }
void IncrementarItem(Caixa c) { c.Valor++; }
void Trocar(Caixa c) { c = new Caixa { Valor = -1 }; }

int v = 10;
IncrementarValor(v);
Console.WriteLine(v);    // 10  — método mexeu na cópia

var caixa = new Caixa { Valor = 10 };
IncrementarItem(caixa);
Console.WriteLine(caixa.Valor);  // 11  — mexeu no objeto

Trocar(caixa);
Console.WriteLine(caixa.Valor);  // 11  — referência local foi trocada,
                                 //       mas a do chamador continuou`})}),e.jsxs("p",{children:["Para deixar o método trocar a referência do chamador também, use ",e.jsx("code",{children:"ref"}),": ",e.jsx("code",{children:"void Trocar(ref Caixa c)"}),". Para passar value type por referência (e evitar cópia de struct grande), use ",e.jsx("code",{children:"in"}),", ",e.jsx("code",{children:"ref"})," ou ",e.jsx("code",{children:"out"}),"."]}),e.jsxs("h2",{children:["Igualdade: ",e.jsx("code",{children:"=="})," tem dois significados"]}),e.jsxs("p",{children:["Para value types primitivos, ",e.jsx("code",{children:"=="})," compara conteúdo. Para reference types, ",e.jsx("code",{children:"=="})," por padrão compara ",e.jsx("strong",{children:"identidade"})," (mesmo endereço). Há exceções importantes que valem decorar:"]}),e.jsx("pre",{children:e.jsx("code",{children:`int a = 5, b = 5;
Console.WriteLine(a == b);          // True — conteúdo

string s1 = "Olá", s2 = "Olá";
Console.WriteLine(s1 == s2);        // True — string SOBRECARREGA == para conteúdo

object o1 = "Olá", o2 = "Olá";
Console.WriteLine(o1 == o2);        // True (interno: strings literais costumam ser
                                    //       'internadas', mesmo objeto), mas em
                                    //       new string("X") == new string("X") é False!

Caixa c1 = new(); Caixa c2 = new();
Console.WriteLine(c1 == c2);        // False — objetos diferentes
Console.WriteLine(c1.Equals(c2));   // False — Equals padrão também é por identidade

record Pessoa(string Nome);
var p1 = new Pessoa("Ana"); var p2 = new Pessoa("Ana");
Console.WriteLine(p1 == p2);        // True — records têm igualdade por valor automática`})}),e.jsxs(a,{type:"warning",title:"Cuidado com strings comparadas como object",children:["Sempre que comparar texto, use ",e.jsx("code",{children:"string.Equals(a, b, StringComparison.Ordinal)"})," ou ",e.jsx("code",{children:"=="})," diretamente em variáveis de tipo ",e.jsx("code",{children:"string"}),". Comparar via ",e.jsx("code",{children:"object"})," ou usar ",e.jsx("code",{children:"ReferenceEquals"})," pode produzir resultados surpreendentes."]}),e.jsx("h2",{children:"Performance: o trade-off"}),e.jsx("p",{children:'Value types são "baratos" para criar (entram no stack, somem sozinhos), mas pagam o custo de cópia em cada atribuição/passagem. Reference types pagam alocação no heap (mais lenta) e dão trabalho ao GC, mas são compartilhados sem cópia. Em código de alta performance:'}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Use ",e.jsx("code",{children:"struct"})," pequena para reduzir pressão sobre o GC."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"in"})," para passar struct grande sem copiar."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"readonly struct"})," para liberar otimizações de cópia defensiva."]}),e.jsxs("li",{children:["Cuidado com ",e.jsx("strong",{children:"boxing"})," (que veremos no próximo capítulo) — converter um value type para ",e.jsx("code",{children:"object"})," ou interface aloca uma caixa no heap."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// Cópia em loop quente (struct de 64 bytes? caro!)
foreach (var ponto in lista) { Calcular(ponto); }

// Versão sem cópia:
foreach (ref readonly var p in CollectionsMarshal.AsSpan(lista)) {
    Calcular(in p);
}`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:'"Modifiquei o item da lista e nada aconteceu":'})," a lista guarda ",e.jsx("em",{children:"structs"}),"; você modificou uma cópia. Recoloque com ",e.jsx("code",{children:"lista[i] = novoValor;"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"Passei o objeto e o método não mudou nada":'})," ou era value type (cópia) ou o método trocou a referência local sem ",e.jsx("code",{children:"ref"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"Comparei com == e deu False mesmo sendo iguais":'})," reference type sem ",e.jsx("code",{children:"Equals"})," sobrecarregado. Implemente igualdade ou use ",e.jsx("code",{children:"record"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:['"Achei que ',e.jsx("code",{children:"string"}),' era value type":']})," não é. É reference type, mas imutável e com ",e.jsx("code",{children:"=="})," por valor — daí parecer value."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Vazamento por referências mantidas:"})," se algo guarda referência ao seu objeto (event handler, cache), o GC nunca o coleta."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Value types guardam o valor em si; reference types guardam um endereço."}),e.jsx("li",{children:"Stack/heap é uma simplificação útil — o que importa é o comportamento de cópia."}),e.jsx("li",{children:"Atribuição copia conteúdo (value) ou referência (reference)."}),e.jsxs("li",{children:["Métodos recebem cópias por padrão; use ",e.jsx("code",{children:"ref"}),"/",e.jsx("code",{children:"in"}),"/",e.jsx("code",{children:"out"})," para mudar isso."]}),e.jsxs("li",{children:[e.jsx("code",{children:"=="})," compara conteúdo em primitivos e em ",e.jsx("code",{children:"string"}),"/",e.jsx("code",{children:"record"}),"; identidade em outras classes."]}),e.jsxs("li",{children:["Performance: prefira struct pequena imutável; em struct grande, passe por ",e.jsx("code",{children:"in"}),"."]})]})]})}export{i as default};
