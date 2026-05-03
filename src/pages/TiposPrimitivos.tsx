import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TiposPrimitivos() {
  return (
    <PageContainer
      title={"Tipos primitivos"}
      subtitle={"int, long, double, decimal, bool, char, string — entender quem é value type, quem é reference type e quanto cada um ocupa evita 90% das surpresas."}
      difficulty={"iniciante"}
      timeToRead={"8 min"}
    >
      <h2>Os numéricos</h2>

      <ul>
        <li><code>byte</code> (1B, 0..255), <code>sbyte</code> (-128..127)</li>
        <li><code>short</code> (2B), <code>ushort</code> (2B)</li>
        <li><code>int</code> (4B) — o padrão pra inteiros</li>
        <li><code>long</code> (8B), <code>ulong</code> (8B)</li>
        <li><code>float</code> (4B, ~7 dígitos), <code>double</code> (8B, ~15 dígitos) — IEEE 754</li>
        <li><code>decimal</code> (16B, ~28 dígitos) — base 10, ideal pra dinheiro</li>
        <li><code>nint</code>/<code>nuint</code> — nativos da plataforma (4 ou 8B)</li>
      </ul>

      <CodeBlock
        language="csharp"
        code={`int idade = 30;
long populacao = 8_100_000_000L;     // _ é separador visual
double pi = 3.14159;
decimal preco = 99.99m;              // sufixo m
float taxa = 0.05f;                  // sufixo f
var quantidade = 42;                 // var infere int`}
      />

      <AlertBox type="warning" title={"Dinheiro nunca em double"}>
        <p>Use <code>decimal</code> pra valores monetários. <code>0.1 + 0.2 == 0.3</code> é <em>false</em> em double.</p>
      </AlertBox>

      <h2>Os outros</h2>

      <ul>
        <li><code>bool</code> — true/false (1B mas alinha em 4)</li>
        <li><code>char</code> — UTF-16 code unit (2B)</li>
        <li><code>string</code> — sequência imutável de chars (reference type)</li>
        <li><code>object</code> — raiz de tudo</li>
      </ul>

      <h2>Value type vs reference type</h2>

      <p>Tipos primitivos numéricos, <code>bool</code>, <code>char</code>, <code>struct</code> e <code>enum</code> são <strong>value types</strong> (cópia por valor, vivem na stack ou inline). <code>string</code>, <code>class</code>, <code>array</code> e <code>delegate</code> são <strong>reference types</strong> (vivem no heap, variável guarda a referência).</p>

      <CodeBlock
        language="csharp"
        code={`int a = 10;
int b = a;        // cópia
b = 20;
// a == 10, b == 20

int[] x = { 1, 2, 3 };
int[] y = x;       // mesmo array, duas referências
y[0] = 99;
// x[0] == 99 também`}
      />
    </PageContainer>
  );
}
