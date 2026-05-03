import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function EfMigrations() {
  return (
    <PageContainer
      title={"Migrations"}
      subtitle={"Versionar schema. Add, Update, Remove, Script."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="bash"
        code={`dotnet tool install -g dotnet-ef

dotnet ef migrations add InicialV1
dotnet ef database update
dotnet ef migrations remove        # último não aplicado
dotnet ef database update PreviousMigration  # rollback
dotnet ef migrations script        # gera SQL pra prod`}
      />

      <h2>OnModelCreating</h2>

      <CodeBlock
        language="csharp"
        code={`protected override void OnModelCreating(ModelBuilder mb)
{
    mb.Entity<Pessoa>(e =>
    {
        e.HasKey(p => p.Id);
        e.Property(p => p.Nome).IsRequired().HasMaxLength(100);
        e.HasIndex(p => p.Email).IsUnique();
        e.HasMany(p => p.Pedidos).WithOne(o => o.Pessoa).HasForeignKey(o => o.PessoaId);
    });
}`}
      />
    </PageContainer>
  );
}
