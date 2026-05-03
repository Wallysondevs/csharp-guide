import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ReflectionBasico() {
  return (
    <PageContainer
      title={"Reflection: lendo metadados"}
      subtitle={"Inspecionar tipos, métodos, atributos em runtime."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`Type t = typeof(Pessoa);
Console.WriteLine(t.FullName);

PropertyInfo[] props = t.GetProperties();
foreach (var p in props)
    Console.WriteLine($"{p.Name}: {p.PropertyType.Name}");

MethodInfo[] m = t.GetMethods();

// instanciar dinâmicamente
object? obj = Activator.CreateInstance(t, "Ana", 30);

// pegar/setar property
var nome = t.GetProperty("Nome")?.GetValue(obj);
t.GetProperty("Idade")?.SetValue(obj, 31);

// invocar método
t.GetMethod("Apresentar")?.Invoke(obj, null);`}
      />

      <AlertBox type="warning" title={"Cara"}>
        <p>Reflection é 10-100x mais lenta que chamada direta. Use só quando precisa (DI, serialização, ORMs). Pra hot path, considere source generators ou compile expressions.</p>
      </AlertBox>
    </PageContainer>
  );
}
