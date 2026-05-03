import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EncodingUnicode() {
  return (
    <PageContainer
      title="Encoding e Unicode em C#"
      subtitle="Por que o caractere 'ç' às vezes vira 'Ã§' — e como ler/escrever bytes corretamente em qualquer linguagem do mundo."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Computadores armazenam <strong>bytes</strong>, não letras. Para traduzir entre os dois — "isto é a letra á", "isto é a letra ç" — usamos uma <strong>codificação</strong> (encoding): uma tabela que mapeia números a caracteres. O problema é que existem <em>várias</em> tabelas concorrentes (UTF-8, UTF-16, ASCII, ISO-8859-1, Windows-1252...), e ler um arquivo com a errada produz aquela bagunça famosa de <code>café</code> virando <code>café</code>. Este capítulo explica o que é Unicode, como o C# representa strings internamente e como ler/escrever bytes sem corromper acentos.
      </p>

      <h2>Unicode e UTF-8 em uma página</h2>
      <p>
        <strong>Unicode</strong> é o catálogo: dá um número único (chamado <em>code point</em>) para cada caractere de quase todos os idiomas do mundo, incluindo emojis. Esse número costuma ser escrito como <code>U+00E7</code> (que é o "ç"). <strong>UTF-8</strong> é uma das formas de <em>serializar</em> esses números em bytes: usa de 1 a 4 bytes por caractere. Letras ASCII (a-z, 0-9, símbolos básicos) usam 1 byte; acentos latinos usam 2; ideogramas chineses usam 3; emojis usam 4. UTF-8 é o padrão de fato da web e o que você deve usar em arquivos texto novos.
      </p>
      <pre><code>{`// "café" em UTF-8 ocupa 5 bytes:
//   c=0x63  a=0x61  f=0x66  é=0xC3 0xA9
// Em ISO-8859-1 (Latin-1) ocupa 4 bytes:
//   c=0x63  a=0x61  f=0x66  é=0xE9
// Ler bytes UTF-8 com decoder Latin-1 "vê" 2 caracteres no lugar do é:
//   0xC3=Ã  0xA9=©  → "café"  (mojibake)`}</code></pre>

      <h2>A classe Encoding</h2>
      <p>
        No .NET, cada codificação é representada por uma instância de <code>System.Text.Encoding</code>. Para o uso comum, há propriedades estáticas: <code>UTF8</code>, <code>Unicode</code> (que é UTF-16 little-endian), <code>UTF32</code>, <code>ASCII</code>. Para outras (Windows-1252, ISO-8859-1), você precisa registrar o pacote <code>System.Text.Encoding.CodePages</code> em .NET Core+.
      </p>
      <pre><code>{`using System.Text;

string txt = "café 🚀";

// Texto → bytes
byte[] utf8  = Encoding.UTF8.GetBytes(txt);     // 9 bytes (4 ASCII + 2 do é + 4 do emoji - 1 espaço extra)
byte[] utf16 = Encoding.Unicode.GetBytes(txt);  // 14 bytes
byte[] ascii = Encoding.ASCII.GetBytes(txt);    // 7 bytes — perde acentos e emoji!
// "ASCII" substitui chars desconhecidos por '?': "caf? ?"

// Bytes → texto
string voltaUtf8  = Encoding.UTF8.GetString(utf8);     // "café 🚀"
string voltaErrada = Encoding.GetEncoding("ISO-8859-1").GetString(utf8);
// → "café ð\\u009f\\u009a\\u0080" (mojibake)`}</code></pre>

      <AlertBox type="warning" title="ASCII descarta tudo fora do alfabeto inglês">
        <code>Encoding.ASCII</code> cobre apenas os 128 primeiros caracteres (a-z, A-Z, 0-9, pontuação básica). Qualquer outro vira <code>?</code>. Use ASCII só quando você tem <em>certeza</em> de que o texto é estritamente inglês simples.
      </AlertBox>

      <h2>BOM (Byte Order Mark): o "selo" do arquivo</h2>
      <p>
        Alguns arquivos começam com 2 a 4 bytes invisíveis chamados <strong>BOM</strong> que identificam a codificação. O Excel, por exemplo, exige BOM em CSVs UTF-8, ou exibe acentos errados. Para escrever com BOM use o construtor <code>new UTF8Encoding(true)</code>; sem BOM, <code>new UTF8Encoding(false)</code> ou simplesmente <code>Encoding.UTF8</code> (que escreve com BOM por padrão na maior parte das APIs).
      </p>
      <pre><code>{`// Excel-friendly CSV em UTF-8 com BOM
using System.Text;

var encoding = new UTF8Encoding(encoderShouldEmitUTF8Identifier: true);
File.WriteAllText("relatorio.csv", "nome;valor\\nMaria;1.500", encoding);

// Bytes resultantes começam com EF BB BF (o BOM UTF-8)`}</code></pre>

      <h2>Lendo um arquivo com encoding desconhecido</h2>
      <p>
        Em geral, abra como <code>UTF-8</code>; é o padrão moderno. Se vier mojibake, é provavelmente <code>Windows-1252</code> (sistemas legados Windows brasileiros) ou <code>ISO-8859-1</code>. Não há detecção 100% confiável — heurísticas existem, mas o pragmático é <em>perguntar a quem gerou</em> ou tentar duas codificações comuns.
      </p>
      <pre><code>{`using System.Text;
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
}`}</code></pre>

      <h2>char é UTF-16 — e isso tem consequências</h2>
      <p>
        Internamente, todo <code>string</code> e <code>char</code> em C# são UTF-16. Cada <code>char</code> ocupa <strong>2 bytes</strong>. O detalhe perigoso é que caracteres "raros" (emoji, ideogramas além do plano básico) ocupam <em>dois</em> <code>char</code>s — formando o que se chama <strong>surrogate pair</strong>. Ou seja, <code>"🚀".Length</code> é <code>2</code>, não 1. Iterar com <code>foreach</code> sobre <code>string</code> também devolve cada metade separadamente.
      </p>
      <pre><code>{`string s = "abç🚀";
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
// U+1F680 (🚀)`}</code></pre>

      <p>
        <code>Rune</code> representa um code point Unicode <em>completo</em> (não uma metade). É a abstração correta quando você precisa contar "caracteres" como um humano contaria, processar texto multilíngue ou validar entrada com emojis.
      </p>

      <AlertBox type="info" title="String.Length não é &quot;número de caracteres&quot;">
        Para o usuário, <code>"🇧🇷"</code> é uma bandeira. Para o C#, é uma <strong>sequência de 4 chars</strong> (dois code points combinados). Se você precisa exibir "X de Y caracteres" para uma pessoa, use <code>StringInfo.LengthInTextElements</code>. Para contar code points, use <code>EnumerateRunes().Count()</code>.
      </AlertBox>

      <h2>Convertendo entre encodings</h2>
      <p>
        Para "transcodificar" um arquivo (mudar de Windows-1252 para UTF-8, por exemplo), leia bytes na origem e escreva na nova codificação:
      </p>
      <pre><code>{`Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

byte[] bytes = File.ReadAllBytes("origem.txt");
string texto = Encoding.GetEncoding(1252).GetString(bytes);
File.WriteAllText("destino_utf8.txt", texto, new UTF8Encoding(false));`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Salvar JSON com BOM</strong> — alguns parsers (especialmente JS antigo) quebram. Use <code>new UTF8Encoding(false)</code>.</li>
        <li><strong>Confundir <code>char</code> com "caractere humano"</strong> — emoji ocupa 2 chars.</li>
        <li><strong>Esquecer <code>RegisterProvider</code></strong> em .NET Core ao usar codepages legados como 1252.</li>
        <li><strong>Usar <code>Encoding.Default</code></strong> em servidores — varia por SO/instalação e gera bugs intermitentes. Seja explícito.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Unicode dá um número (code point) a cada caractere; UTF-8 e UTF-16 são formas de codificá-los em bytes.</li>
        <li><code>Encoding.UTF8</code>, <code>Encoding.Unicode</code> (UTF-16 LE), <code>Encoding.ASCII</code> são as principais.</li>
        <li><code>GetBytes</code> converte string→bytes; <code>GetString</code> faz o caminho inverso.</li>
        <li>BOM identifica a codificação do arquivo; obrigatório em CSV para Excel.</li>
        <li><code>char</code> em C# é UTF-16; emojis ocupam 2 chars (surrogate pair).</li>
        <li>Use <code>Rune</code> ou <code>StringInfo</code> para contar "caracteres humanos".</li>
      </ul>
    </PageContainer>
  );
}
