import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"XML com XDocument e LINQ to XML",subtitle:"Lendo, consultando e gerando arquivos XML de forma elegante usando a API moderna do .NET.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"XML"})," (Extensible Markup Language) ainda é onipresente: arquivos de configuração (",e.jsx("code",{children:".csproj"}),", ",e.jsx("code",{children:"web.config"}),"), feeds RSS, SOAP, documentos do Office, OpenStreetMap, e milhares de integrações corporativas. No .NET temos duas APIs principais: a antiga ",e.jsx("code",{children:"XmlDocument"})," (estilo DOM, verbosa) e a moderna ",e.jsx("strong",{children:"LINQ to XML"})," (namespace ",e.jsx("code",{children:"System.Xml.Linq"}),", classes ",e.jsx("code",{children:"XDocument"})," e ",e.jsx("code",{children:"XElement"}),"). A segunda é dramaticamente mais agradável — você consulta XML como se fossem coleções de objetos."]}),e.jsxs("p",{children:["Pense em XML como uma árvore: existe um ",e.jsx("em",{children:"elemento raiz"}),", que tem elementos filhos, que podem ter atributos e mais filhos. ",e.jsx("code",{children:"LINQ to XML"})," deixa você navegar nessa árvore com métodos que parecem LINQ comum."]}),e.jsx("h2",{children:"Carregando um XML existente"}),e.jsxs("p",{children:["O ponto de entrada é ",e.jsx("code",{children:"XDocument.Load"})," (lê de arquivo, URL ou stream) ou ",e.jsx("code",{children:"XDocument.Parse"})," (lê de string em memória):"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Xml.Linq;

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
XElement raiz = doc.Root!; // <biblioteca>`})}),e.jsxs("p",{children:[e.jsx("code",{children:"XDocument"})," representa o documento inteiro (com declaração ",e.jsx("code",{children:"<?xml ...?>"}),"); ",e.jsx("code",{children:"XElement"})," representa um único elemento. ",e.jsx("code",{children:"doc.Root"})," retorna o elemento raiz."]}),e.jsx("h2",{children:"Navegando: Elements, Descendants, Attributes"}),e.jsx("p",{children:"Os métodos mais usados:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:'Elements("nome")'}),": filhos diretos com aquele nome."]}),e.jsxs("li",{children:[e.jsx("code",{children:'Descendants("nome")'}),": ",e.jsx("em",{children:"todos"})," os descendentes com aquele nome, em qualquer profundidade."]}),e.jsxs("li",{children:[e.jsx("code",{children:'Element("nome")'}),": o primeiro filho direto (singular)."]}),e.jsxs("li",{children:[e.jsx("code",{children:'Attribute("nome")'}),": o atributo (ex.: ",e.jsx("code",{children:'id="1"'}),")."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Value"}),": o conteúdo de texto interno."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// Listar título e preço de cada livro
foreach (var livro in raiz.Elements("livro"))
{
    string titulo = livro.Element("titulo")!.Value;
    decimal preco = decimal.Parse(livro.Element("preco")!.Value);
    string categoria = livro.Attribute("categoria")!.Value;
    Console.WriteLine($"{titulo} ({categoria}) - R$ {preco}");
}`})}),e.jsx("h2",{children:"Consultando com LINQ"}),e.jsxs("p",{children:["A grande sacada: como ",e.jsx("code",{children:"Elements"})," retorna ",e.jsx("code",{children:"IEnumerable<XElement>"}),", você pode usar ",e.jsx("strong",{children:"todos"})," os operadores LINQ — ",e.jsx("code",{children:"Where"}),", ",e.jsx("code",{children:"Select"}),", ",e.jsx("code",{children:"OrderBy"}),", ",e.jsx("code",{children:"GroupBy"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Livros baratos (menos de R$ 50)
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
    .Sum(p => decimal.Parse(p.Value));`})}),e.jsxs(o,{type:"info",title:"Por que tantos Parse?",children:["XML é ",e.jsx("em",{children:"texto"})," — não tem tipos. Tudo vem como string. Para evitar repetição, você pode usar a conversão explícita do LINQ to XML: ",e.jsx("code",{children:'(decimal)l.Element("preco")'}),". Ela faz o parse com cultura invariante, evitando bugs com vírgula/ponto decimal."]}),e.jsx("h2",{children:"Criando XML do zero"}),e.jsx("p",{children:"A API permite construir documentos com sintaxe declarativa, semelhante ao próprio XML resultante:"}),e.jsx("pre",{children:e.jsx("code",{children:`var novoDoc = new XDocument(
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
Console.WriteLine(novoDoc); // imprime o XML formatado`})}),e.jsxs("p",{children:["Cada construtor aceita ",e.jsx("code",{children:"params object[]"})," — você empilha elementos, atributos e textos como argumentos, e a árvore se monta sozinha."]}),e.jsx("h2",{children:"Lidando com namespaces"}),e.jsxs("p",{children:['XML "de verdade" frequentemente tem ',e.jsx("em",{children:"namespaces"})," (não confunda com namespace do C#): prefixos que evitam conflito de nomes em documentos compostos. Em LINQ to XML, use ",e.jsx("code",{children:"XNamespace"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`XNamespace ns = "http://exemplo.com/biblioteca/v1";

var doc2 = new XDocument(
    new XElement(ns + "biblioteca",
        new XElement(ns + "livro",
            new XElement(ns + "titulo", "A Revolução dos Bichos")
        )
    )
);

// Para ler:
var titulos = doc2.Root!.Elements(ns + "livro")
                       .Select(l => l.Element(ns + "titulo")!.Value);`})}),e.jsxs("p",{children:["O operador ",e.jsx("code",{children:"+"})," entre ",e.jsx("code",{children:"XNamespace"})," e string monta um ",e.jsx("code",{children:"XName"})," qualificado. Esquecer isso é o erro número 1 ao consumir SOAP, RSS ou OOXML."]}),e.jsxs(o,{type:"warning",title:"Element vs Descendants",children:[e.jsx("code",{children:'Element("livro")'})," só olha filhos ",e.jsx("em",{children:"diretos"}),". ",e.jsx("code",{children:'Descendants("livro")'})," percorre toda a árvore. Misturar os dois sem perceber leva a buscas vazias ou duplicadas."]}),e.jsx("h2",{children:"Modificando e salvando"}),e.jsxs("p",{children:["XElement é ",e.jsx("em",{children:"mutável"}),". Você pode adicionar, remover e alterar nós:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var livro = raiz.Elements("livro").First();

// Mudar valor
livro.Element("preco")!.Value = "29.90";

// Adicionar filho
livro.Add(new XElement("estoque", 10));

// Remover atributo
livro.Attribute("categoria")?.Remove();

doc.Save("biblioteca-atualizada.xml");`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer namespace:"})," tentar ",e.jsx("code",{children:'doc.Element("livro")'})," em XML com namespace retorna ",e.jsx("code",{children:"null"}),". Sempre use ",e.jsx("code",{children:'ns + "nome"'}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"NullReference:"})," ",e.jsx("code",{children:'Element("x")'})," retorna ",e.jsx("code",{children:"null"})," se não existir. Use ",e.jsx("code",{children:"?.Value"})," ou cheque antes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cultura em decimais:"})," ",e.jsx("code",{children:'decimal.Parse("39.90")'})," falha em máquinas com vírgula como separador. Use a conversão explícita do LINQ to XML ou ",e.jsx("code",{children:"CultureInfo.InvariantCulture"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confundir Element (singular) com Elements (plural):"})," o primeiro retorna um único elemento; o segundo, uma coleção."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"XDocument.Load/Parse"})," carrega XML; ",e.jsx("code",{children:"Save"})," grava."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Elements"}),", ",e.jsx("code",{children:"Descendants"}),", ",e.jsx("code",{children:"Attribute"}),", ",e.jsx("code",{children:"Value"})," navegam a árvore."]}),e.jsxs("li",{children:["Como retornam ",e.jsx("code",{children:"IEnumerable"}),", você usa LINQ direto."]}),e.jsx("li",{children:"Construa XML com construtores aninhados; eles espelham a estrutura final."}),e.jsxs("li",{children:[e.jsx("code",{children:"XNamespace"})," + ",e.jsx("code",{children:"+"})," resolve nomes qualificados."]})]})]})}export{i as default};
