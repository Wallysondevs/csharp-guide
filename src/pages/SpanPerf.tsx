import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SpanPerf() {
  return (
    <PageContainer
      title={"Span<T> em performance"}
      subtitle={"Parsing zero-alocação, fatiar strings sem Substring, ler arquivos rápido."}
      difficulty={"avancado"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// Antes: alocava 3 substrings + array
string[] partes = "a,b,c".Split(',');

// Depois: zero alocação
ReadOnlySpan<char> texto = "a,b,c";
foreach (var range in texto.Split(','))
{
    ReadOnlySpan<char> parte = texto[range];
    // ...
}

// Parsing direto de Span
ReadOnlySpan<char> n = "12345";
int x = int.Parse(n);     // não cria string`}
      />

      <AlertBox type="success" title={"10x mais rápido"}>
        <p>Em microbenchmarks de parsing, ler com Span pode ser 5-20x mais rápido por evitar GC.</p>
      </AlertBox>
    </PageContainer>
  );
}
