import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BoxingUnboxing() {
  return (
    <PageContainer
      title="Boxing e unboxing: o custo escondido"
      subtitle="Aprenda como value types ganham uma 'caixa' no heap quando viram object — e como evitar essa armadilha de performance."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Em C#, todo tipo — inclusive <code>int</code>, <code>bool</code>, <code>DateTime</code> — herda, no fim das contas, de <code>object</code>. Isso parece inocente, mas tem uma consequência fascinante: quando você atribui um value type a uma variável de tipo <code>object</code> (ou a uma interface), o runtime precisa "embrulhar" aquele valor em uma caixa no heap para que ele se comporte como um objeto. Esse embrulho se chama <strong>boxing</strong>; o processo inverso é o <strong>unboxing</strong>. Pense em pegar uma moeda solta e colocá-la dentro de um pequeno cofre só para passá-la a alguém que só aceita cofres.
      </p>

      <h2>Vendo o boxing acontecer</h2>
      <p>
        Tudo o que é necessário é uma atribuição. O compilador insere a operação automaticamente, sem aviso visual. O CLR (Common Language Runtime, o motor de execução do .NET) aloca um pequeno objeto no heap, copia o valor para dentro e devolve a referência.
      </p>
      <pre><code>{`int n = 42;
object o = n;        // BOXING — n vira uma "caixa" no heap

Console.WriteLine(o);          // 42
Console.WriteLine(o is int);   // True

int m = (int)o;      // UNBOXING — precisa cast EXPLÍCITO
Console.WriteLine(m); // 42`}</code></pre>
      <p>
        O boxing acontece silenciosamente. O unboxing exige cast explícito porque o compilador quer que você confirme: "sim, eu sei que dentro dessa caixa há um <code>int</code>". Se a caixa contiver outro tipo, o cast lança <code>InvalidCastException</code> em runtime.
      </p>

      <AlertBox type="warning" title="Cast errado, exceção certa">
        Tentar fazer <code>(long)o</code> quando <code>o</code> guarda um <code>int</code> dá <code>InvalidCastException</code> — não importa que <code>long</code> caiba no <code>int</code>. Unboxing exige o tipo <strong>exato</strong>.
      </AlertBox>

      <h2>Onde o boxing aparece sem você perceber</h2>
      <p>
        Pode parecer raro, mas situações cotidianas escondem boxing. Antes dos generics (C# 1.0), quase toda coleção causava boxing, e era a principal razão de programas em <code>ArrayList</code> serem lentos com números.
      </p>
      <pre><code>{`// 1) Coleções não-genéricas (PRÉ-2005)
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
object[] caixa = new object[] { 1, 2.5, true };  // 3 BOX`}</code></pre>

      <h2>Por que é caro?</h2>
      <p>
        Cada boxing faz três coisas: aloca memória no heap (não é gratuito), copia o valor, e produz lixo que mais tarde o GC precisará coletar. Em <em>loops quentes</em> (executados milhões de vezes), isso destrói a performance e aumenta as pausas de coleta.
      </p>
      <pre><code>{`// PÉSSIMO: 1 milhão de boxes
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
foreach (int n in nums2) total2 += n;`}</code></pre>
      <p>
        Em medições reais a versão genérica costuma ser várias vezes mais rápida e usar muito menos memória. Generics, introduzidos no C# 2.0, foram criados em parte para resolver exatamente esse problema.
      </p>

      <h2>Como os generics evitam boxing</h2>
      <p>
        Em <code>List&lt;T&gt;</code>, quando <code>T</code> é <code>int</code>, o JIT (compilador Just-In-Time) gera uma versão especializada que armazena <code>int</code> diretamente, sem caixa. Isso vale para qualquer struct passada a um genérico, desde que você não a converta para <code>object</code> ou interface por dentro do método.
      </p>
      <pre><code>{`// Sem boxing: T é especializado pelo JIT
T Maximo<T>(T a, T b) where T : IComparable<T>
    => a.CompareTo(b) >= 0 ? a : b;

int maior = Maximo(3, 7);            // sem boxing
DateTime d  = Maximo(DateTime.Now, DateTime.Today);

// COM boxing acidental:
object Pior(object a, object b) =>
    ((IComparable)a).CompareTo(b) >= 0 ? a : b;`}</code></pre>

      <AlertBox type="info" title="As constraints importam">
        Sem <code>where T : IComparable&lt;T&gt;</code>, você precisaria fazer cast para a interface — o que <em>causaria boxing</em> em structs. As <em>constraints genéricas</em> permitem chamar métodos da interface sem boxing, porque o JIT sabe que <code>T</code> implementa.
      </AlertBox>

      <h2>Truques para detectar e remover boxing</h2>
      <p>
        Existem algumas técnicas práticas. Use <strong>Visual Studio diagnostics</strong>, <em>BenchmarkDotNet</em> ou simplesmente leia o código com olhar de detetive procurando por <code>object</code>, interfaces sobre struct, ou APIs antigas.
      </p>
      <pre><code>{`// 1) Em structs, sobrecarregue Equals/GetHashCode para evitar
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
//    em campos do tipo object — quase sempre é desnecessário hoje.`}</code></pre>

      <h2>Quando boxing não é problema</h2>
      <p>
        Não saia paranóico. Boxing custa pouco em chamadas isoladas e a JIT do .NET moderno é muito eficiente. O problema é em <strong>caminhos quentes</strong> (parsing, renderização, jogos, cálculo numérico) ou quando milhões de objetos pequenos são criados. Para um botão clicado uma vez por minuto, ignore — clareza vale mais.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar <code>ArrayList</code> ou <code>Hashtable</code> em código novo:</strong> são pré-genéricos, causam boxing e perdem segurança de tipo.</li>
        <li><strong>Implementar interface em struct e chamar via interface:</strong> causa boxing. Pode ser intencional (polimorfismo), mas saiba o custo.</li>
        <li><strong>Esquecer de implementar <code>IEquatable&lt;T&gt;</code> em struct:</strong> coleções genéricas caem no <code>Equals(object)</code> herdado, fazendo boxing.</li>
        <li><strong>Comparar struct com <code>==</code> via <code>object</code>:</strong> compara identidade entre caixas — quase sempre <code>false</code>.</li>
        <li><strong>Tratar <code>InvalidCastException</code> em vez de prevenir:</strong> use <code>is</code> e padrões para checar antes de unboxar.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Boxing converte um value type em <code>object</code> alocando uma caixa no heap.</li>
        <li>Unboxing extrai o valor e exige cast com tipo exato.</li>
        <li>É o custo escondido por trás de <code>ArrayList</code>, interfaces sobre struct e parâmetros <code>object</code>.</li>
        <li>Generics evitam boxing porque o JIT especializa o código para o tipo concreto.</li>
        <li>Implemente <code>IEquatable&lt;T&gt;</code> em structs personalizadas.</li>
        <li>Preocupe-se em loops quentes; em código frio, clareza ganha.</li>
      </ul>
    </PageContainer>
  );
}
