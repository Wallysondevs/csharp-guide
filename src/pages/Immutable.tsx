import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Immutable() {
  return (
    <PageContainer
      title="Imutabilidade: por que e como tornar tipos imutáveis"
      subtitle="Aprenda a criar objetos que, depois de prontos, jamais mudam — e veja como isso reduz bugs, simplifica testes e libera multithread."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Um objeto <strong>imutável</strong> é aquele cujo estado interno não pode ser alterado depois que ele é criado. Pense em uma carteira de identidade: você recebe pronta, com todos os dados gravados; se algum dado mudar, gera-se uma nova carteira. É o oposto de um caderno de rascunho, onde você risca, sobrescreve e cola por cima. Em C#, abraçar a imutabilidade tem três consequências profundas: menos bugs (ninguém muda nada por baixo), facilidade em código paralelo (não há corrida por escrita) e raciocínio mais simples (o que entrou em uma variável é o que está lá).
      </p>

      <h2>Campos <code>readonly</code>: o nível mais antigo</h2>
      <p>
        O modificador <code>readonly</code> em um campo significa que ele só pode ser atribuído na declaração ou no construtor. Depois disso, qualquer tentativa de atribuição é erro de compilação.
      </p>
      <pre><code>{`public class Cep {
    public readonly string Valor;          // só atribuído no construtor
    public readonly DateTime CriadoEm = DateTime.UtcNow;

    public Cep(string valor) {
        Valor = valor;                     // OK
    }

    public void Reset() {
        // Valor = "00000-000";   // ERRO: campo readonly
    }
}`}</code></pre>
      <p>
        <code>readonly</code> só protege a <em>referência</em>, não o conteúdo apontado. Um <code>readonly List&lt;int&gt;</code> ainda pode ter elementos adicionados — você só não pode trocar a lista por outra. Para imutabilidade real de coleções, veja <code>ImmutableList&lt;T&gt;</code> mais adiante.
      </p>

      <h2>Propriedades <code>init-only</code>: imutabilidade moderna</h2>
      <p>
        Desde o C# 9, propriedades podem usar <code>init</code> no lugar de <code>set</code>. A semântica: pode ser atribuída em construtor, em <em>object initializer</em> e em expressão <code>with</code>; depois, é só leitura. É o melhor de dois mundos — você obtém imutabilidade sem perder a sintaxe declarativa de inicialização.
      </p>
      <pre><code>{`public class Pessoa {
    public string Nome { get; init; } = "";
    public int    Idade { get; init; }
}

var p = new Pessoa { Nome = "Ana", Idade = 30 };  // OK
// p.Nome = "Bia";   // ERRO: init-only fora de inicializador`}</code></pre>

      <AlertBox type="info" title="init não é só sintaxe">
        Sob o capô, o compilador gera um setter especial chamado <code>init_set</code> marcado com um modificador (<code>modreq</code>) que só pode ser invocado em contextos de inicialização. É verificado pelo compilador, mas o membro está lá.
      </AlertBox>

      <h2>Records: imutabilidade pronta para uso</h2>
      <p>
        Um <code>record</code> é uma classe especial otimizada para representar dados imutáveis. Por padrão, suas propriedades posicionais já vêm como <code>init</code>; <code>Equals</code>, <code>GetHashCode</code>, <code>ToString</code> e <code>Deconstruct</code> são gerados automaticamente; e existe a expressão <code>with</code> para "criar uma cópia mudando alguns campos".
      </p>
      <pre><code>{`public record Endereco(string Rua, string Cidade, string Cep);

var e1 = new Endereco("Rua A", "São Paulo", "01000-000");
var e2 = e1 with { Cidade = "Campinas" };   // CÓPIA com 1 campo trocado

Console.WriteLine(e1);    // Endereco { Rua = Rua A, Cidade = São Paulo, ... }
Console.WriteLine(e2);    // Endereco { Rua = Rua A, Cidade = Campinas, ... }
Console.WriteLine(e1 == e2);  // False — comparado por valor

var e3 = e1 with { };
Console.WriteLine(e1 == e3);  // True — mesmo conteúdo`}</code></pre>
      <p>
        A expressão <code>with</code> não muda <code>e1</code>: ela cria um novo objeto. Esse padrão "copy-and-modify" é o coração da imutabilidade prática. Ele é eficiente porque o compilador faz uma cópia de bits e ajusta só os campos pedidos.
      </p>

      <h2>Coleções imutáveis</h2>
      <p>
        Sua classe pode ter todos os campos <code>readonly</code>, mas se um deles for <code>List&lt;T&gt;</code>, você ainda tem mutabilidade interna. A solução é o namespace <code>System.Collections.Immutable</code>, que oferece versões verdadeiramente imutáveis: cada operação devolve uma nova coleção, e a antiga continua intacta.
      </p>
      <pre><code>{`using System.Collections.Immutable;

ImmutableList<int> nums = ImmutableList.Create(1, 2, 3);
ImmutableList<int> outros = nums.Add(4);   // NOVA lista; nums fica intacta

Console.WriteLine(string.Join(",", nums));     // 1,2,3
Console.WriteLine(string.Join(",", outros));   // 1,2,3,4

// Para construção em massa, há o builder eficiente:
var b = ImmutableArray.CreateBuilder<int>();
for (int i = 0; i < 1000; i++) b.Add(i);
ImmutableArray<int> finalArr = b.ToImmutable();`}</code></pre>
      <p>
        Internamente, essas coleções usam estruturas de dados persistentes (árvores balanceadas) que compartilham nodos entre versões — então adicionar um item a uma lista de mil elementos não copia mil elementos, mas sim O(log n) nodos.
      </p>

      <h2>Vantagens práticas da imutabilidade</h2>
      <p>
        Por que se preocupar com tudo isso?
      </p>
      <ul>
        <li><strong>Thread-safety grátis:</strong> objetos que não mudam não precisam de <code>lock</code>. Várias threads podem ler simultaneamente sem qualquer cuidado.</li>
        <li><strong>Cache seguro:</strong> você pode armazenar a referência sem medo de que alguém modifique o objeto e quebre seu cache.</li>
        <li><strong>Igualdade estável:</strong> hash code e equalidade dependem só dos valores iniciais — perfeitos como chave em <code>Dictionary</code>/<code>HashSet</code>.</li>
        <li><strong>Auditoria/histórico:</strong> com cópias <code>with</code>, você guarda versões anteriores facilmente.</li>
        <li><strong>Menos bugs distantes:</strong> o método A passa o objeto a B; quando A vai usá-lo de novo, ele tem certeza que está como antes.</li>
      </ul>
      <pre><code>{`// Antes: classe mutável — você nunca sabe quem mexeu
class CarrinhoMut { public List<string> Itens = new(); }
var c = new CarrinhoMut();
c.Itens.Add("Livro");
Processar(c);              // Processar pode adicionar/remover. Surpresa!

// Depois: record imutável — não há como mexer
public record Carrinho(ImmutableList<string> Itens) {
    public Carrinho Adicionar(string item) =>
        this with { Itens = Itens.Add(item) };
}
var c1 = new Carrinho(ImmutableList<string>.Empty);
var c2 = c1.Adicionar("Livro");
// c1 continua vazio, c2 tem "Livro"`}</code></pre>

      <AlertBox type="success" title="Imutável por padrão, mutável por exceção">
        Uma boa heurística moderna: comece todo modelo de domínio como imutável (record com init). Só transforme em mutável quando perfis de performance comprovarem que a alocação extra é problema. Quase nunca é.
      </AlertBox>

      <h2>Imutabilidade não é tudo</h2>
      <p>
        Há cenários em que mutabilidade é necessária: builders (<code>StringBuilder</code>), buffers de I/O, estados de UI, contadores em loops quentes. Não force imutabilidade onde ela não cabe — use os tipos certos para cada problema. O que importa é tornar a mutabilidade <em>local</em> e <em>controlada</em>: por exemplo, um builder mutável que ao final produz um objeto imutável.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Achar que <code>readonly</code> torna o conteúdo imutável:</strong> não. Só impede trocar a referência. Use coleções imutáveis para o conteúdo.</li>
        <li><strong>Esquecer de usar <code>with</code> e mutar via reflexão/JSON:</strong> serializadores podem contornar <code>init</code>. Não conte com imutabilidade contra atacantes.</li>
        <li><strong>Cópias profundas caras:</strong> <code>with</code> faz cópia rasa. Se há sub-objetos mutáveis, eles continuam compartilhados.</li>
        <li><strong>Records mutáveis "secretos":</strong> definir <code>public T Prop {`{ get; set; }`}</code> dentro de um record te devolve mutabilidade. Mantenha <code>init</code>.</li>
        <li><strong>Performance ingênua:</strong> em loops gigantes, ImmutableList causa alocações; nessas situações use builder e converta no fim.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Imutabilidade = estado fixo após construção.</li>
        <li><code>readonly</code> protege a referência do campo; <code>init</code> protege a propriedade.</li>
        <li><code>record</code> oferece imutabilidade + igualdade + <code>with</code> + <code>Deconstruct</code> embutidos.</li>
        <li><code>System.Collections.Immutable</code> dá coleções verdadeiramente imutáveis e eficientes.</li>
        <li>Vantagens: thread-safety, cache seguro, igualdade estável, código previsível.</li>
        <li>Use mutabilidade só quando provadamente necessário.</li>
      </ul>
    </PageContainer>
  );
}
