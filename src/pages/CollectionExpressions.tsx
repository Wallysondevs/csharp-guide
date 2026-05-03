import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CollectionExpressions() {
  return (
    <PageContainer
      title={"Collection expressions (C# 12)"}
      subtitle={"[1,2,3] funciona pra qualquer coleção. Spread (..) também."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`int[] arr = [1, 2, 3];
List<int> lista = [4, 5, 6];
Span<int> span = [7, 8, 9];

// Spread
int[] inicio = [1, 2];
int[] fim = [4, 5];
int[] tudo = [..inicio, 3, ..fim];   // {1,2,3,4,5}

// Funciona em parâmetros
void Print(IEnumerable<int> nums) { ... }
Print([10, 20, 30]);`}
      />

      <AlertBox type="success" title={"Substitui new T[] {}"}>
        <p>Mais limpo, funciona com qualquer coleção que o compilador saiba construir, e o compilador escolhe a representação mais eficiente.</p>
      </AlertBox>
    </PageContainer>
  );
}
