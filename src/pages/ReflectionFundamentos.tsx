import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ReflectionFundamentos() {
  return (
    <PageContainer
      title="Reflection: inspecionando tipos em runtime"
      subtitle="Quando seu programa precisa olhar para si mesmo no espelho — listar métodos, ler atributos, criar objetos cujo tipo só foi descoberto agora."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        Imagine que você recebeu uma caixa lacrada de um amigo e quer descobrir o que tem dentro sem destruir a embalagem. Em programação, <strong>reflection</strong> é exatamente isso: a habilidade do código de inspecionar seus próprios tipos durante a execução — listar métodos, propriedades e atributos, criar instâncias dinamicamente, chamar métodos cujos nomes só foram descobertos no momento. Tudo isso vive no namespace <code>System.Reflection</code> e gira em torno de uma classe central: <code>Type</code>.
      </p>

      <h2>O ponto de partida: <code>Type</code></h2>
      <p>
        Cada tipo (classe, struct, interface, enum) é representado em runtime por um objeto <code>Type</code>. Você obtém esse objeto de três formas principais:
      </p>
      <pre><code>{`// 1) Pelo nome do tipo, em compilação — mais comum
Type t1 = typeof(string);

// 2) A partir de uma instância — descobre o tipo real (não o declarado)
object obj = "olá";
Type t2 = obj.GetType();   // String, mesmo que obj seja declarado object

// 3) Por nome em string — útil para plugins/loadtime
Type? t3 = Type.GetType("System.DateTime");`}</code></pre>
      <p>
        A diferença entre <code>typeof</code> e <code>GetType()</code> é importante: <code>typeof</code> resolve em compilação e nunca falha; <code>GetType()</code> precisa de uma instância e devolve o tipo <em>dinâmico</em> — pode revelar um <code>Cliente</code> escondido atrás de uma referência <code>object</code>.
      </p>

      <h2>Listando métodos e propriedades</h2>
      <p>
        Tendo o <code>Type</code>, você acessa os <em>members</em> dele:
      </p>
      <pre><code>{`using System.Reflection;

Type tipo = typeof(DateTime);

// Todos os métodos públicos de instância e estáticos
MethodInfo[] metodos = tipo.GetMethods();
foreach (var m in metodos.Take(5))
    Console.WriteLine($"{m.ReturnType.Name} {m.Name}({m.GetParameters().Length} params)");

// Apenas propriedades públicas de instância
PropertyInfo[] props = tipo.GetProperties(
    BindingFlags.Public | BindingFlags.Instance);
foreach (var p in props)
    Console.WriteLine($"{p.PropertyType.Name} {p.Name}");`}</code></pre>
      <p>
        <code>BindingFlags</code> é o filtro: <code>Public</code>, <code>NonPublic</code> (privados), <code>Instance</code>, <code>Static</code>, <code>DeclaredOnly</code> (ignora herdados). Combine com <code>|</code> para refinar a busca. Sem nenhuma flag, o padrão é <em>público + instância + estático</em>.
      </p>

      <h2>Criando instâncias dinamicamente</h2>
      <p>
        <code>Activator.CreateInstance</code> é o atalho universal para invocar o construtor sem conhecer o tipo em compilação. Ideal para sistemas de plugin onde você lê uma string do arquivo de configuração e cria o objeto correspondente.
      </p>
      <pre><code>{`Type tipo = typeof(List<int>);
object lista = Activator.CreateInstance(tipo)!;     // chama construtor padrão

// Com argumentos:
Type stringBuilder = typeof(StringBuilder);
object sb = Activator.CreateInstance(stringBuilder, "olá ")!;  // ctor(string)

// Por string de tipo + assembly:
Type? plugin = Type.GetType("MeuApp.Plugins.Exportador, MeuApp.Plugins");
if (plugin is not null)
{
    object instance = Activator.CreateInstance(plugin)!;
}`}</code></pre>

      <h2>Lendo e escrevendo propriedades em runtime</h2>
      <p>
        <code>PropertyInfo.GetValue</code> e <code>SetValue</code> permitem mexer em propriedades sem conhecê-las em compilação. É a base de mappers (AutoMapper), validadores (FluentValidation) e serializadores (System.Text.Json):
      </p>
      <pre><code>{`public class Pessoa { public string Nome { get; set; } = ""; public int Idade { get; set; } }

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
// Idade = 0`}</code></pre>

      <h2>Invocando métodos por nome</h2>
      <p>
        <code>MethodInfo.Invoke</code> chama um método cujo nome veio em string. O primeiro argumento é a instância (ou <code>null</code> para métodos estáticos); o segundo é um <code>object[]</code> com os parâmetros.
      </p>
      <pre><code>{`var sb = new StringBuilder();
MethodInfo? append = sb.GetType()
    .GetMethod("Append", new[] { typeof(string) });

append!.Invoke(sb, new object?[] { "Olá " });
append.Invoke(sb, new object?[] { "mundo!" });

Console.WriteLine(sb.ToString());   // Olá mundo!`}</code></pre>

      <h2>Atributos via reflection</h2>
      <p>
        Reflection brilha ao ler <strong>atributos customizados</strong> aplicados aos tipos. Frameworks inteiros (ASP.NET, Entity Framework, xUnit) funcionam descobrindo classes/métodos marcados com atributos específicos:
      </p>
      <pre><code>{`[AttributeUsage(AttributeTargets.Method)]
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
}`}</code></pre>

      <AlertBox type="info" title="Como xUnit/NUnit funcionam">
        Por baixo dos panos, o test runner faz exatamente isso: carrega seu assembly, percorre todos os tipos, lista os métodos com atributo <code>[Fact]</code> ou <code>[Test]</code>, e os invoca via reflection. Não é mágica.
      </AlertBox>

      <h2>O custo: performance e AOT</h2>
      <p>
        Reflection é <strong>centenas de vezes mais lenta</strong> que uma chamada direta. Cada <code>Invoke</code> faz checagem de tipos, boxing de parâmetros de valor, lookup de método. Em hot paths, evite — ou cache os <code>MethodInfo</code> e use <code>Delegate.CreateDelegate</code>:
      </p>
      <pre><code>{`MethodInfo m = typeof(Pessoa).GetMethod("get_Nome")!;

// ❌ lento: ~1µs por chamada
for (int i = 0; i < 1000; i++) m.Invoke(p, null);

// ✅ rápido: ~10ns, comparável a chamada direta
var getNome = (Func<Pessoa, string>)Delegate.CreateDelegate(
    typeof(Func<Pessoa, string>), m);
for (int i = 0; i < 1000; i++) getNome(p);`}</code></pre>

      <AlertBox type="warning" title="Reflection x AOT">
        Compilações <strong>AOT</strong> (Ahead-Of-Time, como NativeAOT do .NET 8) <em>removem</em> metadados não usados. Códigos que dependem de reflection podem quebrar silenciosamente em AOT — para esses cenários, prefira <strong>source generators</strong>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>BindingFlags</code> ao buscar membros não-públicos:</strong> <code>GetMethod("metodoPrivado")</code> sem flags retorna null.</li>
        <li><strong>Confundir <code>typeof</code> e <code>GetType()</code>:</strong> o primeiro é tipo declarado em compilação; o segundo é tipo dinâmico real.</li>
        <li><strong>Usar reflection em loops quentes:</strong> mata performance. Cache <code>MethodInfo</code> ou compile delegates.</li>
        <li><strong>Não tratar nulls:</strong> <code>GetMethod</code>, <code>GetType.GetType(string)</code> retornam <code>null</code> se não acharem.</li>
        <li><strong>Acessar propriedades estáticas com instância:</strong> em <code>SetValue/GetValue</code> de propriedade estática, passe <code>null</code> como obj.</li>
        <li><strong>Usar reflection quando interface/genérico resolve:</strong> reflection é último recurso, não primeiro.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Type</code> é o ponto de entrada — obtenha com <code>typeof</code>, <code>GetType()</code> ou <code>Type.GetType(string)</code>.</li>
        <li><code>GetMethods</code>, <code>GetProperties</code>, <code>GetFields</code> listam membros (com <code>BindingFlags</code>).</li>
        <li><code>Activator.CreateInstance</code> cria objetos sem conhecer o tipo em compilação.</li>
        <li><code>MethodInfo.Invoke</code> e <code>PropertyInfo.GetValue/SetValue</code> chamam membros dinamicamente.</li>
        <li><code>GetCustomAttribute&lt;T&gt;</code> lê metadados — base de frameworks de teste, ORMs, serializers.</li>
        <li>É lenta — cache MethodInfo ou prefira source generators em hot paths e AOT.</li>
      </ul>
    </PageContainer>
  );
}
