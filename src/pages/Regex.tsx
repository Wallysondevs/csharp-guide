import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Regex() {
  return (
    <PageContainer
      title="Expressões regulares com Regex"
      subtitle="Como buscar, validar e substituir padrões de texto usando o System.Text.RegularExpressions."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Imagine que você precisa achar todos os e-mails dentro de um documento de mil páginas, ou validar se um CEP tem o formato "12345-678", ou trocar todas as ocorrências de telefones por <code>***</code> num log. Fazer isso com <code>IndexOf</code> e <code>Substring</code> daria um código gigantesco e frágil. <strong>Expressões regulares</strong> (regex) são uma <em>mini-linguagem</em> para descrever padrões de texto — um conjunto de símbolos como <code>\d+</code> (um ou mais dígitos) que casam com qualquer trecho que siga o formato. Em C#, tudo isso vive na classe <code>Regex</code> dentro do namespace <code>System.Text.RegularExpressions</code>.
      </p>

      <h2>Os métodos essenciais</h2>
      <p>
        A classe <code>Regex</code> oferece quatro métodos que você usará 90% do tempo: <code>IsMatch</code> (verdadeiro/falso), <code>Match</code> (primeira ocorrência), <code>Matches</code> (todas) e <code>Replace</code> (substituir). Há versões estáticas (mais rápidas para uso pontual) e de instância (mais rápidas para uso repetido com a mesma regex).
      </p>
      <pre><code>{`using System.Text.RegularExpressions;

string texto = "Pedidos: #1042 e #2045 entregues em 15/07/2024.";

// IsMatch — só verifica se casa
bool temPedido = Regex.IsMatch(texto, @"#\d+");   // true

// Match — primeira ocorrência (com posição, valor)
Match m = Regex.Match(texto, @"#\d+");
if (m.Success)
    Console.WriteLine($"Achei {m.Value} no índice {m.Index}");
// Achei #1042 no índice 10

// Matches — todas as ocorrências
foreach (Match x in Regex.Matches(texto, @"#\d+"))
    Console.WriteLine(x.Value);
// #1042
// #2045

// Replace — substitui
string mascarado = Regex.Replace(texto, @"#\d+", "#XXXX");
// "Pedidos: #XXXX e #XXXX entregues em 15/07/2024."`}</code></pre>

      <h2>O alfabeto básico das regex</h2>
      <p>
        A potência vem dos <strong>metacaracteres</strong> — símbolos que não significam si mesmos, mas representam classes de caracteres ou repetições. Os essenciais:
      </p>
      <table>
        <thead><tr><th>Símbolo</th><th>Significado</th></tr></thead>
        <tbody>
          <tr><td><code>\d</code></td><td>um dígito (0-9)</td></tr>
          <tr><td><code>\w</code></td><td>letra, dígito ou _</td></tr>
          <tr><td><code>\s</code></td><td>espaço, tab, quebra de linha</td></tr>
          <tr><td><code>.</code></td><td>qualquer caractere (exceto quebra de linha)</td></tr>
          <tr><td><code>[abc]</code></td><td>a, b ou c</td></tr>
          <tr><td><code>[^abc]</code></td><td>qualquer coisa exceto a, b, c</td></tr>
          <tr><td><code>+</code></td><td>1 ou mais do anterior</td></tr>
          <tr><td><code>*</code></td><td>0 ou mais</td></tr>
          <tr><td><code>?</code></td><td>0 ou 1 (opcional)</td></tr>
          <tr><td><code>{`{n,m}`}</code></td><td>entre n e m repetições</td></tr>
          <tr><td><code>^ $</code></td><td>início / fim da string (ou linha)</td></tr>
        </tbody>
      </table>
      <p>
        Combinando esses tijolos, você descreve quase qualquer padrão. Note: em C#, sempre use o prefixo <code>@</code> nas strings de regex (<em>verbatim string</em>), para não precisar dobrar todo <code>\</code>.
      </p>

      <h2>Grupos: capturando partes do casamento</h2>
      <p>
        Parênteses agrupam — e <strong>capturam</strong>. Cada grupo recebe um número (1, 2, 3...) que você acessa em <code>m.Groups[i]</code>. É assim que você extrai pedaços específicos do texto casado.
      </p>
      <pre><code>{`string log = "[2024-07-15 14:30] Erro 404: arquivo nao encontrado";
var rx = new Regex(@"\[(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})\] Erro (\d+): (.+)");

Match m = rx.Match(log);
if (m.Success) {
    string ano   = m.Groups[1].Value;  // "2024"
    string mes   = m.Groups[2].Value;  // "07"
    string dia   = m.Groups[3].Value;  // "15"
    string codigo = m.Groups[6].Value; // "404"
    string desc   = m.Groups[7].Value; // "arquivo nao encontrado"
}`}</code></pre>

      <h2>Grupos nomeados: legibilidade salva sua vida</h2>
      <p>
        Contar parênteses dá erro. Use <code>(?&lt;nome&gt;...)</code> para nomear capturas e acessar por nome — código auto-documentado.
      </p>
      <pre><code>{`var rx = new Regex(@"(?<dia>\d{2})/(?<mes>\d{2})/(?<ano>\d{4})");
Match m = rx.Match("Vencimento: 25/12/2024");

string dia = m.Groups["dia"].Value;   // "25"
string mes = m.Groups["mes"].Value;   // "12"
string ano = m.Groups["ano"].Value;   // "2024"

// Replace pode referenciar grupos:
string iso = rx.Replace("25/12/2024", "{ano}-{mes}-{dia}".Replace("{","\${"));
// Mais idiomático:
string iso2 = rx.Replace("25/12/2024", "\${ano}-\${mes}-\${dia}");
// "2024-12-25"`}</code></pre>

      <h2>RegexOptions: ajustando o comportamento</h2>
      <p>
        Várias flags mudam como a regex casa. Combine com <code>|</code> (OR de bits):
      </p>
      <pre><code>{`var rx = new Regex(@"^erro: (.+)$",
    RegexOptions.IgnoreCase     // a/A iguais
  | RegexOptions.Multiline      // ^ e $ casam por linha
  | RegexOptions.CultureInvariant
  | RegexOptions.Compiled);     // pré-compila p/ uso repetido

// IgnoreCase  → "Erro:" também casa
// Multiline   → ^/$ funcionam em texto multi-linha
// Compiled    → mais rápido em loops longos (mais lento na primeira)`}</code></pre>

      <AlertBox type="warning" title="ReDoS: regex maliciosa congela seu app">
        Padrões mal escritos com aninhamento de repetições (<code>(a+)+</code>) podem demorar segundos ou minutos em entradas adversariais — vulnerabilidade chamada <strong>ReDoS</strong>. Sempre passe um <code>matchTimeout</code> ao construir <code>Regex</code> processando entrada de usuário: <code>new Regex(p, RegexOptions.None, TimeSpan.FromSeconds(1))</code>.
      </AlertBox>

      <h2>GeneratedRegex (C# 11+): regex zero-overhead</h2>
      <p>
        A partir de C# 11/.NET 7, você pode marcar um método <strong>partial</strong> com <code>[GeneratedRegex]</code>. Um <em>source generator</em> escreve, em tempo de compilação, código C# otimizado equivalente à regex — sem custo de parsing em runtime e até mais rápido que <code>Compiled</code>.
      </p>
      <pre><code>{`using System.Text.RegularExpressions;

public partial class Validador {
    [GeneratedRegex(@"^\d{5}-\d{3}$")]
    private static partial Regex CepRegex();

    public static bool CepValido(string s) => CepRegex().IsMatch(s);
}

Console.WriteLine(Validador.CepValido("01310-100")); // True
Console.WriteLine(Validador.CepValido("123"));       // False`}</code></pre>

      <AlertBox type="info" title="Quando NÃO usar regex">
        Se você só procura uma substring fixa, <code>String.Contains</code> é mais rápido e legível. Para parsear formatos com aninhamento (HTML, JSON), <strong>nunca</strong> use regex — use um parser dedicado. Regex é para padrões de texto plano e rasos.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>@</code></strong>: sem ele, <code>"\d"</code> vira erro de string ou <code>\\d</code>.</li>
        <li><strong>Não escapar caracteres especiais literais</strong>: para casar um <code>.</code> literal, escreva <code>\.</code> — caso contrário casa qualquer caractere.</li>
        <li><strong>Regex ganancioso</strong>: <code>.+</code> casa o máximo possível. Use <code>.+?</code> (preguiçoso) quando quiser o mínimo.</li>
        <li><strong>Sem timeout</strong> em entrada vinda de usuário — risco de ReDoS.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Regex.IsMatch</code>, <code>Match</code>, <code>Matches</code>, <code>Replace</code> são os 4 métodos centrais.</li>
        <li>Use <code>@"..."</code> para evitar dobrar barras invertidas.</li>
        <li>Parênteses criam grupos; <code>(?&lt;nome&gt;...)</code> cria grupos nomeados.</li>
        <li><code>RegexOptions.Compiled</code> acelera uso repetido; <code>[GeneratedRegex]</code> é ainda melhor em C# 11+.</li>
        <li>Sempre defina <code>matchTimeout</code> em regex sobre input não confiável.</li>
        <li>Regex não substitui parsers para HTML/JSON — use ferramentas próprias.</li>
      </ul>
    </PageContainer>
  );
}
