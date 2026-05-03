import{j as e}from"./index-CzLAthD5.js";import{P as o,A as r}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(o,{title:"Interpolação e formatação avançada de strings",subtitle:'Como montar texto dinâmico com $"...", aplicar máscaras (moeda, data, padding) e respeitar a cultura do usuário.',difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:["Antes de C# 6, juntar variáveis em uma frase exigia ",e.jsxs("code",{children:['string.Format("Olá ',"{0}",", você tem ","{1}",' anos", nome, idade)']})," — verboso e fácil de errar a ordem dos argumentos. Hoje, usamos ",e.jsx("strong",{children:"interpolação de strings"}),": basta colocar um ",e.jsx("code",{children:"$"})," antes das aspas e escrever a variável entre chaves. Mas a interpolação faz ",e.jsx("em",{children:"muito mais"})," do que substituir nomes: aceita ",e.jsx("strong",{children:"especificadores de formato"})," para moeda, data, número decimal, padding (alinhamento) — coisas que você usaria em relatórios e telas reais. Este capítulo mostra do básico ao avançado."]}),e.jsxs("h2",{children:["O básico do ",e.jsx("code",{children:'$"..."'})]}),e.jsxs("p",{children:["Coloque ",e.jsx("code",{children:"$"})," imediatamente antes das aspas. Tudo entre ",e.jsx("code",{children:"{"})," e ",e.jsx("code",{children:"}"})," é ",e.jsx("em",{children:"código C# normal"})," — variáveis, expressões, chamadas de método, ternários. O resultado é convertido para string e inserido."]}),e.jsx("pre",{children:e.jsx("code",{children:`string nome = "Maria";
int idade = 30;

string msg = $"Olá, {nome}! Em 5 anos você terá {idade + 5}.";
Console.WriteLine(msg);
// Olá, Maria! Em 5 anos você terá 35.

// Expressões arbitrárias funcionam:
var hora = DateTime.Now;
Console.WriteLine($"Boa {(hora.Hour < 18 ? "tarde" : "noite")}, {nome}");`})}),e.jsx("h2",{children:"Especificadores de formato"}),e.jsxs("p",{children:["Depois da expressão, dois pontos e o ",e.jsx("strong",{children:"código de formato"})," definem como o valor será exibido. Para números, ",e.jsx("code",{children:"N2"})," (numérico com 2 decimais), ",e.jsx("code",{children:"C"})," (currency/moeda), ",e.jsx("code",{children:"P"})," (porcentagem), ",e.jsx("code",{children:"X"})," (hexadecimal). Para datas, qualquer máscara de ",e.jsx("code",{children:"DateTime"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`decimal preco = 1234.5m;
double  taxa  = 0.1575;
int     id    = 255;
DateTime hoje = new(2024, 7, 15, 14, 30, 0);

Console.WriteLine($"{preco:N2}");      // 1.234,50
Console.WriteLine($"{preco:C}");       // R$ 1.234,50
Console.WriteLine($"{preco:F0}");      // 1235  (sem decimais, arredonda)
Console.WriteLine($"{taxa:P1}");       // 15,8 %
Console.WriteLine($"{id:X4}");         // 00FF  (hex 4 dígitos)
Console.WriteLine($"{hoje:dd/MM/yyyy}");        // 15/07/2024
Console.WriteLine($"{hoje:HH:mm}");             // 14:30
Console.WriteLine($"{hoje:dddd}");              // segunda-feira (depende cultura)
Console.WriteLine($"{hoje:yyyy-MM-ddTHH:mm:ss}"); // 2024-07-15T14:30:00`})}),e.jsx("h2",{children:"Padding: alinhamento à direita ou esquerda"}),e.jsxs("p",{children:["Antes do ",e.jsx("code",{children:":"})," (formato), você pode pôr ",e.jsx("strong",{children:"vírgula + largura"}),". Largura positiva alinha à direita; negativa, à esquerda. Útil para imprimir tabelas no console."]}),e.jsx("pre",{children:e.jsx("code",{children:`var produtos = new[] {
    ("Caneta",   2.50m, 100),
    ("Caderno", 15.00m,  30),
    ("Livro",   45.00m,  10)
};

Console.WriteLine($"{"Produto",-10}{"Preço",10}{"Estoque",10}");
foreach (var (nome, preco, qtd) in produtos)
    Console.WriteLine($"{nome,-10}{preco,10:C}{qtd,10}");

// Saída:
// Produto         Preço   Estoque
// Caneta       R$ 2,50       100
// Caderno     R$ 15,00        30
// Livro       R$ 45,00        10`})}),e.jsxs(r,{type:"info",title:"Sintaxe completa",children:["O molde geral é: ",e.jsxs("code",{children:["{","expressão,largura:formato","}"]}),". Largura e formato são opcionais e independentes. Exemplo: ",e.jsx("code",{children:"{x,8:N2}"})," = 8 caracteres, 2 decimais."]}),e.jsx("h2",{children:"String literal verbatim e raw strings"}),e.jsxs("p",{children:["Combinando ",e.jsx("code",{children:"$"})," com ",e.jsx("code",{children:"@"}),", você obtém ",e.jsx("strong",{children:"strings verbatim interpoladas"})," — quebras de linha e ",e.jsx("code",{children:"\\"})," são literais, sem escape. Em C# 11+, há também as ",e.jsx("strong",{children:"raw string literals"})," (três aspas), perfeitas para JSON, SQL ou HTML embutidos sem precisar escapar nada."]}),e.jsx("pre",{children:e.jsx("code",{children:`string caminho = @"C:\\Usuarios\\maria\\docs";
string nome = "Maria";

// Verbatim + interpolação
string msg = $@"Olá {nome},
seu diretório é {caminho}.";

// Raw string interpolada (C# 11+) — note: 3 aspas, nada de escape
string json = $$"""
{
  "nome": "{{nome}}",
  "ativo": true
}
""";
// {{ }} se torna a chave de interpolação quando há $$, porque
// {} dupla escapa o JSON. Genial.`})}),e.jsx("h2",{children:"FormattableString e culturas"}),e.jsxs("p",{children:["Um detalhe que pega muita gente: ",e.jsxs("code",{children:['$"',"{preco:C}",'"']})," usa a ",e.jsx("strong",{children:"cultura atual da thread"})," para decidir o símbolo (",e.jsx("code",{children:"R$"}),", ",e.jsx("code",{children:"$"}),", ",e.jsx("code",{children:"€"}),") e o separador decimal (",e.jsx("code",{children:","})," ou ",e.jsx("code",{children:"."}),"). Ótimo em apps locais; ",e.jsx("strong",{children:"terrível"}),' ao gerar arquivos compartilhados (CSV, JSON), onde você quer um formato determinístico, normalmente "invariant culture".']}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Globalization;

decimal valor = 1234.56m;

// Padrão: usa cultura corrente
Console.WriteLine($"{valor:N2}");                 // 1.234,56 (pt-BR) ou 1,234.56 (en-US)

// Forçando cultura específica:
string br = string.Format(new CultureInfo("pt-BR"), "{0:C}", valor); // R$ 1.234,56
string us = string.Format(CultureInfo.InvariantCulture, "{0:N2}", valor); // 1,234.56

// Para interpolação, capture como FormattableString:
FormattableString fs = $"Total: {valor:C}";
string brIntp = fs.ToString(new CultureInfo("pt-BR"));
string inv    = fs.ToString(CultureInfo.InvariantCulture);

// Atalho do .NET 6+:
string log = string.Create(CultureInfo.InvariantCulture,
                           $"Valor={valor:N2}");`})}),e.jsxs(r,{type:"warning",title:"Cultura em arquivos",children:["Ao salvar logs, gerar JSON/CSV ou se comunicar com APIs, sempre use ",e.jsx("code",{children:"InvariantCulture"}),". Caso contrário, a vírgula decimal do Brasil pode quebrar parsers que esperam ponto, e os bugs só aparecem em produção quando o servidor mudar de região."]}),e.jsx("h2",{children:"Como funciona por baixo (.NET 6+)"}),e.jsxs("p",{children:["A partir do .NET 6, ",e.jsx("code",{children:'$"..."'})," não é mais traduzido para um simples ",e.jsx("code",{children:"string.Format"}),". O compilador usa um tipo chamado ",e.jsx("code",{children:"DefaultInterpolatedStringHandler"})," que escreve diretamente em um buffer de caracteres, evitando alocações intermediárias. Isso significa que ",e.jsxs("code",{children:['$"oi ',"{nome}",'"']})," é tão eficiente quanto montar manualmente com ",e.jsx("code",{children:"StringBuilder"})," em 99% dos casos. Em outras palavras: pode usar à vontade."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer o ",e.jsx("code",{children:"$"})]}),": ",e.jsxs("code",{children:['"Oi ',"{nome}",'"']})," imprime literalmente ",e.jsxs("code",{children:["Oi ","{nome}"]}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Trocar a vírgula com o dois-pontos"}),": ",e.jsx("code",{children:"{x:8}"})," não dá padding (8 vira formato inválido); o certo é ",e.jsx("code",{children:"{x,8}"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar cultura local em arquivos"})," — gera CSVs com vírgula decimal que outros sistemas não leem."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer de duplicar chaves"})," em raw strings: dentro de ",e.jsx("code",{children:'$$"""'})," use ",e.jsx("code",{children:"{{nome}}"}),"; dentro de ",e.jsx("code",{children:'$"..."'})," normal use ",e.jsxs("code",{children:["{","{"]})," para imprimir uma chave literal."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:'$"..."'})," permite incorporar expressões C# em strings."]}),e.jsxs("li",{children:["Formatação: ",e.jsx("code",{children:"{x:N2}"}),", ",e.jsx("code",{children:"{x:C}"}),", ",e.jsx("code",{children:"{data:dd/MM/yyyy}"}),"."]}),e.jsxs("li",{children:["Padding: ",e.jsx("code",{children:"{x,10}"})," (direita), ",e.jsx("code",{children:"{x,-10}"})," (esquerda)."]}),e.jsxs("li",{children:[e.jsx("code",{children:'$@"..."'})," e ",e.jsx("code",{children:'$$"""..."""'})," simplificam strings com quebras e caracteres especiais."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"FormattableString"})," + ",e.jsx("code",{children:"InvariantCulture"})," ao gerar arquivos ou se comunicar com APIs."]}),e.jsx("li",{children:"A interpolação moderna (.NET 6+) é otimizada — não há motivo para evitá-la por performance."})]})]})}export{s as default};
