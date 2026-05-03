import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinqQuerySyntax() {
  return (
    <PageContainer
      title="Query syntax vs Method syntax em LINQ"
      subtitle="As duas formas de escrever LINQ — quando uma é mais clara que a outra e por que ambas existem."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        LINQ tem duas "caras". A primeira parece <strong>SQL</strong> escrito ao contrário (<code>from x in lista where ... select ...</code>) e se chama <strong>query syntax</strong>. A segunda parece chamada de método encadeada (<code>lista.Where(...).Select(...)</code>) e se chama <strong>method syntax</strong>. Por baixo dos panos, as duas viram exatamente o mesmo código compilado — query syntax é apenas <em>açúcar sintático</em> (uma forma mais bonita de escrever a mesma coisa). Saber as duas e escolher a mais legível para cada caso é marca de quem domina LINQ.
      </p>

      <h2>O mesmo exemplo nos dois estilos</h2>
      <p>
        Vamos começar com uma comparação direta. As duas queries abaixo fazem <strong>exatamente</strong> a mesma coisa — filtrar pessoas maiores de idade e devolver seus nomes em maiúsculas:
      </p>
      <pre><code>{`record Pessoa(string Nome, int Idade);

var pessoas = new[] {
    new Pessoa("Ana",   17),
    new Pessoa("João",  25),
    new Pessoa("Maria", 30)
};

// Query syntax — parecida com SQL invertido
var query = from p in pessoas
            where p.Idade >= 18
            select p.Nome.ToUpper();

// Method syntax — chamada encadeada
var metodo = pessoas
    .Where(p => p.Idade >= 18)
    .Select(p => p.Nome.ToUpper());`}</code></pre>

      <h2>A anatomia da query syntax</h2>
      <p>
        Toda query começa com <code>from X in Coleção</code> (declara a variável de iteração) e termina com <code>select</code> ou <code>group ... by</code>. Entre eles podem entrar quantos <code>where</code>, <code>orderby</code>, <code>join</code> e outros <code>from</code> você quiser.
      </p>
      <pre><code>{`var resultado = from p in pessoas        // origem
                where p.Idade >= 18      // filtro
                orderby p.Nome           // ordenação
                select new {             // projeção
                    p.Nome,
                    Categoria = p.Idade >= 60 ? "Sênior" : "Adulto"
                };`}</code></pre>
      <p>
        Note: a ordem é <code>from → where → orderby → select</code>. Em SQL, <code>SELECT</code> vem primeiro; em LINQ, vem por último — porque você só sabe o que projetar <em>depois</em> de filtrar.
      </p>

      <h2>let: variáveis intermediárias dentro da query</h2>
      <p>
        Uma das vantagens reais da query syntax é o <code>let</code>, que cria uma variável <em>derivada</em> dentro da query, evitando recalcular a mesma expressão várias vezes. Em method syntax, o equivalente seria fazer um <code>Select</code> intermediário com tipo anônimo — bem mais verboso.
      </p>
      <pre><code>{`// Query syntax com let:
var query = from arq in arquivos
            let tamMb = arq.Tamanho / 1024.0 / 1024.0
            where tamMb > 5
            orderby tamMb descending
            select new { arq.Nome, MB = tamMb };

// Equivalente em method syntax (sem let):
var metodo = arquivos
    .Select(arq => new { arq, tamMb = arq.Tamanho / 1024.0 / 1024.0 })
    .Where(x => x.tamMb > 5)
    .OrderByDescending(x => x.tamMb)
    .Select(x => new { x.arq.Nome, MB = x.tamMb });`}</code></pre>

      <AlertBox type="info" title="Use let para legibilidade">
        Sempre que uma expressão se repete duas ou mais vezes na query, extraia para um <code>let</code>. Além de mais rápido (calcula uma vez só), fica muito mais fácil de ler.
      </AlertBox>

      <h2>into: continuação de query</h2>
      <p>
        A palavra <code>into</code> permite "começar de novo" a query a partir de um resultado intermediário (group, join). Sem ela, você teria que quebrar em duas variáveis. Veja um agrupamento por idade:
      </p>
      <pre><code>{`var query = from p in pessoas
            group p by p.Idade / 10 * 10 into faixa
            // a partir daqui, "faixa" é cada grupo
            orderby faixa.Key
            select new {
                Decada  = faixa.Key,
                Nomes   = faixa.Select(x => x.Nome).ToList()
            };

// Saída de exemplo:
// { Decada = 10, Nomes = [Ana] }
// { Decada = 20, Nomes = [João] }
// { Decada = 30, Nomes = [Maria] }`}</code></pre>

      <h2>O que SÓ existe em method syntax</h2>
      <p>
        Várias operações <strong>não têm equivalente</strong> em query syntax: <code>Count</code>, <code>Sum</code>, <code>First</code>, <code>Distinct</code>, <code>Skip</code>, <code>Take</code>, <code>Aggregate</code>... Quando precisa delas, você é obrigado a misturar os dois estilos — colocando a query entre parênteses e chamando o método.
      </p>
      <pre><code>{`// Mistura — totalmente válida e comum:
int qtdAdultos = (from p in pessoas
                  where p.Idade >= 18
                  select p).Count();

// Ou só method:
int qtdAdultos2 = pessoas.Count(p => p.Idade >= 18);

// O segundo é mais idiomático para casos simples.`}</code></pre>

      <h2>Quando usar cada um?</h2>
      <p>
        Não há regra absoluta, mas a comunidade C# tende a:
      </p>
      <ul>
        <li>Usar <strong>query syntax</strong> quando há <code>join</code>, <code>group by</code>, ou várias variáveis temporárias com <code>let</code>. Fica mais legível.</li>
        <li>Usar <strong>method syntax</strong> em queries simples (filtrar, projetar) e quando precisa de operadores que só existem como método (<code>Distinct</code>, <code>Count</code>, <code>FirstOrDefault</code>...).</li>
        <li>Não misturar dentro de uma mesma expressão sem necessidade — escolha um estilo e mantenha.</li>
      </ul>

      <h2>O compilador faz a tradução</h2>
      <p>
        Esta query syntax:
      </p>
      <pre><code>{`from p in pessoas where p.Idade > 18 select p.Nome`}</code></pre>
      <p>
        é literalmente reescrita pelo compilador para:
      </p>
      <pre><code>{`pessoas.Where(p => p.Idade > 18).Select(p => p.Nome)`}</code></pre>
      <p>
        O compilador procura por métodos chamados <code>Where</code>, <code>Select</code>, <code>Join</code>, <code>GroupBy</code>, <code>OrderBy</code> e <code>SelectMany</code> sobre o tipo da coleção. Por isso LINQ funciona tanto sobre <code>IEnumerable</code> (memória) quanto sobre <code>IQueryable</code> (banco): qualquer tipo que ofereça esses métodos com a assinatura correta vira "queryable" automaticamente.
      </p>

      <AlertBox type="warning" title="Sempre termine em select ou group">
        Esquecer o <code>select</code> dá erro: <em>"Query body must end with a select clause or a group clause"</em>. Mesmo quando você só quer o objeto inteiro, escreva <code>select p</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar que <code>select</code> venha primeiro</strong> como em SQL — em LINQ ele vem por último.</li>
        <li><strong>Usar <code>==</code> em <code>join</code></strong>, em vez do obrigatório <code>equals</code>.</li>
        <li><strong>Esquecer parênteses ao misturar estilos</strong>: <code>(from ... select x).Count()</code>.</li>
        <li><strong>Renomear variável de iteração no meio da query</strong> sem usar <code>into</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Query syntax e method syntax são equivalentes — açúcar sintático.</li>
        <li>Query syntax brilha em joins, groups e queries com várias variáveis (<code>let</code>).</li>
        <li>Method syntax é única opção para vários operadores (<code>Count</code>, <code>First</code>...).</li>
        <li><code>let</code> cria variáveis intermediárias dentro da query.</li>
        <li><code>into</code> permite continuar a query a partir de um <code>group</code> ou <code>join</code>.</li>
        <li>O compilador traduz query syntax para chamadas de método antes de compilar.</li>
      </ul>
    </PageContainer>
  );
}
