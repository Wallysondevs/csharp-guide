import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NullableReference() {
  return (
    <PageContainer
      title={"Nullable Reference Types"}
      subtitle={"Desde C# 8 você marca quais referências podem ser null. O compilador avisa antes do crash."}
      difficulty={"intermediario"}
      timeToRead={"7 min"}
    >
      <h2>Habilitando</h2>

      <CodeBlock
        language="xml"
        title="csproj.xml"
        code={`<!-- csproj -->
<PropertyGroup>
  <Nullable>enable</Nullable>
</PropertyGroup>`}
      />

      <h2>Sintaxe</h2>

      <CodeBlock
        language="csharp"
        code={`string nome = "Ana";        // não pode ser null
string? apelido = null;     // pode ser null
string definido = apelido!; // "confia, não é null"

// Acesso seguro
int len = apelido?.Length ?? 0;`}
      />

      <h2>Avisos típicos</h2>

      <ul>
        <li><strong>CS8600</strong>: convertendo null literal pra non-nullable.</li>
        <li><strong>CS8602</strong>: dereferência de possivelmente null.</li>
        <li><strong>CS8618</strong>: campo não-nullable não inicializado no construtor.</li>
      </ul>

      <CodeBlock
        language="csharp"
        code={`public class Pessoa
{
    public string Nome { get; set; } = "";   // ok
    public required string Email { get; set; } // C# 11: obriga init
    public string? Telefone { get; set; }     // ok ser null
}`}
      />

      <AlertBox type="info" title={"Não muda runtime"}>
        <p>Nullable Reference Types é puramente compilador. Em runtime, qualquer referência pode ser null. É um sistema de avisos, não uma garantia em tempo de execução.</p>
      </AlertBox>
    </PageContainer>
  );
}
