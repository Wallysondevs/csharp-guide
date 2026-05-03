import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ImmutableCollections() {
  return (
    <PageContainer
      title="Coleções imutáveis: ImmutableList e amigos"
      subtitle="Coleções que nunca mudam — toda alteração devolve uma nova versão. Por que isso é incrível para concorrência e previsibilidade."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine uma escultura de mármore: uma vez esculpida, ela não muda. Se você quer uma versão diferente, esculpe outra. As <strong>coleções imutáveis</strong> de C# funcionam assim: nenhum método modifica a coleção existente; em vez disso, devolvem uma <em>nova</em> coleção com a alteração aplicada. Isso parece desperdício, mas traz benefícios enormes: <strong>thread-safety automática</strong> (sem locks), código mais previsível e a possibilidade de "voltar no tempo" mantendo versões antigas.
      </p>

      <h2>Instalando e importando</h2>
      <p>
        As coleções imutáveis vivem no namespace <code>System.Collections.Immutable</code>. Em projetos modernos (.NET 6+) elas já vêm no SDK; em projetos antigos, você instala via NuGet o pacote <code>System.Collections.Immutable</code>.
      </p>
      <pre><code>{`using System.Collections.Immutable;

// Lista vazia (singleton — sempre a mesma instância)
ImmutableList<int> vazia = ImmutableList<int>.Empty;

// Add devolve uma NOVA lista; a original não muda
ImmutableList<int> a = vazia.Add(1);
ImmutableList<int> b = a.Add(2).Add(3);

Console.WriteLine(vazia.Count); // 0  (continua vazia!)
Console.WriteLine(a.Count);     // 1
Console.WriteLine(b.Count);     // 3`}</code></pre>

      <h2>Métodos retornam nova coleção</h2>
      <p>
        Toda operação que normalmente mutaria a coleção (<code>Add</code>, <code>Remove</code>, <code>Insert</code>, <code>SetItem</code>) devolve uma instância nova. Você precisa atribuir o resultado:
      </p>
      <pre><code>{`var lista = ImmutableList.Create("ana", "bia", "carla");

lista.Add("diana"); // SEM EFEITO — resultado descartado
Console.WriteLine(lista.Count); // 3

// Forma correta: capture o retorno
var maior = lista.Add("diana");
Console.WriteLine(maior.Count); // 4

// Substituir item no índice 0 (Reset/SetItem)
var alterada = maior.SetItem(0, "ANA");`}</code></pre>

      <AlertBox type="info" title="Persistência estrutural">
        Quando você adiciona um item a uma <code>ImmutableList</code>, o C# <em>não copia</em> os outros itens — internamente as duas versões compartilham a maior parte da estrutura (uma árvore balanceada). Por isso "criar uma nova lista" é mais barato do que parece, especialmente para coleções grandes.
      </AlertBox>

      <h2>O Builder pattern: muitas alterações de uma vez</h2>
      <p>
        Se você precisa fazer 1000 alterações em sequência, cada <code>Add</code> criando uma nova versão fica caro. A solução é o <strong>Builder</strong>: um objeto mutável temporário que, ao final, vira uma imutável de uma vez.
      </p>
      <pre><code>{`// Forma ingênua (lenta para muitas alterações)
var lista = ImmutableList<int>.Empty;
for (int i = 0; i < 10_000; i++)
    lista = lista.Add(i);

// Forma idiomática com Builder
var builder = ImmutableList.CreateBuilder<int>();
for (int i = 0; i < 10_000; i++)
    builder.Add(i); // mutação direta, rápido
ImmutableList<int> resultado = builder.ToImmutable();`}</code></pre>
      <p>
        O builder se comporta como uma <code>List&lt;T&gt;</code> tradicional. Quando você termina, <code>ToImmutable()</code> congela a estrutura.
      </p>

      <h2>A família imutável</h2>
      <p>
        Existem versões imutáveis de quase todas as coleções:
      </p>
      <pre><code>{`// Cada uma tem seu equivalente "mutável" mais conhecido
ImmutableList<int> il = ImmutableList.Create(1, 2, 3);
ImmutableArray<int> ia = ImmutableArray.Create(1, 2, 3);
ImmutableHashSet<int> ihs = ImmutableHashSet.Create(1, 2, 2, 3);
ImmutableDictionary<string, int> id = ImmutableDictionary
    .Create<string, int>()
    .Add("ana", 28)
    .Add("bruno", 30);
ImmutableSortedDictionary<string, int> isd = ImmutableSortedDictionary
    .Create<string, int>();
ImmutableQueue<int> iq = ImmutableQueue.Create(1, 2, 3);
ImmutableStack<int> ist = ImmutableStack.Create(1, 2, 3);`}</code></pre>

      <h2>ImmutableArray: o caso especial</h2>
      <p>
        <code>ImmutableArray&lt;T&gt;</code> é uma fina capa sobre um array comum. Acesso por índice é tão rápido quanto array normal (sem indireção), mas <em>qualquer</em> alteração copia tudo (O(n)). Use-a quando a coleção é montada uma vez e lida muitas vezes.
      </p>
      <pre><code>{`var dias = ImmutableArray.Create("seg", "ter", "qua", "qui", "sex");

Console.WriteLine(dias[2]); // "qua" — acesso ultra-rápido

// Add aqui é caro: cria array novo
var maisUm = dias.Add("sáb");`}</code></pre>

      <h2>Por que isso ajuda em multi-thread?</h2>
      <p>
        Em programação concorrente, o grande vilão são as <em>condições de corrida</em>: duas threads modificando a mesma coleção e gerando estado corrompido. Como uma imutável <strong>nunca</strong> muda depois de criada, você pode passá-la para quantas threads quiser sem nenhum lock — é fisicamente impossível alguém alterá-la.
      </p>
      <pre><code>{`// Configuração compartilhada entre threads
public static class Config
{
    public static ImmutableDictionary<string, string> Settings { get; private set; }
        = ImmutableDictionary<string, string>.Empty;

    public static void Update(string chave, string valor)
    {
        // Reatribui a referência atomicamente; a leitura por outras
        // threads ou pega a versão antiga ou a nova, nunca um meio-termo.
        Settings = Settings.SetItem(chave, valor);
    }
}`}</code></pre>

      <AlertBox type="success" title="Imutáveis são amigas dos records">
        Imutabilidade casa perfeitamente com <strong>records</strong> e <strong>tipos value-like</strong>. Programas funcionais inteiros são construídos com structs imutáveis e coleções imutáveis — um estilo cada vez mais valorizado em C# moderno.
      </AlertBox>

      <h2>Quando NÃO usar imutáveis</h2>
      <p>
        Imutáveis têm custo: cada alteração aloca. Em loops quentes que fazem milhares de mutações, prefira a coleção mutável tradicional. Use imutável para <em>estados</em> compartilhados, configurações, snapshots, e em domínios onde rastreabilidade da história importa.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Chamar <code>Add</code> e ignorar o retorno</strong>: a coleção original não muda. Sempre faça <code>x = x.Add(...)</code>.</li>
        <li><strong>Não usar Builder</strong> para muitas alterações em sequência — desperdício de alocações.</li>
        <li><strong>Achar que <code>ImmutableArray</code> nunca aloca</strong>: ela aloca a cada modificação (cópia integral).</li>
        <li><strong>Misturar o namespace</strong>: esqueceu o <code>using System.Collections.Immutable;</code> e o compilador não acha os tipos.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Coleções imutáveis nunca mudam; cada operação devolve nova versão.</li>
        <li>Vivem em <code>System.Collections.Immutable</code>.</li>
        <li>Persistência estrutural compartilha dados entre versões — mais leve do que parece.</li>
        <li>Use <code>Builder</code> para muitas alterações em lote.</li>
        <li>Thread-safe sem lock — perfeitas para estado compartilhado.</li>
      </ul>
    </PageContainer>
  );
}
