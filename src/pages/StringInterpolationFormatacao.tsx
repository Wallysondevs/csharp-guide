import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StringInterpolationFormatacao() {
  return (
    <PageContainer
      title="Interpolação e formatação avançada de strings"
      subtitle="Como montar texto dinâmico com $&quot;...&quot;, aplicar máscaras (moeda, data, padding) e respeitar a cultura do usuário."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Antes de C# 6, juntar variáveis em uma frase exigia <code>string.Format("Olá {`{0}`}, você tem {`{1}`} anos", nome, idade)</code> — verboso e fácil de errar a ordem dos argumentos. Hoje, usamos <strong>interpolação de strings</strong>: basta colocar um <code>$</code> antes das aspas e escrever a variável entre chaves. Mas a interpolação faz <em>muito mais</em> do que substituir nomes: aceita <strong>especificadores de formato</strong> para moeda, data, número decimal, padding (alinhamento) — coisas que você usaria em relatórios e telas reais. Este capítulo mostra do básico ao avançado.
      </p>

      <h2>O básico do <code>$"..."</code></h2>
      <p>
        Coloque <code>$</code> imediatamente antes das aspas. Tudo entre <code>{`{`}</code> e <code>{`}`}</code> é <em>código C# normal</em> — variáveis, expressões, chamadas de método, ternários. O resultado é convertido para string e inserido.
      </p>
      <pre><code>{`string nome = "Maria";
int idade = 30;

string msg = $"Olá, {nome}! Em 5 anos você terá {idade + 5}.";
Console.WriteLine(msg);
// Olá, Maria! Em 5 anos você terá 35.

// Expressões arbitrárias funcionam:
var hora = DateTime.Now;
Console.WriteLine($"Boa {(hora.Hour < 18 ? "tarde" : "noite")}, {nome}");`}</code></pre>

      <h2>Especificadores de formato</h2>
      <p>
        Depois da expressão, dois pontos e o <strong>código de formato</strong> definem como o valor será exibido. Para números, <code>N2</code> (numérico com 2 decimais), <code>C</code> (currency/moeda), <code>P</code> (porcentagem), <code>X</code> (hexadecimal). Para datas, qualquer máscara de <code>DateTime</code>.
      </p>
      <pre><code>{`decimal preco = 1234.5m;
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
Console.WriteLine($"{hoje:yyyy-MM-ddTHH:mm:ss}"); // 2024-07-15T14:30:00`}</code></pre>

      <h2>Padding: alinhamento à direita ou esquerda</h2>
      <p>
        Antes do <code>:</code> (formato), você pode pôr <strong>vírgula + largura</strong>. Largura positiva alinha à direita; negativa, à esquerda. Útil para imprimir tabelas no console.
      </p>
      <pre><code>{`var produtos = new[] {
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
// Livro       R$ 45,00        10`}</code></pre>

      <AlertBox type="info" title="Sintaxe completa">
        O molde geral é: <code>{`{`}expressão,largura:formato{`}`}</code>. Largura e formato são opcionais e independentes. Exemplo: <code>{`{x,8:N2}`}</code> = 8 caracteres, 2 decimais.
      </AlertBox>

      <h2>String literal verbatim e raw strings</h2>
      <p>
        Combinando <code>$</code> com <code>@</code>, você obtém <strong>strings verbatim interpoladas</strong> — quebras de linha e <code>\</code> são literais, sem escape. Em C# 11+, há também as <strong>raw string literals</strong> (três aspas), perfeitas para JSON, SQL ou HTML embutidos sem precisar escapar nada.
      </p>
      <pre><code>{`string caminho = @"C:\\Usuarios\\maria\\docs";
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
// {} dupla escapa o JSON. Genial.`}</code></pre>

      <h2>FormattableString e culturas</h2>
      <p>
        Um detalhe que pega muita gente: <code>$"{`{preco:C}`}"</code> usa a <strong>cultura atual da thread</strong> para decidir o símbolo (<code>R$</code>, <code>$</code>, <code>€</code>) e o separador decimal (<code>,</code> ou <code>.</code>). Ótimo em apps locais; <strong>terrível</strong> ao gerar arquivos compartilhados (CSV, JSON), onde você quer um formato determinístico, normalmente "invariant culture".
      </p>
      <pre><code>{`using System.Globalization;

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
                           $"Valor={valor:N2}");`}</code></pre>

      <AlertBox type="warning" title="Cultura em arquivos">
        Ao salvar logs, gerar JSON/CSV ou se comunicar com APIs, sempre use <code>InvariantCulture</code>. Caso contrário, a vírgula decimal do Brasil pode quebrar parsers que esperam ponto, e os bugs só aparecem em produção quando o servidor mudar de região.
      </AlertBox>

      <h2>Como funciona por baixo (.NET 6+)</h2>
      <p>
        A partir do .NET 6, <code>$"..."</code> não é mais traduzido para um simples <code>string.Format</code>. O compilador usa um tipo chamado <code>DefaultInterpolatedStringHandler</code> que escreve diretamente em um buffer de caracteres, evitando alocações intermediárias. Isso significa que <code>$"oi {`{nome}`}"</code> é tão eficiente quanto montar manualmente com <code>StringBuilder</code> em 99% dos casos. Em outras palavras: pode usar à vontade.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>$</code></strong>: <code>"Oi {`{nome}`}"</code> imprime literalmente <code>Oi {`{nome}`}</code>.</li>
        <li><strong>Trocar a vírgula com o dois-pontos</strong>: <code>{`{x:8}`}</code> não dá padding (8 vira formato inválido); o certo é <code>{`{x,8}`}</code>.</li>
        <li><strong>Usar cultura local em arquivos</strong> — gera CSVs com vírgula decimal que outros sistemas não leem.</li>
        <li><strong>Esquecer de duplicar chaves</strong> em raw strings: dentro de <code>$$"""</code> use <code>{`{{nome}}`}</code>; dentro de <code>$"..."</code> normal use <code>{`{`}{`{`}</code> para imprimir uma chave literal.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>$"..."</code> permite incorporar expressões C# em strings.</li>
        <li>Formatação: <code>{`{x:N2}`}</code>, <code>{`{x:C}`}</code>, <code>{`{data:dd/MM/yyyy}`}</code>.</li>
        <li>Padding: <code>{`{x,10}`}</code> (direita), <code>{`{x,-10}`}</code> (esquerda).</li>
        <li><code>$@"..."</code> e <code>$$"""..."""</code> simplificam strings com quebras e caracteres especiais.</li>
        <li>Use <code>FormattableString</code> + <code>InvariantCulture</code> ao gerar arquivos ou se comunicar com APIs.</li>
        <li>A interpolação moderna (.NET 6+) é otimizada — não há motivo para evitá-la por performance.</li>
      </ul>
    </PageContainer>
  );
}
