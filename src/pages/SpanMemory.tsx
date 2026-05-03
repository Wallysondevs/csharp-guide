import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SpanMemory() {
  return (
    <PageContainer
      title={"Span<T> e Memory<T>"}
      subtitle={"Janela tipada e segura sobre memória, sem copiar. Mudou jeito de fazer parsing rápido em C#."}
      difficulty={"avancado"}
      timeToRead={"8 min"}
    >
      <h2>O que é Span</h2>

      <p><code>Span&lt;T&gt;</code> é uma "view" sobre uma região contígua de memória — pode apontar pra array, stackalloc ou memória nativa. É um <code>ref struct</code>: vive na stack e não pode escapar (não pode ser campo de classe, não pode ser usado em async).</p>

      <CodeBlock
        language="csharp"
        code={`int[] v = { 1, 2, 3, 4, 5 };
Span<int> span = v.AsSpan(1, 3);  // {2,3,4}
span[0] = 99;
// v = {1, 99, 3, 4, 5}

// Slice sem alocar
ReadOnlySpan<char> s = "Olá, mundo";
ReadOnlySpan<char> ola = s[..3];   // "Olá"
ReadOnlySpan<char> mundo = s[5..]; // "mundo"`}
      />

      <h2>stackalloc + Span</h2>

      <CodeBlock
        language="csharp"
        code={`Span<int> buffer = stackalloc int[64];
for (int i = 0; i < buffer.Length; i++)
    buffer[i] = i * i;
// Sem GC, vive só na função.`}
      />

      <h2>Memory&lt;T&gt;: Span pra async</h2>

      <p>Span não pode atravessar await. <code>Memory&lt;T&gt;</code> sim — é um wrapper que aloca no heap mas dá um Span quando você precisa.</p>

      <CodeBlock
        language="csharp"
        code={`async Task Processar(Memory<byte> buf)
{
    await stream.ReadAsync(buf);
    Span<byte> view = buf.Span;   // converte temporariamente
}`}
      />

      <AlertBox type="warning" title={"Não escapar"}>
        <p>Span apontando pra <code>stackalloc</code> não pode ser retornado da função — frame morre. Compilador detecta a maioria dos casos, mas com pointers/unsafe você se vira.</p>
      </AlertBox>
    </PageContainer>
  );
}
