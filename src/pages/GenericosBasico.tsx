import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GenericosBasico() {
  return (
    <PageContainer
      title={"Genéricos: o básico"}
      subtitle={"Tipo parametrizado. Reuso sem perder type safety nem performance (sem boxing)."}
      difficulty={"intermediario"}
      timeToRead={"7 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public class Pilha<T>
{
    private readonly List<T> _itens = new();
    public void Push(T item) => _itens.Add(item);
    public T Pop()
    {
        var x = _itens[^1];
        _itens.RemoveAt(_itens.Count - 1);
        return x;
    }
    public int Count => _itens.Count;
}

var p = new Pilha<int>();
p.Push(1); p.Push(2);
int x = p.Pop();   // sem cast`}
      />

      <h2>Métodos genéricos</h2>

      <CodeBlock
        language="csharp"
        code={`public static T Maior<T>(T a, T b) where T : IComparable<T>
    => a.CompareTo(b) > 0 ? a : b;

int m = Maior(3, 7);          // tipo inferido
string s = Maior("ab", "cd");`}
      />

      <AlertBox type="info" title={"Sem type erasure"}>
        <p>Diferente do Java, em C# os tipos genéricos são preservados em runtime. <code>List&lt;int&gt;</code> e <code>List&lt;string&gt;</code> são tipos diferentes de fato.</p>
      </AlertBox>
    </PageContainer>
  );
}
