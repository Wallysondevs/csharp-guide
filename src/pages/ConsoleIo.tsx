import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ConsoleIo() {
  return (
    <PageContainer
      title="Lendo e escrevendo no console"
      subtitle="A porta de entrada e saída mais simples do C#: como interagir com o usuário pelo terminal."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Antes de aprender a construir interfaces gráficas, sites ou APIs, todo programador precisa dominar a forma mais antiga e direta de comunicação com o usuário: o <strong>console</strong> (também chamado de terminal ou prompt). Em C#, a classe <code>System.Console</code> oferece tudo que você precisa: imprimir mensagens, ler texto digitado, capturar uma tecla, formatar números. Pense no console como o "primeiro cliente" do seu programa — se você consegue se comunicar com ele, conseguirá depois trocar para qualquer interface mais sofisticada.
      </p>

      <h2>Escrevendo: <code>Write</code> vs <code>WriteLine</code></h2>
      <p>
        Há dois métodos básicos. <code>Console.Write</code> imprime exatamente o que você passou, sem adicionar nada. <code>Console.WriteLine</code> faz o mesmo, mas acrescenta uma <strong>quebra de linha</strong> no final, levando o cursor para a linha seguinte.
      </p>
      <pre><code>{`using System;

Console.Write("Olá ");
Console.Write("mundo");
Console.WriteLine("!");
// Saída em uma única linha: Olá mundo!

Console.WriteLine("Linha 1");
Console.WriteLine("Linha 2");
// Cada uma em sua linha`}</code></pre>
      <p>
        Você pode passar para esses métodos <em>qualquer tipo</em>: número, bool, data, objeto. O .NET chama automaticamente o método <code>ToString()</code> do valor para converter em texto.
      </p>
      <pre><code>{`Console.WriteLine(42);          // "42"
Console.WriteLine(3.14);        // "3,14" em pt-BR, "3.14" em en-US
Console.WriteLine(true);        // "True"
Console.WriteLine(DateTime.Now); // depende da cultura`}</code></pre>

      <h2>Formatação: <code>{`{0}`}</code> e interpolação <code>$"..."</code></h2>
      <p>
        Para misturar texto fixo com valores variáveis, há duas formas. A antiga usa marcadores numerados <code>{`{0}`}</code>, <code>{`{1}`}</code>... A moderna (preferida) usa <strong>strings interpoladas</strong> com prefixo <code>$</code>.
      </p>
      <pre><code>{`string nome = "Ana";
int idade = 30;

// Forma antiga (ainda válida)
Console.WriteLine("Olá, {0}! Você tem {1} anos.", nome, idade);

// Forma moderna (preferida)
Console.WriteLine($"Olá, {nome}! Você tem {idade} anos.");

// Formatos dentro da chave:
double preco = 19.9;
Console.WriteLine($"Preço: {preco:F2}");           // "Preço: 19,90"
Console.WriteLine($"Hoje: {DateTime.Now:dd/MM/yyyy}");
Console.WriteLine($"Hex: {255:X}");                // "FF"
Console.WriteLine($"Padding: '{nome,10}'");        // alinha à direita em 10`}</code></pre>

      <AlertBox type="info" title="Especificadores comuns">
        <code>F2</code> = ponto flutuante 2 casas; <code>N</code> = com separador de milhar; <code>P</code> = porcentagem; <code>C</code> = moeda; <code>X</code> = hexadecimal; <code>D</code> ou <code>D5</code> = inteiro com largura mínima.
      </AlertBox>

      <h2>Lendo: <code>ReadLine</code> e <code>ReadKey</code></h2>
      <p>
        <code>Console.ReadLine</code> espera o usuário digitar e pressionar <strong>Enter</strong>, devolvendo tudo digitado como <code>string</code> (ou <code>null</code> se a entrada acabou — útil quando o input vem de um arquivo redirecionado). <code>Console.ReadKey</code> captura uma <strong>única tecla</strong>, sem precisar de Enter.
      </p>
      <pre><code>{`Console.Write("Como você se chama? ");
string? nome = Console.ReadLine();
Console.WriteLine($"Prazer, {nome}!");

Console.WriteLine("Pressione qualquer tecla para sair...");
ConsoleKeyInfo tecla = Console.ReadKey(intercept: true);
Console.WriteLine($"Você apertou: {tecla.Key}");`}</code></pre>
      <p>
        O parâmetro <code>intercept: true</code> em <code>ReadKey</code> evita que a tecla apareça na tela. Útil para senhas ou menus.
      </p>

      <h2>Validando entrada com <code>TryParse</code></h2>
      <p>
        <code>ReadLine</code> sempre devolve texto. Para números, datas ou bools, você precisa converter — e o usuário pode digitar bobagem. A regra de ouro: <strong>nunca</strong> use <code>int.Parse</code> em entrada de usuário; sempre use <code>TryParse</code>, que devolve <code>false</code> em vez de explodir.
      </p>
      <pre><code>{`Console.Write("Digite sua idade: ");
string? entrada = Console.ReadLine();

if (int.TryParse(entrada, out int idade)) {
    if (idade < 0 || idade > 130) {
        Console.WriteLine("Idade fora do intervalo aceitável.");
    } else {
        Console.WriteLine($"Você tem {idade} anos.");
    }
} else {
    Console.WriteLine("Isso não parece um número.");
}`}</code></pre>

      <h2>Um programa interativo completo</h2>
      <p>
        Vamos juntar tudo num pequeno utilitário: ele pede dois números, um operador, e mostra o resultado. Note como a validação acontece em camadas e como a interpolação deixa as mensagens claras.
      </p>
      <pre><code>{`using System;

Console.WriteLine("=== Calculadora simples ===");

double LerNumero(string rotulo) {
    while (true) {
        Console.Write($"{rotulo}: ");
        string? linha = Console.ReadLine();
        if (double.TryParse(linha, out double valor)) return valor;
        Console.WriteLine("Número inválido, tente de novo.");
    }
}

double a = LerNumero("Primeiro número");
double b = LerNumero("Segundo número");

Console.Write("Operação (+ - * /): ");
string? op = Console.ReadLine();

double resultado = op switch {
    "+" => a + b,
    "-" => a - b,
    "*" => a * b,
    "/" when b != 0 => a / b,
    "/" => double.NaN,
    _   => double.NaN
};

Console.WriteLine($"Resultado: {a} {op} {b} = {resultado:F2}");`}</code></pre>

      <AlertBox type="warning" title="ReadLine pode retornar null">
        Quando o input chega de um pipe ou arquivo e termina, <code>ReadLine</code> retorna <code>null</code>. Em projetos com <em>nullable reference types</em>, sempre cheque com <code>?</code> ou <code>??</code> antes de usar a string.
      </AlertBox>

      <h2>Cores, cursor e limpar a tela</h2>
      <p>
        O console também permite controle visual básico. Útil para destacar mensagens de erro ou desenhar interfaces simples.
      </p>
      <pre><code>{`Console.ForegroundColor = ConsoleColor.Red;
Console.WriteLine("Erro grave!");
Console.ResetColor();

Console.BackgroundColor = ConsoleColor.Yellow;
Console.WriteLine("Atenção");
Console.ResetColor();

Console.Clear();                       // limpa tudo
Console.SetCursorPosition(10, 5);      // coluna 10, linha 5
Console.WriteLine("Posicionado!");`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Misturar <code>Write</code> e <code>WriteLine</code> sem prestar atenção:</strong> a saída fica grudada na próxima linha. Quando em dúvida, use <code>WriteLine</code>.</li>
        <li><strong>Usar <code>int.Parse</code> em entrada de usuário:</strong> qualquer letra digitada gera <code>FormatException</code>. Use <code>TryParse</code>.</li>
        <li><strong>Não checar <code>null</code> de <code>ReadLine</code>:</strong> em scripts redirecionados, o programa quebra.</li>
        <li><strong>Esquecer <code>Console.ResetColor</code>:</strong> as cores ficam aplicadas até o programa terminar.</li>
        <li><strong>Confundir cultura nas conversões:</strong> em pt-BR, "1.5" não é um <code>double</code> válido — só "1,5" funciona com cultura local.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Console.Write</code> imprime sem quebra; <code>WriteLine</code> imprime com quebra.</li>
        <li>Use interpolação <code>$"&#123;x&#125;"</code> em vez de concatenar com <code>+</code>.</li>
        <li><code>ReadLine</code> lê uma linha; <code>ReadKey</code> lê uma tecla.</li>
        <li>Para números, use sempre <code>int.TryParse</code>/<code>double.TryParse</code> em vez de <code>Parse</code>.</li>
        <li><code>Console.ForegroundColor</code> e <code>Clear</code> ajudam a melhorar a aparência.</li>
        <li>Trate sempre o caso de entrada inválida ou <code>null</code>.</li>
      </ul>
    </PageContainer>
  );
}
