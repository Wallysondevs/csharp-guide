import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function RoutingBinding() {
  return (
    <PageContainer
      title={"Routing e Model Binding"}
      subtitle={"Como parâmetros chegam no seu endpoint."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`app.MapGet("/produtos/{id:int}", (int id) => ...);
app.MapGet("/produtos", (int page = 1, int size = 20, string? q = null) => ...);

// FromHeader, FromBody, FromQuery, FromRoute, FromForm
app.MapPost("/upload", async ([FromForm] IFormFile file, [FromHeader] string? Authorization) => ...);

// AsParameters — DTO pra agregação
public record FiltroProdutos(string? Q, int Page = 1, int Size = 20);
app.MapGet("/p", ([AsParameters] FiltroProdutos f) => ...);`}
      />

      <h2>Constraints de rota</h2>

      <ul>
        <li><code>&#123;id:int&#125;</code>, <code>&#123;slug:alpha&#125;</code>, <code>&#123;guid:guid&#125;</code></li>
        <li><code>&#123;nome:minlength(3)&#125;</code>, <code>&#123;x:range(1,10)&#125;</code></li>
      </ul>
    </PageContainer>
  );
}
