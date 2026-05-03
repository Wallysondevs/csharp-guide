import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function RawStrings() {
  return (
    <PageContainer
      title={"Raw string literals (C# 11)"}
      subtitle={"\"\"\"...\"\"\"\" pra strings sem precisar escapar nada."}
      difficulty={"iniciante"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var json = """
{
    "nome": "Ana",
    "saudacao": "Olá "mundo""
}
""";

var html = """
<div class="card">
    <h1>Título</h1>
</div>
""";

// com interpolação ($$ porque "" colide)
var x = "Ana";
var msg = $$"""
Bem-vinda, {{x}}!
Use { e } sem escape.
""";`}
      />

      <AlertBox type="success" title={"Adeus \\n e \\\""}>
        <p>Escrever JSON, regex, SQL e HTML virou prazer. A indentação base é descontada automaticamente do bloco.</p>
      </AlertBox>
    </PageContainer>
  );
}
