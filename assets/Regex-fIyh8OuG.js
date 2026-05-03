import{j as e}from"./index-CzLAthD5.js";import{P as r,A as s}from"./AlertBox-CWJo3ar5.js";function a(){return e.jsxs(r,{title:"Expressões regulares com Regex",subtitle:"Como buscar, validar e substituir padrões de texto usando o System.Text.RegularExpressions.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsxs("p",{children:['Imagine que você precisa achar todos os e-mails dentro de um documento de mil páginas, ou validar se um CEP tem o formato "12345-678", ou trocar todas as ocorrências de telefones por ',e.jsx("code",{children:"***"})," num log. Fazer isso com ",e.jsx("code",{children:"IndexOf"})," e ",e.jsx("code",{children:"Substring"})," daria um código gigantesco e frágil. ",e.jsx("strong",{children:"Expressões regulares"})," (regex) são uma ",e.jsx("em",{children:"mini-linguagem"})," para descrever padrões de texto — um conjunto de símbolos como ",e.jsx("code",{children:"\\d+"})," (um ou mais dígitos) que casam com qualquer trecho que siga o formato. Em C#, tudo isso vive na classe ",e.jsx("code",{children:"Regex"})," dentro do namespace ",e.jsx("code",{children:"System.Text.RegularExpressions"}),"."]}),e.jsx("h2",{children:"Os métodos essenciais"}),e.jsxs("p",{children:["A classe ",e.jsx("code",{children:"Regex"})," oferece quatro métodos que você usará 90% do tempo: ",e.jsx("code",{children:"IsMatch"})," (verdadeiro/falso), ",e.jsx("code",{children:"Match"})," (primeira ocorrência), ",e.jsx("code",{children:"Matches"})," (todas) e ",e.jsx("code",{children:"Replace"})," (substituir). Há versões estáticas (mais rápidas para uso pontual) e de instância (mais rápidas para uso repetido com a mesma regex)."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Text.RegularExpressions;

string texto = "Pedidos: #1042 e #2045 entregues em 15/07/2024.";

// IsMatch — só verifica se casa
bool temPedido = Regex.IsMatch(texto, @"#d+");   // true

// Match — primeira ocorrência (com posição, valor)
Match m = Regex.Match(texto, @"#d+");
if (m.Success)
    Console.WriteLine($"Achei {m.Value} no índice {m.Index}");
// Achei #1042 no índice 10

// Matches — todas as ocorrências
foreach (Match x in Regex.Matches(texto, @"#d+"))
    Console.WriteLine(x.Value);
// #1042
// #2045

// Replace — substitui
string mascarado = Regex.Replace(texto, @"#d+", "#XXXX");
// "Pedidos: #XXXX e #XXXX entregues em 15/07/2024."`})}),e.jsx("h2",{children:"O alfabeto básico das regex"}),e.jsxs("p",{children:["A potência vem dos ",e.jsx("strong",{children:"metacaracteres"})," — símbolos que não significam si mesmos, mas representam classes de caracteres ou repetições. Os essenciais:"]}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Símbolo"}),e.jsx("th",{children:"Significado"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"\\d"})}),e.jsx("td",{children:"um dígito (0-9)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"\\w"})}),e.jsx("td",{children:"letra, dígito ou _"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"\\s"})}),e.jsx("td",{children:"espaço, tab, quebra de linha"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"."})}),e.jsx("td",{children:"qualquer caractere (exceto quebra de linha)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"[abc]"})}),e.jsx("td",{children:"a, b ou c"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"[^abc]"})}),e.jsx("td",{children:"qualquer coisa exceto a, b, c"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"+"})}),e.jsx("td",{children:"1 ou mais do anterior"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"*"})}),e.jsx("td",{children:"0 ou mais"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"?"})}),e.jsx("td",{children:"0 ou 1 (opcional)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"{n,m}"})}),e.jsx("td",{children:"entre n e m repetições"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"^ $"})}),e.jsx("td",{children:"início / fim da string (ou linha)"})]})]})]}),e.jsxs("p",{children:["Combinando esses tijolos, você descreve quase qualquer padrão. Note: em C#, sempre use o prefixo ",e.jsx("code",{children:"@"})," nas strings de regex (",e.jsx("em",{children:"verbatim string"}),"), para não precisar dobrar todo ",e.jsx("code",{children:"\\"}),"."]}),e.jsx("h2",{children:"Grupos: capturando partes do casamento"}),e.jsxs("p",{children:["Parênteses agrupam — e ",e.jsx("strong",{children:"capturam"}),". Cada grupo recebe um número (1, 2, 3...) que você acessa em ",e.jsx("code",{children:"m.Groups[i]"}),". É assim que você extrai pedaços específicos do texto casado."]}),e.jsx("pre",{children:e.jsx("code",{children:`string log = "[2024-07-15 14:30] Erro 404: arquivo nao encontrado";
var rx = new Regex(@"[(d{4})-(d{2})-(d{2}) (d{2}):(d{2})] Erro (d+): (.+)");

Match m = rx.Match(log);
if (m.Success) {
    string ano   = m.Groups[1].Value;  // "2024"
    string mes   = m.Groups[2].Value;  // "07"
    string dia   = m.Groups[3].Value;  // "15"
    string codigo = m.Groups[6].Value; // "404"
    string desc   = m.Groups[7].Value; // "arquivo nao encontrado"
}`})}),e.jsx("h2",{children:"Grupos nomeados: legibilidade salva sua vida"}),e.jsxs("p",{children:["Contar parênteses dá erro. Use ",e.jsx("code",{children:"(?<nome>...)"})," para nomear capturas e acessar por nome — código auto-documentado."]}),e.jsx("pre",{children:e.jsx("code",{children:`var rx = new Regex(@"(?<dia>d{2})/(?<mes>d{2})/(?<ano>d{4})");
Match m = rx.Match("Vencimento: 25/12/2024");

string dia = m.Groups["dia"].Value;   // "25"
string mes = m.Groups["mes"].Value;   // "12"
string ano = m.Groups["ano"].Value;   // "2024"

// Replace pode referenciar grupos:
string iso = rx.Replace("25/12/2024", "{ano}-{mes}-{dia}".Replace("{","\${"));
// Mais idiomático:
string iso2 = rx.Replace("25/12/2024", "\${ano}-\${mes}-\${dia}");
// "2024-12-25"`})}),e.jsx("h2",{children:"RegexOptions: ajustando o comportamento"}),e.jsxs("p",{children:["Várias flags mudam como a regex casa. Combine com ",e.jsx("code",{children:"|"})," (OR de bits):"]}),e.jsx("pre",{children:e.jsx("code",{children:`var rx = new Regex(@"^erro: (.+)$",
    RegexOptions.IgnoreCase     // a/A iguais
  | RegexOptions.Multiline      // ^ e $ casam por linha
  | RegexOptions.CultureInvariant
  | RegexOptions.Compiled);     // pré-compila p/ uso repetido

// IgnoreCase  → "Erro:" também casa
// Multiline   → ^/$ funcionam em texto multi-linha
// Compiled    → mais rápido em loops longos (mais lento na primeira)`})}),e.jsxs(s,{type:"warning",title:"ReDoS: regex maliciosa congela seu app",children:["Padrões mal escritos com aninhamento de repetições (",e.jsx("code",{children:"(a+)+"}),") podem demorar segundos ou minutos em entradas adversariais — vulnerabilidade chamada ",e.jsx("strong",{children:"ReDoS"}),". Sempre passe um ",e.jsx("code",{children:"matchTimeout"})," ao construir ",e.jsx("code",{children:"Regex"})," processando entrada de usuário: ",e.jsx("code",{children:"new Regex(p, RegexOptions.None, TimeSpan.FromSeconds(1))"}),"."]}),e.jsx("h2",{children:"GeneratedRegex (C# 11+): regex zero-overhead"}),e.jsxs("p",{children:["A partir de C# 11/.NET 7, você pode marcar um método ",e.jsx("strong",{children:"partial"})," com ",e.jsx("code",{children:"[GeneratedRegex]"}),". Um ",e.jsx("em",{children:"source generator"})," escreve, em tempo de compilação, código C# otimizado equivalente à regex — sem custo de parsing em runtime e até mais rápido que ",e.jsx("code",{children:"Compiled"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Text.RegularExpressions;

public partial class Validador {
    [GeneratedRegex(@"^d{5}-d{3}$")]
    private static partial Regex CepRegex();

    public static bool CepValido(string s) => CepRegex().IsMatch(s);
}

Console.WriteLine(Validador.CepValido("01310-100")); // True
Console.WriteLine(Validador.CepValido("123"));       // False`})}),e.jsxs(s,{type:"info",title:"Quando NÃO usar regex",children:["Se você só procura uma substring fixa, ",e.jsx("code",{children:"String.Contains"})," é mais rápido e legível. Para parsear formatos com aninhamento (HTML, JSON), ",e.jsx("strong",{children:"nunca"})," use regex — use um parser dedicado. Regex é para padrões de texto plano e rasos."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"@"})]}),": sem ele, ",e.jsx("code",{children:'"\\d"'})," vira erro de string ou ",e.jsx("code",{children:"\\\\d"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não escapar caracteres especiais literais"}),": para casar um ",e.jsx("code",{children:"."})," literal, escreva ",e.jsx("code",{children:"\\."})," — caso contrário casa qualquer caractere."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Regex ganancioso"}),": ",e.jsx("code",{children:".+"})," casa o máximo possível. Use ",e.jsx("code",{children:".+?"})," (preguiçoso) quando quiser o mínimo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sem timeout"})," em entrada vinda de usuário — risco de ReDoS."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Regex.IsMatch"}),", ",e.jsx("code",{children:"Match"}),", ",e.jsx("code",{children:"Matches"}),", ",e.jsx("code",{children:"Replace"})," são os 4 métodos centrais."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:'@"..."'})," para evitar dobrar barras invertidas."]}),e.jsxs("li",{children:["Parênteses criam grupos; ",e.jsx("code",{children:"(?<nome>...)"})," cria grupos nomeados."]}),e.jsxs("li",{children:[e.jsx("code",{children:"RegexOptions.Compiled"})," acelera uso repetido; ",e.jsx("code",{children:"[GeneratedRegex]"})," é ainda melhor em C# 11+."]}),e.jsxs("li",{children:["Sempre defina ",e.jsx("code",{children:"matchTimeout"})," em regex sobre input não confiável."]}),e.jsx("li",{children:"Regex não substitui parsers para HTML/JSON — use ferramentas próprias."})]})]})}export{a as default};
