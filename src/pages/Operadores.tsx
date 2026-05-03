import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Operadores() {
  return (
    <PageContainer
      title="Operadores aritméticos, lógicos e de comparação"
      subtitle="Os símbolos que combinam valores: contas, decisões, bits e os operadores modernos para lidar com null."
      difficulty="iniciante"
      timeToRead="14 min"
    >
      <p>
        Operadores são os "verbos" da linguagem. Eles pegam um ou dois valores (chamados <em>operandos</em>) e produzem um novo. Saber quais existem, em que ordem o C# os avalia e quais armadilhas escondem é essencial: muitos bugs nascem de uma simples falta de parênteses ou de uma confusão entre <code>=</code> e <code>==</code>. Este capítulo cobre os principais grupos: aritméticos, comparativos, lógicos, bitwise (de bits), o ternário e os operadores modernos para lidar com <code>null</code>.
      </p>

      <h2>Aritméticos: <code>+ - * / %</code></h2>
      <p>
        São as quatro operações da escola, mais o resto da divisão (<code>%</code>, chamado <em>módulo</em>). A divisão tem um detalhe traiçoeiro: entre dois inteiros, ela <strong>descarta</strong> a parte fracionária.
      </p>
      <pre><code>{`int soma = 7 + 3;        // 10
int sub  = 7 - 3;        // 4
int mult = 7 * 3;        // 21
int div  = 7 / 3;        // 2  (não é 2.333!)
int mod  = 7 % 3;        // 1  (resto)

double divReal = 7.0 / 3; // 2.3333... — pelo menos um operando é double

// Incremento e decremento
int x = 5;
x++;            // pós-incremento, x vira 6
++x;            // pré-incremento, x vira 7
int y = x++;    // y recebe 7, depois x vira 8
int z = ++x;    // x vira 9, depois z recebe 9`}</code></pre>

      <h2>Precedência e associatividade</h2>
      <p>
        Expressões longas seguem a ordem matemática: <code>* / %</code> antes de <code>+ -</code>. Em caso de empate, a avaliação é da esquerda para a direita. Use parênteses sempre que duvidar — eles tornam o código legível e impedem que o compilador "interprete diferente do que você quis".
      </p>
      <pre><code>{`int r1 = 2 + 3 * 4;        // 14, não 20
int r2 = (2 + 3) * 4;      // 20
int r3 = 10 - 2 - 3;       // 5  (esquerda para direita)
int r4 = 2 + 3 * 4 - 5;    // 9`}</code></pre>

      <h2>Comparação: <code>== != &lt; &gt; &lt;= &gt;=</code></h2>
      <p>
        Devolvem sempre um <code>bool</code>. O detalhe importante: <strong>iguais</strong> são dois sinais (<code>==</code>); um único <code>=</code> é atribuição. Esse é o erro #1 de quem vem de matemática.
      </p>
      <pre><code>{`int idade = 18;
bool maior = idade >= 18;          // true
bool diferente = idade != 21;      // true

// Erro CLÁSSICO em outras linguagens (C aceita, C# bloqueia):
// if (idade = 18) { … }   // ERRO de compilação em C#
if (idade == 18) {                  // OK
    Console.WriteLine("Maioridade!");
}`}</code></pre>

      <h2>Lógicos: <code>&amp;&amp;</code>, <code>||</code>, <code>!</code></h2>
      <p>
        Combinam booleanos. <code>&amp;&amp;</code> é "E" (ambos verdadeiros), <code>||</code> é "OU" (pelo menos um), <code>!</code> inverte. O importante: ambos fazem <strong>curto-circuito</strong>. Se o primeiro operando já decide o resultado, o segundo nem é avaliado.
      </p>
      <pre><code>{`bool maior = idade >= 18;
bool brasileiro = pais == "BR";
if (maior && brasileiro) { … }

// Curto-circuito: se 'pessoa' for null, NÃO chama .Idade,
// evitando NullReferenceException
if (pessoa != null && pessoa.Idade >= 18) { … }

// ! inverte
if (!ativo) { … }`}</code></pre>

      <AlertBox type="info" title="&amp; e | sem curto-circuito">
        Existem também <code>&amp;</code> e <code>|</code> (um sinal só), que avaliam <strong>sempre</strong> os dois lados. Use raramente — só quando o segundo operando tem um efeito colateral importante.
      </AlertBox>

      <h2>Bitwise: manipulando bits</h2>
      <p>
        Para manipular números bit a bit (útil em flags, criptografia, gráficos): <code>&amp;</code> AND, <code>|</code> OR, <code>^</code> XOR, <code>~</code> NOT, <code>&lt;&lt;</code> shift à esquerda, <code>&gt;&gt;</code> shift à direita.
      </p>
      <pre><code>{`int a = 0b_1100;     // 12
int b = 0b_1010;     // 10
int and = a & b;     // 0b_1000 = 8
int or  = a | b;     // 0b_1110 = 14
int xor = a ^ b;     // 0b_0110 = 6
int not = ~a;        // inverte todos os bits
int sl  = 1 << 3;    // 1000 = 8 (multiplicar por 2 três vezes)
int sr  = 16 >> 2;   // 4

// Uso prático: enum com [Flags]
[Flags]
enum Permissao { Ler = 1, Escrever = 2, Executar = 4 }
var p = Permissao.Ler | Permissao.Escrever;
bool podeLer = (p & Permissao.Ler) != 0;`}</code></pre>

      <h2>Ternário <code>?:</code></h2>
      <p>
        Uma forma compacta de "if-else que devolve um valor": <code>condicao ? seVerdadeiro : seFalso</code>. Ótimo para atribuições simples; abuse e o código fica ilegível.
      </p>
      <pre><code>{`string mensagem = idade >= 18 ? "Adulto" : "Menor";

// Encadear é possível, mas duvidoso:
string faixa = idade < 12 ? "criança"
             : idade < 18 ? "adolescente"
             : idade < 60 ? "adulto"
             : "idoso";`}</code></pre>

      <h2>Operadores de null: <code>??</code>, <code>??=</code>, <code>?.</code></h2>
      <p>
        Esses são <em>os</em> operadores que diferenciam código C# moderno do estilo antigo. Eles ajudam a lidar com <code>null</code> de forma elegante e segura.
      </p>
      <pre><code>{`string? nome = ObterNome();           // pode ser null

// ??  (null-coalescing): valor padrão se for null
string exibir = nome ?? "Anônimo";

// ??= : atribui só se a variável estiver null
nome ??= "Visitante";

// ?.  (null-conditional): chama membro só se não for null
int? tamanho = nome?.Length;          // null se nome for null

// Encadear:
int? tamPais = pessoa?.Endereco?.Pais?.Length;`}</code></pre>

      <AlertBox type="warning" title="Pegadinha do ?? com bool?">
        <code>bool? x = null; if (x ?? false) …</code> é a forma idiomática para tratar nullable bool. Não escreva <code>if (x == true)</code> sem entender que <code>null == true</code> é <code>false</code> em C# (e isso é o que você quer, normalmente).
      </AlertBox>

      <h2>Atribuição composta</h2>
      <p>
        Para encurtar "x = x + algo": existem versões compostas para todos os operadores aritméticos e bitwise.
      </p>
      <pre><code>{`int x = 10;
x += 5;     // x = x + 5
x -= 2;     // x = x - 2
x *= 3;     // x = x * 3
x /= 4;     // x = x / 4
x %= 2;     // x = x % 2
x <<= 1;    // shift à esquerda`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Confundir <code>=</code> com <code>==</code>:</strong> em C# o compilador pega isso quando o tipo é não-booleano, mas com <code>bool</code> escapa.</li>
        <li><strong>Esquecer parênteses:</strong> <code>a &amp;&amp; b || c</code> não é o que parece — <code>&amp;&amp;</code> tem precedência sobre <code>||</code>.</li>
        <li><strong>Divisão inteira inesperada:</strong> <code>1 / 2</code> é <code>0</code>; escreva <code>1.0 / 2</code>.</li>
        <li><strong>Usar <code>&amp;</code> em vez de <code>&amp;&amp;</code>:</strong> perde o curto-circuito e pode causar <code>NullReferenceException</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Aritméticos seguem precedência matemática; use parênteses para clareza.</li>
        <li>Divisão entre inteiros descarta a parte fracionária.</li>
        <li>Lógicos <code>&amp;&amp;</code> e <code>||</code> fazem curto-circuito; <code>&amp;</code> e <code>|</code> não.</li>
        <li>Comparação usa <code>==</code> (dois sinais!), não <code>=</code>.</li>
        <li>Operadores bitwise tratam números como sequências de bits — úteis em flags.</li>
        <li><code>??</code>, <code>??=</code> e <code>?.</code> simplificam o tratamento de <code>null</code>.</li>
      </ul>
    </PageContainer>
  );
}
