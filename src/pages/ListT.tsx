import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ListT() {
  return (
    <PageContainer
      title={"List<T>"}
      subtitle={"A coleção mutável mais usada. Array dinâmico, indexável, com Add/Remove/Insert."}
      difficulty={"iniciante"}
      timeToRead={"7 min"}
    >
      <h2>Operações básicas</h2>

      <CodeBlock
        language="csharp"
        code={`var lista = new List<int>();
lista.Add(1); lista.Add(2); lista.Add(3);

var nomes = new List<string> { "Ana", "Bia", "Cris" };

nomes.Insert(0, "Beto");      // O(n) — desloca
nomes.Remove("Bia");          // remove primeiro match
nomes.RemoveAt(2);            // por índice
nomes.Contains("Ana");        // bool
nomes.IndexOf("Ana");         // int
int n = nomes.Count;
nomes.Sort();
nomes.Reverse();
nomes.Clear();`}
      />

      <h2>Capacity vs Count</h2>

      <p><code>List&lt;T&gt;</code> tem capacidade interna que dobra quando enche. Se você sabe o tamanho aproximado, passe no construtor: <code>new List&lt;int&gt;(10_000)</code>.</p>

      <CodeBlock
        language="csharp"
        code={`var l = new List<int>(1000);   // capacidade inicial
Console.WriteLine(l.Capacity);  // 1000
Console.WriteLine(l.Count);     // 0`}
      />

      <h2>Iteração</h2>

      <CodeBlock
        language="csharp"
        code={`foreach (var x in lista) Console.WriteLine(x);

// LINQ direto
var pares = lista.Where(x => x % 2 == 0).ToList();

// Span pra performance (sem copiar)
foreach (var x in CollectionsMarshal.AsSpan(lista))
    Console.WriteLine(x);`}
      />

      <AlertBox type="warning" title={"Não modifique enquanto itera"}>
        <p>Adicionar/remover dentro de <code>foreach</code> joga <code>InvalidOperationException</code>. Itere ao contrário com <code>for</code>, ou colete o que remover e remova depois.</p>
      </AlertBox>
    </PageContainer>
  );
}
