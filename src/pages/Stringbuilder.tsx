import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Stringbuilder() {
  return (
    <PageContainer
      title="StringBuilder: concatenando strings sem desperdiçar memória"
      subtitle="Por que somar strings com + dentro de loops é um desastre — e como o StringBuilder resolve isso elegantemente."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Imagine que você está montando um texto longo letra por letra. Em C#, escrever <code>texto = texto + "a"</code> mil vezes parece inocente — mas escondidamente cria <strong>mil strings novas</strong> na memória, descartando todas exceto a última. Para textos pequenos isso não importa; para milhares de concatenações, vira um gargalo absurdo. A solução é <code>StringBuilder</code>, uma classe especialmente projetada para construir texto <em>passo a passo</em> sem alocar lixo. Pense num caderno em branco onde você só escreve no final — em vez de arrancar a página e copiar tudo de novo a cada palavra.
      </p>

      <h2>Por que strings são "imutáveis"?</h2>
      <p>
        No .NET, todo objeto <code>string</code> é <strong>imutável</strong>: uma vez criada, a memória que ela ocupa nunca muda. Quando você faz <code>s = s + "x"</code>, o runtime aloca uma <em>nova</em> string com o conteúdo somado e a antiga vira lixo (a ser coletado pelo GC). Isso é uma decisão de design que torna strings seguras para compartilhar entre threads, mas paga um preço alto em manipulação intensiva.
      </p>
      <pre><code>{`string s = "Olá";
s = s + " mundo";
// Existem agora 2 strings na memória:
//   "Olá"        ← a antiga, lixo
//   "Olá mundo"  ← a nova, apontada por s`}</code></pre>

      <h2>O experimento que prova a diferença</h2>
      <p>
        Vamos comparar concatenação ingênua com <code>StringBuilder</code> em um loop de 50 mil iterações. A diferença chega a <strong>mil vezes</strong> em tempo:
      </p>
      <pre><code>{`using System.Diagnostics;
using System.Text;

const int N = 50_000;

// Versão ingênua — cria 50.000 strings descartáveis
var sw1 = Stopwatch.StartNew();
string ruim = "";
for (int i = 0; i < N; i++)
    ruim += i;
sw1.Stop();
Console.WriteLine($"+= : {sw1.ElapsedMilliseconds} ms");

// Versão com StringBuilder — buffer mutável
var sw2 = Stopwatch.StartNew();
var sb = new StringBuilder();
for (int i = 0; i < N; i++)
    sb.Append(i);
string bom = sb.ToString();
sw2.Stop();
Console.WriteLine($"SB : {sw2.ElapsedMilliseconds} ms");

// Saída típica:
// += : ~7000 ms
// SB : ~5 ms`}</code></pre>

      <AlertBox type="warning" title="Quando NÃO usar StringBuilder">
        Para 2 ou 3 concatenações simples (<code>"Olá " + nome + "!"</code>), o compilador <em>já</em> usa <code>String.Concat</code> otimizado. Não troque por StringBuilder — código fica mais feio sem ganho. Use SB quando: tem loop, ou monta texto em vários métodos, ou são mais de ~10 concatenações.
      </AlertBox>

      <h2>Os principais métodos</h2>
      <p>
        <code>StringBuilder</code> é uma "string escrevível". Você acrescenta no final com <code>Append</code>, e ao terminar chama <code>ToString()</code> uma única vez para fixar o resultado.
      </p>
      <pre><code>{`var sb = new StringBuilder();

sb.Append("Olá ");                         // texto puro
sb.Append(42);                              // qualquer ToString
sb.AppendLine();                            // adiciona \\n
sb.AppendLine("Linha 2");                   // texto + \\n
sb.AppendFormat("Total: {0:C}", 99.5m);    // formatação

// Manipulação posicional:
sb.Insert(0, ">>> ");                       // insere no início
sb.Replace("Olá", "Oi");                    // substitui
sb.Remove(0, 4);                            // remove 4 chars do início

// Acesso e tamanho:
char primeiro = sb[0];                      // indexação
int  tam      = sb.Length;
sb.Length     = 5;                          // trunca

string final = sb.ToString();               // congela em string`}</code></pre>

      <h2>Capacidade inicial: um detalhe que economiza alocações</h2>
      <p>
        Internamente, o SB mantém um buffer de caracteres. Quando o buffer enche, ele <em>dobra</em> de tamanho (alocando um novo array e copiando). Se você sabe quanto vai escrever, passe a <strong>capacidade</strong> no construtor para evitar redimensionamentos.
      </p>
      <pre><code>{`// Sem capacidade: começa com 16, vai dobrando: 16→32→64→128…→8192
var sb1 = new StringBuilder();

// Com capacidade: aloca 10 mil chars de cara, sem redimensionar
var sb2 = new StringBuilder(capacity: 10_000);

// Ainda dá para definir um teto máximo:
var sb3 = new StringBuilder(capacity: 100, maxCapacity: 500);
// Ultrapassar maxCapacity lança ArgumentOutOfRangeException`}</code></pre>

      <h2>Encadeamento (fluent)</h2>
      <p>
        Quase todos os métodos de <code>StringBuilder</code> retornam o próprio SB, permitindo encadeamento estilo "fluent". Útil para construir blocos de texto inteiros em uma só expressão.
      </p>
      <pre><code>{`string html = new StringBuilder()
    .Append("<ul>")
    .AppendLine()
    .AppendFormat("  <li>{0}</li>", "Item A").AppendLine()
    .AppendFormat("  <li>{0}</li>", "Item B").AppendLine()
    .Append("</ul>")
    .ToString();`}</code></pre>

      <h2>Quando o compilador faz o trabalho por você</h2>
      <p>
        Em interpolação simples (<code>$"Oi {`{nome}`}"</code>), versões modernas do .NET (6+) usam internamente um tipo otimizado chamado <code>DefaultInterpolatedStringHandler</code>, que trabalha de forma muito parecida com SB nos bastidores. Por isso, em 95% dos casos do dia-a-dia, basta interpolação. Reserve SB para os outros 5% (loops, IO de texto, geração de relatórios).
      </p>

      <AlertBox type="info" title="StringBuilder e Span">
        Em código de altíssimo desempenho, <code>StringBuilder</code> ainda aloca um array. Para zero-alocação, há alternativas como <code>string.Create</code> com <code>Span&lt;char&gt;</code>. Mas isso é tema avançado — comece com SB e só evolua se profiler mostrar gargalo.
      </AlertBox>

      <h2>Pequeno truque: AppendJoin</h2>
      <p>
        Em vez de <code>foreach</code>+<code>Append</code>+separador manual, existe <code>AppendJoin</code> — análogo a <code>string.Join</code> mas direto no SB:
      </p>
      <pre><code>{`var sb = new StringBuilder("Frutas: ");
sb.AppendJoin(", ", new[] { "maçã", "pera", "uva" });
// → "Frutas: maçã, pera, uva"`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>ToString()</code></strong> e passar o <code>StringBuilder</code> direto a um método que espera <code>string</code> — não compila.</li>
        <li><strong>Reusar SB sem limpar</strong> — para reaproveitar, faça <code>sb.Clear()</code> (não desaloca o buffer; só zera o tamanho).</li>
        <li><strong>Trocar <code>+</code> por SB em concatenações pequenas</strong> — é um pessimismo prematuro; código fica feio sem benefício.</li>
        <li><strong>Modificar a string retornada</strong> — não dá: <code>ToString()</code> devolve uma string normal e imutável.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Strings em C# são imutáveis: <code>+</code> aloca uma nova a cada vez.</li>
        <li><code>StringBuilder</code> é um buffer de caracteres mutável e crescente.</li>
        <li>Use SB em loops e construções de texto longas; ignore-o em concatenações triviais.</li>
        <li>Métodos principais: <code>Append</code>, <code>AppendLine</code>, <code>AppendFormat</code>, <code>Insert</code>, <code>Replace</code>, <code>Remove</code>.</li>
        <li>Defina <code>capacity</code> inicial quando souber o tamanho aproximado.</li>
        <li>Termine sempre chamando <code>ToString()</code> para obter a string final.</li>
      </ul>
    </PageContainer>
  );
}
