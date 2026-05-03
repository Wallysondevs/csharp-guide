import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function NullableValue() {
  return (
    <PageContainer
      title={"Nullable Value Types"}
      subtitle={"int? é açúcar pra Nullable&lt;int&gt;. HasValue, Value e os truques."}
      difficulty={"iniciante"}
      timeToRead={"6 min"}
    >
      <h2>A sintaxe</h2>

      <CodeBlock
        language="csharp"
        code={`int? idade = null;
idade = 30;

if (idade.HasValue)
    Console.WriteLine(idade.Value);

int x = idade ?? -1;     // null-coalescing`}
      />

      <h2>Por baixo do capô</h2>

      <p><code>int?</code> é o struct <code>Nullable&lt;int&gt;</code>: tem dois campos — <code>HasValue</code> (bool) e <code>value</code> (T). Não vira <code>object</code>, não faz boxing por ser nullable.</p>

      <CodeBlock
        language="csharp"
        code={`Nullable<int> n = 42;     // mesmo que int? n = 42;`}
      />

      <h2>Operações</h2>

      <CodeBlock
        language="csharp"
        code={`int? a = 10, b = null;
int? soma = a + b;        // null (qualquer operação com null = null)
bool? eh = a > b;         // null

// GetValueOrDefault
int v = b.GetValueOrDefault(0);  // 0
int w = b.GetValueOrDefault();   // 0 (default de int)`}
      />
    </PageContainer>
  );
}
