import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Heranca() {
  return (
    <PageContainer
      title={"Herança"}
      subtitle={"class Filha : Pai. Single inheritance, mas múltiplas interfaces."}
      difficulty={"iniciante"}
      timeToRead={"7 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public class Animal
{
    public string Nome { get; set; } = "";
    public virtual string Som() => "...";
}

public class Cachorro : Animal
{
    public override string Som() => "Au!";
}

public class Cao : Cachorro
{
    public Cao() { Nome = "Cão"; }
    public override string Som() => "AU AU!";
}

Animal a = new Cachorro { Nome = "Rex" };
Console.WriteLine(a.Som());   // "Au!" (despacho dinâmico)`}
      />

      <h2>base</h2>

      <CodeBlock
        language="csharp"
        code={`public class Filho : Pai
{
    public Filho(string nome) : base(nome) { }
    public override void Falar()
    {
        base.Falar();           // chama do pai
        Console.WriteLine("e mais um pouco");
    }
}`}
      />

      <AlertBox type="warning" title={"Single inheritance"}>
        <p>C# permite herdar de UMA classe, mas implementar VÁRIAS interfaces. Foi escolha consciente pra evitar diamond problem.</p>
      </AlertBox>
    </PageContainer>
  );
}
