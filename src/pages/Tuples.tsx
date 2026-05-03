import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Tuples() {
  return (
    <PageContainer
      title={"Tuples"}
      subtitle={"Agrupar valores sem criar tipo. ValueTuple é struct, sem alocação no heap."}
      difficulty={"iniciante"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// criar
var t = (1, "ana", true);
Console.WriteLine(t.Item1);

// nomeada
var pessoa = (nome: "Ana", idade: 30);
Console.WriteLine(pessoa.nome);

// retorno múltiplo
(string nome, int idade) ObterPessoa() => ("Bia", 25);

var (n, i) = ObterPessoa();
Console.WriteLine($"{n}, {i}");

// trocar valores
(a, b) = (b, a);`}
      />

      <AlertBox type="info" title={"Tuple vs Record"}>
        <p>Tuple pra retorno temporário/local. Record pra modelar dados que cruzam camadas e merecem nome próprio.</p>
      </AlertBox>
    </PageContainer>
  );
}
