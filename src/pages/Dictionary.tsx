import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Dictionary() {
  return (
    <PageContainer
      title={"Dictionary<TK,TV>"}
      subtitle={"Hash table, lookup O(1) médio. A coleção mais usada depois de List."}
      difficulty={"iniciante"}
      timeToRead={"7 min"}
    >
      <h2>Básico</h2>

      <CodeBlock
        language="csharp"
        code={`var idades = new Dictionary<string, int>
{
    ["Ana"] = 30,
    ["Bia"] = 25
};

idades["Cris"] = 40;
idades.Add("Dani", 22);  // joga se já existir

int x = idades["Ana"];   // KeyNotFoundException se não existir

// Acesso seguro
if (idades.TryGetValue("Eli", out int v))
    Console.WriteLine(v);

// Existe?
if (idades.ContainsKey("Ana")) { ... }`}
      />

      <h2>Iteração</h2>

      <CodeBlock
        language="csharp"
        code={`foreach (var (nome, idade) in idades)
    Console.WriteLine($"{nome}: {idade}");

foreach (var kv in idades)
    Console.WriteLine($"{kv.Key}={kv.Value}");

// Só chaves ou valores
foreach (var nome in idades.Keys) ...
foreach (var idade in idades.Values) ...`}
      />

      <h2>Padrões úteis</h2>

      <CodeBlock
        language="csharp"
        code={`// Conta ocorrências
var contagem = new Dictionary<string, int>();
foreach (var p in palavras)
    contagem[p] = contagem.GetValueOrDefault(p) + 1;

// CollectionsMarshal.GetValueRefOrAddDefault — incrementa sem 2 lookups
ref int slot = ref CollectionsMarshal.GetValueRefOrAddDefault(contagem, p, out _);
slot++;`}
      />

      <AlertBox type="info" title={"GetHashCode é vital"}>
        <p>Dictionary usa <code>GetHashCode</code> e <code>Equals</code> da chave. Se você usar tipos próprios como chave, override os dois ou use <code>record</code> (que faz isso automaticamente).</p>
      </AlertBox>
    </PageContainer>
  );
}
