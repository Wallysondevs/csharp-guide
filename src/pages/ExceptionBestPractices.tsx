import { PageContainer } from "@/components/layout/PageContainer";

export default function ExceptionBestPractices() {
  return (
    <PageContainer
      title={"Boas práticas com exceções"}
      subtitle={"O que te mata em produção e como evitar."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <ul>
        <li>Não capture <code>Exception</code> generalizada — capture o tipo específico.</li>
        <li>Use <code>throw;</code> e não <code>throw ex;</code> pra preservar stack.</li>
        <li>Não engula exceção (catch vazio). No mínimo logue.</li>
        <li>Pra fluxo esperado (validação), use Try-pattern, não exceção.</li>
        <li>Sempre limpe recursos com <code>using</code>/<code>finally</code>.</li>
        <li>Mensagens em inglês ou pt sem acento — facilita logs.</li>
        <li>Inclua dados úteis: IDs, contexto, não só "deu erro".</li>
      </ul>
    </PageContainer>
  );
}
