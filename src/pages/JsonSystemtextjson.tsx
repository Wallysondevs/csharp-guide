import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JsonSystemtextjson() {
  return (
    <PageContainer
      title="JSON com System.Text.Json"
      subtitle="A biblioteca oficial e de alta performance do .NET para serializar e desserializar dados em JSON."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        <strong>JSON</strong> (JavaScript Object Notation) é o formato mais usado hoje para trocar dados entre sistemas — APIs web, arquivos de configuração, salvamento de jogos, tudo. Pense nele como um envelope de texto bem padronizado: chaves e valores entre <code>{`{ }`}</code>, listas entre <code>[ ]</code>, e cada item separado por vírgula. Em C#, a biblioteca <strong>System.Text.Json</strong> (do namespace <code>System.Text.Json</code>) é a forma moderna, rápida e oficial de transformar objetos C# em JSON (<em>serializar</em>) e o inverso (<em>desserializar</em>).
      </p>
      <p>
        Antes do .NET Core 3.0, o padrão de fato era <code>Newtonsoft.Json</code> (também conhecido como Json.NET). Ela ainda é excelente, mas a Microsoft criou <code>System.Text.Json</code> para ser <em>mais rápida</em>, alocar menos memória e funcionar muito bem com APIs assíncronas e <code>Span&lt;T&gt;</code>. Para projetos novos, é a escolha recomendada.
      </p>

      <h2>Serializando: do objeto para JSON</h2>
      <p>
        Serializar é pegar um objeto C# e transformá-lo em uma string JSON. O método principal é <code>JsonSerializer.Serialize</code>:
      </p>
      <pre><code>{`using System.Text.Json;

// Um record simples (record é uma classe imutável "rápida" do C# 9+)
public record Pessoa(string Nome, int Idade, string Email);

var maria = new Pessoa("Maria Silva", 30, "maria@exemplo.com");

// Serializa para string JSON em uma linha só (compacto)
string json = JsonSerializer.Serialize(maria);
Console.WriteLine(json);
// Saída: {"Nome":"Maria Silva","Idade":30,"Email":"maria@exemplo.com"}`}</code></pre>
      <p>
        Note que as propriedades vêm com <strong>PascalCase</strong> (igual ao C#). Em JSON é convenção usar <strong>camelCase</strong> (primeira letra minúscula). Para isso usamos <code>JsonSerializerOptions</code>:
      </p>
      <pre><code>{`var opcoes = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase, // nome -> "nome"
    WriteIndented = true                                // formata com quebras
};

string jsonBonito = JsonSerializer.Serialize(maria, opcoes);
Console.WriteLine(jsonBonito);
/*
{
  "nome": "Maria Silva",
  "idade": 30,
  "email": "maria@exemplo.com"
}
*/`}</code></pre>

      <AlertBox type="info" title="Reaproveite as opções">
        <code>JsonSerializerOptions</code> é caro de criar (faz cache interno de metadados na primeira chamada). Crie uma instância única <em>estática</em> e reutilize em todo o app — não crie uma nova a cada chamada.
      </AlertBox>

      <h2>Desserializando: de JSON para objeto</h2>
      <p>
        O inverso é igualmente direto. Você passa o tipo esperado como <em>generic parameter</em> (parâmetro genérico, em <code>&lt;...&gt;</code>):
      </p>
      <pre><code>{`string entrada = """
{
  "nome": "João",
  "idade": 25,
  "email": "joao@x.com"
}
""";

var p = JsonSerializer.Deserialize<Pessoa>(entrada, opcoes);
Console.WriteLine(p?.Nome); // João`}</code></pre>
      <p>
        O <code>?</code> em <code>p?.Nome</code> existe porque <code>Deserialize</code> pode retornar <code>null</code> se a entrada for o literal <code>"null"</code> ou string vazia. Sempre trate essa possibilidade em código de produção.
      </p>

      <h2>Customizando nomes com [JsonPropertyName]</h2>
      <p>
        Quando o JSON externo usa nomes diferentes dos seus (por exemplo, um campo chamado <code>"user_id"</code> e você quer chamar de <code>UsuarioId</code>), use o atributo <code>[JsonPropertyName]</code>:
      </p>
      <pre><code>{`using System.Text.Json.Serialization;

public class Cliente
{
    [JsonPropertyName("user_id")]
    public int UsuarioId { get; set; }

    [JsonPropertyName("full_name")]
    public string NomeCompleto { get; set; } = "";

    [JsonIgnore] // nunca aparece no JSON gerado
    public string SenhaInterna { get; set; } = "";
}`}</code></pre>
      <p>
        <code>[JsonIgnore]</code> exclui um campo da serialização — ótimo para senhas, dados internos ou propriedades calculadas que você não quer expor.
      </p>

      <h2>Polimorfismo com JsonDerivedType</h2>
      <p>
        Imagine uma hierarquia: <code>Animal</code> e suas subclasses <code>Cachorro</code>, <code>Gato</code>. Como serializar uma <code>List&lt;Animal&gt;</code> e depois reconstruir a subclasse correta? Use <code>[JsonDerivedType]</code> (.NET 7+):
      </p>
      <pre><code>{`[JsonPolymorphic(TypeDiscriminatorPropertyName = "$tipo")]
[JsonDerivedType(typeof(Cachorro), "cachorro")]
[JsonDerivedType(typeof(Gato), "gato")]
public abstract class Animal { public string Nome { get; set; } = ""; }

public class Cachorro : Animal { public string Raca { get; set; } = ""; }
public class Gato    : Animal { public bool   Castrado { get; set; } }

Animal a = new Cachorro { Nome = "Rex", Raca = "Vira-lata" };
string json = JsonSerializer.Serialize<Animal>(a);
// {"$tipo":"cachorro","Raca":"Vira-lata","Nome":"Rex"}

Animal? voltou = JsonSerializer.Deserialize<Animal>(json);
// voltou é, em runtime, um Cachorro`}</code></pre>

      <h2>Source Generation: zero reflection, AOT-friendly</h2>
      <p>
        Por padrão, <code>System.Text.Json</code> usa <strong>reflection</strong> (inspecionar tipos em tempo de execução) para descobrir as propriedades. Isso funciona, mas é lento na primeira chamada e <em>não funciona</em> em compilação <strong>AOT</strong> (Ahead-Of-Time, comum em apps móveis e cloud-native enxutos). A solução é o <em>source generator</em>:
      </p>
      <pre><code>{`[JsonSerializable(typeof(Pessoa))]
[JsonSerializable(typeof(List<Pessoa>))]
public partial class MeuJsonContext : JsonSerializerContext { }

// Uso:
string json = JsonSerializer.Serialize(maria, MeuJsonContext.Default.Pessoa);
var voltou = JsonSerializer.Deserialize(json, MeuJsonContext.Default.Pessoa);`}</code></pre>
      <p>
        O compilador gera automaticamente o código de serialização em tempo de build (você verá arquivos <code>.g.cs</code> no projeto). Resultado: <strong>10× mais rápido</strong> na primeira chamada e compatível com AOT.
      </p>

      <AlertBox type="warning" title="Datas e fusos">
        Datas em JSON não têm padrão único. <code>System.Text.Json</code> usa <strong>ISO 8601</strong> (<code>"2025-01-15T14:30:00Z"</code>). Se a API que você consome usa outro formato, configure um <code>JsonConverter</code> personalizado.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer setters públicos:</strong> sem <code>get; set;</code> público, a desserialização não preenche a propriedade. Em records isso já vem resolvido pelo construtor.</li>
        <li><strong>Criar JsonSerializerOptions toda hora:</strong> mata a performance. Faça <code>static readonly</code>.</li>
        <li><strong>Confiar em case por padrão:</strong> System.Text.Json é case-sensitive. Se o JSON vem com chaves em camelCase, configure <code>PropertyNameCaseInsensitive = true</code> ou a <code>NamingPolicy</code>.</li>
        <li><strong>Usar tipos sem construtor sem parâmetros:</strong> classes que só têm construtores com argumentos podem falhar — prefira records ou marque o construtor com <code>[JsonConstructor]</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>JsonSerializer.Serialize/Deserialize</code> são os métodos centrais.</li>
        <li><code>JsonSerializerOptions</code> controla naming, indentação, case, e deve ser reutilizada.</li>
        <li><code>[JsonPropertyName]</code> e <code>[JsonIgnore]</code> ajustam o mapeamento de propriedades.</li>
        <li><code>[JsonDerivedType]</code> permite polimorfismo seguro com discriminador.</li>
        <li>Source generators (<code>JsonSerializerContext</code>) dão performance e suporte a AOT.</li>
      </ul>
    </PageContainer>
  );
}
