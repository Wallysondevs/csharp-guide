import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Properties() {
  return (
    <PageContainer
      title={"Propriedades"}
      subtitle={"Auto, com backing field, init-only, required, expression-bodied. Açúcar sintático pra get/set."}
      difficulty={"iniciante"}
      timeToRead={"7 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public class Pedido
{
    // auto-property
    public int Id { get; set; }

    // só leitura (set apenas no construtor)
    public DateTime CriadoEm { get; }

    // init-only (C# 9): set só em inicializador
    public string Cliente { get; init; } = "";

    // required (C# 11): obriga init
    public required decimal Total { get; init; }

    // com backing field
    private string _status = "novo";
    public string Status
    {
        get => _status;
        set => _status = value?.ToLower() ?? "novo";
    }

    // expression-bodied
    public bool EstaPago => Status == "pago";
}

var p = new Pedido { Cliente = "Ana", Total = 99m };`}
      />

      <AlertBox type="info" title={"init vs set"}>
        <p><code>init</code> permite definir só durante construção/inicializador, garantindo imutabilidade após. Combina com <code>record</code> e DTOs.</p>
      </AlertBox>
    </PageContainer>
  );
}
