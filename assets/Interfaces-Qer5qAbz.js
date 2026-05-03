import{j as e}from"./index-CzLAthD5.js";import{P as o,A as a}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(o,{title:"Interfaces: contratos puros entre classes",subtitle:"Aprenda a definir contratos que classes podem assinar — possibilitando polimorfismo sem herança.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:['Imagine uma tomada de parede. Qualquer aparelho que tenha o "plugue padrão" pode se conectar — não importa se é um liquidificador, um carregador ou uma TV. A tomada não se importa ',e.jsx("em",{children:"como"})," o aparelho funciona por dentro; ela só exige que ele tenha o plugue certo. Em C#, uma ",e.jsx("strong",{children:"interface"}),' é o "padrão de plugue" do código: um contrato que diz "se você quer ser tratado como X, precisa ter estes métodos". A classe que ',e.jsx("em",{children:"implementa"})," a interface se compromete a respeitar esse contrato. Esse é o coração da flexibilidade em projetos grandes."]}),e.jsx("h2",{children:"O que é uma interface?"}),e.jsxs("p",{children:['Uma interface é, tradicionalmente, uma lista de assinaturas (nomes de métodos, propriedades, eventos) sem implementação. Ela diz "o que", não "como". Por convenção, nomes de interfaces começam com a letra ',e.jsx("code",{children:"I"})," maiúscula."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Definição de uma interface
public interface IPagavel
{
    decimal Valor { get; }
    void Pagar();
}`})}),e.jsxs("p",{children:['A interface acima diz: "qualquer coisa pagável precisa ter um ',e.jsx("code",{children:"Valor"})," que se possa ler e um método ",e.jsx("code",{children:"Pagar()"}),'". Não há corpo nem campo privado — só o contrato.']}),e.jsx("h2",{children:"Implementando uma interface"}),e.jsxs("p",{children:["Uma classe declara que cumpre o contrato usando ",e.jsx("code",{children:":"})," seguido do nome da interface, igual à sintaxe de herança. A diferença: você pode implementar ",e.jsx("strong",{children:"quantas interfaces quiser"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Fatura : IPagavel
{
    public decimal Valor { get; init; }
    public string Cliente { get; init; } = "";

    public void Pagar()
    {
        Console.WriteLine($"Fatura de {Cliente} ({Valor:C}) paga.");
    }
}

public class Salario : IPagavel
{
    public decimal Valor { get; init; }
    public string Funcionario { get; init; } = "";

    public void Pagar()
    {
        Console.WriteLine($"Salário de {Funcionario} ({Valor:C}) depositado.");
    }
}`})}),e.jsx("h2",{children:"Polimorfismo via interface"}),e.jsxs("p",{children:["O grande ganho: você pode tratar ",e.jsx("code",{children:"Fatura"})," e ",e.jsx("code",{children:"Salario"})," uniformemente como ",e.jsx("code",{children:"IPagavel"}),", mesmo que não tenham nenhuma classe-pai em comum. Isso é polimorfismo desacoplado de hierarquia."]}),e.jsx("pre",{children:e.jsx("code",{children:`IPagavel[] pendentes =
{
    new Fatura  { Cliente = "Loja X", Valor = 1500m },
    new Salario { Funcionario = "Ana", Valor = 5000m }
};

foreach (var p in pendentes) p.Pagar();
// Fatura de Loja X (R$ 1.500,00) paga.
// Salário de Ana (R$ 5.000,00) depositado.`})}),e.jsxs(a,{type:"info",title:"Por que isso é poderoso?",children:["A função que processa pagamentos depende só do contrato ",e.jsx("code",{children:"IPagavel"}),". Amanhã você cria ",e.jsx("code",{children:"Comissao"}),", ",e.jsx("code",{children:"Reembolso"}),", ",e.jsx("code",{children:"Boleto"}),"... todas implementam ",e.jsx("code",{children:"IPagavel"})," e o processador funciona sem mudanças. Esse é o princípio da ",e.jsx("strong",{children:"inversão de dependência"}),"."]}),e.jsx("h2",{children:'Múltipla "herança" de interfaces'}),e.jsxs("p",{children:["Diferente de classes (onde você só herda de uma), uma classe pode implementar ",e.jsx("strong",{children:"várias interfaces"}),' ao mesmo tempo. Isso é como dizer "este objeto cumpre vários contratos diferentes simultaneamente".']}),e.jsx("pre",{children:e.jsx("code",{children:`public interface IComparavel
{
    int CompararCom(object outro);
}

public interface ISerializavel
{
    string ParaJson();
}

// Cumpre os DOIS contratos
public class Produto : IComparavel, ISerializavel
{
    public string Nome { get; init; } = "";
    public decimal Preco { get; init; }

    public int CompararCom(object outro)
        => outro is Produto p ? Preco.CompareTo(p.Preco) : 0;

    public string ParaJson()
        => $"{{\\"nome\\":\\"{Nome}\\",\\"preco\\":{Preco}}}";
}`})}),e.jsx("h2",{children:"Interfaces da própria biblioteca .NET"}),e.jsxs("p",{children:["O .NET é repleto de interfaces que você consumirá o tempo todo: ",e.jsx("code",{children:"IEnumerable<T>"})," (algo iterável), ",e.jsx("code",{children:"IDisposable"})," (algo que libera recursos), ",e.jsx("code",{children:"IComparable<T>"})," (algo ordenável), ",e.jsx("code",{children:"IEquatable<T>"})," (algo comparável por igualdade). Implementá-las faz sua classe ganhar superpoderes que se integram ao restante da plataforma."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Versao : IComparable<Versao>
{
    public int Major { get; init; }
    public int Minor { get; init; }

    public int CompareTo(Versao? outra)
    {
        if (outra is null) return 1;
        var diff = Major.CompareTo(outra.Major);
        return diff != 0 ? diff : Minor.CompareTo(outra.Minor);
    }
}

var versoes = new List<Versao>
{
    new() { Major = 2, Minor = 0 },
    new() { Major = 1, Minor = 5 },
    new() { Major = 1, Minor = 2 }
};
versoes.Sort(); // funciona porque implementamos IComparable<Versao>`})}),e.jsx("h2",{children:"Default interface methods (C# 8+)"}),e.jsxs("p",{children:["Desde C# 8, interfaces podem trazer ",e.jsx("strong",{children:"implementações padrão"})," nos seus métodos. Isso permite evoluir uma interface sem quebrar quem já a implementava. Use com moderação — em geral, o objetivo de uma interface é ser puramente um contrato."]}),e.jsx("pre",{children:e.jsx("code",{children:`public interface ILogador
{
    void Logar(string mensagem);

    // Implementação padrão: qualquer classe que implemente ILogador
    // ganha LogarErro de graça
    void LogarErro(string erro)
    {
        Logar($"[ERRO] {erro}");
    }
}

public class LogadorConsole : ILogador
{
    public void Logar(string mensagem) => Console.WriteLine(mensagem);
    // Não precisamos implementar LogarErro: a versão padrão funciona
}`})}),e.jsxs("p",{children:["Para chamar a versão default, você precisa converter para o tipo da interface: ",e.jsx("code",{children:'((ILogador)log).LogarErro("falha");'})]}),e.jsxs(a,{type:"warning",title:"Naming convention obrigatória de fato",children:["Não é obrigado pelo compilador, mas é convenção universal: nomes de interfaces começam com ",e.jsx("code",{children:"I"})," maiúsculo (",e.jsx("code",{children:"IRepositorio"}),", ",e.jsx("code",{children:"IUsuario"}),", ",e.jsx("code",{children:"IClienteHttp"}),"). Quebrar isso confunde leitores e ferramentas."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"public"})," ao implementar"]}),": métodos de interface são automaticamente públicos. Se você omitir ",e.jsx("code",{children:"public"})," na classe, o compilador acusa erro."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Achar que pode instanciar uma interface"}),": ",e.jsx("code",{children:"new IPagavel()"})," não compila. Você só instancia classes concretas que a implementem."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar herança com interface esperando o mesmo"}),": classe abstrata pode oferecer estado e construtor; interface (tradicionalmente) não."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Criar uma interface com um único método para todo lado"}),": as vezes um ",e.jsx("code",{children:"delegate"})," ou um ",e.jsx("code",{children:"Func<T>"})," resolveria com menos cerimônia."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Interface define um contrato: o que a classe precisa oferecer."}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:":"})," para implementar; uma classe pode implementar várias interfaces."]}),e.jsxs("li",{children:["Convencionalmente, nomes começam com ",e.jsx("code",{children:"I"})," maiúsculo."]}),e.jsx("li",{children:"Polimorfismo via interface desacopla código de qualquer hierarquia de herança."}),e.jsxs("li",{children:["O .NET tem interfaces prontas (",e.jsx("code",{children:"IEnumerable"}),", ",e.jsx("code",{children:"IDisposable"}),", etc.) que valem a pena implementar."]}),e.jsx("li",{children:"C# 8+ permite implementação default em interfaces (use com cautela)."})]})]})}export{s as default};
