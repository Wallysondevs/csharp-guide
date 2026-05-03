import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EfQuerying() {
  return (
    <PageContainer
      title={"Querying com LINQ"}
      subtitle={"Toda LINQ vira SQL. O que funciona, o que não."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var ativos = await db.Pessoas
    .Where(p => p.Ativo && p.Idade >= 18)
    .OrderBy(p => p.Nome)
    .Select(p => new { p.Id, p.Nome })
    .Skip(20).Take(20)
    .ToListAsync();

// Includes
var pessoaCompleta = await db.Pessoas
    .Include(p => p.Pedidos)
        .ThenInclude(o => o.Itens)
    .FirstOrDefaultAsync(p => p.Id == id);

// Projeções (mais eficientes que Include)
var resumo = await db.Pessoas
    .Where(p => p.Id == id)
    .Select(p => new ResumoDto {
        Nome = p.Nome,
        TotalPedidos = p.Pedidos.Count(),
        Gasto = p.Pedidos.Sum(o => o.Total)
    })
    .FirstOrDefaultAsync();`}
      />

      <AlertBox type="warning" title={"N+1 mata"}>
        <p>Iterar entidade puxando relacionamento sem Include vira 1+N queries. Sempre Include ou projete.</p>
      </AlertBox>
    </PageContainer>
  );
}
