import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ReadonlyCollections() {
  return (
    <PageContainer
      title={"IReadOnlyList, IReadOnlyDictionary"}
      subtitle={"Expor coleções \"só leitura\" sem clonar. Boa cidadania de API."}
      difficulty={"iniciante"}
      timeToRead={"4 min"}
    >
      <p>Devolver <code>List&lt;T&gt;</code> em uma propriedade pública é convidar o caller a modificar seu estado interno. Use os tipos read-only.</p>

      <CodeBlock
        language="csharp"
        code={`public class Carrinho
{
    private readonly List<Item> _itens = new();
    public IReadOnlyList<Item> Itens => _itens;

    public void Adicionar(Item i) => _itens.Add(i);
}

// caller
carrinho.Itens.Count;       // ok
// carrinho.Itens.Add(...)  // não compila`}
      />

      <AlertBox type="info" title={"AsReadOnly()"}>
        <p><code>list.AsReadOnly()</code> retorna um wrapper barato (sem cópia). Pra coleções imutáveis "de verdade", use <code>ImmutableList</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
