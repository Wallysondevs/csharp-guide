import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IasyncEnumerable() {
  return (
    <PageContainer
      title={"IAsyncEnumerable<T>"}
      subtitle={"Streaming async. await foreach em fonte que produz dados aos poucos."}
      difficulty={"avancado"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public async IAsyncEnumerable<string> LerLinhasAsync(
    string path,
    [EnumeratorCancellation] CancellationToken ct = default)
{
    using var sr = new StreamReader(path);
    string? linha;
    while ((linha = await sr.ReadLineAsync(ct)) != null)
    {
        yield return linha;
    }
}

// consumir
await foreach (var linha in LerLinhasAsync("dados.txt"))
{
    Console.WriteLine(linha);
}`}
      />

      <AlertBox type="success" title={"Memória constante"}>
        <p>Diferente de <code>Task&lt;List&lt;T&gt;&gt;</code>, IAsyncEnumerable não carrega tudo na memória. Ideal pra arquivos gigantes ou streams de DB.</p>
      </AlertBox>
    </PageContainer>
  );
}
