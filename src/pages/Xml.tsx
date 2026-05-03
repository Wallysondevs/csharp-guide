import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Xml() {
  return (
    <PageContainer
      title={"XML: parsing e serialização"}
      subtitle={"XmlReader, XDocument, XmlSerializer. Quando você precisa ler SOAP ou config legado."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`using System.Xml.Linq;

// LINQ to XML
var doc = XDocument.Parse("""
<pessoas>
    <pessoa nome="Ana" idade="30"/>
    <pessoa nome="Bia" idade="25"/>
</pessoas>
""");

var nomes = doc.Descendants("pessoa")
               .Select(p => p.Attribute("nome")!.Value)
               .ToList();

// XmlSerializer pra DTOs
[XmlRoot("config")]
public class Config { public string Host { get; set; } = ""; }

var ser = new XmlSerializer(typeof(Config));
using var sr = new StringReader(xmlText);
var c = (Config)ser.Deserialize(sr)!;`}
      />
    </PageContainer>
  );
}
