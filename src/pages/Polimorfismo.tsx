import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Polimorfismo() {
  return (
    <PageContainer
      title={"Polimorfismo"}
      subtitle={"virtual / override / new / abstract. Despacho dinâmico vs estático."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public class Forma
{
    public virtual double Area() => 0;
}

public class Circulo : Forma
{
    public double Raio { get; set; }
    public override double Area() => Math.PI * Raio * Raio;
}

public class Quadrado : Forma
{
    public double Lado { get; set; }
    public override double Area() => Lado * Lado;
}

Forma[] formas = { new Circulo { Raio = 1 }, new Quadrado { Lado = 2 } };
double total = formas.Sum(f => f.Area());`}
      />

      <h2>new (esconde, não sobrescreve)</h2>

      <CodeBlock
        language="csharp"
        code={`public class A { public void M() => Console.WriteLine("A"); }
public class B : A { public new void M() => Console.WriteLine("B"); }

A a = new B();
a.M();   // "A" — método não é virtual, despacho estático
((B)a).M();  // "B"`}
      />

      <AlertBox type="warning" title={"new é confuso"}>
        <p>Use <code>new</code> só quando precisa esconder método não-virtual de classe-base. Em código novo, prefira <code>virtual/override</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
