import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function LinqAgregacao() {
  return (
    <PageContainer
      title={"Agregação: Sum, Count, Min, Max, Aggregate"}
      subtitle={"Reduzir a um valor."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var nums = new[] { 3, 1, 4, 1, 5, 9, 2, 6 };

int total = nums.Sum();
int qtd = nums.Count();
int min = nums.Min();
int max = nums.Max();
double media = nums.Average();

// Sum/Count/etc com seletor
decimal totalPrecos = produtos.Sum(p => p.Preco);

// Aggregate (fold)
int produto = nums.Aggregate(1, (acc, n) => acc * n);
string concat = nomes.Aggregate("", (acc, s) => acc + s + ",");

// Any / All
bool temPar = nums.Any(n => n % 2 == 0);
bool todosPositivos = nums.All(n => n > 0);

// Contains
bool tem9 = nums.Contains(9);`}
      />
    </PageContainer>
  );
}
