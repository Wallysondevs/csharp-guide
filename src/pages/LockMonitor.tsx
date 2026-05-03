import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LockMonitor() {
  return (
    <PageContainer
      title={"lock e Monitor"}
      subtitle={"Exclusão mútua básica. lock(obj) é açúcar pra Monitor.Enter/Exit."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public class Contador
{
    private readonly object _lock = new();
    private int _valor;

    public void Incrementar()
    {
        lock (_lock) { _valor++; }
    }

    public int Valor
    {
        get { lock (_lock) return _valor; }
    }
}`}
      />

      <AlertBox type="warning" title={"Não locke em this nem em string"}>
        <p>Outro código pode lockar no mesmo objeto. Use sempre um campo privado <code>readonly object _lock = new()</code>.</p>
      </AlertBox>

      <h2>Lock (C# 13)</h2>

      <CodeBlock
        language="csharp"
        code={`// .NET 9 / C# 13 traz tipo dedicado System.Threading.Lock
private readonly Lock _lk = new();
lock (_lk) { ... }`}
      />
    </PageContainer>
  );
}
