import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function OpenapiSwagger() {
  return (
    <PageContainer
      title={"OpenAPI / Swagger"}
      subtitle={"Documentação interativa da sua API."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Minha API", Version = "v1" });
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Em endpoint
app.MapGet("/p/{id}", (int id) => ...)
   .WithName("GetPessoa")
   .WithOpenApi();`}
      />

      <AlertBox type="info" title={".NET 9 nativo"}>
        <p>Em .NET 9, OpenAPI é nativo via <code>builder.Services.AddOpenApi()</code> sem precisar de Swashbuckle.</p>
      </AlertBox>
    </PageContainer>
  );
}
