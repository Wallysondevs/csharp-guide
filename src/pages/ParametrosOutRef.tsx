import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ParametrosOutRef() {
  return (
    <PageContainer
      title="Parâmetros especiais: ref, out, in e params"
      subtitle="Quando o método precisa modificar a variável do chamador, devolver vários valores ou aceitar um número variável de argumentos."
      difficulty="iniciante"
      timeToRead="14 min"
    >
      <p>
        Por padrão, ao chamar um método, C# passa <strong>cópias</strong> dos valores. Se você modifica um <code>int</code> dentro do método, a variável do chamador permanece intocada — porque o método só recebeu uma cópia. Mas há situações em que isso é exatamente o oposto do que você quer: <em>preciso</em> que o método mude minha variável; preciso que ele me devolva <em>dois</em> valores; preciso passar uma quantidade arbitrária de argumentos. Para esses casos, C# oferece quatro modificadores de parâmetro: <code>ref</code>, <code>out</code>, <code>in</code> e <code>params</code>. Saber quando (e quando <strong>não</strong>) usá-los é o assunto deste capítulo.
      </p>

      <h2>O comportamento padrão: passagem por valor</h2>
      <p>
        Antes dos modificadores, vamos firmar o padrão. Para tipos por valor, o método recebe uma cópia. Para tipos por referência, recebe uma cópia da <em>referência</em> — então pode modificar o conteúdo do objeto, mas não pode reapontar a variável do chamador.
      </p>
      <pre><code>{`static void Dobrar(int x) {
    x = x * 2;        // só altera a cópia local
}

int n = 5;
Dobrar(n);
Console.WriteLine(n);   // continua 5

static void EsvaziarLista(List<int> lista) {
    lista.Clear();        // modifica o objeto: chamador VÊ
}

static void TrocarLista(List<int> lista) {
    lista = new List<int>(); // só muda a referência LOCAL
}

var l = new List<int> { 1, 2, 3 };
EsvaziarLista(l);
Console.WriteLine(l.Count); // 0 (modificou o conteúdo)
TrocarLista(l);
// l ainda existe, com 0 itens — não foi substituído`}</code></pre>

      <h2><code>ref</code>: o método pode ler e escrever na variável do chamador</h2>
      <p>
        Marque o parâmetro com <code>ref</code> tanto na definição quanto na chamada. A variável passada precisa estar <strong>já inicializada</strong> antes da chamada, porque o método pode lê-la.
      </p>
      <pre><code>{`static void Dobrar(ref int x) {
    x = x * 2;
}

int n = 5;
Dobrar(ref n);
Console.WriteLine(n);   // agora é 10

// Trocar dois valores (clássico):
static void Trocar(ref int a, ref int b) {
    int tmp = a;
    a = b;
    b = tmp;
}

int x = 1, y = 2;
Trocar(ref x, ref y);
Console.WriteLine($"x={x}, y={y}");  // x=2, y=1`}</code></pre>

      <h2><code>out</code>: o método é obrigado a atribuir antes de retornar</h2>
      <p>
        Igual ao <code>ref</code>, mas com duas diferenças: o chamador <strong>não</strong> precisa inicializar a variável antes, e o método <strong>obrigatoriamente</strong> precisa atribuir um valor antes de retornar. Use para retornar valores adicionais.
      </p>
      <pre><code>{`static bool DividirSeguro(int dividendo, int divisor, out int resultado) {
    if (divisor == 0) {
        resultado = 0;     // ainda assim PRECISA atribuir
        return false;
    }
    resultado = dividendo / divisor;
    return true;
}

if (DividirSeguro(10, 3, out int r)) {
    Console.WriteLine($"Resultado: {r}");
} else {
    Console.WriteLine("Divisão por zero!");
}

// Padrão MUITO comum no .NET: TryParse
if (int.TryParse("42", out int valor)) {
    Console.WriteLine(valor * 2);
}`}</code></pre>

      <AlertBox type="info" title="out variables inline (C# 7+)">
        Você pode declarar a variável diretamente na chamada: <code>int.TryParse(s, out int n)</code>. O <code>n</code> existe no escopo a partir desse ponto. Antes do C# 7, era preciso declarar antes.
      </AlertBox>

      <h2><code>in</code>: passagem por referência somente leitura</h2>
      <p>
        <code>in</code> passa uma referência à variável (evitando cópia, útil para <em>structs grandes</em>), mas <strong>impede</strong> que o método a modifique. É uma promessa de "vou ler, mas não vou tocar".
      </p>
      <pre><code>{`public readonly struct GrandeMatriz {
    public readonly double[,] Dados;
    public GrandeMatriz(double[,] d) => Dados = d;
}

static double Soma(in GrandeMatriz m) {
    double s = 0;
    for (int i = 0; i < m.Dados.GetLength(0); i++)
        for (int j = 0; j < m.Dados.GetLength(1); j++)
            s += m.Dados[i, j];
    // m = new GrandeMatriz(...);  // ERRO: in é readonly
    return s;
}`}</code></pre>
      <p>
        Para tipos por referência ou structs pequenos, <code>in</code> raramente faz diferença — use só quando perfilamento mostrar ganho real.
      </p>

      <h2><code>params</code>: número variável de argumentos</h2>
      <p>
        Use <code>params</code> no <strong>último</strong> parâmetro para aceitar zero, um ou muitos argumentos, que o método recebe como array. <code>Console.WriteLine</code>, <code>string.Format</code> e <code>string.Concat</code> usam isso.
      </p>
      <pre><code>{`static int SomarTodos(params int[] valores) {
    int total = 0;
    foreach (int v in valores) total += v;
    return total;
}

Console.WriteLine(SomarTodos());            // 0
Console.WriteLine(SomarTodos(10));          // 10
Console.WriteLine(SomarTodos(1, 2, 3, 4));  // 10
Console.WriteLine(SomarTodos(new[] { 1, 2 })); // também aceita array

// Misturado com parâmetros normais:
static void Log(string nivel, params object[] partes) {
    Console.Write($"[{nivel}] ");
    foreach (var p in partes) Console.Write(p);
    Console.WriteLine();
}
Log("INFO", "Usuário ", "Ana", " logado às ", DateTime.Now);`}</code></pre>

      <h2>Retorno por referência: <code>ref returns</code></h2>
      <p>
        C# moderno permite que um método devolva uma <em>referência</em> a uma variável, e que o chamador modifique através dessa referência. Use raramente; é uma otimização para cenários específicos (engines, manipulação de buffers).
      </p>
      <pre><code>{`static ref int PrimeiroMaiorQue(int[] arr, int alvo) {
    for (int i = 0; i < arr.Length; i++) {
        if (arr[i] > alvo) return ref arr[i];
    }
    throw new InvalidOperationException("Nenhum elemento maior");
}

int[] dados = { 1, 5, 10, 20 };
ref int slot = ref PrimeiroMaiorQue(dados, 7);
slot = 999;        // modifica o array!
Console.WriteLine(dados[2]);  // 999`}</code></pre>

      <AlertBox type="warning" title="Quando NÃO usar ref">
        <strong>Não</strong> use <code>ref</code> só por achar que é mais rápido. Para a maioria dos casos, retornar um valor é mais legível e o compilador otimiza muito bem. Use <code>ref</code>/<code>out</code> só quando: (a) precisa devolver mais de um valor sem criar uma classe; (b) precisa modificar a variável do chamador deliberadamente; (c) está lidando com structs gigantes em código quente. Caso contrário, prefira retornar um <code>(bool ok, int valor)</code> tuple ou um <code>record</code>.
      </AlertBox>

      <h2>Tuplas: alternativa moderna a <code>out</code></h2>
      <p>
        Em vez de usar <code>out</code>, muitos códigos modernos retornam uma <strong>tupla</strong> com vários valores nomeados. É mais legível.
      </p>
      <pre><code>{`static (bool sucesso, int valor) DividirTupla(int a, int b) {
    if (b == 0) return (false, 0);
    return (true, a / b);
}

var (ok, r) = DividirTupla(10, 3);
if (ok) Console.WriteLine(r);`}</code></pre>

      <h2>Resumo das diferenças</h2>
      <table>
        <thead><tr><th>Modificador</th><th>Inicializar antes?</th><th>Método pode ler?</th><th>Método pode escrever?</th><th>Uso</th></tr></thead>
        <tbody>
          <tr><td>(nenhum)</td><td>Sim</td><td>Sim (cópia)</td><td>Local apenas</td><td>Padrão</td></tr>
          <tr><td><code>ref</code></td><td>Sim</td><td>Sim</td><td>Sim</td><td>Modificar variável do chamador</td></tr>
          <tr><td><code>out</code></td><td>Não</td><td>Não</td><td>Obrigatório</td><td>Devolver valor extra (TryParse)</td></tr>
          <tr><td><code>in</code></td><td>Sim</td><td>Sim</td><td>Não</td><td>Evitar cópia de struct grande</td></tr>
          <tr><td><code>params</code></td><td>—</td><td>—</td><td>—</td><td>Número variável de args</td></tr>
        </tbody>
      </table>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>ref</code> ou <code>out</code> na chamada:</strong> o compilador exige o modificador também na chamada, não só na assinatura.</li>
        <li><strong>Não atribuir um <code>out</code>:</strong> o compilador acusa "the out parameter must be assigned before control leaves the method". Atribua mesmo nos caminhos de erro.</li>
        <li><strong>Tentar passar <code>const</code> ou propriedade como <code>ref</code>:</strong> só variáveis "endereçáveis" funcionam.</li>
        <li><strong>Usar <code>ref</code> com tipo por referência sem entender:</strong> só faz diferença se o método precisa <em>reapontar</em> a variável do chamador.</li>
        <li><strong>Abusar de <code>params</code>:</strong> cada chamada pode alocar um array escondido. Em código quente, ofereça uma sobrecarga sem <code>params</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Padrão é passagem por valor (cópia); para tipos referência, copia o ponteiro.</li>
        <li><code>ref</code>: passar e poder modificar; precisa inicializar antes.</li>
        <li><code>out</code>: devolver valores extras; método é obrigado a atribuir.</li>
        <li><code>in</code>: passar por referência, somente leitura — útil para structs grandes.</li>
        <li><code>params</code>: aceitar número variável de argumentos como array.</li>
        <li>Tuplas e <code>record</code> muitas vezes substituem <code>ref</code>/<code>out</code> com mais clareza.</li>
      </ul>
    </PageContainer>
  );
}
