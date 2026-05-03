import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function InitRequired() {
  return (
    <PageContainer
      title={"init e required"}
      subtitle={"Properties que só podem ser definidas na construção, e propriedades obrigatórias."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public class Usuario
{
    public required string Email { get; init; }   // obrigatório
    public required string Nome { get; init; }
    public string? Apelido { get; init; }          // opcional
}

// Compila
var u = new Usuario { Email = "a@b.c", Nome = "Ana" };

// Não compila — required ausente
// var u2 = new Usuario { Email = "x" };`}
      />

      <AlertBox type="success" title={"DTO sem construtor gigante"}>
        <p>Antes você precisava de construtor com 12 parâmetros. Agora é initializer claro e validado em compile-time.</p>
      </AlertBox>
    </PageContainer>
  );
}
