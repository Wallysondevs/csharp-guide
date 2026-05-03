import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function EfSetup() {
  return (
    <PageContainer
      title={"EF Core: setup"}
      subtitle={"Provider, DbContext, primeiro uso."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="bash"
        code={`dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL`}
      />

      <CodeBlock
        language="csharp"
        code={`public class AppDb : DbContext
{
    public AppDb(DbContextOptions<AppDb> opt) : base(opt) {}
    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
}

// Program.cs
builder.Services.AddDbContext<AppDb>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Db")));`}
      />
    </PageContainer>
  );
}
