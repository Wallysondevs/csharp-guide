import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"JSON com System.Text.Json",subtitle:"A biblioteca oficial e de alta performance do .NET para serializar e desserializar dados em JSON.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"JSON"})," (JavaScript Object Notation) é o formato mais usado hoje para trocar dados entre sistemas — APIs web, arquivos de configuração, salvamento de jogos, tudo. Pense nele como um envelope de texto bem padronizado: chaves e valores entre ",e.jsx("code",{children:"{ }"}),", listas entre ",e.jsx("code",{children:"[ ]"}),", e cada item separado por vírgula. Em C#, a biblioteca ",e.jsx("strong",{children:"System.Text.Json"})," (do namespace ",e.jsx("code",{children:"System.Text.Json"}),") é a forma moderna, rápida e oficial de transformar objetos C# em JSON (",e.jsx("em",{children:"serializar"}),") e o inverso (",e.jsx("em",{children:"desserializar"}),")."]}),e.jsxs("p",{children:["Antes do .NET Core 3.0, o padrão de fato era ",e.jsx("code",{children:"Newtonsoft.Json"})," (também conhecido como Json.NET). Ela ainda é excelente, mas a Microsoft criou ",e.jsx("code",{children:"System.Text.Json"})," para ser ",e.jsx("em",{children:"mais rápida"}),", alocar menos memória e funcionar muito bem com APIs assíncronas e ",e.jsx("code",{children:"Span<T>"}),". Para projetos novos, é a escolha recomendada."]}),e.jsx("h2",{children:"Serializando: do objeto para JSON"}),e.jsxs("p",{children:["Serializar é pegar um objeto C# e transformá-lo em uma string JSON. O método principal é ",e.jsx("code",{children:"JsonSerializer.Serialize"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Text.Json;

// Um record simples (record é uma classe imutável "rápida" do C# 9+)
public record Pessoa(string Nome, int Idade, string Email);

var maria = new Pessoa("Maria Silva", 30, "maria@exemplo.com");

// Serializa para string JSON em uma linha só (compacto)
string json = JsonSerializer.Serialize(maria);
Console.WriteLine(json);
// Saída: {"Nome":"Maria Silva","Idade":30,"Email":"maria@exemplo.com"}`})}),e.jsxs("p",{children:["Note que as propriedades vêm com ",e.jsx("strong",{children:"PascalCase"})," (igual ao C#). Em JSON é convenção usar ",e.jsx("strong",{children:"camelCase"})," (primeira letra minúscula). Para isso usamos ",e.jsx("code",{children:"JsonSerializerOptions"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`var opcoes = new JsonSerializerOptions
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
*/`})}),e.jsxs(o,{type:"info",title:"Reaproveite as opções",children:[e.jsx("code",{children:"JsonSerializerOptions"})," é caro de criar (faz cache interno de metadados na primeira chamada). Crie uma instância única ",e.jsx("em",{children:"estática"})," e reutilize em todo o app — não crie uma nova a cada chamada."]}),e.jsx("h2",{children:"Desserializando: de JSON para objeto"}),e.jsxs("p",{children:["O inverso é igualmente direto. Você passa o tipo esperado como ",e.jsx("em",{children:"generic parameter"})," (parâmetro genérico, em ",e.jsx("code",{children:"<...>"}),"):"]}),e.jsx("pre",{children:e.jsx("code",{children:`string entrada = """
{
  "nome": "João",
  "idade": 25,
  "email": "joao@x.com"
}
""";

var p = JsonSerializer.Deserialize<Pessoa>(entrada, opcoes);
Console.WriteLine(p?.Nome); // João`})}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"?"})," em ",e.jsx("code",{children:"p?.Nome"})," existe porque ",e.jsx("code",{children:"Deserialize"})," pode retornar ",e.jsx("code",{children:"null"})," se a entrada for o literal ",e.jsx("code",{children:'"null"'})," ou string vazia. Sempre trate essa possibilidade em código de produção."]}),e.jsx("h2",{children:"Customizando nomes com [JsonPropertyName]"}),e.jsxs("p",{children:["Quando o JSON externo usa nomes diferentes dos seus (por exemplo, um campo chamado ",e.jsx("code",{children:'"user_id"'})," e você quer chamar de ",e.jsx("code",{children:"UsuarioId"}),"), use o atributo ",e.jsx("code",{children:"[JsonPropertyName]"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Text.Json.Serialization;

public class Cliente
{
    [JsonPropertyName("user_id")]
    public int UsuarioId { get; set; }

    [JsonPropertyName("full_name")]
    public string NomeCompleto { get; set; } = "";

    [JsonIgnore] // nunca aparece no JSON gerado
    public string SenhaInterna { get; set; } = "";
}`})}),e.jsxs("p",{children:[e.jsx("code",{children:"[JsonIgnore]"})," exclui um campo da serialização — ótimo para senhas, dados internos ou propriedades calculadas que você não quer expor."]}),e.jsx("h2",{children:"Polimorfismo com JsonDerivedType"}),e.jsxs("p",{children:["Imagine uma hierarquia: ",e.jsx("code",{children:"Animal"})," e suas subclasses ",e.jsx("code",{children:"Cachorro"}),", ",e.jsx("code",{children:"Gato"}),". Como serializar uma ",e.jsx("code",{children:"List<Animal>"})," e depois reconstruir a subclasse correta? Use ",e.jsx("code",{children:"[JsonDerivedType]"})," (.NET 7+):"]}),e.jsx("pre",{children:e.jsx("code",{children:`[JsonPolymorphic(TypeDiscriminatorPropertyName = "$tipo")]
[JsonDerivedType(typeof(Cachorro), "cachorro")]
[JsonDerivedType(typeof(Gato), "gato")]
public abstract class Animal { public string Nome { get; set; } = ""; }

public class Cachorro : Animal { public string Raca { get; set; } = ""; }
public class Gato    : Animal { public bool   Castrado { get; set; } }

Animal a = new Cachorro { Nome = "Rex", Raca = "Vira-lata" };
string json = JsonSerializer.Serialize<Animal>(a);
// {"$tipo":"cachorro","Raca":"Vira-lata","Nome":"Rex"}

Animal? voltou = JsonSerializer.Deserialize<Animal>(json);
// voltou é, em runtime, um Cachorro`})}),e.jsx("h2",{children:"Source Generation: zero reflection, AOT-friendly"}),e.jsxs("p",{children:["Por padrão, ",e.jsx("code",{children:"System.Text.Json"})," usa ",e.jsx("strong",{children:"reflection"})," (inspecionar tipos em tempo de execução) para descobrir as propriedades. Isso funciona, mas é lento na primeira chamada e ",e.jsx("em",{children:"não funciona"})," em compilação ",e.jsx("strong",{children:"AOT"})," (Ahead-Of-Time, comum em apps móveis e cloud-native enxutos). A solução é o ",e.jsx("em",{children:"source generator"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`[JsonSerializable(typeof(Pessoa))]
[JsonSerializable(typeof(List<Pessoa>))]
public partial class MeuJsonContext : JsonSerializerContext { }

// Uso:
string json = JsonSerializer.Serialize(maria, MeuJsonContext.Default.Pessoa);
var voltou = JsonSerializer.Deserialize(json, MeuJsonContext.Default.Pessoa);`})}),e.jsxs("p",{children:["O compilador gera automaticamente o código de serialização em tempo de build (você verá arquivos ",e.jsx("code",{children:".g.cs"})," no projeto). Resultado: ",e.jsx("strong",{children:"10× mais rápido"})," na primeira chamada e compatível com AOT."]}),e.jsxs(o,{type:"warning",title:"Datas e fusos",children:["Datas em JSON não têm padrão único. ",e.jsx("code",{children:"System.Text.Json"})," usa ",e.jsx("strong",{children:"ISO 8601"})," (",e.jsx("code",{children:'"2025-01-15T14:30:00Z"'}),"). Se a API que você consome usa outro formato, configure um ",e.jsx("code",{children:"JsonConverter"})," personalizado."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer setters públicos:"})," sem ",e.jsx("code",{children:"get; set;"})," público, a desserialização não preenche a propriedade. Em records isso já vem resolvido pelo construtor."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Criar JsonSerializerOptions toda hora:"})," mata a performance. Faça ",e.jsx("code",{children:"static readonly"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confiar em case por padrão:"})," System.Text.Json é case-sensitive. Se o JSON vem com chaves em camelCase, configure ",e.jsx("code",{children:"PropertyNameCaseInsensitive = true"})," ou a ",e.jsx("code",{children:"NamingPolicy"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar tipos sem construtor sem parâmetros:"})," classes que só têm construtores com argumentos podem falhar — prefira records ou marque o construtor com ",e.jsx("code",{children:"[JsonConstructor]"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"JsonSerializer.Serialize/Deserialize"})," são os métodos centrais."]}),e.jsxs("li",{children:[e.jsx("code",{children:"JsonSerializerOptions"})," controla naming, indentação, case, e deve ser reutilizada."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[JsonPropertyName]"})," e ",e.jsx("code",{children:"[JsonIgnore]"})," ajustam o mapeamento de propriedades."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[JsonDerivedType]"})," permite polimorfismo seguro com discriminador."]}),e.jsxs("li",{children:["Source generators (",e.jsx("code",{children:"JsonSerializerContext"}),") dão performance e suporte a AOT."]})]})]})}export{i as default};
