import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TiposValor() {
  return (
    <PageContainer
      title="Tipos por valor: int, double, bool, char, decimal"
      subtitle="Os blocos de construção primitivos do C#: o que cada um guarda, qual é o intervalo aceito e quando usar."
      difficulty="iniciante"
      timeToRead="14 min"
    >
      <p>
        Os <strong>tipos por valor</strong> são os "tijolos" da linguagem. Ao contrário dos tipos por referência (que veremos no próximo capítulo), eles guardam o conteúdo <em>diretamente</em> na variável — não há indireção. Pense neles como caixas pequenas e padronizadas: você sempre sabe exatamente quanto espaço cada uma ocupa e qual é o intervalo de valores que cabe lá. Esse capítulo apresenta os tipos numéricos inteiros, os de ponto flutuante, o lógico (<code>bool</code>) e o caractere (<code>char</code>) — junto com as armadilhas de precisão que pegam todo iniciante de surpresa.
      </p>

      <h2>Inteiros: tamanho importa</h2>
      <p>
        C# oferece oito tipos inteiros, divididos por <strong>tamanho em bits</strong> e por aceitarem sinal negativo (<em>signed</em>) ou não (<em>unsigned</em>). A regra de bolso é: use <code>int</code> a menos que tenha um motivo concreto para outro.
      </p>
      <table>
        <thead><tr><th>Tipo</th><th>Bits</th><th>Faixa</th><th>Quando usar</th></tr></thead>
        <tbody>
          <tr><td><code>sbyte</code></td><td>8</td><td>-128 a 127</td><td>raríssimo</td></tr>
          <tr><td><code>byte</code></td><td>8</td><td>0 a 255</td><td>bytes de arquivo, pixel</td></tr>
          <tr><td><code>short</code></td><td>16</td><td>-32.768 a 32.767</td><td>protocolos antigos</td></tr>
          <tr><td><code>ushort</code></td><td>16</td><td>0 a 65.535</td><td>idem</td></tr>
          <tr><td><code>int</code></td><td>32</td><td>±2,1 bilhões</td><td><strong>padrão</strong></td></tr>
          <tr><td><code>uint</code></td><td>32</td><td>0 a 4,2 bilhões</td><td>id sem sinal</td></tr>
          <tr><td><code>long</code></td><td>64</td><td>±9 quintilhões</td><td>timestamps, ids grandes</td></tr>
          <tr><td><code>ulong</code></td><td>64</td><td>0 a 18 quintilhões</td><td>raro</td></tr>
        </tbody>
      </table>
      <pre><code>{`int idade = 30;
long populacao = 8_100_000_000L;   // sufixo L para long
byte canalRed = 255;
uint identificador = 4_000_000_000U; // sufixo U para unsigned

// Sublinhados '_' são separadores visuais — o compilador ignora
int milhao = 1_000_000;`}</code></pre>
      <p>
        O sufixo <code>L</code> diz ao compilador "trate este literal como <code>long</code>"; sem ele, o número <code>8100000000</code> sequer compila, porque excede o tamanho de um <code>int</code>.
      </p>

      <h2>Ponto flutuante: <code>float</code>, <code>double</code> e <code>decimal</code></h2>
      <p>
        Para números com casas decimais, há três opções, e escolher a errada gera bugs sutis em sistemas financeiros. A diferença está na <strong>precisão</strong> e na forma como os números são armazenados internamente.
      </p>
      <pre><code>{`float pesoF = 1.5f;          // 32 bits, ~7 dígitos de precisão. Sufixo 'f'
double pesoD = 1.5;          // 64 bits, ~15 dígitos. Padrão para decimais
decimal preco = 19.90m;      // 128 bits, 28-29 dígitos EXATOS. Sufixo 'm'

// Demonstração do problema clássico:
double a = 0.1 + 0.2;        // 0.30000000000000004 (!)
decimal b = 0.1m + 0.2m;     // 0.3 exato`}</code></pre>
      <p>
        <code>float</code> e <code>double</code> seguem o padrão IEEE 754 — eles são <em>aproximações binárias</em> de números decimais. Para a maioria dos cálculos científicos isso é ótimo (e rápido), mas para dinheiro é catastrófico. <code>decimal</code>, por outro lado, armazena os dígitos de forma exata, à custa de mais memória e velocidade. <strong>Sempre use <code>decimal</code> para valores monetários.</strong>
      </p>

      <AlertBox type="danger" title="Nunca compare floats com ==">
        Por causa das aproximações binárias, <code>0.1 + 0.2 == 0.3</code> é <code>false</code>! Para comparar <code>double</code> ou <code>float</code>, verifique se a diferença absoluta é menor que uma tolerância: <code>Math.Abs(a - b) &lt; 0.0001</code>.
      </AlertBox>

      <h2>O tipo <code>char</code>: um caractere Unicode</h2>
      <p>
        <code>char</code> guarda <strong>um único</strong> caractere usando aspas simples. Internamente, é um número de 16 bits (<em>UTF-16 code unit</em>), o que cobre a maior parte dos caracteres do mundo (mas não emojis fora do plano básico, que ocupam dois <code>char</code>).
      </p>
      <pre><code>{`char letra = 'A';
char digito = '7';
char acento = 'ã';
char tab = '\\t';        // escape: tabulação
char newline = '\\n';    // escape: quebra de linha
char unicode = '\\u00e3'; // 'ã' por código

// char é numérico! Pode somar:
int codigo = letra;     // 65 (código ASCII de 'A')
char proxima = (char)(letra + 1); // 'B'`}</code></pre>

      <h2>O tipo <code>bool</code>: verdadeiro ou falso</h2>
      <p>
        <code>bool</code> só aceita dois valores literais: <code>true</code> ou <code>false</code>. Diferente do C/C++, números <strong>não</strong> são convertidos automaticamente para booleano: <code>if (1)</code> não compila em C#.
      </p>
      <pre><code>{`bool ativo = true;
bool maiorIdade = idade >= 18;   // resultado de comparação

// Estas linhas NÃO compilam:
// bool x = 1;          // erro: int não vira bool implicitamente
// if (idade) { … }     // erro: precisa ser uma expressão booleana`}</code></pre>

      <h2>Overflow: <code>checked</code> e <code>unchecked</code></h2>
      <p>
        O que acontece se você somar 1 ao maior <code>int</code> possível? Por padrão, em <em>release</em>, ele "dá a volta" e vira o menor número negativo — sem aviso. Esse comportamento, chamado <strong>overflow</strong>, pode causar bugs sérios em código de segurança ou financeiro. O C# permite controlar isso com dois blocos:
      </p>
      <pre><code>{`int max = int.MaxValue;            // 2_147_483_647

// Sem proteção: dá a volta silenciosamente
int errado = max + 1;              // -2_147_483_648

// Com checked: lança OverflowException se estourar
checked {
    int explode = max + 1;         // ERRO em runtime
}

// Forçar comportamento sem verificação dentro de checked global
unchecked {
    int silencioso = max + 1;
}`}</code></pre>

      <AlertBox type="info" title="Sufixos de literais numéricos">
        <code>L</code> = long, <code>U</code> = unsigned, <code>UL</code> = ulong, <code>F</code> = float, <code>D</code> = double (raro, é o padrão), <code>M</code> = decimal. Sem sufixo, números inteiros são <code>int</code> e decimais são <code>double</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>m</code> em decimais:</strong> <code>decimal x = 19.90;</code> não compila — o literal sem sufixo é <code>double</code>. Escreva <code>19.90m</code>.</li>
        <li><strong>Usar <code>double</code> para dinheiro:</strong> erros de centavos vão se acumular. Use <code>decimal</code>.</li>
        <li><strong>Comparar <code>double</code> com <code>==</code>:</strong> use uma tolerância (<code>Math.Abs(a - b) &lt; 1e-9</code>).</li>
        <li><strong>Estourar inteiros sem perceber:</strong> ao multiplicar <code>int</code> grandes, faça o cast para <code>long</code> antes: <code>(long)a * b</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Use <code>int</code> para inteiros normais; <code>long</code> só quando necessário.</li>
        <li><code>byte</code> e <code>uint</code> existem para casos específicos (bytes, ids).</li>
        <li>Para números reais: <code>double</code> em geral, <code>decimal</code> sempre que for dinheiro.</li>
        <li><code>float</code>/<code>double</code> sofrem de imprecisão binária — não compare com <code>==</code>.</li>
        <li><code>char</code> é Unicode UTF-16 e tem aspas simples; <code>bool</code> só aceita <code>true</code>/<code>false</code>.</li>
        <li>Use <code>checked</code> para evitar overflow silencioso em cálculos sensíveis.</li>
      </ul>
    </PageContainer>
  );
}
