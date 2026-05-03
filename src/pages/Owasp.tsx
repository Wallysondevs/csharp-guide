import { PageContainer } from "@/components/layout/PageContainer";

export default function Owasp() {
  return (
    <PageContainer
      title={"OWASP Top 10 em ASP.NET"}
      subtitle={"Os 10 maiores bugs de segurança e como o stack ajuda (ou não)."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <ul>
        <li><strong>Injection</strong>: use parameterized queries (EF / Dapper). Nunca string-concat em SQL.</li>
        <li><strong>Broken auth</strong>: Identity / JWT bem feito, MFA, lockout.</li>
        <li><strong>Sensitive data exposure</strong>: HTTPS, hash de senha, criptografia em rest.</li>
        <li><strong>XML external entity (XXE)</strong>: <code>XmlReaderSettings.DtdProcessing = DtdProcessing.Prohibit</code>.</li>
        <li><strong>Broken access control</strong>: <code>[Authorize(Policy = "...")]</code> em todo endpoint sensível.</li>
        <li><strong>Security misconfiguration</strong>: não exponha stack trace em prod.</li>
        <li><strong>XSS</strong>: Razor escapa por default. Cuidado com <code>@Html.Raw</code>.</li>
        <li><strong>Deserialization</strong>: nunca desserialize JSON de fonte não confiável em <code>object</code>/<code>dynamic</code>.</li>
        <li><strong>Vulnerable components</strong>: <code>dotnet list package --vulnerable</code>.</li>
        <li><strong>Logging insufficiente</strong>: log auth failures, mudanças críticas, com correlation id.</li>
      </ul>
    </PageContainer>
  );
}
