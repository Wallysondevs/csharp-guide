import{j as e}from"./index-CzLAthD5.js";import{P as s,A as r}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(s,{title:"Strings em C#: o básico que todo iniciante precisa",subtitle:"Como criar, escapar, concatenar e indexar textos — e por que toda string em C# é imutável.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs("p",{children:["Uma ",e.jsx("strong",{children:"string"})," é simplesmente uma sequência de caracteres — texto. Em C#, o tipo se chama ",e.jsx("code",{children:"string"})," (apelido de ",e.jsx("code",{children:"System.String"}),'), e ele aparece em quase todo programa: nomes de usuário, mensagens, caminhos de arquivo, JSON. Apesar de parecer trivial, há armadilhas: como escapar caracteres especiais, como combinar várias strings sem criar lixo na memória, e por que "modificar" uma string nunca modifica a original. Este capítulo cobre o essencial para você não tropeçar nos primeiros dias.']}),e.jsxs("h2",{children:["Literais: aspas duplas, escape e ",e.jsx("code",{children:"@"})]}),e.jsxs("p",{children:["Em C#, strings literais ficam entre aspas duplas. Caracteres especiais usam contrabarra (",e.jsx("code",{children:"\\"}),") — chamada ",e.jsx("em",{children:"escape"}),". Os mais comuns são ",e.jsx("code",{children:"\\n"})," (nova linha), ",e.jsx("code",{children:"\\t"})," (tabulação), ",e.jsx("code",{children:'\\"'})," (aspas literais) e ",e.jsx("code",{children:"\\\\"})," (a própria contrabarra)."]}),e.jsx("pre",{children:e.jsx("code",{children:`string nome = "Ana";
string com_quebra = "Linha 1\\nLinha 2";
string com_aspas = "Ela disse \\"oi\\"";
string caminho = "C:\\\\Usuarios\\\\Ana\\\\Docs"; // contrabarras dobram

// Verbatim string com @: ignora escapes (exceto "" para aspas)
string caminho2 = @"C:\\Usuarios\\Ana\\Docs";
string sql = @"SELECT *
              FROM Clientes
              WHERE Ativo = 1";`})}),e.jsxs("p",{children:["O prefixo ",e.jsx("code",{children:"@"})," torna a string ",e.jsx("em",{children:"verbatim"}),": a contrabarra deixa de ser caractere de escape, e quebras de linha no código viram quebras de linha no texto. Para incluir aspas duplas dentro de uma verbatim, dobre-as: ",e.jsx("code",{children:'@"ela disse ""oi"""'}),"."]}),e.jsx("h2",{children:"Raw strings (C# 11+): a forma mais limpa"}),e.jsxs("p",{children:["Para strings com muitas aspas, contrabarras ou quebras de linha (JSON, regex, código), o C# moderno introduziu as ",e.jsx("strong",{children:"raw string literals"})," com três ou mais aspas. Nada precisa ser escapado."]}),e.jsx("pre",{children:e.jsx("code",{children:`string json = """
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
    """";`})}),e.jsx(r,{type:"info",title:"Indentação inteligente",children:"Em uma raw string multilinha, o C# remove automaticamente a indentação comum, baseando-se nas três aspas finais. Você pode indentar o JSON do exemplo no código sem que isso apareça no texto final."}),e.jsxs("h2",{children:["Concatenação: ",e.jsx("code",{children:"+"}),", ",e.jsx("code",{children:"string.Concat"}),", ",e.jsx("code",{children:"StringBuilder"})]}),e.jsxs("p",{children:["Você pode juntar strings com o operador ",e.jsx("code",{children:"+"}),". Internamente, o compilador chama ",e.jsx("code",{children:"string.Concat"}),". É legível, mas se você juntar centenas de strings num laço, o desempenho cai — porque cada ",e.jsx("code",{children:"+"})," cria uma nova string. Para isso, existe ",e.jsx("code",{children:"StringBuilder"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`string a = "Olá, ";
string b = "mundo!";
string c = a + b;                 // "Olá, mundo!"
string d = string.Concat(a, b);   // mesma coisa

// Em laço grande, prefira StringBuilder:
var sb = new System.Text.StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.Append("linha ").Append(i).Append('\\n');
}
string resultado = sb.ToString();`})}),e.jsxs("h2",{children:["Interpolação ",e.jsx("code",{children:'$"..."'})]}),e.jsxs("p",{children:["Em vez de concatenar com ",e.jsx("code",{children:"+"}),", prefixe a string com ",e.jsx("code",{children:"$"})," e coloque variáveis entre chaves. É mais legível e suporta formatação."]}),e.jsx("pre",{children:e.jsx("code",{children:`string nome = "Ana";
int idade = 30;
string msg = $"Olá, {nome}! Você tem {idade} anos.";

// Formatação dentro da chave:
double preco = 19.9;
string p = $"Preço: {preco:F2}";              // "19.90"
string data = $"Hoje é {DateTime.Now:dd/MM/yyyy}";

// Combinar interpolado com verbatim ou raw:
string caminho = $@"C:\\Users\\{nome}\\Docs";`})}),e.jsxs("h2",{children:["Indexador, ",e.jsx("code",{children:"Length"})," e iteração"]}),e.jsxs("p",{children:["Strings são, por dentro, sequências de ",e.jsx("code",{children:"char"}),". Você pode acessar cada caractere por índice (começando em zero) e pedir o tamanho com ",e.jsx("code",{children:"Length"}),". Também é possível iterar com ",e.jsx("code",{children:"foreach"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`string nome = "Ana";
char primeiro = nome[0];      // 'A'
int tamanho = nome.Length;    // 3

foreach (char c in nome) {
    Console.WriteLine(c);
}

// Acessar índice fora do tamanho lança IndexOutOfRangeException:
// char x = nome[10];   // CRASH!

// Slicing com ranges (C# 8+):
string sub = nome[0..2];      // "An"
string ultimoChar = nome[^1..]; // "a" (^ conta a partir do fim)`})}),e.jsx("h2",{children:"Imutabilidade: a regra de ouro"}),e.jsxs("p",{children:["Toda string em C# é ",e.jsx("strong",{children:"imutável"}),": depois de criada, seu conteúdo nunca muda. Métodos como ",e.jsx("code",{children:"ToUpper"}),", ",e.jsx("code",{children:"Replace"}),", ",e.jsx("code",{children:"Trim"})," não alteram a string original — eles devolvem uma ",e.jsx("em",{children:"nova"})," string. Esquecer disso é o erro número um com strings."]}),e.jsx("pre",{children:e.jsx("code",{children:`string s = "ola";
s.ToUpper();              // chama, mas IGNORA o resultado!
Console.WriteLine(s);     // ainda "ola"

s = s.ToUpper();          // agora sim — atribuiu o retorno
Console.WriteLine(s);     // "OLA"

string trocada = "abcabc".Replace("a", "X");  // "XbcXbc"
string sem_espaco = "  texto  ".Trim();       // "texto"`})}),e.jsxs(r,{type:"warning",title:"Por que imutável?",children:["Imutabilidade torna strings ",e.jsx("strong",{children:"seguras"})," para compartilhar entre threads e usar como chaves de dicionário. É também o que permite ao .NET reaproveitar literais idênticos (",e.jsx("em",{children:"string interning"}),"), economizando memória."]}),e.jsx("h2",{children:"Métodos úteis do dia a dia"}),e.jsx("pre",{children:e.jsx("code",{children:`string s = "  Olá, Mundo!  ";

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
string.IsNullOrWhiteSpace("  "); // true`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Não atribuir o retorno de métodos:"})," ",e.jsx("code",{children:"s.Trim();"})," sozinho não muda nada. Faça ",e.jsx("code",{children:"s = s.Trim();"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Comparar com ",e.jsx("code",{children:"=="})," esperando referência:"]})," em ",e.jsx("code",{children:"string"}),", ",e.jsx("code",{children:"=="})," compara conteúdo. Para case-insensitive, use ",e.jsx("code",{children:"string.Equals(a, b, StringComparison.OrdinalIgnoreCase)"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Concatenar em laço com ",e.jsx("code",{children:"+"}),":"]})," use ",e.jsx("code",{children:"StringBuilder"})," para mais que dezenas de iterações."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Acessar índice fora do tamanho:"})," sempre cheque ",e.jsx("code",{children:"Length"})," antes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer cultura ao comparar:"}),' "i".ToUpper() pode dar "İ" em turco. Use ',e.jsx("code",{children:"InvariantCulture"})," para dados internos."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Strings literais usam aspas duplas; ",e.jsx("code",{children:"\\"})," escapa caracteres."]}),e.jsxs("li",{children:[e.jsx("code",{children:'@"..."'})," ignora escapes; ",e.jsx("code",{children:'"""..."""'})," é a forma raw moderna."]}),e.jsxs("li",{children:["Prefira interpolação ",e.jsx("code",{children:'$"{x}"'})," a concatenação com ",e.jsx("code",{children:"+"}),"."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"StringBuilder"})," para construir strings em laços longos."]}),e.jsx("li",{children:"Strings são imutáveis: métodos retornam novas strings."}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"string.IsNullOrEmpty"}),"/",e.jsx("code",{children:"IsNullOrWhiteSpace"})," para validar entrada."]})]})]})}export{n as default};
