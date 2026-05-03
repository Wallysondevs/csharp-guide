import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AbstractSealed() {
  return (
    <PageContainer
      title={"abstract, virtual, sealed"}
      subtitle={"Quem pode ser estendido, quem deve, quem não pode mais."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <h2>abstract</h2>

      <CodeBlock
        language="csharp"
        code={`public abstract class Veiculo
{
    public abstract void Mover();        // sem corpo, obrigatório implementar
    public virtual void Buzinar() => Console.WriteLine("Bi");
}

// Não compila: new Veiculo();
public class Carro : Veiculo
{
    public override void Mover() => Console.WriteLine("Vrum");
}`}
      />

      <h2>sealed</h2>

      <CodeBlock
        language="csharp"
        code={`public sealed class Final { }       // ninguém herda
public class Base
{
    public sealed override void X() { }  // ninguém sobrescreve
}`}
      />

      <AlertBox type="success" title={"Sealed por padrão"}>
        <p>Em DDD/Clean Code, muitos preferem deixar classes <code>sealed</code> por padrão e só abrir quando há razão clara. Reduz bugs de override mal pensado.</p>
      </AlertBox>
    </PageContainer>
  );
}
