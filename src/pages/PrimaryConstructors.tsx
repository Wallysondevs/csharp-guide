import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PrimaryConstructors() {
  return (
    <PageContainer
      title="Primary constructors em classes (C# 12)"
      subtitle="A sintaxe enxuta para declarar parâmetros do construtor direto na linha da classe — agora também em classes comuns, não só em records."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Em C#, criar uma classe com construtor que apenas atribui parâmetros a campos é uma cerimônia repetitiva: declarar campo, declarar construtor, copiar parâmetro para campo. Os <strong>primary constructors</strong> resolvem isso: você declara os parâmetros direto após o nome da classe, e eles ficam disponíveis em todo o corpo. A ideia já existia em <code>record</code> desde o C# 9; o C# 12 estendeu para <code>class</code> e <code>struct</code> comuns. Pense numa "lista de ingredientes" no topo de uma receita — tudo que é necessário para preparar a classe está logo na primeira linha.
      </p>

      <h2>Sem primary constructor (forma antiga)</h2>
      <p>
        Antes do C# 12, escrever uma classe imutável simples era assim:
      </p>
      <pre><code>{`public class Pessoa {
    private readonly string _nome;
    private readonly int _idade;

    public Pessoa(string nome, int idade) {
        _nome = nome;
        _idade = idade;
    }

    public void Apresentar() {
        Console.WriteLine($"{_nome}, {_idade} anos");
    }
}`}</code></pre>
      <p>
        Note três blocos: declaração dos campos, construtor que atribui, e os métodos. Quase metade do arquivo é "burocracia" para mover dois valores.
      </p>

      <h2>Com primary constructor (C# 12)</h2>
      <p>
        Agora você declara os parâmetros diretamente após o nome da classe. Eles viram visíveis dentro do corpo inteiro:
      </p>
      <pre><code>{`public class Pessoa(string nome, int idade) {
    public void Apresentar() {
        // 'nome' e 'idade' acessíveis aqui, como se fossem campos
        Console.WriteLine($"{nome}, {idade} anos");
    }
}

var p = new Pessoa("Ana", 30);
p.Apresentar();   // Ana, 30 anos`}</code></pre>
      <p>
        Os parâmetros do primary constructor não são propriedades públicas (ao contrário do que acontece em records). Eles são <em>capturados</em> pela classe — o compilador gera campos privados de apoio quando você usa o parâmetro fora do próprio construtor.
      </p>

      <AlertBox type="info" title="Capturas, não propriedades">
        Em <code>class</code>: os parâmetros são <strong>privados</strong> e capturados conforme o uso. Em <code>record</code>: viram <strong>propriedades públicas init-only</strong> automaticamente, com igualdade por valor. É a diferença mais importante entre os dois mundos.
      </AlertBox>

      <h2>Diferença entre <code>record</code> e <code>class</code> com primary ctor</h2>
      <p>
        Compare lado a lado o que cada um gera:
      </p>
      <pre><code>{`// Record posicional (desde C# 9)
public record Pessoa(string Nome, int Idade);
// O compilador gera:
//  - Propriedades públicas Nome e Idade, init-only
//  - Equals/GetHashCode por valor
//  - ToString amigável
//  - Deconstruct: var (n, i) = pessoa;
//  - Método 'with' para clonar com mudanças

// Classe com primary ctor (C# 12)
public class Pessoa(string nome, int idade) {
    // NADA é gerado automaticamente
    // 'nome' e 'idade' são parâmetros capturados, em minúsculo
    // sem propriedades, sem Equals por valor, sem with, sem ToString
}`}</code></pre>
      <p>
        Por isso a convenção: <strong>parâmetros de primary ctor em <code>class</code> usam camelCase</strong> (como qualquer parâmetro), enquanto propriedades de <code>record</code> usam PascalCase.
      </p>

      <h2>Expondo como propriedades quando quiser</h2>
      <p>
        Se você quer propriedades públicas, declare-as explicitamente, inicializadas com os parâmetros:
      </p>
      <pre><code>{`public class Pessoa(string nome, int idade) {
    // Propriedades públicas iniciadas a partir dos parâmetros
    public string Nome { get; } = nome;
    public int Idade { get; } = idade;

    public bool EhMaiorIdade => Idade >= 18;
}

var p = new Pessoa("Ana", 30);
Console.WriteLine(p.Nome);          // Ana
Console.WriteLine(p.EhMaiorIdade);  // True`}</code></pre>
      <p>
        Aqui, <code>nome</code> e <code>idade</code> são usados <em>uma vez</em> (no inicializador) e o compilador NÃO gera campo de apoio — ele apenas atribui à propriedade. Isso é mais eficiente do que capturar.
      </p>

      <h2>Validação de parâmetros</h2>
      <p>
        Como não há corpo de construtor explícito, você valida no inicializador de uma propriedade ou usando expressão. Padrão idiomático:
      </p>
      <pre><code>{`public class Conta(string titular, decimal saldoInicial) {
    public string Titular { get; } =
        string.IsNullOrWhiteSpace(titular)
            ? throw new ArgumentException("Titular obrigatório", nameof(titular))
            : titular;

    public decimal Saldo { get; private set; } =
        saldoInicial < 0
            ? throw new ArgumentOutOfRangeException(nameof(saldoInicial))
            : saldoInicial;

    public void Depositar(decimal valor) => Saldo += valor;
}`}</code></pre>

      <h2>Injeção de dependência elegante</h2>
      <p>
        O caso de uso mais útil: serviços que recebem dependências via construtor. Antes era ladainha; agora é uma linha:
      </p>
      <pre><code>{`// Antes
public class UsuarioService {
    private readonly IUsuarioRepo _repo;
    private readonly ILogger<UsuarioService> _logger;
    public UsuarioService(IUsuarioRepo repo, ILogger<UsuarioService> logger) {
        _repo = repo;
        _logger = logger;
    }
    public async Task<Usuario?> Buscar(int id) {
        _logger.LogInformation("Buscando {Id}", id);
        return await _repo.ObterAsync(id);
    }
}

// Depois (C# 12)
public class UsuarioService(IUsuarioRepo repo, ILogger<UsuarioService> logger) {
    public async Task<Usuario?> Buscar(int id) {
        logger.LogInformation("Buscando {Id}", id);
        return await repo.ObterAsync(id);
    }
}`}</code></pre>

      <h2>Construtores adicionais</h2>
      <p>
        Você pode adicionar outros construtores, mas todos <strong>precisam chamar o primary</strong> via <code>: this(...)</code>. Isso garante que os parâmetros do primary sempre estejam definidos:
      </p>
      <pre><code>{`public class Pessoa(string nome, int idade) {
    // Construtor secundário: chama o primary com idade padrão
    public Pessoa(string nome) : this(nome, 0) { }

    // Outro: nome anônimo
    public Pessoa() : this("Anônimo") { }
}`}</code></pre>

      <AlertBox type="warning" title="Cuidado com captura mutável">
        Se um parâmetro do primary ctor for usado em métodos (não só na inicialização de propriedades), o compilador cria um <em>campo privado mutável</em>. Isso significa que você poderia atribuir <code>nome = "outro";</code> dentro de um método e mudar o "estado" — comportamento que iniciantes esperam que seja imutável. Use propriedades <code>{`{ get; }`}</code> para garantir imutabilidade.
      </AlertBox>

      <h2>Quando usar (e quando não)</h2>
      <ul>
        <li><strong>Use:</strong> serviços com injeção de dependência, classes pequenas com poucos parâmetros, código onde a verbosidade do construtor estava atrapalhando.</li>
        <li><strong>Use record:</strong> quando quer DTO imutável com igualdade por valor.</li>
        <li><strong>Não use:</strong> classes com lógica complexa de inicialização (validações múltiplas, side-effects, ramos condicionais) — um construtor explícito comunica melhor a intenção.</li>
        <li><strong>Não use:</strong> classes com muitos parâmetros (5+) — vire-os em um objeto de configuração ou use builder.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar propriedades públicas:</strong> em <code>class</code>, parâmetros são privados. Para expor, declare propriedade explicitamente.</li>
        <li><strong>Esperar Equals por valor:</strong> só vem em <code>record</code>. Em <code>class</code>, você ainda precisa sobrescrever manualmente.</li>
        <li><strong>Construtor secundário sem <code>: this(...)</code>:</strong> erro de compilação. O primary é o "construtor base" do tipo.</li>
        <li><strong>Misturar primary ctor com inicializadores de campo posicionais:</strong> a ordem de execução é parâmetros → inicializadores de campo → corpo do primary (não há corpo explícito). Atenção a dependências entre eles.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Primary ctor declara parâmetros direto após o nome da classe.</li>
        <li>Em <code>class</code>: parâmetros são privados e capturados conforme uso.</li>
        <li>Em <code>record</code>: viram propriedades públicas init-only com igualdade por valor.</li>
        <li>Outros construtores precisam encadear via <code>: this(...)</code>.</li>
        <li>Reduz drasticamente a "cerimônia" de classes com injeção de dependência.</li>
      </ul>
    </PageContainer>
  );
}
