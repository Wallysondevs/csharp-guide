import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StructVsClass() {
  return (
    <PageContainer
      title={"struct vs class"}
      subtitle={"Quando usar cada um. Pegadinhas de mutabilidade e cópia."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <h2>Diferenças fundamentais</h2>

      <ul>
        <li><code>class</code>: reference type, vive no heap, copy-by-reference, herança permitida.</li>
        <li><code>struct</code>: value type, vive na stack ou inline, copy-by-value, sem herança (só interfaces).</li>
      </ul>

      <CodeBlock
        language="csharp"
        code={`public struct Ponto
{
    public int X, Y;
    public Ponto(int x, int y) { X = x; Y = y; }
}

Ponto a = new(1, 2);
Ponto b = a;     // cópia!
b.X = 99;
// a.X == 1 (independente)`}
      />

      <h2>Quando usar struct</h2>

      <ul>
        <li>Tipo pequeno (≤ 16 bytes idealmente).</li>
        <li>Imutável.</li>
        <li>Sem identidade — só dados.</li>
        <li>Não vai ser boxed/unboxed com frequência.</li>
      </ul>

      <h2>readonly struct e ref struct</h2>

      <CodeBlock
        language="csharp"
        code={`public readonly struct Vec3
{
    public readonly float X, Y, Z;
    public Vec3(float x, float y, float z) => (X, Y, Z) = (x, y, z);
}

public ref struct Buffer    // só vive na stack
{
    public Span<byte> Dados;
}`}
      />

      <AlertBox type="warning" title={"Struct mutável é pegadinha"}>
        <p>Modificar propriedade de struct dentro de coleção/loop pode falhar silenciosamente — você modifica a cópia, não o original. Quase sempre faça <code>readonly struct</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
