import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ValueVsReference() {
  return (
    <PageContainer
      title="Value type vs Reference type: a diferença que importa"
      subtitle="Entenda o que muda na memória, na cópia, na igualdade e na performance — e nunca mais se confunda com bugs estranhos."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Toda variável em C# pertence a uma de duas grandes famílias: <strong>tipos por valor</strong> (value types) ou <strong>tipos por referência</strong> (reference types). Saber a diferença é parecido com saber a diferença entre <em>entregar uma fotocópia de um documento</em> e <em>entregar o endereço da gaveta onde o original está guardado</em>. Parece detalhe, mas muda como o código se comporta quando você atribui, passa para método, compara e armazena. Este capítulo dá nome aos bois e te tira de armadilhas comuns.
      </p>

      <h2>O que é cada um</h2>
      <p>
        <strong>Tipos por valor</strong> incluem todos os <code>int</code>, <code>double</code>, <code>bool</code>, <code>char</code>, <code>DateTime</code>, todos os <code>enum</code> e todas as <code>struct</code>. Eles armazenam o conteúdo <em>diretamente</em> na variável. <strong>Tipos por referência</strong> incluem todas as <code>class</code>, <code>interface</code>, <code>delegate</code>, <code>string</code> e arrays — a variável guarda apenas um <em>endereço</em> apontando para o objeto, que mora em outra área de memória.
      </p>
      <pre><code>{`int x = 10;              // value type — '10' está dentro de x
string s = "Olá";        // reference type — s guarda endereço do texto
DateTime d = DateTime.Now; // value type (struct)
List<int> nums = new();  // reference type (class)`}</code></pre>

      <h2>Stack vs Heap (de forma conceitual)</h2>
      <p>
        Tradicionalmente se diz: "value types vivem no <em>stack</em> e reference types no <em>heap</em>". Isso é uma simplificação útil, mas não é uma regra rígida (campos de struct dentro de uma classe vão para o heap, por exemplo). O que importa entender é o conceito:
      </p>
      <ul>
        <li><strong>Stack</strong> é uma pilha de memória rápida, organizada por escopo. Quando o método termina, tudo que estava lá some automaticamente. É como uma pilha de pratos: você empilha quando chama um método, desempilha quando ele retorna.</li>
        <li><strong>Heap</strong> é uma área grande e flexível, gerenciada pelo <strong>Garbage Collector</strong> (GC) — um sistema do .NET que acompanha quem ainda usa cada objeto e libera o que ninguém mais aponta. Reference types vivem aqui.</li>
      </ul>
      <pre><code>{`// Visualização mental ao executar:
//   void M() {
//       int n = 42;                      // STACK: [n=42]
//       Pessoa p = new Pessoa("Ana");    // STACK: [p=0xABC]   HEAP: 0xABC -> {Nome="Ana"}
//   }
// Ao sair de M(): stack desaparece. O objeto Pessoa fica no heap até o GC
// perceber que ninguém mais o referencia, e então o coleta.`}</code></pre>

      <AlertBox type="info" title="Termo: Garbage Collector">
        O <strong>GC</strong> é um faxineiro automático que de tempos em tempos varre o heap, encontra objetos sem referências vivas e libera essa memória. Você não precisa fazer <code>delete</code> nem <code>free</code> como em C/C++.
      </AlertBox>

      <h2>Cópia: a regra que muda tudo</h2>
      <p>
        Atribuir um value type <em>copia o conteúdo</em>. Atribuir um reference type <em>copia só o endereço</em>. Veja o impacto:
      </p>
      <pre><code>{`// VALUE TYPE
int a = 5;
int b = a;
b = 99;
Console.WriteLine(a);   // 5  — a não muda

// REFERENCE TYPE
class Caixa { public int Valor; }
var x = new Caixa { Valor = 5 };
var y = x;              // y aponta para a MESMA caixa
y.Valor = 99;
Console.WriteLine(x.Valor);  // 99  — x e y olham para o mesmo objeto`}</code></pre>
      <p>
        É exatamente daqui que vêm os bugs clássicos do tipo "alterei o item da lista e ele mudou em outro lugar do programa". A solução é entender que você não tem dois objetos — tem duas <em>variáveis</em> apontando para um só.
      </p>

      <h2>Passagem para método</h2>
      <p>
        A regra de cópia se aplica também aos parâmetros. Por padrão, value types entram <em>por valor</em> (o método recebe uma cópia) e reference types entram <em>por referência ao endereço</em> (o método pode mexer no objeto original, mas <strong>não</strong> pode trocar a referência que o chamador mantém).
      </p>
      <pre><code>{`void IncrementarValor(int n) { n++; }
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
                                 //       mas a do chamador continuou`}</code></pre>
      <p>
        Para deixar o método trocar a referência do chamador também, use <code>ref</code>: <code>void Trocar(ref Caixa c)</code>. Para passar value type por referência (e evitar cópia de struct grande), use <code>in</code>, <code>ref</code> ou <code>out</code>.
      </p>

      <h2>Igualdade: <code>==</code> tem dois significados</h2>
      <p>
        Para value types primitivos, <code>==</code> compara conteúdo. Para reference types, <code>==</code> por padrão compara <strong>identidade</strong> (mesmo endereço). Há exceções importantes que valem decorar:
      </p>
      <pre><code>{`int a = 5, b = 5;
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
Console.WriteLine(p1 == p2);        // True — records têm igualdade por valor automática`}</code></pre>

      <AlertBox type="warning" title="Cuidado com strings comparadas como object">
        Sempre que comparar texto, use <code>string.Equals(a, b, StringComparison.Ordinal)</code> ou <code>==</code> diretamente em variáveis de tipo <code>string</code>. Comparar via <code>object</code> ou usar <code>ReferenceEquals</code> pode produzir resultados surpreendentes.
      </AlertBox>

      <h2>Performance: o trade-off</h2>
      <p>
        Value types são "baratos" para criar (entram no stack, somem sozinhos), mas pagam o custo de cópia em cada atribuição/passagem. Reference types pagam alocação no heap (mais lenta) e dão trabalho ao GC, mas são compartilhados sem cópia. Em código de alta performance:
      </p>
      <ul>
        <li>Use <code>struct</code> pequena para reduzir pressão sobre o GC.</li>
        <li>Use <code>in</code> para passar struct grande sem copiar.</li>
        <li>Use <code>readonly struct</code> para liberar otimizações de cópia defensiva.</li>
        <li>Cuidado com <strong>boxing</strong> (que veremos no próximo capítulo) — converter um value type para <code>object</code> ou interface aloca uma caixa no heap.</li>
      </ul>
      <pre><code>{`// Cópia em loop quente (struct de 64 bytes? caro!)
foreach (var ponto in lista) { Calcular(ponto); }

// Versão sem cópia:
foreach (ref readonly var p in CollectionsMarshal.AsSpan(lista)) {
    Calcular(in p);
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>"Modifiquei o item da lista e nada aconteceu":</strong> a lista guarda <em>structs</em>; você modificou uma cópia. Recoloque com <code>lista[i] = novoValor;</code>.</li>
        <li><strong>"Passei o objeto e o método não mudou nada":</strong> ou era value type (cópia) ou o método trocou a referência local sem <code>ref</code>.</li>
        <li><strong>"Comparei com == e deu False mesmo sendo iguais":</strong> reference type sem <code>Equals</code> sobrecarregado. Implemente igualdade ou use <code>record</code>.</li>
        <li><strong>"Achei que <code>string</code> era value type":</strong> não é. É reference type, mas imutável e com <code>==</code> por valor — daí parecer value.</li>
        <li><strong>Vazamento por referências mantidas:</strong> se algo guarda referência ao seu objeto (event handler, cache), o GC nunca o coleta.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Value types guardam o valor em si; reference types guardam um endereço.</li>
        <li>Stack/heap é uma simplificação útil — o que importa é o comportamento de cópia.</li>
        <li>Atribuição copia conteúdo (value) ou referência (reference).</li>
        <li>Métodos recebem cópias por padrão; use <code>ref</code>/<code>in</code>/<code>out</code> para mudar isso.</li>
        <li><code>==</code> compara conteúdo em primitivos e em <code>string</code>/<code>record</code>; identidade em outras classes.</li>
        <li>Performance: prefira struct pequena imutável; em struct grande, passe por <code>in</code>.</li>
      </ul>
    </PageContainer>
  );
}
