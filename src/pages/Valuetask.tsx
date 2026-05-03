import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Valuetask() {
  return (
    <PageContainer
      title={"ValueTask<T>"}
      subtitle={"Otimização: evita alocação de Task quando o resultado é síncrono."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public ValueTask<int> ObterAsync(int id)
{
    if (_cache.TryGetValue(id, out var v))
        return new ValueTask<int>(v);   // sem alocar Task
    return new ValueTask<int>(BuscarDoBancoAsync(id));
}`}
      />

      <AlertBox type="warning" title={"Não consuma duas vezes"}>
        <p>ValueTask só pode ser awaited UMA vez. Se precisar reusar, converta com <code>.AsTask()</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
