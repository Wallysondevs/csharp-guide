import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function VariaveisTipos() {
  return (
    <PageContainer
      title="Variáveis e o sistema de tipos do C#"
      subtitle="Como o C# guarda dados na memória, por que cada variável precisa de um tipo e como nomeá-las corretamente."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Pense em uma <strong>variável</strong> como uma caixa etiquetada na memória do computador. A etiqueta é o <em>nome</em> da variável; o conteúdo é o <em>valor</em> guardado lá dentro; e o <em>tipo</em> diz que tamanho e formato a caixa tem — se cabe um número inteiro, um texto, uma data, ou qualquer outra coisa. Em C#, ao contrário de linguagens como JavaScript ou Python, <strong>toda</strong> variável tem um tipo definido em tempo de compilação. Isso é chamado de <em>tipagem estática</em> e é uma das maiores forças da linguagem: o compilador (o programa que transforma seu código em algo executável) descobre erros antes do programa rodar.
      </p>

      <h2>Declarando variáveis</h2>
      <p>
        A forma básica é <code>tipo nome = valor;</code>. O tipo vem antes do nome, igual a uma etiqueta colada na frente da caixa. Você também pode declarar a variável agora e atribuir o valor depois, mas é necessário atribuir antes de usar.
      </p>
      <pre><code>{`int idade = 30;            // inteiro de 32 bits
double altura = 1.75;      // ponto flutuante de 64 bits
bool ativo = true;         // verdadeiro ou falso
string nome = "Ana";       // texto Unicode
char inicial = 'A';        // um único caractere

// Declarar agora, atribuir depois
int contador;
contador = 0;`}</code></pre>
      <p>
        Cada linha termina em <code>;</code>. O tipo <code>string</code> sempre usa aspas duplas <code>"…"</code>, enquanto <code>char</code> usa aspas simples <code>'…'</code>. Trocar uma pela outra é erro de compilação.
      </p>

      <h2>Inferência com <code>var</code></h2>
      <p>
        Quando o tipo é óbvio pelo valor da direita, você pode usar a palavra-chave <code>var</code>. O compilador <strong>infere</strong> (deduz) o tipo automaticamente. Cuidado: <code>var</code> não significa "qualquer tipo" — significa "deixe o compilador descobrir o tipo agora". A variável continua estaticamente tipada.
      </p>
      <pre><code>{`var idade = 30;            // compilador infere: int
var nome = "Ana";          // compilador infere: string
var preco = 19.90;         // compilador infere: double

// ERRO: precisa de inicializador para inferir
// var x;
// var y = null; // null sem contexto também não funciona`}</code></pre>

      <AlertBox type="info" title="Quando usar var?">
        Use <code>var</code> quando o tipo for evidente (<code>var lista = new List&lt;int&gt;();</code>) ou redundante. Prefira o tipo explícito (<code>int idade = …</code>) quando ele documentar uma intenção importante para quem lê o código depois.
      </AlertBox>

      <h2>O sistema CTS: tudo herda de <code>object</code></h2>
      <p>
        Todo tipo em C# faz parte do <strong>Common Type System (CTS)</strong>, uma hierarquia única em que tudo (até o humilde <code>int</code>) descende de <code>System.Object</code>. Os tipos se dividem em duas grandes famílias:
      </p>
      <ul>
        <li><strong>Tipos por valor</strong> (<em>value types</em>) — vivem diretamente onde foram declarados (na pilha, em geral). Cópia duplica o conteúdo. Ex.: <code>int</code>, <code>double</code>, <code>bool</code>, <code>char</code>, <code>struct</code>, <code>enum</code>.</li>
        <li><strong>Tipos por referência</strong> (<em>reference types</em>) — vivem no <em>heap</em> (uma área grande de memória); a variável guarda apenas um "endereço" apontando para o objeto. Cópia duplica o endereço, não o conteúdo. Ex.: <code>string</code>, <code>object</code>, classes, arrays.</li>
      </ul>
      <pre><code>{`int a = 10;
int b = a;          // cópia do valor: b == 10, mudar a não afeta b
a = 99;
// b continua 10

int[] x = { 1, 2, 3 };
int[] y = x;        // cópia da REFERÊNCIA: x e y apontam para o mesmo array
y[0] = 999;
// x[0] também é 999`}</code></pre>

      <h2>Escopo: onde a variável existe</h2>
      <p>
        O <strong>escopo</strong> é a região do código em que uma variável é visível. Em C#, ele é definido pelas chaves <code>{`{ }`}</code>. Uma variável declarada dentro de um bloco morre quando o bloco termina.
      </p>
      <pre><code>{`void Exemplo() {
    int x = 1;          // visível em todo o método
    if (x > 0) {
        int y = 2;      // visível só dentro do if
        Console.WriteLine(x + y);
    }
    // Console.WriteLine(y); // ERRO: y não existe mais aqui
}`}</code></pre>
      <p>
        Você também não pode declarar duas variáveis com o mesmo nome no mesmo escopo. Esse erro pega muito iniciante que copia-cola código.
      </p>

      <h2>Convenções de nomenclatura</h2>
      <p>
        C# segue convenções rígidas (não obrigatórias pelo compilador, mas universais entre programadores .NET):
      </p>
      <table>
        <thead><tr><th>Onde</th><th>Estilo</th><th>Exemplo</th></tr></thead>
        <tbody>
          <tr><td>Classes, métodos, propriedades</td><td>PascalCase</td><td><code>CalcularTotal</code></td></tr>
          <tr><td>Variáveis locais e parâmetros</td><td>camelCase</td><td><code>nomeCompleto</code></td></tr>
          <tr><td>Campos privados</td><td>_camelCase</td><td><code>_contador</code></td></tr>
          <tr><td>Constantes</td><td>PascalCase</td><td><code>TaxaJuros</code></td></tr>
          <tr><td>Interfaces</td><td>I + PascalCase</td><td><code>IComparavel</code></td></tr>
        </tbody>
      </table>

      <h2><code>const</code> vs <code>readonly</code></h2>
      <p>
        Quando um valor não pode mudar, marque-o como constante. Existem duas formas, e a diferença é importante.
      </p>
      <pre><code>{`// const: avaliado em tempo de COMPILAÇÃO. Só serve para
// literais simples (números, strings, bool). É "embutido"
// no binário onde for usado.
const double Pi = 3.14159;
const string Versao = "1.0.0";

class Configuracao {
    // readonly: definido em tempo de EXECUÇÃO, no construtor.
    // Pode receber resultado de função, DateTime.Now, etc.
    public readonly DateTime CriadoEm;

    public Configuracao() {
        CriadoEm = DateTime.Now;   // OK aqui
    }

    // CriadoEm = DateTime.Now;     // ERRO fora do construtor
}`}</code></pre>

      <AlertBox type="warning" title="const é traiçoeiro entre projetos">
        Como <code>const</code> é "embutido" no código que o consome, se você mudar a constante em uma biblioteca e <strong>não recompilar</strong> os projetos que dependem dela, eles continuarão usando o valor antigo. Para valores que podem mudar entre versões, prefira <code>static readonly</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar variável sem inicializar:</strong> o compilador acusa "use of unassigned local variable". Sempre atribua um valor antes de ler.</li>
        <li><strong>Confundir <code>=</code> com <code>==</code>:</strong> o primeiro atribui, o segundo compara. <code>if (x = 5)</code> é erro em C# (felizmente, ao contrário do C).</li>
        <li><strong>Trocar maiúsculas:</strong> <code>Idade</code> e <code>idade</code> são variáveis diferentes. C# é sensível ao caso.</li>
        <li><strong>Tentar mudar uma <code>const</code>:</strong> "left-hand side of assignment must be a variable".</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Toda variável em C# tem um tipo fixo em tempo de compilação.</li>
        <li><code>var</code> infere o tipo, mas não muda a tipagem estática.</li>
        <li>Tipos se dividem em <strong>valor</strong> (cópia duplica conteúdo) e <strong>referência</strong> (cópia duplica endereço).</li>
        <li>O escopo é delimitado por chaves; variável fora do escopo deixa de existir.</li>
        <li>Convenções: PascalCase para tipos/métodos, camelCase para locais, _camelCase para campos privados.</li>
        <li><code>const</code> é em tempo de compilação; <code>readonly</code> é em tempo de execução (atribuído no construtor).</li>
      </ul>
    </PageContainer>
  );
}
