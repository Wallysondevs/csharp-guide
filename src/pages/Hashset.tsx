import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Hashset() {
  return (
    <PageContainer
      title={"HashSet<T>"}
      subtitle={"Conjunto sem duplicatas, pertinência O(1). Útil pra deduplicar e checar existência rápido."}
      difficulty={"iniciante"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var visto = new HashSet<int>();
foreach (var n in numeros)
{
    if (!visto.Add(n))         // Add retorna false se já existia
        Console.WriteLine($"duplicado: {n}");
}

var conjunto = new HashSet<string> { "a", "b", "c" };
conjunto.Contains("a");        // true, O(1) médio
conjunto.Remove("b");

// Operações de conjunto
var s1 = new HashSet<int> { 1, 2, 3 };
var s2 = new HashSet<int> { 2, 3, 4 };
s1.UnionWith(s2);              // {1,2,3,4}
s1.IntersectWith(s2);          // {2,3}
s1.ExceptWith(s2);             // {1}`}
      />

      <AlertBox type="info" title={"SortedSet"}>
        <p><code>SortedSet&lt;T&gt;</code> mantém ordem (árvore vermelho-preto), inserção e busca em O(log n). Use quando precisar iterar em ordem ou pegar min/max barato.</p>
      </AlertBox>
    </PageContainer>
  );
}
