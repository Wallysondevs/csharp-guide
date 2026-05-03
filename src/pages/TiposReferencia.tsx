import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TiposReferencia() {
  return (
    <PageContainer
      title="Tipos por referência: string, object, classes, arrays"
      subtitle="Como o C# guarda objetos no heap, por que a atribuição entre eles compartilha estado e como comparar referências corretamente."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Imagine que cada objeto grande do seu programa — uma lista, um cliente, uma string — mora em uma "casa" em algum lugar da cidade (o <strong>heap</strong>, uma área grande de memória administrada pelo .NET). Sua variável não é a casa em si: é apenas o <em>endereço</em> escrito em um pedaço de papel. Quando você passa o papel para outra pessoa, ambas leem o mesmo endereço — e portanto enxergam a mesma casa. Esse é o princípio dos <strong>tipos por referência</strong> em C#, e entender isso evita quase todos os bugs de "por que minha lista mudou sozinha?".
      </p>

      <h2>Onde cada tipo vive</h2>
      <p>
        Os <em>tipos por valor</em> (capítulo anterior) ficam, em geral, na <strong>pilha</strong> (<em>stack</em>): uma região rápida e pequena, que o programa usa enquanto métodos estão executando. Já os <em>tipos por referência</em> ficam no <strong>heap</strong>: uma região maior, gerenciada pelo <strong>Garbage Collector (GC)</strong>, que automaticamente libera memória quando ninguém aponta mais para o objeto.
      </p>
      <pre><code>{`// 'pessoa' está na pilha, mas o objeto Pessoa em si vive no heap.
// 'pessoa' guarda apenas o endereço do objeto.
Pessoa pessoa = new Pessoa { Nome = "Ana" };

// O array em si vive no heap; 'numeros' é o ponteiro.
int[] numeros = new int[] { 1, 2, 3 };

// String também é referência (apesar de parecer primitiva).
string texto = "Olá";`}</code></pre>

      <h2>Atribuição copia o ponteiro, não o objeto</h2>
      <p>
        Esta é a diferença fundamental para iniciantes. Quando você atribui uma variável de referência a outra, está copiando o <em>endereço</em>. As duas variáveis passam a apontar para o <strong>mesmo</strong> objeto.
      </p>
      <pre><code>{`int[] a = { 1, 2, 3 };
int[] b = a;          // b aponta para o MESMO array que a
b[0] = 999;
Console.WriteLine(a[0]);  // 999 (!)

// Se eu quiser uma cópia de verdade, preciso pedir explicitamente:
int[] c = (int[])a.Clone();
c[0] = 0;
Console.WriteLine(a[0]);  // continua 999, c é independente`}</code></pre>

      <AlertBox type="warning" title="Cuidado ao passar para métodos">
        Quando você passa uma lista ou objeto para um método, o método pode <strong>modificar o conteúdo</strong> e essas mudanças serão vistas por quem chamou. Isso é poderoso, mas surpreende quem espera o comportamento de "valor".
      </AlertBox>

      <h2><code>null</code>: a ausência de referência</h2>
      <p>
        Como uma variável de referência guarda um endereço, ela pode também guardar um endereço "vazio": <code>null</code>. Tentar acessar membros de uma referência <code>null</code> lança a famigerada <code>NullReferenceException</code> — provavelmente o erro mais comum em todo programa C#.
      </p>
      <pre><code>{`string nome = null;
// int n = nome.Length; // CRASH: NullReferenceException

// Defesa moderna: nullable reference types (C# 8+)
string? talvezNome = null;          // ? marca que pode ser null
int n = talvezNome?.Length ?? 0;    // ?. e ?? evitam o crash

// Pattern matching também ajuda:
if (talvezNome is { } valor) {
    Console.WriteLine(valor.Length);
}`}</code></pre>
      <p>
        Em projetos modernos, ative <code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</code> no <code>.csproj</code>: o compilador passa a avisar quando você arrisca usar <code>null</code> sem checar.
      </p>

      <h2><code>==</code> vs <code>Equals</code> vs <code>ReferenceEquals</code></h2>
      <p>
        Para tipos por valor, <code>==</code> compara conteúdo. Para tipos por referência, o significado depende do tipo: por padrão compara endereços, mas pode ser <em>sobrescrito</em> para comparar conteúdo. Quem domina essa diferença evita bugs sutis.
      </p>
      <pre><code>{`string a = "Olá";
string b = "Ol" + "á";        // string sobrescreve == para comparar texto
Console.WriteLine(a == b);                  // True
Console.WriteLine(a.Equals(b));             // True
Console.WriteLine(object.ReferenceEquals(a, b)); // True/False (depende do interning)

// Para uma classe SUA, sem sobrescrever Equals:
class Cliente { public string Nome; }
var c1 = new Cliente { Nome = "Ana" };
var c2 = new Cliente { Nome = "Ana" };
Console.WriteLine(c1 == c2);          // False — endereços diferentes
Console.WriteLine(c1.Equals(c2));     // False — comportamento padrão herdado de object`}</code></pre>
      <p>
        Para forçar comparação por conteúdo nas suas classes, sobrescreva <code>Equals</code> e <code>GetHashCode</code> (ou use <code>record</code>, que faz isso automaticamente).
      </p>

      <h2>O caso especial da <code>string</code></h2>
      <p>
        <code>string</code> é tipo por referência, mas se comporta como valor em vários aspectos: é <strong>imutável</strong> (qualquer "modificação" cria uma nova string) e o <code>==</code> compara conteúdo. Internamente, o .NET até reaproveita strings literais idênticas (<em>string interning</em>), economizando memória.
      </p>
      <pre><code>{`string s1 = "abc";
string s2 = "abc";
Console.WriteLine(object.ReferenceEquals(s1, s2)); // geralmente True (interning)

string s3 = string.Concat("a", "bc");
Console.WriteLine(s1 == s3);                       // True (mesmo conteúdo)
Console.WriteLine(object.ReferenceEquals(s1, s3)); // False (objetos diferentes)`}</code></pre>

      <h2>Classes e arrays como exemplos canônicos</h2>
      <p>
        Toda <code>class</code> que você criar é tipo por referência. Toda <code>struct</code> é tipo por valor. Arrays — mesmo de <code>int</code> — são <strong>sempre</strong> tipos por referência (o array em si vive no heap, ainda que seus elementos sejam <code>int</code>).
      </p>
      <pre><code>{`class Conta {
    public decimal Saldo { get; set; }
}

void Sacar(Conta c, decimal valor) {
    c.Saldo -= valor;   // modifica o objeto original
}

var minha = new Conta { Saldo = 1000 };
Sacar(minha, 200);
Console.WriteLine(minha.Saldo); // 800`}</code></pre>

      <AlertBox type="info" title="Garbage Collector em uma frase">
        O GC roda automaticamente e libera objetos do heap quando nenhuma variável aponta mais para eles. Você não precisa chamar <code>delete</code> nem <code>free</code> — diferente de C/C++.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong><code>NullReferenceException</code>:</strong> tentar usar variável que ainda é <code>null</code>. Sempre cheque com <code>?.</code> ou <code>if (x is not null)</code>.</li>
        <li><strong>Modificar uma lista compartilhada sem perceber:</strong> dois métodos guardando referência à mesma <code>List&lt;T&gt;</code>. Documente bem ou clone antes de passar.</li>
        <li><strong>Esperar que <code>==</code> compare conteúdo em classes próprias:</strong> compare via <code>Equals</code> sobrescrito ou use <code>record</code>.</li>
        <li><strong>Confundir array de struct com array por valor:</strong> o array é referência mesmo que seus elementos sejam tipo por valor.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Tipos por referência vivem no heap; a variável é só o "endereço".</li>
        <li>Atribuir uma referência copia o ponteiro — ambos enxergam o mesmo objeto.</li>
        <li><code>null</code> é a ausência de referência; acessá-la lança <code>NullReferenceException</code>.</li>
        <li><code>==</code> e <code>Equals</code> podem comparar referência ou conteúdo, dependendo do tipo.</li>
        <li><code>ReferenceEquals</code> garante comparação de endereços, ignorando sobrescritas.</li>
        <li><code>string</code> é referência, mas imutável e com <code>==</code> que compara texto.</li>
      </ul>
    </PageContainer>
  );
}
