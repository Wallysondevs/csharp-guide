import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Trimming() {
  return (
    <PageContainer
      title={"Trimming"}
      subtitle={"Remover código não usado. App size cai pela metade."}
      difficulty={"avancado"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="xml"
        code={`<PropertyGroup>
  <PublishTrimmed>true</PublishTrimmed>
  <TrimMode>full</TrimMode>
</PropertyGroup>`}
      />

      <p>Static analysis remove tipos/métodos não referenciados. Reflection quebra silenciosamente — anote com <code>[DynamicallyAccessedMembers]</code> ou desligue trim pra esses tipos.</p>
    </PageContainer>
  );
}
