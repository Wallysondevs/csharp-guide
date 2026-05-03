import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinqIntro() {
  return (
    <PageContainer
      title={"LINQ: o que é"}
      subtitle={"Language Integrated Query. Consultar coleções, XML, banco com a mesma sintaxe."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <p>LINQ é um conjunto de métodos de extensão sobre <code>IEnumerable&lt;T&gt;</code> (e <code>IQueryable&lt;T&gt;</code>) que dá poder de SQL pra qualquer coleção.</p>

      <h2>Method syntax (mais usada)</h2>

      <CodeBlock
        language="csharp"
        code={`var nomes = new[] { "Ana", "Bia", "Cris", "Dani" };

var maiusculas = nomes
    .Where(n => n.Length >= 4)
    .Select(n => n.ToUpper())
    .OrderBy(n => n)
    .ToList();
// ["CRIS", "DANI"]`}
      />

      <h2>Query syntax</h2>

      <CodeBlock
        language="csharp"
        code={`var q = from n in nomes
        where n.Length >= 4
        orderby n
        select n.ToUpper();`}
      />

      <AlertBox type="info" title={"As duas existem"}>
        <p>Method e query são equivalentes — o compilador converte query syntax pra method syntax. Use o que ler melhor pro caso.</p>
      </AlertBox>
    </PageContainer>
  );
}
