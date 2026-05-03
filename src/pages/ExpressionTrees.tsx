import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ExpressionTrees() {
  return (
    <PageContainer
      title={"Expression Trees"}
      subtitle={"Código como dado. Base do LINQ-to-SQL, EF Core e DSLs."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`using System.Linq.Expressions;

// lambda comum: Func<int,int>
Func<int, int> f = x => x * 2;

// expression tree: árvore que descreve "x * 2"
Expression<Func<int, int>> expr = x => x * 2;

// inspecionar
Console.WriteLine(expr.Body);          // (x * 2)
Console.WriteLine(expr.Parameters[0]); // x

// compilar pra delegate
Func<int, int> compiled = expr.Compile();
Console.WriteLine(compiled(5));        // 10`}
      />

      <AlertBox type="success" title={"Por que EF traduz pra SQL"}>
        <p>Quando você escreve <code>db.Users.Where(u =&gt; u.Age &gt; 18)</code>, EF recebe a expression tree e a converte em <code>WHERE age &gt; 18</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
