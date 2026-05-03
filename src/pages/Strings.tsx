import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Strings() {
  return (
    <PageContainer
      title={"Strings em C#"}
      subtitle={"string é imutável, alocada no heap, com interning automático pra literais. Conhecer StringBuilder, interpolação e Span economiza memória."}
      difficulty={"iniciante"}
      timeToRead={"8 min"}
    >
      <h2>Imutabilidade</h2>

      <p>Toda operação que "modifica" uma string, na verdade cria uma nova. Por isso <code>+</code> em loop é venenoso.</p>

      <CodeBlock
        language="csharp"
        code={`string a = "olá";
string b = a + " mundo";
// a continua "olá", b é uma nova string`}
      />

      <h2>StringBuilder pra concatenação intensa</h2>

      <CodeBlock
        language="csharp"
        code={`using System.Text;
var sb = new StringBuilder();
for (int i = 0; i < 10_000; i++)
    sb.Append("linha ").AppendLine(i.ToString());
string resultado = sb.ToString();`}
      />

      <h2>Interpolação ($) e literais raw ("""..."""")</h2>

      <CodeBlock
        language="csharp"
        code={`var nome = "Ana"; var idade = 30;
string msg = $"Olá, {nome}! Você tem {idade} anos.";
string fmt = $"Pi = {Math.PI:F4}";   // 3.1416

// Raw string literals (C# 11)
string json = $$"""
{
  "nome": "{{nome}}",
  "idade": {{idade}}
}
""";`}
      />

      <h2>Métodos essenciais</h2>

      <CodeBlock
        language="csharp"
        code={`s.Length
s.ToUpper(); s.ToLower();
s.Trim(); s.TrimStart(); s.TrimEnd();
s.Contains("abc"); s.StartsWith("h"); s.EndsWith(".");
s.IndexOf("x"); s.LastIndexOf("y");
s.Replace("a", "A");
s.Substring(2, 5);
s.Split(','); string.Join(", ", lista);
string.IsNullOrEmpty(s); string.IsNullOrWhiteSpace(s);`}
      />

      <AlertBox type="info" title={"Comparação cultural"}>
        <p>Por padrão, <code>==</code> e <code>Equals</code> usam ordinal. Pra ignorar caixa: <code>string.Equals(a, b, StringComparison.OrdinalIgnoreCase)</code>. Pra comparar respeitando idioma (ex: "ä" == "ae" em alemão) use <code>StringComparison.CurrentCulture</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
