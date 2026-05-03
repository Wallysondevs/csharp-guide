import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function t(){return e.jsxs(s,{title:"Reflection: inspecionando tipos em runtime",subtitle:"Quando seu programa precisa olhar para si mesmo no espelho — listar métodos, ler atributos, criar objetos cujo tipo só foi descoberto agora.",difficulty:"avancado",timeToRead:"14 min",children:[e.jsxs("p",{children:["Imagine que você recebeu uma caixa lacrada de um amigo e quer descobrir o que tem dentro sem destruir a embalagem. Em programação, ",e.jsx("strong",{children:"reflection"})," é exatamente isso: a habilidade do código de inspecionar seus próprios tipos durante a execução — listar métodos, propriedades e atributos, criar instâncias dinamicamente, chamar métodos cujos nomes só foram descobertos no momento. Tudo isso vive no namespace ",e.jsx("code",{children:"System.Reflection"})," e gira em torno de uma classe central: ",e.jsx("code",{children:"Type"}),"."]}),e.jsxs("h2",{children:["O ponto de partida: ",e.jsx("code",{children:"Type"})]}),e.jsxs("p",{children:["Cada tipo (classe, struct, interface, enum) é representado em runtime por um objeto ",e.jsx("code",{children:"Type"}),". Você obtém esse objeto de três formas principais:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// 1) Pelo nome do tipo, em compilação — mais comum
Type t1 = typeof(string);

// 2) A partir de uma instância — descobre o tipo real (não o declarado)
object obj = "olá";
Type t2 = obj.GetType();   // String, mesmo que obj seja declarado object

// 3) Por nome em string — útil para plugins/loadtime
Type? t3 = Type.GetType("System.DateTime");`})}),e.jsxs("p",{children:["A diferença entre ",e.jsx("code",{children:"typeof"})," e ",e.jsx("code",{children:"GetType()"})," é importante: ",e.jsx("code",{children:"typeof"})," resolve em compilação e nunca falha; ",e.jsx("code",{children:"GetType()"})," precisa de uma instância e devolve o tipo ",e.jsx("em",{children:"dinâmico"})," — pode revelar um ",e.jsx("code",{children:"Cliente"})," escondido atrás de uma referência ",e.jsx("code",{children:"object"}),"."]}),e.jsx("h2",{children:"Listando métodos e propriedades"}),e.jsxs("p",{children:["Tendo o ",e.jsx("code",{children:"Type"}),", você acessa os ",e.jsx("em",{children:"members"})," dele:"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Reflection;

Type tipo = typeof(DateTime);

// Todos os métodos públicos de instância e estáticos
MethodInfo[] metodos = tipo.GetMethods();
foreach (var m in metodos.Take(5))
    Console.WriteLine($"{m.ReturnType.Name} {m.Name}({m.GetParameters().Length} params)");

// Apenas propriedades públicas de instância
PropertyInfo[] props = tipo.GetProperties(
    BindingFlags.Public | BindingFlags.Instance);
foreach (var p in props)
    Console.WriteLine($"{p.PropertyType.Name} {p.Name}");`})}),e.jsxs("p",{children:[e.jsx("code",{children:"BindingFlags"})," é o filtro: ",e.jsx("code",{children:"Public"}),", ",e.jsx("code",{children:"NonPublic"})," (privados), ",e.jsx("code",{children:"Instance"}),", ",e.jsx("code",{children:"Static"}),", ",e.jsx("code",{children:"DeclaredOnly"})," (ignora herdados). Combine com ",e.jsx("code",{children:"|"})," para refinar a busca. Sem nenhuma flag, o padrão é ",e.jsx("em",{children:"público + instância + estático"}),"."]}),e.jsx("h2",{children:"Criando instâncias dinamicamente"}),e.jsxs("p",{children:[e.jsx("code",{children:"Activator.CreateInstance"})," é o atalho universal para invocar o construtor sem conhecer o tipo em compilação. Ideal para sistemas de plugin onde você lê uma string do arquivo de configuração e cria o objeto correspondente."]}),e.jsx("pre",{children:e.jsx("code",{children:`Type tipo = typeof(List<int>);
object lista = Activator.CreateInstance(tipo)!;     // chama construtor padrão

// Com argumentos:
Type stringBuilder = typeof(StringBuilder);
object sb = Activator.CreateInstance(stringBuilder, "olá ")!;  // ctor(string)

// Por string de tipo + assembly:
Type? plugin = Type.GetType("MeuApp.Plugins.Exportador, MeuApp.Plugins");
if (plugin is not null)
{
    object instance = Activator.CreateInstance(plugin)!;
}`})}),e.jsx("h2",{children:"Lendo e escrevendo propriedades em runtime"}),e.jsxs("p",{children:[e.jsx("code",{children:"PropertyInfo.GetValue"})," e ",e.jsx("code",{children:"SetValue"})," permitem mexer em propriedades sem conhecê-las em compilação. É a base de mappers (AutoMapper), validadores (FluentValidation) e serializadores (System.Text.Json):"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pessoa { public string Nome { get; set; } = ""; public int Idade { get; set; } }

var p = new Pessoa();
Type t = p.GetType();

// Setar Nome dinamicamente
PropertyInfo? propNome = t.GetProperty("Nome");
propNome!.SetValue(p, "Maria");

// Iterar todas e imprimir valores
foreach (var prop in t.GetProperties())
{
    var valor = prop.GetValue(p);
    Console.WriteLine($"{prop.Name} = {valor}");
}
// Nome = Maria
// Idade = 0`})}),e.jsx("h2",{children:"Invocando métodos por nome"}),e.jsxs("p",{children:[e.jsx("code",{children:"MethodInfo.Invoke"})," chama um método cujo nome veio em string. O primeiro argumento é a instância (ou ",e.jsx("code",{children:"null"})," para métodos estáticos); o segundo é um ",e.jsx("code",{children:"object[]"})," com os parâmetros."]}),e.jsx("pre",{children:e.jsx("code",{children:`var sb = new StringBuilder();
MethodInfo? append = sb.GetType()
    .GetMethod("Append", new[] { typeof(string) });

append!.Invoke(sb, new object?[] { "Olá " });
append.Invoke(sb, new object?[] { "mundo!" });

Console.WriteLine(sb.ToString());   // Olá mundo!`})}),e.jsx("h2",{children:"Atributos via reflection"}),e.jsxs("p",{children:["Reflection brilha ao ler ",e.jsx("strong",{children:"atributos customizados"})," aplicados aos tipos. Frameworks inteiros (ASP.NET, Entity Framework, xUnit) funcionam descobrindo classes/métodos marcados com atributos específicos:"]}),e.jsx("pre",{children:e.jsx("code",{children:`[AttributeUsage(AttributeTargets.Method)]
public class TestAttribute : Attribute { }

public class MinhaSuite
{
    [Test] public void Soma() { /* ... */ }
    [Test] public void Subtracao() { /* ... */ }
    public void NaoEhTeste() { }
}

// Descobre todos os métodos marcados com [Test] e os roda
var suite = new MinhaSuite();
foreach (var m in typeof(MinhaSuite).GetMethods())
{
    if (m.GetCustomAttribute<TestAttribute>() is not null)
    {
        Console.WriteLine($"Rodando: {m.Name}");
        m.Invoke(suite, null);
    }
}`})}),e.jsxs(o,{type:"info",title:"Como xUnit/NUnit funcionam",children:["Por baixo dos panos, o test runner faz exatamente isso: carrega seu assembly, percorre todos os tipos, lista os métodos com atributo ",e.jsx("code",{children:"[Fact]"})," ou ",e.jsx("code",{children:"[Test]"}),", e os invoca via reflection. Não é mágica."]}),e.jsx("h2",{children:"O custo: performance e AOT"}),e.jsxs("p",{children:["Reflection é ",e.jsx("strong",{children:"centenas de vezes mais lenta"})," que uma chamada direta. Cada ",e.jsx("code",{children:"Invoke"})," faz checagem de tipos, boxing de parâmetros de valor, lookup de método. Em hot paths, evite — ou cache os ",e.jsx("code",{children:"MethodInfo"})," e use ",e.jsx("code",{children:"Delegate.CreateDelegate"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`MethodInfo m = typeof(Pessoa).GetMethod("get_Nome")!;

// ❌ lento: ~1µs por chamada
for (int i = 0; i < 1000; i++) m.Invoke(p, null);

// ✅ rápido: ~10ns, comparável a chamada direta
var getNome = (Func<Pessoa, string>)Delegate.CreateDelegate(
    typeof(Func<Pessoa, string>), m);
for (int i = 0; i < 1000; i++) getNome(p);`})}),e.jsxs(o,{type:"warning",title:"Reflection x AOT",children:["Compilações ",e.jsx("strong",{children:"AOT"})," (Ahead-Of-Time, como NativeAOT do .NET 8) ",e.jsx("em",{children:"removem"})," metadados não usados. Códigos que dependem de reflection podem quebrar silenciosamente em AOT — para esses cenários, prefira ",e.jsx("strong",{children:"source generators"}),"."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"BindingFlags"})," ao buscar membros não-públicos:"]})," ",e.jsx("code",{children:'GetMethod("metodoPrivado")'})," sem flags retorna null."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"typeof"})," e ",e.jsx("code",{children:"GetType()"}),":"]})," o primeiro é tipo declarado em compilação; o segundo é tipo dinâmico real."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar reflection em loops quentes:"})," mata performance. Cache ",e.jsx("code",{children:"MethodInfo"})," ou compile delegates."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não tratar nulls:"})," ",e.jsx("code",{children:"GetMethod"}),", ",e.jsx("code",{children:"GetType.GetType(string)"})," retornam ",e.jsx("code",{children:"null"})," se não acharem."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Acessar propriedades estáticas com instância:"})," em ",e.jsx("code",{children:"SetValue/GetValue"})," de propriedade estática, passe ",e.jsx("code",{children:"null"})," como obj."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar reflection quando interface/genérico resolve:"})," reflection é último recurso, não primeiro."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Type"})," é o ponto de entrada — obtenha com ",e.jsx("code",{children:"typeof"}),", ",e.jsx("code",{children:"GetType()"})," ou ",e.jsx("code",{children:"Type.GetType(string)"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"GetMethods"}),", ",e.jsx("code",{children:"GetProperties"}),", ",e.jsx("code",{children:"GetFields"})," listam membros (com ",e.jsx("code",{children:"BindingFlags"}),")."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Activator.CreateInstance"})," cria objetos sem conhecer o tipo em compilação."]}),e.jsxs("li",{children:[e.jsx("code",{children:"MethodInfo.Invoke"})," e ",e.jsx("code",{children:"PropertyInfo.GetValue/SetValue"})," chamam membros dinamicamente."]}),e.jsxs("li",{children:[e.jsx("code",{children:"GetCustomAttribute<T>"})," lê metadados — base de frameworks de teste, ORMs, serializers."]}),e.jsx("li",{children:"É lenta — cache MethodInfo ou prefira source generators em hot paths e AOT."})]})]})}export{t as default};
