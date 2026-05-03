import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function RefStruct() {
  return (
    <PageContainer
      title={"ref struct"}
      subtitle={"Struct que só pode viver na stack. Span é assim."}
      difficulty={"avancado"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public ref struct Buffer
{
    public Span<byte> Dados;
    public int Pos;

    public void Escrever(byte b) => Dados[Pos++] = b;
}

// Não pode:
// - ser campo de classe/struct comum
// - ir pra heap
// - ser usado em iterator (yield)
// - ser usado em async`}
      />

      <AlertBox type="info" title={"Pra que serve"}>
        <p>Garantir que tipos como Span/ReadOnlySpan/ValueStringBuilder não vazem pro heap acidentalmente.</p>
      </AlertBox>
    </PageContainer>
  );
}
