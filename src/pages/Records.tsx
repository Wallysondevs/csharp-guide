import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Records() {
  return (
    <PageContainer
      title={"Records (C# 9+)"}
      subtitle={"Tipo de referência (ou value, com record struct) com value-equality, with-expressions e ToString automático."}
      difficulty={"intermediario"}
      timeToRead={"7 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// posicional
public record Pessoa(string Nome, int Idade);

var p1 = new Pessoa("Ana", 30);
var p2 = new Pessoa("Ana", 30);
Console.WriteLine(p1 == p2);   // true (compara por valor!)

// with-expression
var p3 = p1 with { Idade = 31 };

// ToString automático
Console.WriteLine(p1);   // Pessoa { Nome = Ana, Idade = 30 }

// deconstruct
var (n, i) = p1;`}
      />

      <h2>record vs class</h2>

      <ul>
        <li><code>record</code> compara por <strong>valor</strong> (todos os campos públicos).</li>
        <li>Class compara por <strong>referência</strong> (mesma instância).</li>
        <li>Record é imutável por padrão (init-only).</li>
        <li>Record gera <code>Equals</code>, <code>GetHashCode</code>, <code>ToString</code>, deconstructor automaticamente.</li>
      </ul>

      <h2>record struct (C# 10)</h2>

      <CodeBlock
        language="csharp"
        code={`public readonly record struct Ponto(double X, double Y);
// value type, sem alocação no heap, ainda com ==/with`}
      />

      <AlertBox type="success" title={"DTO ideal"}>
        <p>Records são perfeitos pra DTOs, eventos de domínio, configurações, qualquer dado imutável.</p>
      </AlertBox>
    </PageContainer>
  );
}
