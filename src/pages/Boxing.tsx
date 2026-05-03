import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Boxing() {
  return (
    <PageContainer
      title={"Boxing e unboxing"}
      subtitle={"O imposto silencioso ao usar value types como object."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`int n = 42;
object o = n;       // boxing — aloca no heap, copia
int m = (int)o;     // unboxing — copia de volta

// Bug clássico — boxing repetido
ArrayList lista = new();   // não-genérica
for (int i = 0; i < 10_000; i++) lista.Add(i);  // 10k boxings!

// Genérico — sem boxing
List<int> lista2 = new();
for (int i = 0; i < 10_000; i++) lista2.Add(i);`}
      />

      <AlertBox type="warning" title={"Cuidado com string.Format"}>
        <p><code>$"&#123;i&#125;"</code> com value type <strong>não</strong> faz boxing (interpolation handler em .NET 6+). <code>string.Format("&#123;0&#125;", i)</code> faz.</p>
      </AlertBox>
    </PageContainer>
  );
}
