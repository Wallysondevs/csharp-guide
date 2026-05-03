import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function PatternMatching() {
  return (
    <PageContainer
      title={"Pattern Matching"}
      subtitle={"is, switch expressions, property patterns, list patterns. C# virou linguagem funcional."}
      difficulty={"intermediario"}
      timeToRead={"8 min"}
    >
      <h2>is com pattern</h2>

      <CodeBlock
        language="csharp"
        code={`if (obj is string s && s.Length > 0) ...
if (obj is int n and > 0) ...
if (obj is null) ...`}
      />

      <h2>Switch expression</h2>

      <CodeBlock
        language="csharp"
        code={`var label = forma switch
{
    Circulo  { Raio: > 0 } c => $"círculo r={c.Raio}",
    Quadrado { Lado: var l }  => $"quadrado l={l}",
    null                       => "nada",
    _                          => "desconhecido"
};`}
      />

      <h2>Property pattern</h2>

      <CodeBlock
        language="csharp"
        code={`if (pessoa is { Idade: >= 18, Nome: not null }) ...

var preco = produto switch
{
    { Categoria: "Bebida", Estoque: > 100 } => 0.9m * produto.Preco,
    { Categoria: "Bebida" }                  => produto.Preco,
    _                                        => produto.Preco
};`}
      />

      <h2>List pattern (C# 11)</h2>

      <CodeBlock
        language="csharp"
        code={`int[] arr = ...;

if (arr is [1, 2, 3]) ...
if (arr is [1, .., 9]) ...           // começa com 1, termina com 9
if (arr is [var primeiro, .., var ultimo]) ...
if (arr is []) ...                    // vazio`}
      />
    </PageContainer>
  );
}
