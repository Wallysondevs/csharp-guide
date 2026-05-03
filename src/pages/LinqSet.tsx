import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function LinqSet() {
  return (
    <PageContainer
      title={"Distinct, Union, Intersect, Except"}
      subtitle={"Operações de conjunto."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var a = new[] { 1, 2, 3, 4 };
var b = new[] { 3, 4, 5, 6 };

a.Distinct();          // {1,2,3,4}
a.Union(b);            // {1,2,3,4,5,6}
a.Intersect(b);        // {3,4}
a.Except(b);           // {1,2}

// DistinctBy (C# 6+)
var pessoas = new[] { ... };
var unicas = pessoas.DistinctBy(p => p.Email);

// Concat — junta sem deduplicar
a.Concat(b);           // {1,2,3,4,3,4,5,6}`}
      />
    </PageContainer>
  );
}
