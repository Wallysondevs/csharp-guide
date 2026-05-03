import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GenericMethods() {
  return (
    <PageContainer
      title={"Métodos genéricos avançados"}
      subtitle={"Inferência, restrições combinadas, e quando o compilador erra na inferência."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public static IEnumerable<TResult> Map<T, TResult>(
    IEnumerable<T> source, Func<T, TResult> selector)
{
    foreach (var x in source) yield return selector(x);
}

var nums = new[] { 1, 2, 3 };
var dobros = Map(nums, x => x * 2);   // T inferido int, TResult inferido int

// Quando o compilador não infere — passe explícito
var r = Map<int, string>(nums, x => x.ToString());`}
      />

      <AlertBox type="warning" title={"Inferência só por argumentos"}>
        <p>C# infere T pelos argumentos do método, NÃO pelo retorno esperado. Isso difere do F# e às vezes força você a anotar.</p>
      </AlertBox>
    </PageContainer>
  );
}
