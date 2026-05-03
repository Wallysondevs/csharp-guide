import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function VarDynamicObject() {
  return (
    <PageContainer
      title={"var, dynamic e object"}
      subtitle={"Três jeitos de \"ser flexível\" com tipo — só um deles continua sendo type-safe. Saber a diferença evita bugs surreais."}
      difficulty={"iniciante"}
      timeToRead={"7 min"}
    >
      <h2>var: inferência em tempo de compilação</h2>

      <p><code>var</code> não é "tipo dinâmico" — é o compilador deduzindo o tipo. Depois de inferido, é como se você tivesse escrito o tipo na mão.</p>

      <CodeBlock
        language="csharp"
        code={`var nome = "Ana";        // string
var idade = 30;          // int
var lista = new List<int>(); // List<int>

// nome = 42; // ERRO de compilação — já é string`}
      />

      <h2>object: a raiz da hierarquia</h2>

      <p>Tudo herda de <code>object</code>. Atribuir um value type a <code>object</code> faz <strong>boxing</strong> (cópia pro heap). Tirar de volta exige cast e faz <strong>unboxing</strong>.</p>

      <CodeBlock
        language="csharp"
        code={`object o = 42;          // boxing — vai pro heap
int n = (int)o;         // unboxing
// (int)"texto" gera InvalidCastException em runtime`}
      />

      <h2>dynamic: late binding</h2>

      <p>Compilador desliga a checagem de tipo. Tudo é resolvido em runtime via DLR (Dynamic Language Runtime). Útil pra interop com COM, Python (IronPython) ou JSON sem schema. <strong>Errado vira erro só em runtime.</strong></p>

      <CodeBlock
        language="csharp"
        code={`dynamic d = "olá";
Console.WriteLine(d.Length);   // 3 — funciona

d = 42;
Console.WriteLine(d.Length);   // RuntimeBinderException`}
      />

      <AlertBox type="warning" title={"Evite dynamic"}>
        <p>Em código de produção, prefira <code>object</code> + pattern matching, ou genéricos. <code>dynamic</code> mata performance e atrasa erros.</p>
      </AlertBox>
    </PageContainer>
  );
}
