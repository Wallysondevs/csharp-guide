import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinqSetOperations() {
  return (
    <PageContainer
      title="LINQ: Distinct, Union, Intersect, Except"
      subtitle="Operações de conjunto: remover duplicatas, juntar sem repetir, achar comuns ou diferenças entre coleções."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Lembra dos diagramas de Venn da escola — aqueles dois círculos que se sobrepõem? As <strong>operações de conjunto</strong> em LINQ são exatamente isso, mas em código. Você tem duas coleções e quer saber: o que existe em ambas? Só na primeira? Tudo junto sem duplicar? Para isso, LINQ oferece quatro operadores fundamentais: <code>Distinct</code>, <code>Union</code>, <code>Intersect</code> e <code>Except</code>. Eles compartilham uma característica: <strong>tratam a coleção como um conjunto matemático</strong>, ou seja, sem itens repetidos no resultado.
      </p>

      <h2>Distinct: removendo duplicatas</h2>
      <p>
        <code>Distinct</code> percorre a coleção e devolve cada valor único <em>uma única vez</em>, na ordem em que apareceu pela primeira vez. Por baixo dos panos, ele usa um <code>HashSet</code> — uma estrutura otimizada que checa "já vi este?" em tempo praticamente constante.
      </p>
      <pre><code>{`int[] numeros = { 1, 2, 2, 3, 3, 3, 4 };
var unicos = numeros.Distinct();
// → 1, 2, 3, 4

string[] tags = { "csharp", "CSHARP", "csharp", "linq" };
var deduplicado = tags.Distinct(StringComparer.OrdinalIgnoreCase);
// → "csharp", "linq"  (ignora caixa)`}</code></pre>
      <p>
        Para <strong>tipos primitivos e strings</strong>, o <code>Distinct</code> sem argumentos já funciona. Para classes próprias, leia abaixo sobre <code>IEqualityComparer</code>.
      </p>

      <h2>DistinctBy: deduplicar por uma propriedade</h2>
      <p>
        Disponível desde o .NET 6, <code>DistinctBy</code> permite remover duplicatas com base numa <em>chave</em> extraída de cada item — sem precisar implementar comparadores complicados.
      </p>
      <pre><code>{`record Pessoa(string Nome, int Idade);

var lista = new[] {
    new Pessoa("Ana",  30),
    new Pessoa("João", 25),
    new Pessoa("Ana",  31)   // mesmo nome, idade diferente
};

var unicas = lista.DistinctBy(p => p.Nome);
// → Ana(30), João(25)  — a segunda Ana some`}</code></pre>

      <h2>Union: juntar sem repetir</h2>
      <p>
        <code>Union</code> combina duas coleções em uma só, eliminando duplicatas. É como concatenar (<code>Concat</code>) e depois aplicar <code>Distinct</code>, mas em uma operação única e mais eficiente.
      </p>
      <pre><code>{`int[] a = { 1, 2, 3 };
int[] b = { 3, 4, 5 };

var todos    = a.Concat(b);  // 1,2,3,3,4,5  (mantém duplicata)
var conjunto = a.Union(b);   // 1,2,3,4,5    (sem duplicata)`}</code></pre>

      <AlertBox type="info" title="Concat vs Union">
        Use <code>Concat</code> quando quiser <em>todos</em> os elementos (preservando repetição). Use <code>Union</code> quando quiser tratar como conjunto. <code>Concat</code> é mais barato, então não pague o custo de remover duplicatas se não precisa.
      </AlertBox>

      <h2>Intersect: o que existe em ambas</h2>
      <p>
        <code>Intersect</code> devolve apenas os elementos que aparecem nas <strong>duas</strong> coleções. É como perguntar "quais clientes compraram tanto em janeiro quanto em fevereiro?".
      </p>
      <pre><code>{`int[] janeiro  = { 1, 2, 3, 4 };
int[] fevereiro = { 3, 4, 5, 6 };

var fieis = janeiro.Intersect(fevereiro);
// → 3, 4`}</code></pre>

      <h2>Except: o que está em A mas não em B</h2>
      <p>
        <code>Except</code> devolve os elementos da primeira coleção que <em>não</em> estão na segunda. É a "diferença" matemática (A − B). Útil para "quais pedidos pendentes ainda não foram processados".
      </p>
      <pre><code>{`int[] todos      = { 1, 2, 3, 4, 5 };
int[] processados = { 2, 4 };

var pendentes = todos.Except(processados);
// → 1, 3, 5

// IntersectBy / ExceptBy / UnionBy (NET 6+) aceitam seletor de chave:
var clientesDuplicados = clientesA.IntersectBy(
    clientesB.Select(c => c.Id),
    c => c.Id);`}</code></pre>

      <h2>Custom IEqualityComparer: comparar objetos como você quer</h2>
      <p>
        Quando trabalha com <strong>classes próprias</strong>, o C# por padrão compara por <em>referência</em> (mesmo objeto na memória), o que quase nunca é o que você quer. Há duas saídas: implementar <code>Equals</code>/<code>GetHashCode</code> na classe, ou passar um <code>IEqualityComparer</code> ad-hoc.
      </p>
      <pre><code>{`record Cliente(int Id, string Nome);

class CmpPorId : IEqualityComparer<Cliente> {
    public bool Equals(Cliente? a, Cliente? b) =>
        a?.Id == b?.Id;
    public int GetHashCode(Cliente c) => c.Id.GetHashCode();
}

var lista = new[] {
    new Cliente(1, "Ana"),
    new Cliente(1, "Ana Maria"), // mesmo Id
    new Cliente(2, "João")
};
var unicos = lista.Distinct(new CmpPorId());
// → Ana, João  (Ana Maria some, mesmo Id)`}</code></pre>
      <p>
        Atalho: como <code>record</code> em C# já implementa <code>Equals</code> baseado em <em>todas</em> as propriedades, dois <code>record</code>s com mesmas propriedades são considerados iguais sem você precisar fazer nada. É um dos motivos de <code>record</code> ser tão útil para modelos de dados.
      </p>

      <h2>Performance: o HashSet escondido</h2>
      <p>
        Todas essas operações constroem internamente um <code>HashSet&lt;T&gt;</code> da segunda coleção (ou da própria, no caso de <code>Distinct</code>). Isso significa:
      </p>
      <ul>
        <li>Custo de tempo: <strong>O(n + m)</strong> — bem rápido.</li>
        <li>Custo de memória: <strong>O(menor das duas)</strong> — a segunda coleção é totalmente carregada na memória.</li>
        <li>Para <code>IQueryable</code> (EF Core), o operador é traduzido para SQL (<code>UNION</code>, <code>INTERSECT</code>, <code>EXCEPT</code>) e roda no banco.</li>
      </ul>

      <AlertBox type="warning" title="Ordem do resultado">
        A documentação NÃO garante ordem em <code>Distinct</code>/<code>Union</code>/etc. Em LINQ-to-Objects, na prática, a ordem da primeira aparição é preservada — mas não confie nisso. Se precisa de ordem, use <code>OrderBy</code> depois.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Aplicar <code>Distinct</code> em classes</strong> sem <code>Equals</code>/<code>GetHashCode</code> — não dedupa nada porque compara por referência.</li>
        <li><strong>Confundir <code>Concat</code> com <code>Union</code></strong> — o primeiro mantém duplicatas, o segundo não.</li>
        <li><strong>Inverter <code>Except</code></strong>: <code>A.Except(B)</code> ≠ <code>B.Except(A)</code>.</li>
        <li><strong>Esperar ordenação</strong> do resultado — não é garantida.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Distinct</code> remove duplicatas; <code>DistinctBy</code> deduplica por chave.</li>
        <li><code>Union</code> = união sem duplicatas; <code>Concat</code> = concatenação simples.</li>
        <li><code>Intersect</code> = elementos comuns às duas coleções.</li>
        <li><code>Except</code> = elementos de A que não estão em B.</li>
        <li>Para classes próprias, use <code>IEqualityComparer</code> ou <code>record</code>.</li>
        <li>Implementação interna usa <code>HashSet</code>: O(n+m) em tempo, O(m) em memória.</li>
      </ul>
    </PageContainer>
  );
}
