import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Structs() {
  return (
    <PageContainer
      title="Structs: tipos por valor sob medida"
      subtitle="Entenda quando e por que criar seus próprios value types — e os ganhos (e armadilhas) de performance que vêm junto."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Em C#, quando você cria uma <code>class</code>, está criando um <strong>tipo por referência</strong>: as variáveis guardam um "endereço" para o objeto, e o objeto vive no <em>heap</em> (uma área de memória administrada pelo coletor de lixo). Já uma <strong>struct</strong> é um <strong>tipo por valor</strong>: a variável carrega o conteúdo inteiro consigo, normalmente vivendo no <em>stack</em> (uma pilha de memória rápida e descartada automaticamente). Pense numa class como o número de uma casa (você passa o endereço para todo mundo), e numa struct como uma cópia da planta da casa entregue em mãos.
      </p>

      <h2>Declarando uma struct</h2>
      <p>
        A sintaxe é quase idêntica à de uma classe — basta trocar <code>class</code> por <code>struct</code>. Structs típicas representam valores pequenos e indivisíveis: pontos no plano, dimensões, dinheiro, cor RGB, datas customizadas.
      </p>
      <pre><code>{`// Uma struct simples representando um ponto 2D
public struct Ponto {
    public double X;
    public double Y;

    public Ponto(double x, double y) {
        X = x;
        Y = y;
    }

    public double DistanciaDaOrigem() => Math.Sqrt(X * X + Y * Y);

    public override string ToString() => $"({X}, {Y})";
}

class Programa {
    static void Main() {
        var p = new Ponto(3, 4);
        Console.WriteLine(p);                        // (3, 4)
        Console.WriteLine(p.DistanciaDaOrigem());    // 5
    }
}`}</code></pre>
      <p>
        Tudo o que você sabe sobre métodos, propriedades e construtores em classes vale para structs. Mas há diferenças sutis e importantes que mudam o comportamento na prática.
      </p>

      <h2>Cópia de valor — a maior diferença</h2>
      <p>
        Atribuir uma struct a outra variável <strong>copia o conteúdo inteiro</strong>. Modificar a cópia <em>não</em> afeta o original. Com classes, ao contrário, você apenas copia o endereço — duas variáveis apontam para o mesmo objeto, e mexer numa "vê" a mudança na outra.
      </p>
      <pre><code>{`var a = new Ponto(1, 1);
var b = a;          // cópia COMPLETA
b.X = 99;
Console.WriteLine(a.X);  // 1  — a não mudou
Console.WriteLine(b.X);  // 99

// Mesmo princípio ao passar para método:
void Mover(Ponto p) { p.X = 0; }   // p é uma cópia local
Mover(a);
Console.WriteLine(a.X);  // ainda 1!`}</code></pre>
      <p>
        Para <em>realmente</em> mexer no original, é preciso usar <code>ref</code> (passar por referência) ou tornar a struct mutável e devolver uma nova versão. Por isso, na prática, se você quer compartilhar e mutar, usa class; se quer um valor isolado e seguro, usa struct.
      </p>

      <AlertBox type="warning" title="Structs mutáveis são perigosas">
        Quando você expõe uma struct via propriedade (<code>public Ponto Pos {`{ get; }`}</code>), <code>obj.Pos.X = 5;</code> modifica uma <em>cópia temporária</em> e o C# avisa com erro. Para evitar bugs, declare suas structs como <strong>readonly struct</strong> e prefira métodos que devolvem novas instâncias.
      </AlertBox>

      <h2>Structs não suportam herança</h2>
      <p>
        Você não pode escrever <code>struct PontoColorido : Ponto</code>. Structs sempre herdam de <code>System.ValueType</code> (que herda de <code>object</code>) e ponto. Isso não é arbitrário: o tamanho de um value type precisa ser conhecido em tempo de compilação para poder ser alocado no stack, e herança quebraria essa garantia. Ainda assim, structs <em>podem</em> implementar <strong>interfaces</strong>, o que dá a flexibilidade necessária para a maioria dos casos.
      </p>
      <pre><code>{`public interface IFigura {
    double Area();
}

public readonly struct Circulo : IFigura {
    public double Raio { get; }
    public Circulo(double raio) => Raio = raio;
    public double Area() => Math.PI * Raio * Raio;
}`}</code></pre>

      <h2><code>readonly struct</code> e <code>readonly</code> em membros</h2>
      <p>
        Marcar a struct como <code>readonly</code> diz ao compilador: "nenhum membro vai modificar o estado". Isso permite otimizações (não é preciso copiar a struct ao chamar métodos), evita os bugs de mutabilidade descritos acima e documenta a intenção. Você também pode marcar métodos individuais com <code>readonly</code> para liberar a otimização em structs mutáveis.
      </p>
      <pre><code>{`public readonly struct Dinheiro {
    public decimal Valor { get; }
    public string Moeda { get; }

    public Dinheiro(decimal valor, string moeda) {
        Valor = valor;
        Moeda = moeda;
    }

    // "Operações" devolvem NOVAS instâncias, nunca mutam
    public Dinheiro MaisJuros(decimal taxa)
        => new Dinheiro(Valor * (1 + taxa), Moeda);
}`}</code></pre>

      <h2><code>ref struct</code>: o caso especial do Span&lt;T&gt;</h2>
      <p>
        Há uma variante poderosa chamada <code>ref struct</code>. Ela tem uma regra extra: <strong>nunca</strong> pode ir para o heap. Não pode ser campo de classe, não pode ser <em>boxed</em>, não pode ser capturada por <em>lambda</em>, não pode entrar em coleção. Em troca, recebe garantias de tempo de vida que permitem coisas como <code>Span&lt;T&gt;</code> — uma "fatia" de memória contígua (array, stack, memória nativa) sem alocação extra.
      </p>
      <pre><code>{`// Span<T> é um ref struct: aponta para uma região de memória
Span<int> numeros = stackalloc int[5] { 10, 20, 30, 40, 50 };
foreach (var n in numeros) Console.Write(n + " ");

// Slicing sem alocar nada novo
Span<int> meio = numeros.Slice(1, 3);   // {20, 30, 40}
meio[0] = 999;
Console.WriteLine(numeros[1]);          // 999 — mesma memória!`}</code></pre>
      <p>
        Você raramente <em>declara</em> seus próprios <code>ref struct</code>, mas usa <code>Span&lt;T&gt;</code> e <code>ReadOnlySpan&lt;T&gt;</code> o tempo todo em código de alta performance — análise de strings, parsing binário, manipulação de buffers.
      </p>

      <h2>Quando usar struct em vez de class</h2>
      <p>
        Não saia transformando suas classes em structs achando que vai ganhar performance — você pode acabar piorando, porque cópias grandes de valor custam caro. A regra prática (vinda do guia oficial da Microsoft) sugere usar <code>struct</code> quando <strong>todas</strong> as condições abaixo são verdadeiras:
      </p>
      <ul>
        <li>O tipo representa logicamente um <em>valor único</em> (como <code>int</code>, <code>DateTime</code>).</li>
        <li>É <strong>pequeno</strong> — geralmente até 16 bytes (mais ou menos 2 ponteiros).</li>
        <li>É <strong>imutável</strong>.</li>
        <li>Não será frequentemente <em>boxed</em> (tratado como <code>object</code>).</li>
      </ul>
      <p>
        Se algum desses não vale, prefira <code>class</code> ou <code>record class</code>.
      </p>

      <AlertBox type="info" title="Performance: o trade-off real">
        Structs evitam alocação no heap (menos pressão sobre o coletor de lixo), mas pagam o custo de cópia em cada atribuição/passagem de parâmetro. Para tipos &gt; 16 bytes, passar por <code>in</code> ou <code>ref readonly</code> elimina a cópia mantendo a semântica de valor.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar herdar de uma struct:</strong> impossível. Use composição ou interfaces.</li>
        <li><strong>Mutar struct via propriedade:</strong> <code>cliente.Endereco.Cep = "..."</code> compila se Endereco for class, mas falha (ou modifica cópia) se for struct.</li>
        <li><strong>Struct grande passada várias vezes:</strong> cada chamada copia tudo. Use <code>in</code> para passar por referência somente-leitura.</li>
        <li><strong>Struct em <code>List&lt;T&gt;</code> e tentar editar via indexador:</strong> <code>lista[0].X = 5;</code> dá erro porque o indexador devolve cópia.</li>
        <li><strong>Boxing acidental:</strong> atribuir uma struct a uma variável <code>object</code> ou interface aloca no heap silenciosamente — perde-se a vantagem de valor.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Structs são tipos por valor: copiadas inteiras a cada atribuição.</li>
        <li>Não suportam herança, mas implementam interfaces.</li>
        <li>Prefira <code>readonly struct</code> e devolva novas instâncias em vez de mutar.</li>
        <li><code>ref struct</code> garante stack-only e habilita <code>Span&lt;T&gt;</code> de alta performance.</li>
        <li>Use struct quando o tipo é pequeno, imutável e representa um valor lógico único.</li>
        <li>Para evitar cópias caras de structs grandes, passe por <code>in</code> ou <code>ref readonly</code>.</li>
      </ul>
    </PageContainer>
  );
}
