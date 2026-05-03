import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Constraints() {
  return (
    <PageContainer
      title={"Constraints (where)"}
      subtitle={"Limitar T pra ter capacidades específicas. Sem isso, T é só \"object\"."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// where T : class            -> T é reference type
// where T : struct           -> T é value type não-nullable
// where T : new()            -> T tem construtor sem args
// where T : Pessoa           -> T herda Pessoa
// where T : IComparable<T>   -> implementa interface
// where T : notnull          -> T não é nullable
// where T : unmanaged        -> T é blittable (pra interop/ptr)

public class Repo<T> where T : class, IEntidade, new()
{
    public T Criar() => new T();
}`}
      />

      <h2>Múltiplas constraints</h2>

      <CodeBlock
        language="csharp"
        code={`public T Min<T>(T a, T b) where T : struct, IComparable<T>
    => a.CompareTo(b) < 0 ? a : b;`}
      />
    </PageContainer>
  );
}
