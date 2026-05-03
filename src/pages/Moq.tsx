import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Moq() {
  return (
    <PageContainer
      title={"Moq: mocks pra dependências"}
      subtitle={"Trocar interface por dublê controlado em teste."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`using Moq;

public interface IRepo { Task<Pessoa?> ObterAsync(int id); }

[Fact]
public async Task Servico_devolve_404_quando_repo_devolve_null()
{
    var repo = new Mock<IRepo>();
    repo.Setup(r => r.ObterAsync(42)).ReturnsAsync((Pessoa?)null);

    var svc = new Servico(repo.Object);
    var resp = await svc.BuscarAsync(42);

    Assert.False(resp.Encontrado);
    repo.Verify(r => r.ObterAsync(42), Times.Once);
}`}
      />

      <AlertBox type="info" title={"NSubstitute / FakeItEasy"}>
        <p>Outros mockers populares com sintaxe mais natural. <code>repo.ObterAsync(42).Returns(null)</code> em NSubstitute.</p>
      </AlertBox>
    </PageContainer>
  );
}
