import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function IdisposableUsing() {
  return (
    <PageContainer
      title={"IDisposable e using"}
      subtitle={"Liberação determinística de recursos não gerenciados (arquivos, sockets, conexões)."}
      difficulty={"iniciante"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`using (var sr = new StreamReader("a.txt"))
{
    string conteudo = sr.ReadToEnd();
}   // Dispose chamado aqui

// using declaration (C# 8+)
using var sr2 = new StreamReader("b.txt");
// Dispose ao sair do escopo`}
      />

      <h2>Implementando</h2>

      <CodeBlock
        language="csharp"
        code={`public class Conexao : IDisposable
{
    private bool _disposed;

    public void Dispose()
    {
        if (_disposed) return;
        // libera recursos
        _disposed = true;
        GC.SuppressFinalize(this);
    }
}

// IAsyncDisposable
public class ConexaoAsync : IAsyncDisposable
{
    public async ValueTask DisposeAsync()
    {
        await CloseConnectionAsync();
    }
}

await using var conn = new ConexaoAsync();`}
      />
    </PageContainer>
  );
}
