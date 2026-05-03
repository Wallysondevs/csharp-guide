import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function EfPerformance() {
  return (
    <PageContainer
      title={"EF Performance"}
      subtitle={"AsNoTracking, AsSplitQuery, raw SQL, pooling."}
      difficulty={"avancado"}
      timeToRead={"6 min"}
    >
      <ul>
        <li><code>AsNoTracking()</code> pra leitura.</li>
        <li><code>AsSplitQuery()</code> quando Include explode em cartesiano.</li>
        <li><code>FromSql()</code> / <code>ExecuteSqlAsync()</code> pra SQL bruto.</li>
        <li><code>AddDbContextPool</code> reusa contextos.</li>
        <li>Compiled queries pra hot path.</li>
      </ul>

      <CodeBlock
        language="csharp"
        code={`builder.Services.AddDbContextPool<AppDb>(opt =>
    opt.UseNpgsql(cs).EnableSensitiveDataLogging(false));

// Compiled query
private static readonly Func<AppDb, int, Task<Pessoa?>> _byId =
    EF.CompileAsyncQuery((AppDb db, int id) =>
        db.Pessoas.FirstOrDefault(p => p.Id == id));

var p = await _byId(db, 42);

// Raw SQL
var lista = await db.Pessoas
    .FromSql($"SELECT * FROM pessoas WHERE idade > {minIdade}")
    .ToListAsync();`}
      />
    </PageContainer>
  );
}
