import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Fluentassertions() {
  return (
    <PageContainer
      title={"FluentAssertions"}
      subtitle={"Asserts que leem como inglês e dão mensagens de erro detalhadas."}
      difficulty={"iniciante"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`using FluentAssertions;

resultado.Should().Be(42);
nome.Should().NotBeNullOrEmpty();
nome.Should().StartWith("A").And.HaveLength(3);

lista.Should().HaveCount(3).And.ContainInOrder(1, 2, 3);
pedido.Should().BeEquivalentTo(esperado, opt => opt.Excluding(p => p.Id));

await act.Should().ThrowAsync<InvalidOperationException>()
   .WithMessage("*estoque*");`}
      />
    </PageContainer>
  );
}
