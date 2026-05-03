import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Xunit() {
  return (
    <PageContainer
      title={"xUnit: o framework padrão"}
      subtitle={"Fact, Theory, InlineData, fixtures."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="bash"
        code={`dotnet new xunit -o Meu.Tests
dotnet add reference ../Meu/Meu.csproj
dotnet test`}
      />

      <CodeBlock
        language="csharp"
        code={`public class CalculadoraTests
{
    [Fact]
    public void Soma_dois_numeros()
    {
        var c = new Calculadora();
        Assert.Equal(5, c.Soma(2, 3));
    }

    [Theory]
    [InlineData(1, 1, 2)]
    [InlineData(0, 0, 0)]
    [InlineData(-1, 1, 0)]
    public void Soma_varios(int a, int b, int esperado)
    {
        Assert.Equal(esperado, new Calculadora().Soma(a, b));
    }

    [Fact]
    public async Task Buscar_async()
    {
        var svc = new Servico();
        var r = await svc.BuscarAsync(1);
        Assert.NotNull(r);
    }
}`}
      />
    </PageContainer>
  );
}
