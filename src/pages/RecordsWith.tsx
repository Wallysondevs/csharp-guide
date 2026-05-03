import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function RecordsWith() {
  return (
    <PageContainer
      title={"Records, with e desconstrução"}
      subtitle={"Imutabilidade prática."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public record Pedido(int Id, string Cliente, decimal Total, DateTime Data);

var p = new Pedido(1, "Ana", 100m, DateTime.UtcNow);

// criar nova versão modificada
var pAjustado = p with { Total = 110m };

// desconstrução
var (id, cli, total, data) = p;

// herança de record
public record PedidoEspecial(int Id, string Cliente, decimal Total, DateTime Data, bool Vip)
    : Pedido(Id, Cliente, Total, Data);`}
      />
    </PageContainer>
  );
}
