import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function XmlLinq() {
  return (
    <PageContainer
      title="XML com XDocument e LINQ to XML"
      subtitle="Lendo, consultando e gerando arquivos XML de forma elegante usando a API moderna do .NET."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        <strong>XML</strong> (Extensible Markup Language) ainda é onipresente: arquivos de configuração (<code>.csproj</code>, <code>web.config</code>), feeds RSS, SOAP, documentos do Office, OpenStreetMap, e milhares de integrações corporativas. No .NET temos duas APIs principais: a antiga <code>XmlDocument</code> (estilo DOM, verbosa) e a moderna <strong>LINQ to XML</strong> (namespace <code>System.Xml.Linq</code>, classes <code>XDocument</code> e <code>XElement</code>). A segunda é dramaticamente mais agradável — você consulta XML como se fossem coleções de objetos.
      </p>
      <p>
        Pense em XML como uma árvore: existe um <em>elemento raiz</em>, que tem elementos filhos, que podem ter atributos e mais filhos. <code>LINQ to XML</code> deixa você navegar nessa árvore com métodos que parecem LINQ comum.
      </p>

      <h2>Carregando um XML existente</h2>
      <p>
        O ponto de entrada é <code>XDocument.Load</code> (lê de arquivo, URL ou stream) ou <code>XDocument.Parse</code> (lê de string em memória):
      </p>
      <pre><code>{`using System.Xml.Linq;

string xml = """
<biblioteca>
  <livro id="1" categoria="ficcao">
    <titulo>1984</titulo>
    <autor>George Orwell</autor>
    <preco>39.90</preco>
  </livro>
  <livro id="2" categoria="tecnico">
    <titulo>Clean Code</titulo>
    <autor>Robert Martin</autor>
    <preco>89.00</preco>
  </livro>
</biblioteca>
""";

XDocument doc = XDocument.Parse(xml);
XElement raiz = doc.Root!; // <biblioteca>`}</code></pre>
      <p>
        <code>XDocument</code> representa o documento inteiro (com declaração <code>&lt;?xml ...?&gt;</code>); <code>XElement</code> representa um único elemento. <code>doc.Root</code> retorna o elemento raiz.
      </p>

      <h2>Navegando: Elements, Descendants, Attributes</h2>
      <p>
        Os métodos mais usados:
      </p>
      <ul>
        <li><code>Elements("nome")</code>: filhos diretos com aquele nome.</li>
        <li><code>Descendants("nome")</code>: <em>todos</em> os descendentes com aquele nome, em qualquer profundidade.</li>
        <li><code>Element("nome")</code>: o primeiro filho direto (singular).</li>
        <li><code>Attribute("nome")</code>: o atributo (ex.: <code>id="1"</code>).</li>
        <li><code>Value</code>: o conteúdo de texto interno.</li>
      </ul>
      <pre><code>{`// Listar título e preço de cada livro
foreach (var livro in raiz.Elements("livro"))
{
    string titulo = livro.Element("titulo")!.Value;
    decimal preco = decimal.Parse(livro.Element("preco")!.Value);
    string categoria = livro.Attribute("categoria")!.Value;
    Console.WriteLine($"{titulo} ({categoria}) - R$ {preco}");
}`}</code></pre>

      <h2>Consultando com LINQ</h2>
      <p>
        A grande sacada: como <code>Elements</code> retorna <code>IEnumerable&lt;XElement&gt;</code>, você pode usar <strong>todos</strong> os operadores LINQ — <code>Where</code>, <code>Select</code>, <code>OrderBy</code>, <code>GroupBy</code>:
      </p>
      <pre><code>{`// Livros baratos (menos de R$ 50)
var baratos = raiz.Elements("livro")
    .Where(l => decimal.Parse(l.Element("preco")!.Value) < 50)
    .Select(l => new
    {
        Titulo = l.Element("titulo")!.Value,
        Preco  = decimal.Parse(l.Element("preco")!.Value)
    })
    .ToList();

// Total geral
decimal total = raiz.Descendants("preco")
    .Sum(p => decimal.Parse(p.Value));`}</code></pre>

      <AlertBox type="info" title="Por que tantos Parse?">
        XML é <em>texto</em> — não tem tipos. Tudo vem como string. Para evitar repetição, você pode usar a conversão explícita do LINQ to XML: <code>(decimal)l.Element("preco")</code>. Ela faz o parse com cultura invariante, evitando bugs com vírgula/ponto decimal.
      </AlertBox>

      <h2>Criando XML do zero</h2>
      <p>
        A API permite construir documentos com sintaxe declarativa, semelhante ao próprio XML resultante:
      </p>
      <pre><code>{`var novoDoc = new XDocument(
    new XDeclaration("1.0", "utf-8", null),
    new XElement("biblioteca",
        new XElement("livro",
            new XAttribute("id", 1),
            new XAttribute("categoria", "ficcao"),
            new XElement("titulo", "Dom Quixote"),
            new XElement("autor", "Miguel de Cervantes"),
            new XElement("preco", 49.90m)
        )
    )
);

novoDoc.Save("biblioteca.xml");
Console.WriteLine(novoDoc); // imprime o XML formatado`}</code></pre>
      <p>
        Cada construtor aceita <code>params object[]</code> — você empilha elementos, atributos e textos como argumentos, e a árvore se monta sozinha.
      </p>

      <h2>Lidando com namespaces</h2>
      <p>
        XML "de verdade" frequentemente tem <em>namespaces</em> (não confunda com namespace do C#): prefixos que evitam conflito de nomes em documentos compostos. Em LINQ to XML, use <code>XNamespace</code>:
      </p>
      <pre><code>{`XNamespace ns = "http://exemplo.com/biblioteca/v1";

var doc2 = new XDocument(
    new XElement(ns + "biblioteca",
        new XElement(ns + "livro",
            new XElement(ns + "titulo", "A Revolução dos Bichos")
        )
    )
);

// Para ler:
var titulos = doc2.Root!.Elements(ns + "livro")
                       .Select(l => l.Element(ns + "titulo")!.Value);`}</code></pre>
      <p>
        O operador <code>+</code> entre <code>XNamespace</code> e string monta um <code>XName</code> qualificado. Esquecer isso é o erro número 1 ao consumir SOAP, RSS ou OOXML.
      </p>

      <AlertBox type="warning" title="Element vs Descendants">
        <code>Element("livro")</code> só olha filhos <em>diretos</em>. <code>Descendants("livro")</code> percorre toda a árvore. Misturar os dois sem perceber leva a buscas vazias ou duplicadas.
      </AlertBox>

      <h2>Modificando e salvando</h2>
      <p>
        XElement é <em>mutável</em>. Você pode adicionar, remover e alterar nós:
      </p>
      <pre><code>{`var livro = raiz.Elements("livro").First();

// Mudar valor
livro.Element("preco")!.Value = "29.90";

// Adicionar filho
livro.Add(new XElement("estoque", 10));

// Remover atributo
livro.Attribute("categoria")?.Remove();

doc.Save("biblioteca-atualizada.xml");`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer namespace:</strong> tentar <code>doc.Element("livro")</code> em XML com namespace retorna <code>null</code>. Sempre use <code>ns + "nome"</code>.</li>
        <li><strong>NullReference:</strong> <code>Element("x")</code> retorna <code>null</code> se não existir. Use <code>?.Value</code> ou cheque antes.</li>
        <li><strong>Cultura em decimais:</strong> <code>decimal.Parse("39.90")</code> falha em máquinas com vírgula como separador. Use a conversão explícita do LINQ to XML ou <code>CultureInfo.InvariantCulture</code>.</li>
        <li><strong>Confundir Element (singular) com Elements (plural):</strong> o primeiro retorna um único elemento; o segundo, uma coleção.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>XDocument.Load/Parse</code> carrega XML; <code>Save</code> grava.</li>
        <li><code>Elements</code>, <code>Descendants</code>, <code>Attribute</code>, <code>Value</code> navegam a árvore.</li>
        <li>Como retornam <code>IEnumerable</code>, você usa LINQ direto.</li>
        <li>Construa XML com construtores aninhados; eles espelham a estrutura final.</li>
        <li><code>XNamespace</code> + <code>+</code> resolve nomes qualificados.</li>
      </ul>
    </PageContainer>
  );
}
