import{j as e}from"./index-CzLAthD5.js";import{P as o,A as r}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(o,{title:"Primary constructors em classes (C# 12)",subtitle:"A sintaxe enxuta para declarar parâmetros do construtor direto na linha da classe — agora também em classes comuns, não só em records.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:["Em C#, criar uma classe com construtor que apenas atribui parâmetros a campos é uma cerimônia repetitiva: declarar campo, declarar construtor, copiar parâmetro para campo. Os ",e.jsx("strong",{children:"primary constructors"})," resolvem isso: você declara os parâmetros direto após o nome da classe, e eles ficam disponíveis em todo o corpo. A ideia já existia em ",e.jsx("code",{children:"record"})," desde o C# 9; o C# 12 estendeu para ",e.jsx("code",{children:"class"})," e ",e.jsx("code",{children:"struct"}),' comuns. Pense numa "lista de ingredientes" no topo de uma receita — tudo que é necessário para preparar a classe está logo na primeira linha.']}),e.jsx("h2",{children:"Sem primary constructor (forma antiga)"}),e.jsx("p",{children:"Antes do C# 12, escrever uma classe imutável simples era assim:"}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pessoa {
    private readonly string _nome;
    private readonly int _idade;

    public Pessoa(string nome, int idade) {
        _nome = nome;
        _idade = idade;
    }

    public void Apresentar() {
        Console.WriteLine($"{_nome}, {_idade} anos");
    }
}`})}),e.jsx("p",{children:'Note três blocos: declaração dos campos, construtor que atribui, e os métodos. Quase metade do arquivo é "burocracia" para mover dois valores.'}),e.jsx("h2",{children:"Com primary constructor (C# 12)"}),e.jsx("p",{children:"Agora você declara os parâmetros diretamente após o nome da classe. Eles viram visíveis dentro do corpo inteiro:"}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pessoa(string nome, int idade) {
    public void Apresentar() {
        // 'nome' e 'idade' acessíveis aqui, como se fossem campos
        Console.WriteLine($"{nome}, {idade} anos");
    }
}

var p = new Pessoa("Ana", 30);
p.Apresentar();   // Ana, 30 anos`})}),e.jsxs("p",{children:["Os parâmetros do primary constructor não são propriedades públicas (ao contrário do que acontece em records). Eles são ",e.jsx("em",{children:"capturados"})," pela classe — o compilador gera campos privados de apoio quando você usa o parâmetro fora do próprio construtor."]}),e.jsxs(r,{type:"info",title:"Capturas, não propriedades",children:["Em ",e.jsx("code",{children:"class"}),": os parâmetros são ",e.jsx("strong",{children:"privados"})," e capturados conforme o uso. Em ",e.jsx("code",{children:"record"}),": viram ",e.jsx("strong",{children:"propriedades públicas init-only"})," automaticamente, com igualdade por valor. É a diferença mais importante entre os dois mundos."]}),e.jsxs("h2",{children:["Diferença entre ",e.jsx("code",{children:"record"})," e ",e.jsx("code",{children:"class"})," com primary ctor"]}),e.jsx("p",{children:"Compare lado a lado o que cada um gera:"}),e.jsx("pre",{children:e.jsx("code",{children:`// Record posicional (desde C# 9)
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
}`})}),e.jsxs("p",{children:["Por isso a convenção: ",e.jsxs("strong",{children:["parâmetros de primary ctor em ",e.jsx("code",{children:"class"})," usam camelCase"]})," (como qualquer parâmetro), enquanto propriedades de ",e.jsx("code",{children:"record"})," usam PascalCase."]}),e.jsx("h2",{children:"Expondo como propriedades quando quiser"}),e.jsx("p",{children:"Se você quer propriedades públicas, declare-as explicitamente, inicializadas com os parâmetros:"}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pessoa(string nome, int idade) {
    // Propriedades públicas iniciadas a partir dos parâmetros
    public string Nome { get; } = nome;
    public int Idade { get; } = idade;

    public bool EhMaiorIdade => Idade >= 18;
}

var p = new Pessoa("Ana", 30);
Console.WriteLine(p.Nome);          // Ana
Console.WriteLine(p.EhMaiorIdade);  // True`})}),e.jsxs("p",{children:["Aqui, ",e.jsx("code",{children:"nome"})," e ",e.jsx("code",{children:"idade"})," são usados ",e.jsx("em",{children:"uma vez"})," (no inicializador) e o compilador NÃO gera campo de apoio — ele apenas atribui à propriedade. Isso é mais eficiente do que capturar."]}),e.jsx("h2",{children:"Validação de parâmetros"}),e.jsx("p",{children:"Como não há corpo de construtor explícito, você valida no inicializador de uma propriedade ou usando expressão. Padrão idiomático:"}),e.jsx("pre",{children:e.jsx("code",{children:`public class Conta(string titular, decimal saldoInicial) {
    public string Titular { get; } =
        string.IsNullOrWhiteSpace(titular)
            ? throw new ArgumentException("Titular obrigatório", nameof(titular))
            : titular;

    public decimal Saldo { get; private set; } =
        saldoInicial < 0
            ? throw new ArgumentOutOfRangeException(nameof(saldoInicial))
            : saldoInicial;

    public void Depositar(decimal valor) => Saldo += valor;
}`})}),e.jsx("h2",{children:"Injeção de dependência elegante"}),e.jsx("p",{children:"O caso de uso mais útil: serviços que recebem dependências via construtor. Antes era ladainha; agora é uma linha:"}),e.jsx("pre",{children:e.jsx("code",{children:`// Antes
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
}`})}),e.jsx("h2",{children:"Construtores adicionais"}),e.jsxs("p",{children:["Você pode adicionar outros construtores, mas todos ",e.jsx("strong",{children:"precisam chamar o primary"})," via ",e.jsx("code",{children:": this(...)"}),". Isso garante que os parâmetros do primary sempre estejam definidos:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pessoa(string nome, int idade) {
    // Construtor secundário: chama o primary com idade padrão
    public Pessoa(string nome) : this(nome, 0) { }

    // Outro: nome anônimo
    public Pessoa() : this("Anônimo") { }
}`})}),e.jsxs(r,{type:"warning",title:"Cuidado com captura mutável",children:["Se um parâmetro do primary ctor for usado em métodos (não só na inicialização de propriedades), o compilador cria um ",e.jsx("em",{children:"campo privado mutável"}),". Isso significa que você poderia atribuir ",e.jsx("code",{children:'nome = "outro";'}),' dentro de um método e mudar o "estado" — comportamento que iniciantes esperam que seja imutável. Use propriedades ',e.jsx("code",{children:"{ get; }"})," para garantir imutabilidade."]}),e.jsx("h2",{children:"Quando usar (e quando não)"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Use:"})," serviços com injeção de dependência, classes pequenas com poucos parâmetros, código onde a verbosidade do construtor estava atrapalhando."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Use record:"})," quando quer DTO imutável com igualdade por valor."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não use:"})," classes com lógica complexa de inicialização (validações múltiplas, side-effects, ramos condicionais) — um construtor explícito comunica melhor a intenção."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não use:"})," classes com muitos parâmetros (5+) — vire-os em um objeto de configuração ou use builder."]})]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar propriedades públicas:"})," em ",e.jsx("code",{children:"class"}),", parâmetros são privados. Para expor, declare propriedade explicitamente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar Equals por valor:"})," só vem em ",e.jsx("code",{children:"record"}),". Em ",e.jsx("code",{children:"class"}),", você ainda precisa sobrescrever manualmente."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Construtor secundário sem ",e.jsx("code",{children:": this(...)"}),":"]}),' erro de compilação. O primary é o "construtor base" do tipo.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar primary ctor com inicializadores de campo posicionais:"})," a ordem de execução é parâmetros → inicializadores de campo → corpo do primary (não há corpo explícito). Atenção a dependências entre eles."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Primary ctor declara parâmetros direto após o nome da classe."}),e.jsxs("li",{children:["Em ",e.jsx("code",{children:"class"}),": parâmetros são privados e capturados conforme uso."]}),e.jsxs("li",{children:["Em ",e.jsx("code",{children:"record"}),": viram propriedades públicas init-only com igualdade por valor."]}),e.jsxs("li",{children:["Outros construtores precisam encadear via ",e.jsx("code",{children:": this(...)"}),"."]}),e.jsx("li",{children:'Reduz drasticamente a "cerimônia" de classes com injeção de dependência.'})]})]})}export{i as default};
