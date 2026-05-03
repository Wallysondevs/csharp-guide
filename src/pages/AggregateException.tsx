import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function AggregateException() {
  return (
    <PageContainer
      title={"AggregateException e InnerExceptions"}
      subtitle={"Quando WhenAll falha em vários lados ao mesmo tempo."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`try { await Task.WhenAll(t1, t2, t3); }
catch (Exception)
{
    // await re-joga só a PRIMEIRA exceção
    // pra ver todas:
    var aggregated = Task.WhenAll(t1, t2, t3);
    try { await aggregated; }
    catch
    {
        foreach (var e in aggregated.Exception!.InnerExceptions)
            Console.WriteLine(e.Message);
    }
}`}
      />
    </PageContainer>
  );
}
