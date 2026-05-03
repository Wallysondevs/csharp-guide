import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ClassesStaticPartial() {
  return (
    <PageContainer
      title="Classes static, partial e nested"
      subtitle="Três variações de classe que resolvem problemas específicos: agrupar utilitários, dividir código em arquivos e encapsular tipos auxiliares."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Nem toda classe precisa virar um objeto que você instancia, e nem todo arquivo precisa conter uma classe inteira. Em C#, três modificadores ampliam o conceito tradicional de classe para resolver problemas práticos do dia a dia: <strong><code>static</code></strong> (caixa de utilitários sem instância), <strong><code>partial</code></strong> (mesma classe espalhada em vários arquivos) e <strong>nested</strong> (uma classe dentro da outra). Conhecer cada uma evita criar workarounds estranhos quando uma simples palavrinha resolve.
      </p>

      <h2>Static class: a caixa de ferramentas</h2>
      <p>
        Uma <strong>classe estática</strong> é uma classe que <em>nunca</em> é instanciada. Ela existe só para agrupar funções e dados relacionados que não dependem de "estado de objeto". O exemplo clássico é <code>Math</code> do .NET: você nunca escreve <code>new Math()</code>; chama direto <code>Math.Sqrt(9)</code>.
      </p>
      <pre><code>{`public static class CalculadoraIR
{
    // Constantes que pertencem à classe, não a instâncias
    public const decimal Faixa1 = 2259.20m;
    public const decimal Faixa2 = 2826.65m;

    // Método utilitário sem dependência de estado
    public static decimal CalcularImposto(decimal salario)
    {
        if (salario <= Faixa1) return 0m;
        if (salario <= Faixa2) return (salario - Faixa1) * 0.075m;
        return (salario - Faixa1) * 0.15m;
    }
}

// Uso direto, sem 'new'
decimal ir = CalculadoraIR.CalcularImposto(3000m);`}</code></pre>
      <p>
        Regras: toda classe <code>static</code> só pode conter membros <code>static</code>; o compilador impede que você crie campos de instância ou construtores normais. Não pode ser herdada nem usada como tipo de variável.
      </p>

      <AlertBox type="info" title="static using"
      >
        Você pode importar todos os membros estáticos de uma classe com <code>using static System.Math;</code> e depois chamar <code>Sqrt(9)</code> sem o prefixo. Útil em código matemático, mas use com moderação para não confundir o leitor.
      </AlertBox>

      <h2>Partial class: a mesma classe em vários arquivos</h2>
      <p>
        Uma <strong>classe parcial</strong> é uma classe cuja definição está dividida em dois ou mais arquivos. O compilador junta as partes na hora de compilar, como se tivesse sido escrita inteira em um arquivo só. Foi criada para suportar geradores de código (<em>code generators</em>): a ferramenta gera um arquivo, você escreve o complemento em outro, sem nenhum dos dois "passar por cima" do outro.
      </p>
      <pre><code>{`// Arquivo: Pessoa.cs (escrito por você)
public partial class Pessoa
{
    public string Nome { get; init; } = "";

    public void Apresentar()
        => Console.WriteLine($"Olá, sou {Nome}.");
}

// Arquivo: Pessoa.Generated.cs (gerado por uma ferramenta)
public partial class Pessoa
{
    public Guid Id { get; init; } = Guid.NewGuid();

    public string Resumo() => $"#{Id} - {Nome}";
}`}</code></pre>
      <p>
        Os dois arquivos compõem uma única classe <code>Pessoa</code> com quatro membros. Use <code>partial</code> quando faz sentido separar visualmente código manual de código gerado, ou quando uma classe muito grande beneficia de divisão por responsabilidade (mas, em geral, classes muito grandes pedem refatoração, não divisão).
      </p>

      <h2>Partial methods: assinatura sem corpo obrigatório</h2>
      <p>
        Em conjunto com <code>partial</code>, você pode declarar <strong>métodos parciais</strong>: a assinatura aparece em uma parte; o corpo é opcional na outra. Se ninguém implementa, o compilador remove a chamada inteira — útil para "ganchos" de extensão sem custo.
      </p>
      <pre><code>{`public partial class Pessoa
{
    partial void OnNomeAlterado(string novoNome);

    public void RenomearPara(string novoNome)
    {
        Nome = novoNome;
        OnNomeAlterado(novoNome); // some se ninguém implementar
    }
}

// Em outro arquivo, opcionalmente:
public partial class Pessoa
{
    partial void OnNomeAlterado(string novoNome)
        => Console.WriteLine($"Renomeado para {novoNome}");
}`}</code></pre>

      <h2>Nested class: classe dentro de classe</h2>
      <p>
        Uma <strong>classe aninhada</strong> é declarada dentro de outra. Ela serve para encapsular um tipo auxiliar que só faz sentido no contexto da classe externa. Cada instância da nested é totalmente independente do enclosing — não há acoplamento mágico de dados.
      </p>
      <pre><code>{`public class CarrinhoCompras
{
    private readonly List<Item> itens = new();

    // Nested class: faz sentido somente dentro de CarrinhoCompras
    public class Item
    {
        public string Produto { get; init; } = "";
        public decimal Preco { get; init; }
        public int Quantidade { get; init; }
    }

    public void Adicionar(Item i) => itens.Add(i);
    public decimal Total => itens.Sum(i => i.Preco * i.Quantidade);
}

// Uso de fora: o nome qualificado é Externa.Interna
var c = new CarrinhoCompras();
c.Adicionar(new CarrinhoCompras.Item
{
    Produto = "Café",
    Preco = 25.50m,
    Quantidade = 2
});`}</code></pre>
      <p>
        Vantagens: o tipo auxiliar não polui o namespace global; quem lê o código de fora vê imediatamente a relação ("Item pertence a Carrinho"); pode acessar membros <code>private</code> da classe externa quando útil.
      </p>

      <AlertBox type="warning" title="Nested ≠ inner class do Java"
      >
        Em Java, "inner class" mantém referência implícita ao objeto externo. Em C#, uma classe aninhada NÃO mantém essa referência: ela é como uma classe normal, só com nome qualificado. Para acessar a instância externa, você precisa passar uma referência explícita.
      </AlertBox>

      <h2>Casos de uso típicos</h2>
      <ul>
        <li><strong>static class</strong>: utilitários (<code>Math</code>, <code>String</code>, <code>File</code>), métodos de extensão (capítulo próprio), constantes globais agrupadas, fábricas que não precisam de estado.</li>
        <li><strong>partial class</strong>: tipos gerados por ferramentas (Entity Framework, designers WinForms/WPF, Source Generators), separar a UI da lógica em arquivos diferentes.</li>
        <li><strong>nested class</strong>: tipos auxiliares pertinentes só ao escopo da externa (<em>builder</em> interno, nó de árvore, item de coleção customizada, enumerador específico).</li>
      </ul>

      <h2>Combinação útil: nested + private + record</h2>
      <p>
        Um padrão moderno: classe nested marcada como <code>private</code>, usada como detalhe de implementação invisível por fora. Frequentemente combinada com <code>record</code> para virar um DTO interno.
      </p>
      <pre><code>{`public class CacheUsuarios
{
    // Detalhe interno: ninguém de fora vê esta classe
    private record Entrada(string Nome, DateTime ExpiraEm);

    private readonly Dictionary<int, Entrada> mapa = new();

    public void Adicionar(int id, string nome)
        => mapa[id] = new Entrada(nome, DateTime.UtcNow.AddMinutes(10));

    public string? Buscar(int id)
        => mapa.TryGetValue(id, out var e) && e.ExpiraEm > DateTime.UtcNow
            ? e.Nome
            : null;
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar instanciar uma <code>static class</code></strong>: o compilador bloqueia. Static é "namespace de funções", não "objeto".</li>
        <li><strong>Esquecer <code>partial</code> em uma das partes</strong>: se um arquivo declara <code>partial class X</code> e outro só <code>class X</code>, o compilador acusa duplicidade.</li>
        <li><strong>Achar que nested vê o estado da externa automaticamente</strong>: precisa passar a referência (<code>this</code>) explicitamente.</li>
        <li><strong>Usar partial só para "diminuir" um arquivo</strong>: se a classe está grande demais, talvez ela tenha responsabilidades demais — refatore em vez de só dividir.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>static class</code>: nunca instanciada; só membros estáticos; ótima para utilitários.</li>
        <li><code>partial class</code>: definição espalhada em vários arquivos; o compilador junta tudo.</li>
        <li><code>partial method</code>: declarado num arquivo, opcionalmente implementado em outro.</li>
        <li>Nested class: declarada dentro de outra; encapsula tipos auxiliares relacionados.</li>
        <li>Combinações como nested + private + record dão tipos internos elegantes.</li>
      </ul>
    </PageContainer>
  );
}
