import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function EfDbcontext() {
  return (
    <PageContainer
      title={"DbContext, DbSet, mudanças"}
      subtitle={"O coração do EF: tracking, SaveChanges, ChangeTracker."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var p = new Pessoa { Nome = "Ana", Idade = 30 };
db.Pessoas.Add(p);
await db.SaveChangesAsync();   // INSERT, p.Id preenchido

var existente = await db.Pessoas.FindAsync(1);
existente!.Idade = 31;
await db.SaveChangesAsync();   // UPDATE só nas colunas mudadas

db.Pessoas.Remove(existente);
await db.SaveChangesAsync();   // DELETE`}
      />

      <h2>AsNoTracking pra leitura</h2>

      <CodeBlock
        language="csharp"
        code={`var rapido = await db.Pessoas
    .AsNoTracking()
    .Where(p => p.Idade > 18)
    .ToListAsync();
// Não cria entries no ChangeTracker — mais leve, leitura pura`}
      />
    </PageContainer>
  );
}
