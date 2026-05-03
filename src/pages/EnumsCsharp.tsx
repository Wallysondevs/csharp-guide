import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function EnumsCsharp() {
  return (
    <PageContainer
      title={"Enums"}
      subtitle={"Constantes nomeadas, com tipo subjacente, flags e métodos auxiliares."}
      difficulty={"iniciante"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public enum Status
{
    Pendente = 0,
    Aprovado = 1,
    Rejeitado = 2
}

Status s = Status.Aprovado;
int n = (int)s;                  // 1
Status s2 = (Status)1;           // Aprovado

// nome <-> valor
string nome = s.ToString();      // "Aprovado"
Status s3 = Enum.Parse<Status>("Pendente");
bool ok = Enum.TryParse<Status>("X", out var st);

// listar
foreach (Status v in Enum.GetValues<Status>()) ...`}
      />

      <h2>Flags</h2>

      <CodeBlock
        language="csharp"
        code={`[Flags]
public enum Permissao
{
    Nenhuma = 0,
    Ler     = 1 << 0,   // 1
    Escrever = 1 << 1,  // 2
    Executar = 1 << 2,  // 4,
    Tudo = Ler | Escrever | Executar
}

var p = Permissao.Ler | Permissao.Escrever;
bool podeLer = p.HasFlag(Permissao.Ler);   // true
Console.WriteLine(p);   // "Ler, Escrever"`}
      />
    </PageContainer>
  );
}
