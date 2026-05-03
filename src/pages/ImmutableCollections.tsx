import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ImmutableCollections() {
  return (
    <PageContainer
      title={"Immutable Collections"}
      subtitle={"Coleções que não mudam — qualquer \"modificação\" retorna nova instância. Ouro pra concorrência."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`using System.Collections.Immutable;

var lista = ImmutableList.Create(1, 2, 3);
var maior = lista.Add(4);   // nova lista; original intacta
// lista = {1,2,3}; maior = {1,2,3,4}

var dict = ImmutableDictionary<string, int>.Empty
    .Add("a", 1)
    .Add("b", 2);

// Builder pra mutação eficiente em lote
var builder = ImmutableList.CreateBuilder<int>();
for (int i = 0; i < 1000; i++) builder.Add(i);
ImmutableList<int> pronto = builder.ToImmutable();`}
      />

      <AlertBox type="success" title={"Por que importa"}>
        <p>Em código concorrente, passar imutável elimina toda a categoria de bug "alguém mudou no meio". Custo: alocações. Builders amortizam.</p>
      </AlertBox>
    </PageContainer>
  );
}
