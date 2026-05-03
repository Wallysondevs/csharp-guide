import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CustomExceptions() {
  return (
    <PageContainer
      title={"Exceções customizadas"}
      subtitle={"Quando criar, como nomear, o que NÃO usar exceção pra fazer."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public class EstoqueInsuficienteException : Exception
{
    public int Disponivel { get; }
    public int Solicitado { get; }

    public EstoqueInsuficienteException(int disp, int sol)
        : base($"Disponível: {disp}, solicitado: {sol}")
    {
        Disponivel = disp; Solicitado = sol;
    }
}

throw new EstoqueInsuficienteException(2, 5);`}
      />

      <AlertBox type="warning" title={"Não use exceção pra controle de fluxo"}>
        <p>Exceção é cara (stack walking). Pra "não encontrado" ou "inválido" em fluxo normal, use <code>Try*</code> patterns ou <code>Result&lt;T&gt;</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
