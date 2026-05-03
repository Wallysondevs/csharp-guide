import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function AspnetSetup() {
  return (
    <PageContainer
      title={"ASP.NET Core: criando o projeto"}
      subtitle={"dotnet new webapi vs minimal vs MVC. O que vem na caixa."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="bash"
        code={`dotnet new webapi -o Api --use-controllers       # MVC controllers
dotnet new webapi -o Api                          # Minimal API (default)
dotnet new mvc -o Web                             # MVC com Views
dotnet new blazor -o App                          # Blazor

cd Api
dotnet run
# Abre em https://localhost:7xxx, /swagger pra UI`}
      />

      <h2>Program.cs (Minimal API .NET 8+)</h2>

      <CodeBlock
        language="csharp"
        code={`var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); app.UseSwaggerUI();
}

app.MapGet("/", () => "Olá!");
app.MapGet("/pessoa/{id:int}", (int id) => new { Id = id, Nome = "Ana" });
app.MapPost("/pessoa", (Pessoa p) => Results.Created($"/pessoa/{p.Id}", p));

app.Run();`}
      />
    </PageContainer>
  );
}
