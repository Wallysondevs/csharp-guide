import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinqIqueryable() {
  return (
    <PageContainer
      title={"IQueryable vs IEnumerable"}
      subtitle={"Em memória? Vai pra IEnumerable. Vai virar SQL? IQueryable."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <p><code>IEnumerable&lt;T&gt;</code> é executado em memória — todos os filtros são código C#. <code>IQueryable&lt;T&gt;</code> é uma <strong>árvore de expressão</strong> que provedores (EF Core, NHibernate) traduzem pra SQL.</p>

      <CodeBlock
        language="csharp"
        code={`// EF Core — IQueryable
var ativos = db.Usuarios
    .Where(u => u.Ativo)             // vira WHERE no SQL
    .Select(u => new { u.Nome })
    .ToList();                       // executa SQL aqui

// Cuidado: AsEnumerable() força "puxar tudo"
var tudo = db.Usuarios.AsEnumerable()
    .Where(u => u.Ativo)             // C# em memória — SELECT *!
    .ToList();`}
      />

      <AlertBox type="warning" title={"ToList cedo demais"}>
        <p>Chamar <code>.ToList()</code> antes do <code>Where</code> em IQueryable puxa tudo do banco. Aplique filtros antes.</p>
      </AlertBox>
    </PageContainer>
  );
}
