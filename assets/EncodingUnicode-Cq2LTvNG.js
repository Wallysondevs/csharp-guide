import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"Encoding e Unicode em C#",subtitle:"Por que o caractere 'ç' às vezes vira 'Ã§' — e como ler/escrever bytes corretamente em qualquer linguagem do mundo.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["Computadores armazenam ",e.jsx("strong",{children:"bytes"}),', não letras. Para traduzir entre os dois — "isto é a letra á", "isto é a letra ç" — usamos uma ',e.jsx("strong",{children:"codificação"})," (encoding): uma tabela que mapeia números a caracteres. O problema é que existem ",e.jsx("em",{children:"várias"})," tabelas concorrentes (UTF-8, UTF-16, ASCII, ISO-8859-1, Windows-1252...), e ler um arquivo com a errada produz aquela bagunça famosa de ",e.jsx("code",{children:"café"})," virando ",e.jsx("code",{children:"café"}),". Este capítulo explica o que é Unicode, como o C# representa strings internamente e como ler/escrever bytes sem corromper acentos."]}),e.jsx("h2",{children:"Unicode e UTF-8 em uma página"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Unicode"})," é o catálogo: dá um número único (chamado ",e.jsx("em",{children:"code point"}),") para cada caractere de quase todos os idiomas do mundo, incluindo emojis. Esse número costuma ser escrito como ",e.jsx("code",{children:"U+00E7"}),' (que é o "ç"). ',e.jsx("strong",{children:"UTF-8"})," é uma das formas de ",e.jsx("em",{children:"serializar"})," esses números em bytes: usa de 1 a 4 bytes por caractere. Letras ASCII (a-z, 0-9, símbolos básicos) usam 1 byte; acentos latinos usam 2; ideogramas chineses usam 3; emojis usam 4. UTF-8 é o padrão de fato da web e o que você deve usar em arquivos texto novos."]}),e.jsx("pre",{children:e.jsx("code",{children:`// "café" em UTF-8 ocupa 5 bytes:
//   c=0x63  a=0x61  f=0x66  é=0xC3 0xA9
// Em ISO-8859-1 (Latin-1) ocupa 4 bytes:
//   c=0x63  a=0x61  f=0x66  é=0xE9
// Ler bytes UTF-8 com decoder Latin-1 "vê" 2 caracteres no lugar do é:
//   0xC3=Ã  0xA9=©  → "café"  (mojibake)`})}),e.jsx("h2",{children:"A classe Encoding"}),e.jsxs("p",{children:["No .NET, cada codificação é representada por uma instância de ",e.jsx("code",{children:"System.Text.Encoding"}),". Para o uso comum, há propriedades estáticas: ",e.jsx("code",{children:"UTF8"}),", ",e.jsx("code",{children:"Unicode"})," (que é UTF-16 little-endian), ",e.jsx("code",{children:"UTF32"}),", ",e.jsx("code",{children:"ASCII"}),". Para outras (Windows-1252, ISO-8859-1), você precisa registrar o pacote ",e.jsx("code",{children:"System.Text.Encoding.CodePages"})," em .NET Core+."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Text;

string txt = "café 🚀";

// Texto → bytes
byte[] utf8  = Encoding.UTF8.GetBytes(txt);     // 9 bytes (4 ASCII + 2 do é + 4 do emoji - 1 espaço extra)
byte[] utf16 = Encoding.Unicode.GetBytes(txt);  // 14 bytes
byte[] ascii = Encoding.ASCII.GetBytes(txt);    // 7 bytes — perde acentos e emoji!
// "ASCII" substitui chars desconhecidos por '?': "caf? ?"

// Bytes → texto
string voltaUtf8  = Encoding.UTF8.GetString(utf8);     // "café 🚀"
string voltaErrada = Encoding.GetEncoding("ISO-8859-1").GetString(utf8);
// → "café ð\\u009f\\u009a\\u0080" (mojibake)`})}),e.jsxs(o,{type:"warning",title:"ASCII descarta tudo fora do alfabeto inglês",children:[e.jsx("code",{children:"Encoding.ASCII"})," cobre apenas os 128 primeiros caracteres (a-z, A-Z, 0-9, pontuação básica). Qualquer outro vira ",e.jsx("code",{children:"?"}),". Use ASCII só quando você tem ",e.jsx("em",{children:"certeza"})," de que o texto é estritamente inglês simples."]}),e.jsx("h2",{children:'BOM (Byte Order Mark): o "selo" do arquivo'}),e.jsxs("p",{children:["Alguns arquivos começam com 2 a 4 bytes invisíveis chamados ",e.jsx("strong",{children:"BOM"})," que identificam a codificação. O Excel, por exemplo, exige BOM em CSVs UTF-8, ou exibe acentos errados. Para escrever com BOM use o construtor ",e.jsx("code",{children:"new UTF8Encoding(true)"}),"; sem BOM, ",e.jsx("code",{children:"new UTF8Encoding(false)"})," ou simplesmente ",e.jsx("code",{children:"Encoding.UTF8"})," (que escreve com BOM por padrão na maior parte das APIs)."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Excel-friendly CSV em UTF-8 com BOM
using System.Text;

var encoding = new UTF8Encoding(encoderShouldEmitUTF8Identifier: true);
File.WriteAllText("relatorio.csv", "nome;valor\\nMaria;1.500", encoding);

// Bytes resultantes começam com EF BB BF (o BOM UTF-8)`})}),e.jsx("h2",{children:"Lendo um arquivo com encoding desconhecido"}),e.jsxs("p",{children:["Em geral, abra como ",e.jsx("code",{children:"UTF-8"}),"; é o padrão moderno. Se vier mojibake, é provavelmente ",e.jsx("code",{children:"Windows-1252"})," (sistemas legados Windows brasileiros) ou ",e.jsx("code",{children:"ISO-8859-1"}),". Não há detecção 100% confiável — heurísticas existem, mas o pragmático é ",e.jsx("em",{children:"perguntar a quem gerou"})," ou tentar duas codificações comuns."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Text;
Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
// (necessário em .NET Core+ para encodings legados)

string ler(string path, Encoding enc) =>
    File.ReadAllText(path, enc);

try {
    var conteudo = ler("legado.txt", Encoding.UTF8);
    if (conteudo.Contains("ï¿½"))   // marca de erro
        conteudo = ler("legado.txt", Encoding.GetEncoding(1252));
    Console.WriteLine(conteudo);
} catch (DecoderFallbackException) {
    // UTF-8 estrito rejeitou bytes inválidos: tente outra
}`})}),e.jsx("h2",{children:"char é UTF-16 — e isso tem consequências"}),e.jsxs("p",{children:["Internamente, todo ",e.jsx("code",{children:"string"})," e ",e.jsx("code",{children:"char"})," em C# são UTF-16. Cada ",e.jsx("code",{children:"char"})," ocupa ",e.jsx("strong",{children:"2 bytes"}),'. O detalhe perigoso é que caracteres "raros" (emoji, ideogramas além do plano básico) ocupam ',e.jsx("em",{children:"dois"})," ",e.jsx("code",{children:"char"}),"s — formando o que se chama ",e.jsx("strong",{children:"surrogate pair"}),". Ou seja, ",e.jsx("code",{children:'"🚀".Length'})," é ",e.jsx("code",{children:"2"}),", não 1. Iterar com ",e.jsx("code",{children:"foreach"})," sobre ",e.jsx("code",{children:"string"})," também devolve cada metade separadamente."]}),e.jsx("pre",{children:e.jsx("code",{children:`string s = "abç🚀";
Console.WriteLine(s.Length);                  // 5  (não 4!)
Console.WriteLine(s[3]);                       // � (primeira metade do emoji)
Console.WriteLine((int)s[3]);                  // 55357 (high surrogate)

// Para iterar caracteres "humanos" (graphemes), use StringInfo / Rune:
var runes = s.EnumerateRunes();   // .NET Core 3+
foreach (Rune r in runes)
    Console.WriteLine($"U+{r.Value:X4}");
// U+0061  (a)
// U+0062  (b)
// U+00E7  (ç)
// U+1F680 (🚀)`})}),e.jsxs("p",{children:[e.jsx("code",{children:"Rune"})," representa um code point Unicode ",e.jsx("em",{children:"completo"}),' (não uma metade). É a abstração correta quando você precisa contar "caracteres" como um humano contaria, processar texto multilíngue ou validar entrada com emojis.']}),e.jsxs(o,{type:"info",title:'String.Length não é "número de caracteres"',children:["Para o usuário, ",e.jsx("code",{children:'"🇧🇷"'})," é uma bandeira. Para o C#, é uma ",e.jsx("strong",{children:"sequência de 4 chars"}),' (dois code points combinados). Se você precisa exibir "X de Y caracteres" para uma pessoa, use ',e.jsx("code",{children:"StringInfo.LengthInTextElements"}),". Para contar code points, use ",e.jsx("code",{children:"EnumerateRunes().Count()"}),"."]}),e.jsx("h2",{children:"Convertendo entre encodings"}),e.jsx("p",{children:'Para "transcodificar" um arquivo (mudar de Windows-1252 para UTF-8, por exemplo), leia bytes na origem e escreva na nova codificação:'}),e.jsx("pre",{children:e.jsx("code",{children:`Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

byte[] bytes = File.ReadAllBytes("origem.txt");
string texto = Encoding.GetEncoding(1252).GetString(bytes);
File.WriteAllText("destino_utf8.txt", texto, new UTF8Encoding(false));`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Salvar JSON com BOM"})," — alguns parsers (especialmente JS antigo) quebram. Use ",e.jsx("code",{children:"new UTF8Encoding(false)"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"char"}),' com "caractere humano"']})," — emoji ocupa 2 chars."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"RegisterProvider"})]})," em .NET Core ao usar codepages legados como 1252."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"Encoding.Default"})]})," em servidores — varia por SO/instalação e gera bugs intermitentes. Seja explícito."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Unicode dá um número (code point) a cada caractere; UTF-8 e UTF-16 são formas de codificá-los em bytes."}),e.jsxs("li",{children:[e.jsx("code",{children:"Encoding.UTF8"}),", ",e.jsx("code",{children:"Encoding.Unicode"})," (UTF-16 LE), ",e.jsx("code",{children:"Encoding.ASCII"})," são as principais."]}),e.jsxs("li",{children:[e.jsx("code",{children:"GetBytes"})," converte string→bytes; ",e.jsx("code",{children:"GetString"})," faz o caminho inverso."]}),e.jsx("li",{children:"BOM identifica a codificação do arquivo; obrigatório em CSV para Excel."}),e.jsxs("li",{children:[e.jsx("code",{children:"char"})," em C# é UTF-16; emojis ocupam 2 chars (surrogate pair)."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"Rune"})," ou ",e.jsx("code",{children:"StringInfo"}),' para contar "caracteres humanos".']})]})]})}export{i as default};
