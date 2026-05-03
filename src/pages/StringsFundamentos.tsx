import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StringsFundamentos() {
  return (
    <PageContainer
      title="Strings em C#: o básico que todo iniciante precisa"
      subtitle="Como criar, escapar, concatenar e indexar textos — e por que toda string em C# é imutável."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Uma <strong>string</strong> é simplesmente uma sequência de caracteres — texto. Em C#, o tipo se chama <code>string</code> (apelido de <code>System.String</code>), e ele aparece em quase todo programa: nomes de usuário, mensagens, caminhos de arquivo, JSON. Apesar de parecer trivial, há armadilhas: como escapar caracteres especiais, como combinar várias strings sem criar lixo na memória, e por que "modificar" uma string nunca modifica a original. Este capítulo cobre o essencial para você não tropeçar nos primeiros dias.
      </p>

      <h2>Literais: aspas duplas, escape e <code>@</code></h2>
      <p>
        Em C#, strings literais ficam entre aspas duplas. Caracteres especiais usam contrabarra (<code>\</code>) — chamada <em>escape</em>. Os mais comuns são <code>\n</code> (nova linha), <code>\t</code> (tabulação), <code>\"</code> (aspas literais) e <code>\\</code> (a própria contrabarra).
      </p>
      <pre><code>{`string nome = "Ana";
string com_quebra = "Linha 1\\nLinha 2";
string com_aspas = "Ela disse \\"oi\\"";
string caminho = "C:\\\\Usuarios\\\\Ana\\\\Docs"; // contrabarras dobram

// Verbatim string com @: ignora escapes (exceto "" para aspas)
string caminho2 = @"C:\\Usuarios\\Ana\\Docs";
string sql = @"SELECT *
              FROM Clientes
              WHERE Ativo = 1";`}</code></pre>
      <p>
        O prefixo <code>@</code> torna a string <em>verbatim</em>: a contrabarra deixa de ser caractere de escape, e quebras de linha no código viram quebras de linha no texto. Para incluir aspas duplas dentro de uma verbatim, dobre-as: <code>@"ela disse ""oi"""</code>.
      </p>

      <h2>Raw strings (C# 11+): a forma mais limpa</h2>
      <p>
        Para strings com muitas aspas, contrabarras ou quebras de linha (JSON, regex, código), o C# moderno introduziu as <strong>raw string literals</strong> com três ou mais aspas. Nada precisa ser escapado.
      </p>
      <pre><code>{`string json = """
    {
        "nome": "Ana",
        "idade": 30,
        "ativo": true
    }
    """;

string regex = """\\d{3}-\\d{4}""";   // três aspas: o conteúdo é literal

// Use mais aspas se o conteúdo já tiver três:
string codigo = """"
    Console.WriteLine("""Olá""");
    """";`}</code></pre>

      <AlertBox type="info" title="Indentação inteligente">
        Em uma raw string multilinha, o C# remove automaticamente a indentação comum, baseando-se nas três aspas finais. Você pode indentar o JSON do exemplo no código sem que isso apareça no texto final.
      </AlertBox>

      <h2>Concatenação: <code>+</code>, <code>string.Concat</code>, <code>StringBuilder</code></h2>
      <p>
        Você pode juntar strings com o operador <code>+</code>. Internamente, o compilador chama <code>string.Concat</code>. É legível, mas se você juntar centenas de strings num laço, o desempenho cai — porque cada <code>+</code> cria uma nova string. Para isso, existe <code>StringBuilder</code>.
      </p>
      <pre><code>{`string a = "Olá, ";
string b = "mundo!";
string c = a + b;                 // "Olá, mundo!"
string d = string.Concat(a, b);   // mesma coisa

// Em laço grande, prefira StringBuilder:
var sb = new System.Text.StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.Append("linha ").Append(i).Append('\\n');
}
string resultado = sb.ToString();`}</code></pre>

      <h2>Interpolação <code>$"..."</code></h2>
      <p>
        Em vez de concatenar com <code>+</code>, prefixe a string com <code>$</code> e coloque variáveis entre chaves. É mais legível e suporta formatação.
      </p>
      <pre><code>{`string nome = "Ana";
int idade = 30;
string msg = $"Olá, {nome}! Você tem {idade} anos.";

// Formatação dentro da chave:
double preco = 19.9;
string p = $"Preço: {preco:F2}";              // "19.90"
string data = $"Hoje é {DateTime.Now:dd/MM/yyyy}";

// Combinar interpolado com verbatim ou raw:
string caminho = $@"C:\\Users\\{nome}\\Docs";`}</code></pre>

      <h2>Indexador, <code>Length</code> e iteração</h2>
      <p>
        Strings são, por dentro, sequências de <code>char</code>. Você pode acessar cada caractere por índice (começando em zero) e pedir o tamanho com <code>Length</code>. Também é possível iterar com <code>foreach</code>.
      </p>
      <pre><code>{`string nome = "Ana";
char primeiro = nome[0];      // 'A'
int tamanho = nome.Length;    // 3

foreach (char c in nome) {
    Console.WriteLine(c);
}

// Acessar índice fora do tamanho lança IndexOutOfRangeException:
// char x = nome[10];   // CRASH!

// Slicing com ranges (C# 8+):
string sub = nome[0..2];      // "An"
string ultimoChar = nome[^1..]; // "a" (^ conta a partir do fim)`}</code></pre>

      <h2>Imutabilidade: a regra de ouro</h2>
      <p>
        Toda string em C# é <strong>imutável</strong>: depois de criada, seu conteúdo nunca muda. Métodos como <code>ToUpper</code>, <code>Replace</code>, <code>Trim</code> não alteram a string original — eles devolvem uma <em>nova</em> string. Esquecer disso é o erro número um com strings.
      </p>
      <pre><code>{`string s = "ola";
s.ToUpper();              // chama, mas IGNORA o resultado!
Console.WriteLine(s);     // ainda "ola"

s = s.ToUpper();          // agora sim — atribuiu o retorno
Console.WriteLine(s);     // "OLA"

string trocada = "abcabc".Replace("a", "X");  // "XbcXbc"
string sem_espaco = "  texto  ".Trim();       // "texto"`}</code></pre>

      <AlertBox type="warning" title="Por que imutável?">
        Imutabilidade torna strings <strong>seguras</strong> para compartilhar entre threads e usar como chaves de dicionário. É também o que permite ao .NET reaproveitar literais idênticos (<em>string interning</em>), economizando memória.
      </AlertBox>

      <h2>Métodos úteis do dia a dia</h2>
      <pre><code>{`string s = "  Olá, Mundo!  ";

s.Length;                        // 17
s.Trim();                        // "Olá, Mundo!"
s.ToLower();                     // "  olá, mundo!  "
s.ToUpper();                     // "  OLÁ, MUNDO!  "
s.Contains("Mundo");             // true
s.StartsWith("  Olá");           // true
s.EndsWith("!  ");               // true
s.IndexOf("Mundo");              // 7
s.Replace("Mundo", "C#");        // "  Olá, C#!  "
s.Substring(2, 3);               // "Olá"
s.Split(',');                    // ["  Olá", " Mundo!  "]
string.Join("-", "a", "b", "c"); // "a-b-c"
string.IsNullOrEmpty(s);         // false
string.IsNullOrWhiteSpace("  "); // true`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Não atribuir o retorno de métodos:</strong> <code>s.Trim();</code> sozinho não muda nada. Faça <code>s = s.Trim();</code>.</li>
        <li><strong>Comparar com <code>==</code> esperando referência:</strong> em <code>string</code>, <code>==</code> compara conteúdo. Para case-insensitive, use <code>string.Equals(a, b, StringComparison.OrdinalIgnoreCase)</code>.</li>
        <li><strong>Concatenar em laço com <code>+</code>:</strong> use <code>StringBuilder</code> para mais que dezenas de iterações.</li>
        <li><strong>Acessar índice fora do tamanho:</strong> sempre cheque <code>Length</code> antes.</li>
        <li><strong>Esquecer cultura ao comparar:</strong> "i".ToUpper() pode dar "İ" em turco. Use <code>InvariantCulture</code> para dados internos.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Strings literais usam aspas duplas; <code>\</code> escapa caracteres.</li>
        <li><code>@"..."</code> ignora escapes; <code>"""..."""</code> é a forma raw moderna.</li>
        <li>Prefira interpolação <code>$"&#123;x&#125;"</code> a concatenação com <code>+</code>.</li>
        <li>Use <code>StringBuilder</code> para construir strings em laços longos.</li>
        <li>Strings são imutáveis: métodos retornam novas strings.</li>
        <li>Use <code>string.IsNullOrEmpty</code>/<code>IsNullOrWhiteSpace</code> para validar entrada.</li>
      </ul>
    </PageContainer>
  );
}
