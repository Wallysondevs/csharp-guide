import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function t(){return e.jsxs(r,{title:"Atributos customizados: metadados em runtime",subtitle:"Pequenos rótulos colados em classes, métodos ou propriedades que ferramentas e frameworks usam para tomar decisões — sem mexer na lógica do seu código.",difficulty:"avancado",timeToRead:"13 min",children:[e.jsxs("p",{children:["Um ",e.jsx("strong",{children:"atributo"})," em C# é como um adesivo grudado em uma peça de roupa: não muda o tecido, mas diz ao caixa o preço, o tamanho e a marca. Você já viu vários: ",e.jsx("code",{children:"[Obsolete]"}),", ",e.jsx("code",{children:"[Serializable]"}),", ",e.jsx("code",{children:"[HttpGet]"}),", ",e.jsx("code",{children:"[Required]"}),". Eles são pequenas anotações ",e.jsx("em",{children:"declarativas"})," — você só cola, e ",e.jsx("em",{children:"outro"})," código (framework, validador, IDE) lê e age. Neste capítulo, vamos criar nossos próprios e entender como lê-los em runtime via reflection."]}),e.jsxs("h2",{children:["Atributo é uma classe que herda de ",e.jsx("code",{children:"Attribute"})]}),e.jsxs("p",{children:["Não há mágica: cada atributo é uma classe normal de C# que herda de ",e.jsx("code",{children:"System.Attribute"}),". Quando você escreve ",e.jsx("code",{children:"[MeuAtributo]"}),", o compilador instancia essa classe e anexa aos metadados do tipo/método marcado. Por convenção, o nome termina com ",e.jsx("code",{children:"Attribute"}),", mas você pode omitir esse sufixo na hora de aplicar."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System;

// Definição
public class MinhaTagAttribute : Attribute { }

// Aplicação — o sufixo "Attribute" some
[MinhaTag]
public class MeuServico { }

// Equivalente:
[MinhaTagAttribute]
public class OutroServico { }`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"[AttributeUsage]"}),": dizendo onde pode colar"]}),e.jsxs("p",{children:['Por padrão, um atributo pode ser aplicado em qualquer coisa. Geralmente queremos restringir: "este só faz sentido em propriedades", "este só em métodos". Use ',e.jsx("code",{children:"[AttributeUsage]"})," na declaração:"]}),e.jsx("pre",{children:e.jsx("code",{children:`[AttributeUsage(
    AttributeTargets.Property | AttributeTargets.Field,
    AllowMultiple = false,
    Inherited = true)]
public class ValidateAttribute : Attribute { }

// Agora isto compila:
public class Pedido
{
    [Validate] public decimal Total { get; set; }
}

// Mas isto NÃO compila — Validate não permite em classes:
[Validate]
public class Cliente { }   // CS0592 — atributo não válido para esse alvo`})}),e.jsxs("p",{children:["Os parâmetros: ",e.jsx("code",{children:"AttributeTargets"})," diz onde pode aplicar (combine com ",e.jsx("code",{children:"|"}),"). ",e.jsx("code",{children:"AllowMultiple"})," permite o mesmo atributo aparecer várias vezes no mesmo alvo. ",e.jsx("code",{children:"Inherited"}),' determina se classes derivadas "herdam" o atributo.']}),e.jsx("h2",{children:"Construtores e propriedades — passando dados"}),e.jsxs("p",{children:["Atributos podem receber dados de duas formas: ",e.jsx("strong",{children:"parâmetros posicionais"})," (vêm do construtor) e ",e.jsx("strong",{children:"parâmetros nomeados"})," (correspondem a propriedades públicas)."]}),e.jsx("pre",{children:e.jsx("code",{children:`[AttributeUsage(AttributeTargets.Property)]
public class ValidateAttribute : Attribute
{
    // Posicional: obrigatório, ordem importa
    public string Mensagem { get; }

    // Nomeados: opcionais, com nome explícito
    public int Min { get; set; } = int.MinValue;
    public int Max { get; set; } = int.MaxValue;

    public ValidateAttribute(string mensagem)
    {
        Mensagem = mensagem;
    }
}

public class Produto
{
    [Validate("preço deve ser positivo", Min = 1)]
    public int Preco { get; set; }

    [Validate("quantidade entre 0 e 999", Min = 0, Max = 999)]
    public int Quantidade { get; set; }
}`})}),e.jsxs("p",{children:["A regra é simples: o que vai como argumento do construtor é ",e.jsx("em",{children:"posicional"}),"; o que aparece como ",e.jsx("code",{children:"Nome = valor"})," é ",e.jsx("em",{children:"nomeado"}),". Atributos só aceitam tipos constantes em compilação — primitivos, strings, enums, ",e.jsx("code",{children:"typeof(...)"})," e arrays simples desses."]}),e.jsxs(o,{type:"info",title:"Por que essa restrição?",children:["Atributos são gravados nos ",e.jsx("strong",{children:"metadados do assembly"})," em tempo de compilação. Por isso seus argumentos precisam ser literais conhecidos pelo compilador — ele não pode embutir o resultado de uma chamada de método."]}),e.jsx("h2",{children:"Lendo atributos em runtime"}),e.jsxs("p",{children:["Definir um atributo sozinho não faz nada: você precisa de ",e.jsx("em",{children:"código que olhe"}),". Isso é feito via reflection com ",e.jsx("code",{children:"GetCustomAttribute<T>()"})," ou ",e.jsx("code",{children:"GetCustomAttributes<T>()"})," (para múltiplos)."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Reflection;

public static IEnumerable<string> Validar(object obj)
{
    var tipo = obj.GetType();
    foreach (var prop in tipo.GetProperties())
    {
        var attr = prop.GetCustomAttribute<ValidateAttribute>();
        if (attr is null) continue;

        var valor = prop.GetValue(obj);
        if (valor is int n)
        {
            if (n < attr.Min || n > attr.Max)
                yield return $"{prop.Name}: {attr.Mensagem} (atual: {n})";
        }
    }
}

var p = new Produto { Preco = 0, Quantidade = 1500 };
foreach (var erro in Validar(p))
    Console.WriteLine(erro);
// Preco: preço deve ser positivo (atual: 0)
// Quantidade: quantidade entre 0 e 999 (atual: 1500)`})}),e.jsxs("p",{children:["Em ~25 linhas você criou seu próprio mini-validador declarativo. É exatamente o princípio por trás do ",e.jsx("code",{children:"DataAnnotations"}),", FluentValidation e Pydantic."]}),e.jsx("h2",{children:"Atributos múltiplos"}),e.jsxs("p",{children:["Quando ",e.jsx("code",{children:"AllowMultiple = true"}),', você pode colar o mesmo atributo várias vezes — útil para metadados como "permissões" ou "rotas alternativas":']}),e.jsx("pre",{children:e.jsx("code",{children:`[AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
public class RouteAttribute(string padrao) : Attribute
{
    public string Padrao { get; } = padrao;
}

public class UsuariosController
{
    [Route("/users")]
    [Route("/api/users")]
    public void Listar() { }
}

// leitura
var rotas = typeof(UsuariosController)
    .GetMethod("Listar")!
    .GetCustomAttributes<RouteAttribute>();

foreach (var r in rotas) Console.WriteLine(r.Padrao);`})}),e.jsx("h2",{children:"Sintaxe moderna: primary constructors"}),e.jsxs("p",{children:["Desde C# 12, você pode declarar atributos com ",e.jsx("strong",{children:"primary constructors"}),", ficando muito mais conciso (note o exemplo acima). Os parâmetros do construtor viram propriedades automáticas — perfeito para atributos imutáveis."]}),e.jsx("pre",{children:e.jsx("code",{children:`// C# 12+ — sintaxe enxuta
public class TestCaseAttribute(string nome, int prioridade = 5) : Attribute
{
    public string Nome { get; } = nome;
    public int Prioridade { get; } = prioridade;
}

[TestCase("login feliz", prioridade: 1)]
public void TestarLogin() { }`})}),e.jsxs(o,{type:"warning",title:"Reflection é lenta — cache os resultados",children:["Ler atributos em loop quente é caro. Em frameworks de produção, faça a leitura ",e.jsx("strong",{children:"uma vez"})," ao inicializar (ex: scan dos controllers no startup) e armazene em ",e.jsx("code",{children:"Dictionary"}),". ASP.NET, EF Core, xUnit fazem exatamente isso."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"[AttributeUsage]"}),":"]})," seu atributo aceita ser aplicado em qualquer coisa, mesmo onde não faz sentido."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tentar passar tipo não-constante:"})," ",e.jsx("code",{children:"[MeuAttr(DateTime.Now)]"})," não compila — argumentos precisam ser const."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'Esperar que o atributo "faça algo":'})," sem código que leia via reflection, atributo é só um adesivo decorativo."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Colar ",e.jsx("code",{children:"AllowMultiple = false"})," e tentar duplicar:"]})," erro de compilação."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não considerar herança:"})," ",e.jsx("code",{children:"Inherited = false"})," em base + reflection na derivada não enxerga o atributo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reflection toda hora:"})," cache ",e.jsx("code",{children:"Dictionary<Type, AtributoXYZ>"})," em vez de varrer a cada chamada."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Atributo = classe que herda de ",e.jsx("code",{children:"Attribute"}),", anexada via ",e.jsx("code",{children:"[Nome]"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[AttributeUsage]"})," restringe alvos, controla múltiplos e herança."]}),e.jsxs("li",{children:["Argumentos do construtor são ",e.jsx("em",{children:"posicionais"}),"; ",e.jsx("code",{children:"Prop = valor"})," são ",e.jsx("em",{children:"nomeados"}),"."]}),e.jsxs("li",{children:["Argumentos só aceitam constantes em compilação (primitivos, strings, enums, ",e.jsx("code",{children:"typeof"}),")."]}),e.jsxs("li",{children:["Leitura via ",e.jsx("code",{children:"GetCustomAttribute<T>()"})," em ",e.jsx("code",{children:"Type"}),", ",e.jsx("code",{children:"MethodInfo"}),", ",e.jsx("code",{children:"PropertyInfo"})," etc."]}),e.jsx("li",{children:"Cache os resultados — atributos costumam ser lidos em hot path."})]})]})}export{t as default};
