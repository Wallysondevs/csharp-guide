import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ControleFluxo() {
  return (
    <PageContainer
      title={"Controle de fluxo"}
      subtitle={"if, switch (clássico e expression), for, foreach, while, do-while, break/continue, goto (sim, existe)."}
      difficulty={"iniciante"}
      timeToRead={"7 min"}
    >
      <h2>if / else if / else</h2>

      <CodeBlock
        language="csharp"
        code={`if (saldo >= preco)
    Comprar();
else if (saldo > 0)
    AvisarParcial();
else
    Recusar();`}
      />

      <h2>Loops</h2>

      <CodeBlock
        language="csharp"
        code={`for (int i = 0; i < 10; i++) Console.WriteLine(i);

foreach (var item in lista) Console.WriteLine(item);

int n = 0;
while (n < 5) { Console.WriteLine(n); n++; }

do { Console.WriteLine(n); n--; } while (n > 0);`}
      />

      <h2>break, continue</h2>

      <p><code>break</code> sai do loop; <code>continue</code> pula pra próxima iteração. Em loops aninhados, <code>break</code> só sai do mais interno (use <code>goto</code> ou refatore pra função se precisar sair de vários).</p>

      <h2>switch clássico vs expression</h2>

      <CodeBlock
        language="csharp"
        code={`// Clássico — comando
switch (status)
{
    case "ok":
    case "OK":
        Processar();
        break;
    case "erro":
        Logar();
        break;
    default:
        throw new InvalidOperationException();
}

// Expression (C# 8+) — retorna valor
var label = status switch
{
    "ok" or "OK" => "sucesso",
    "erro"       => "falha",
    _            => "desconhecido"
};`}
      />

      <AlertBox type="info" title={"Sem fall-through implícito"}>
        <p>Diferente de C/Java, em <code>switch</code> clássico de C# você é obrigado a colocar <code>break</code> (ou <code>return</code>/<code>throw</code>) — o compilador não deixa "vazar" pra próxima case.</p>
      </AlertBox>
    </PageContainer>
  );
}
