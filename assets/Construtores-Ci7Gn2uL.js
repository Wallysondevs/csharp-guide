import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"Construtores: dando vida aos objetos",subtitle:"Construtores são as fábricas dos seus objetos. Aprenda a garantir que cada instância nasça em um estado válido.",difficulty:"iniciante",timeToRead:"14 min",children:[e.jsxs("p",{children:["Imagine que toda vez que um bebê nasce, ele já precisa ter nome registrado, data de nascimento e tipo sanguíneo definidos — caso contrário, vira um problema. Em C#, o ",e.jsx("strong",{children:"construtor"}),' é o "cartório" que garante que todo objeto nasça com as informações essenciais já preenchidas. É um método especial chamado automaticamente quando você usa ',e.jsx("code",{children:"new"}),". Sem entender construtores, você cria objetos quebrados, com campos vazios e bugs imprevisíveis."]}),e.jsx("h2",{children:"Construtor padrão (sem parâmetros)"}),e.jsxs("p",{children:["Se você não escreve nenhum construtor, o compilador ",e.jsx("strong",{children:"fabrica um sozinho"}),": o chamado ",e.jsx("em",{children:"construtor padrão"}),", que não recebe nada e apenas inicializa os campos com seus valores default (0 para ",e.jsx("code",{children:"int"}),", ",e.jsx("code",{children:"null"})," para referências, ",e.jsx("code",{children:"false"})," para ",e.jsx("code",{children:"bool"}),"). É por isso que ",e.jsx("code",{children:"new Carro()"})," funciona mesmo sem você ter escrito nada."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Animal
{
    public string Nome { get; set; } = "Sem nome";
    public int Idade { get; set; }
    // Nenhum construtor escrito. O compilador cria:
    // public Animal() { }
}

var bicho = new Animal(); // Funciona; Nome = "Sem nome", Idade = 0`})}),e.jsx("h2",{children:"Construtores com parâmetros"}),e.jsxs("p",{children:["Para forçar quem cria o objeto a fornecer dados essenciais, escreva um construtor explícito. Note que ele tem o ",e.jsx("strong",{children:"mesmo nome da classe"})," e ",e.jsx("strong",{children:"nenhum tipo de retorno"})," (nem ",e.jsx("code",{children:"void"}),")."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pessoa
{
    public string Nome { get; }
    public DateTime Nascimento { get; }

    // Construtor: obriga a passar nome e data de nascimento
    public Pessoa(string nome, DateTime nascimento)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome obrigatório.", nameof(nome));

        Nome = nome;
        Nascimento = nascimento;
    }
}

var maria = new Pessoa("Maria", new DateTime(1990, 5, 12));
// var x = new Pessoa(); // ERRO: não existe mais construtor sem parâmetros`})}),e.jsxs("p",{children:["Quando você define ",e.jsx("em",{children:"qualquer"})," construtor explícito, o compilador deixa de criar o construtor padrão automaticamente. Se ainda quiser permitir ",e.jsx("code",{children:"new Pessoa()"}),", precisa adicionar um construtor sem parâmetros à mão."]}),e.jsxs(o,{type:"info",title:"Por que validar no construtor?",children:["Validar no construtor garante que ",e.jsx("strong",{children:"nunca"}),' exista uma instância em estado inválido. Se a regra "nome não pode ser vazio" estiver no construtor, você pode confiar nessa regra em todo o resto do código.']}),e.jsxs("h2",{children:["Encadeamento com ",e.jsx("code",{children:"this(...)"})]}),e.jsxs("p",{children:["Quando você quer várias formas de criar o mesmo objeto, sem repetir código, use ",e.jsx("code",{children:"this(...)"})," para um construtor chamar outro da mesma classe."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Retangulo
{
    public double Largura { get; }
    public double Altura { get; }

    public Retangulo(double largura, double altura)
    {
        Largura = largura;
        Altura = altura;
    }

    // Quadrado é só um retângulo com largura == altura
    public Retangulo(double lado) : this(lado, lado) { }
}

var quadrado = new Retangulo(5);     // chama o construtor de 2 args via this(...)
var retang   = new Retangulo(4, 7);`})}),e.jsxs("h2",{children:["Encadeamento com ",e.jsx("code",{children:"base(...)"})," em herança"]}),e.jsxs("p",{children:["Quando uma classe filha herda de uma pai, o construtor da filha precisa garantir que o construtor da pai também rode (afinal, a pai pode ter regras próprias). Use ",e.jsx("code",{children:"base(...)"})," para passar os argumentos."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Veiculo
{
    public string Modelo { get; }
    public Veiculo(string modelo) { Modelo = modelo; }
}

public class Caminhao : Veiculo
{
    public int CapacidadeKg { get; }

    public Caminhao(string modelo, int capacidade)
        : base(modelo) // chama o construtor da pai
    {
        CapacidadeKg = capacidade;
    }
}`})}),e.jsx("h2",{children:"Construtor estático"}),e.jsxs("p",{children:["Existe também o ",e.jsx("strong",{children:"construtor estático"}),", marcado com ",e.jsx("code",{children:"static"}),". Ele roda ",e.jsx("em",{children:"uma única vez"}),", automaticamente, antes de qualquer uso da classe. Serve para inicializar dados estáticos (compartilhados por todas as instâncias)."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Configuracao
{
    public static string Versao { get; }

    // Construtor estático: roda uma vez, sem parâmetros, sem modificador de acesso
    static Configuracao()
    {
        Versao = "1.0.0-" + DateTime.UtcNow.Year;
        Console.WriteLine("Configuracao inicializada.");
    }
}`})}),e.jsx("h2",{children:"Primary constructors (C# 12)"}),e.jsxs("p",{children:["A partir do C# 12, você pode declarar parâmetros direto no cabeçalho da classe — o chamado ",e.jsx("strong",{children:"construtor primário"}),". Eles ficam disponíveis em qualquer membro da classe, sem precisar atribuir manualmente a campos. Ótimo para reduzir boilerplate."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Construtor primário: parâmetros disponíveis em todo o corpo
public class Funcionario(string nome, decimal salario)
{
    public string Nome { get; } = nome;
    public decimal Salario { get; private set; } = salario;

    public void Aumentar(decimal percentual)
    {
        Salario += Salario * percentual;
        Console.WriteLine($"{nome} agora ganha {Salario:C}.");
    }
}

var f = new Funcionario("Ana", 5000m);
f.Aumentar(0.10m); // Ana agora ganha R$ 5.500,00.`})}),e.jsx("h2",{children:"Object initializer: o atalho elegante"}),e.jsxs("p",{children:["Quando o construtor não cobre todas as propriedades, você pode complementar com ",e.jsx("strong",{children:"object initializer"}),", usando chaves ",e.jsx("code",{children:"{ }"})," logo após o ",e.jsx("code",{children:"new"}),". Funciona com qualquer propriedade que tenha ",e.jsx("code",{children:"set"})," ou ",e.jsx("code",{children:"init"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Carro
{
    public string Modelo { get; init; } = "";
    public string Cor { get; init; } = "";
    public int Ano { get; init; }
}

var c = new Carro
{
    Modelo = "Civic",
    Cor = "Preto",
    Ano = 2025
};`})}),e.jsxs(o,{type:"warning",title:"Object initializer roda DEPOIS do construtor",children:["As atribuições do ",e.jsx("code",{children:"{ }"})," ocorrem após o construtor terminar. Se sua validação está no construtor e o valor obrigatório vem só pelo initializer, a validação não funciona. Use ",e.jsx("code",{children:"required"})," (C# 11+) para forçar a presença de propriedades."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar construtor padrão depois de criar um com parâmetros"}),": o compilador deixa de fabricá-lo automaticamente."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar usar ",e.jsx("code",{children:"this"})," antes da chamada ",e.jsx("code",{children:": this(...)"})," ou ",e.jsx("code",{children:": base(...)"})]}),": a inicialização da pai/encadeada acontece antes do corpo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer que construtor estático não tem modificador de acesso"}),": ele é sempre privado por natureza, controlado pelo runtime."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar lógica pesada no construtor"}),": chamar I/O, banco ou rede no construtor torna o objeto difícil de testar. Prefira métodos como ",e.jsx("code",{children:"Carregar()"})," ou ",e.jsx("em",{children:"factory methods"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Construtor é um método especial com o nome da classe e sem retorno."}),e.jsx("li",{children:"O construtor padrão só existe se você não definir nenhum."}),e.jsxs("li",{children:[e.jsx("code",{children:": this(...)"})," evita repetição entre construtores da mesma classe."]}),e.jsxs("li",{children:[e.jsx("code",{children:": base(...)"})," chama o construtor da classe pai."]}),e.jsxs("li",{children:["Construtor ",e.jsx("code",{children:"static"})," roda uma vez, automaticamente, para a classe."]}),e.jsx("li",{children:"C# 12 traz construtores primários direto no cabeçalho da classe."}),e.jsxs("li",{children:["Object initializer ",e.jsx("code",{children:"{ ... }"})," roda depois do construtor."]})]})]})}export{i as default};
