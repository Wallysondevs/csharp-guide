import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Variance() {
  return (
    <PageContainer
      title={"Covariance e Contravariance"}
      subtitle={"in / out em interfaces e delegates. Por que IEnumerable&lt;Animal&gt; aceita IEnumerable&lt;Cachorro&gt;."}
      difficulty={"avancado"}
      timeToRead={"6 min"}
    >
      <h2>Covariance (out)</h2>

      <CodeBlock
        language="csharp"
        code={`public interface IProdutor<out T>
{
    T Obter();
}
class CachorroProd : IProdutor<Cachorro> { ... }

IProdutor<Animal> a = new CachorroProd();   // ok, covariante`}
      />

      <h2>Contravariance (in)</h2>

      <CodeBlock
        language="csharp"
        code={`public interface IConsumidor<in T>
{
    void Consumir(T item);
}
class AnimalCons : IConsumidor<Animal> { ... }

IConsumidor<Cachorro> c = new AnimalCons();   // ok, contravariante`}
      />

      <AlertBox type="info" title={"Quem é variante na BCL"}>
        <p><code>IEnumerable&lt;out T&gt;</code>, <code>Func&lt;in T, out R&gt;</code>, <code>Action&lt;in T&gt;</code>. <code>List&lt;T&gt;</code> NÃO é (porque tanto lê quanto escreve T).</p>
      </AlertBox>
    </PageContainer>
  );
}
