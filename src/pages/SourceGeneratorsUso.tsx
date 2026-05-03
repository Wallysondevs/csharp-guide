import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SourceGeneratorsUso() {
  return (
    <PageContainer
      title={"Source Generators (visão de uso)"}
      subtitle={"Código gerado em compile-time. Velocidade e segurança de tipo."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <p>Source generator é um analyzer que <em>adiciona</em> código ao projeto durante a compilação. Você nem precisa rodar nada — o IDE/Roslyn cuidam.</p>

      <CodeBlock
        language="csharp"
        code={`// Exemplo: System.Text.Json com source gen (.NET 6+)
[JsonSerializable(typeof(Pedido))]
public partial class MyContext : JsonSerializerContext { }

string json = JsonSerializer.Serialize(pedido, MyContext.Default.Pedido);`}
      />

      <AlertBox type="success" title={"Por que importa"}>
        <p>Sem reflection em runtime → AOT-friendly, mais rápido, menor app size. Frameworks como Mediator, Aspire, MapperGen usam pra eliminar reflection.</p>
      </AlertBox>
    </PageContainer>
  );
}
