import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ArraysMulti() {
  return (
    <PageContainer
      title={"Arrays multidimensionais"}
      subtitle={"C# tem dois tipos: retangular (T[,]) e jagged (T[][]). Performance e uso diferem."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <h2>Retangular</h2>

      <CodeBlock
        language="csharp"
        code={`int[,] matriz = new int[3, 4];     // 3 linhas, 4 colunas
matriz[0, 0] = 1;
matriz[2, 3] = 99;

int linhas = matriz.GetLength(0);   // 3
int colunas = matriz.GetLength(1);  // 4

// Inicializador
int[,] tab = { {1,2,3}, {4,5,6} };`}
      />

      <h2>Jagged (array de arrays)</h2>

      <CodeBlock
        language="csharp"
        code={`int[][] jagged = new int[3][];
jagged[0] = new int[] { 1, 2 };
jagged[1] = new int[] { 3, 4, 5 };
jagged[2] = new int[] { 6 };

Console.WriteLine(jagged[1][2]);   // 5
Console.WriteLine(jagged[1].Length); // 3 (cada linha pode ter tamanho diferente)`}
      />

      <AlertBox type="info" title={"Performance"}>
        <p>Jagged costuma ser mais rápido (CLR otimiza melhor o índice unidimensional). Retangular gasta menos memória de overhead. Pra ML/imagem, prefira <code>Span&lt;T&gt;</code> ou tensores especializados.</p>
      </AlertBox>
    </PageContainer>
  );
}
