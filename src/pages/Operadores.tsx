import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Operadores() {
  return (
    <PageContainer
      title={"Operadores"}
      subtitle={"Aritméticos, lógicos, relacionais, bitwise, null-coalescing, ?., ??, ??=, range, index... C# tem mais operadores que muita linguagem inteira."}
      difficulty={"iniciante"}
      timeToRead={"8 min"}
    >
      <h2>Aritméticos e relacionais</h2>

      <CodeBlock
        language="csharp"
        code={`int a = 10, b = 3;
int soma = a + b;       // 13
int div = a / b;        // 3 (divisão inteira!)
int resto = a % b;      // 1
double exato = (double)a / b; // 3.333...

bool maior = a > b;      // true
bool igual = a == b;     // false`}
      />

      <h2>Lógicos</h2>

      <CodeBlock
        language="csharp"
        code={`bool x = true, y = false;
bool e = x && y;         // false (curto-circuito)
bool ou = x || y;        // true
bool nao = !x;           // false

// & e | (sem curto-circuito) — avaliam os dois lados`}
      />

      <h2>Null-aware (a alma do C# moderno)</h2>

      <CodeBlock
        language="csharp"
        code={`string? nome = obterNome();

// ?. — só acessa se não for null
int? len = nome?.Length;

// ?? — valor padrão se for null
string final = nome ?? "anônimo";

// ??= — atribui só se for null
nome ??= "padrão";

// !.  — diz "confia, não é null" (afasta warning)
int forca = nome!.Length;`}
      />

      <h2>Range e Index (C# 8+)</h2>

      <CodeBlock
        language="csharp"
        code={`int[] v = { 10, 20, 30, 40, 50 };
int ultimo = v[^1];      // 50 (^ conta do fim)
int penultimo = v[^2];   // 40
int[] meio = v[1..4];    // { 20, 30, 40 }
int[] doInicio = v[..3]; // { 10, 20, 30 }
int[] ateOFim = v[2..];  // { 30, 40, 50 }`}
      />

      <h2>Ternário e switch expression</h2>

      <CodeBlock
        language="csharp"
        code={`var msg = idade >= 18 ? "adulto" : "menor";

var label = idade switch
{
    < 13 => "criança",
    < 18 => "adolescente",
    < 65 => "adulto",
    _    => "idoso"
};`}
      />
    </PageContainer>
  );
}
