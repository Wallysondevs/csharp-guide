import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Interfaces() {
  return (
    <PageContainer
      title={"Interfaces"}
      subtitle={"Contrato puro. Desde C# 8 podem ter implementação default. Múltipla \"herança\" só por aqui."}
      difficulty={"iniciante"}
      timeToRead={"7 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public interface IRepositorio<T>
{
    Task<T?> ObterAsync(int id);
    Task SalvarAsync(T entidade);
    Task RemoverAsync(int id);
}

public class UsuarioRepo : IRepositorio<Usuario>
{
    public Task<Usuario?> ObterAsync(int id) { /*...*/ }
    public Task SalvarAsync(Usuario u)       { /*...*/ }
    public Task RemoverAsync(int id)         { /*...*/ }
}`}
      />

      <h2>Default interface methods (C# 8+)</h2>

      <CodeBlock
        language="csharp"
        code={`public interface ILogger
{
    void Log(string msg);
    void Warn(string msg) => Log($"[WARN] {msg}");  // implementação default
}`}
      />

      <h2>Múltiplas interfaces</h2>

      <CodeBlock
        language="csharp"
        code={`public class Servico : IRepositorio<X>, IDisposable, ILogger
{
    // implementa as três
}`}
      />

      <AlertBox type="info" title={"Convenção I"}>
        <p>Por convenção, interfaces começam com <code>I</code>. <code>IList</code>, <code>IEnumerable</code>, <code>IDisposable</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
