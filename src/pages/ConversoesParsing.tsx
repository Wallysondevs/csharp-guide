import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function ConversoesParsing() {
  return (
    <PageContainer
      title={"Conversões e Parsing"}
      subtitle={"Cast, as, is, Convert, Parse, TryParse — qual usar e quando."}
      difficulty={"iniciante"}
      timeToRead={"7 min"}
    >
      <h2>Cast explícito</h2>

      <CodeBlock
        language="csharp"
        code={`double d = 3.7;
int i = (int)d;          // 3 (trunca, não arredonda)

// Pode estourar — InvalidCastException
object o = "texto";
int n = (int)o;          // crash em runtime`}
      />

      <h2>as e is</h2>

      <CodeBlock
        language="csharp"
        code={`object o = "olá";

if (o is string s)        // pattern matching
    Console.WriteLine(s.Length);

string? s2 = o as string; // retorna null se não for
if (s2 != null) { ... }`}
      />

      <h2>Convert e Parse</h2>

      <CodeBlock
        language="csharp"
        code={`int n = int.Parse("42");
int m = Convert.ToInt32("42");

// TryParse — não joga exceção
if (int.TryParse(input, out int valor))
    Console.WriteLine(valor);
else
    Console.WriteLine("não é número");

// Com cultura
double d = double.Parse("3,14", new CultureInfo("pt-BR"));`}
      />

      <h2>Diferenças importantes</h2>

      <ul>
        <li><code>(int)null</code> em <code>object</code> → <code>NullReferenceException</code>.</li>
        <li><code>Convert.ToInt32(null)</code> → 0.</li>
        <li><code>int.Parse(null)</code> → <code>ArgumentNullException</code>.</li>
        <li>Use <code>TryParse</code> sempre que o input vier de usuário/arquivo.</li>
      </ul>
    </PageContainer>
  );
}
