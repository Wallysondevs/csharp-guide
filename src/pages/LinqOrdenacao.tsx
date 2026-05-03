import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function LinqOrdenacao() {
  return (
    <PageContainer
      title={"Ordenação e agrupamento"}
      subtitle={"OrderBy, ThenBy, GroupBy. SQL chega no LINQ."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// ordenação simples
var ord = produtos.OrderBy(p => p.Preco);

// ordenação composta
var ord2 = produtos
    .OrderBy(p => p.Categoria)
    .ThenByDescending(p => p.Preco)
    .ThenBy(p => p.Nome);

// agrupamento
var grupos = produtos.GroupBy(p => p.Categoria);
foreach (var g in grupos)
{
    Console.WriteLine($"{g.Key}: {g.Count()} itens");
    foreach (var p in g) Console.WriteLine($"  {p.Nome}");
}

// agrupar e projetar
var resumo = produtos
    .GroupBy(p => p.Categoria)
    .Select(g => new {
        Categoria = g.Key,
        Total = g.Sum(p => p.Preco * p.Estoque),
        Qtd = g.Count()
    });`}
      />
    </PageContainer>
  );
}
