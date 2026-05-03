import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AttributesCustomizados() {
  return (
    <PageContainer
      title="Atributos customizados: metadados em runtime"
      subtitle="Pequenos rótulos colados em classes, métodos ou propriedades que ferramentas e frameworks usam para tomar decisões — sem mexer na lógica do seu código."
      difficulty="avancado"
      timeToRead="13 min"
    >
      <p>
        Um <strong>atributo</strong> em C# é como um adesivo grudado em uma peça de roupa: não muda o tecido, mas diz ao caixa o preço, o tamanho e a marca. Você já viu vários: <code>[Obsolete]</code>, <code>[Serializable]</code>, <code>[HttpGet]</code>, <code>[Required]</code>. Eles são pequenas anotações <em>declarativas</em> — você só cola, e <em>outro</em> código (framework, validador, IDE) lê e age. Neste capítulo, vamos criar nossos próprios e entender como lê-los em runtime via reflection.
      </p>

      <h2>Atributo é uma classe que herda de <code>Attribute</code></h2>
      <p>
        Não há mágica: cada atributo é uma classe normal de C# que herda de <code>System.Attribute</code>. Quando você escreve <code>[MeuAtributo]</code>, o compilador instancia essa classe e anexa aos metadados do tipo/método marcado. Por convenção, o nome termina com <code>Attribute</code>, mas você pode omitir esse sufixo na hora de aplicar.
      </p>
      <pre><code>{`using System;

// Definição
public class MinhaTagAttribute : Attribute { }

// Aplicação — o sufixo "Attribute" some
[MinhaTag]
public class MeuServico { }

// Equivalente:
[MinhaTagAttribute]
public class OutroServico { }`}</code></pre>

      <h2><code>[AttributeUsage]</code>: dizendo onde pode colar</h2>
      <p>
        Por padrão, um atributo pode ser aplicado em qualquer coisa. Geralmente queremos restringir: "este só faz sentido em propriedades", "este só em métodos". Use <code>[AttributeUsage]</code> na declaração:
      </p>
      <pre><code>{`[AttributeUsage(
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
public class Cliente { }   // CS0592 — atributo não válido para esse alvo`}</code></pre>
      <p>
        Os parâmetros: <code>AttributeTargets</code> diz onde pode aplicar (combine com <code>|</code>). <code>AllowMultiple</code> permite o mesmo atributo aparecer várias vezes no mesmo alvo. <code>Inherited</code> determina se classes derivadas "herdam" o atributo.
      </p>

      <h2>Construtores e propriedades — passando dados</h2>
      <p>
        Atributos podem receber dados de duas formas: <strong>parâmetros posicionais</strong> (vêm do construtor) e <strong>parâmetros nomeados</strong> (correspondem a propriedades públicas).
      </p>
      <pre><code>{`[AttributeUsage(AttributeTargets.Property)]
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
}`}</code></pre>
      <p>
        A regra é simples: o que vai como argumento do construtor é <em>posicional</em>; o que aparece como <code>Nome = valor</code> é <em>nomeado</em>. Atributos só aceitam tipos constantes em compilação — primitivos, strings, enums, <code>typeof(...)</code> e arrays simples desses.
      </p>

      <AlertBox type="info" title="Por que essa restrição?">
        Atributos são gravados nos <strong>metadados do assembly</strong> em tempo de compilação. Por isso seus argumentos precisam ser literais conhecidos pelo compilador — ele não pode embutir o resultado de uma chamada de método.
      </AlertBox>

      <h2>Lendo atributos em runtime</h2>
      <p>
        Definir um atributo sozinho não faz nada: você precisa de <em>código que olhe</em>. Isso é feito via reflection com <code>GetCustomAttribute&lt;T&gt;()</code> ou <code>GetCustomAttributes&lt;T&gt;()</code> (para múltiplos).
      </p>
      <pre><code>{`using System.Reflection;

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
// Quantidade: quantidade entre 0 e 999 (atual: 1500)`}</code></pre>
      <p>
        Em ~25 linhas você criou seu próprio mini-validador declarativo. É exatamente o princípio por trás do <code>DataAnnotations</code>, FluentValidation e Pydantic.
      </p>

      <h2>Atributos múltiplos</h2>
      <p>
        Quando <code>AllowMultiple = true</code>, você pode colar o mesmo atributo várias vezes — útil para metadados como "permissões" ou "rotas alternativas":
      </p>
      <pre><code>{`[AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
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

foreach (var r in rotas) Console.WriteLine(r.Padrao);`}</code></pre>

      <h2>Sintaxe moderna: primary constructors</h2>
      <p>
        Desde C# 12, você pode declarar atributos com <strong>primary constructors</strong>, ficando muito mais conciso (note o exemplo acima). Os parâmetros do construtor viram propriedades automáticas — perfeito para atributos imutáveis.
      </p>
      <pre><code>{`// C# 12+ — sintaxe enxuta
public class TestCaseAttribute(string nome, int prioridade = 5) : Attribute
{
    public string Nome { get; } = nome;
    public int Prioridade { get; } = prioridade;
}

[TestCase("login feliz", prioridade: 1)]
public void TestarLogin() { }`}</code></pre>

      <AlertBox type="warning" title="Reflection é lenta — cache os resultados">
        Ler atributos em loop quente é caro. Em frameworks de produção, faça a leitura <strong>uma vez</strong> ao inicializar (ex: scan dos controllers no startup) e armazene em <code>Dictionary</code>. ASP.NET, EF Core, xUnit fazem exatamente isso.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>[AttributeUsage]</code>:</strong> seu atributo aceita ser aplicado em qualquer coisa, mesmo onde não faz sentido.</li>
        <li><strong>Tentar passar tipo não-constante:</strong> <code>[MeuAttr(DateTime.Now)]</code> não compila — argumentos precisam ser const.</li>
        <li><strong>Esperar que o atributo "faça algo":</strong> sem código que leia via reflection, atributo é só um adesivo decorativo.</li>
        <li><strong>Colar <code>AllowMultiple = false</code> e tentar duplicar:</strong> erro de compilação.</li>
        <li><strong>Não considerar herança:</strong> <code>Inherited = false</code> em base + reflection na derivada não enxerga o atributo.</li>
        <li><strong>Reflection toda hora:</strong> cache <code>Dictionary&lt;Type, AtributoXYZ&gt;</code> em vez de varrer a cada chamada.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Atributo = classe que herda de <code>Attribute</code>, anexada via <code>[Nome]</code>.</li>
        <li><code>[AttributeUsage]</code> restringe alvos, controla múltiplos e herança.</li>
        <li>Argumentos do construtor são <em>posicionais</em>; <code>Prop = valor</code> são <em>nomeados</em>.</li>
        <li>Argumentos só aceitam constantes em compilação (primitivos, strings, enums, <code>typeof</code>).</li>
        <li>Leitura via <code>GetCustomAttribute&lt;T&gt;()</code> em <code>Type</code>, <code>MethodInfo</code>, <code>PropertyInfo</code> etc.</li>
        <li>Cache os resultados — atributos costumam ser lidos em hot path.</li>
      </ul>
    </PageContainer>
  );
}
