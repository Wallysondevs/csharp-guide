import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function ProjetoWebapiCrud() {
  return (
    <PageContainer
      title={"Projeto: Web API CRUD completo"}
      subtitle={"API REST com EF Core, validação, JWT, swagger."}
      difficulty={"avancado"}
      timeToRead={"8 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDb>(o => o.UseNpgsql(builder.Configuration.GetConnectionString("Db")));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(...);
builder.Services.AddAuthorization();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddOpenApi();

var app = builder.Build();
app.MapOpenApi();
app.UseAuthentication();
app.UseAuthorization();

var produtos = app.MapGroup("/api/produtos").RequireAuthorization();

produtos.MapGet("/", async (AppDb db, int page = 1, int size = 20) =>
    await db.Produtos.AsNoTracking().Skip((page-1)*size).Take(size).ToListAsync());

produtos.MapGet("/{id:int}", async (int id, AppDb db) =>
    await db.Produtos.FindAsync(id) is { } p ? Results.Ok(p) : Results.NotFound());

produtos.MapPost("/", async (CriarProdutoDto dto, IValidator<CriarProdutoDto> v, AppDb db) =>
{
    var r = await v.ValidateAsync(dto);
    if (!r.IsValid) return Results.ValidationProblem(r.ToDictionary());
    var p = new Produto { Nome = dto.Nome, Preco = dto.Preco };
    db.Produtos.Add(p); await db.SaveChangesAsync();
    return Results.Created($"/api/produtos/{p.Id}", p);
});

produtos.MapPut("/{id:int}", async (int id, AtualizarProdutoDto dto, AppDb db) =>
{
    var p = await db.Produtos.FindAsync(id);
    if (p is null) return Results.NotFound();
    p.Nome = dto.Nome; p.Preco = dto.Preco;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

produtos.MapDelete("/{id:int}", async (int id, AppDb db) =>
{
    var p = await db.Produtos.FindAsync(id);
    if (p is null) return Results.NotFound();
    db.Produtos.Remove(p); await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();`}
      />
    </PageContainer>
  );
}
