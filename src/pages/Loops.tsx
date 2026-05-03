import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Loops() {
  return (
    <PageContainer
      title="Loops: for, while, do-while, foreach"
      subtitle="Como repetir blocos de código sem reescrevê-los, escolhendo a forma certa para cada situação."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Computadores são incansáveis: enquanto humanos se cansam de repetir uma tarefa duas ou três vezes, eles fazem milhões de iterações sem reclamar. Os <strong>loops</strong> (também chamados <em>laços</em>) são as instruções que dizem "repita este bloco enquanto valer alguma condição" ou "para cada item desta coleção, faça isto". C# oferece quatro variações principais — <code>for</code>, <code>while</code>, <code>do-while</code> e <code>foreach</code> — e dominar quando usar cada uma deixa o código mais legível e menos propenso a bugs.
      </p>

      <h2><code>for</code>: quando você sabe quantas voltas dar</h2>
      <p>
        O <code>for</code> clássico tem três partes na cabeça, separadas por <code>;</code>: a <em>inicialização</em> (executada uma vez no começo), a <em>condição</em> (testada antes de cada volta), e o <em>incremento</em> (executado depois de cada volta). Use-o quando o número de iterações é conhecido ou quando você precisa do índice.
      </p>
      <pre><code>{`// Imprime os números de 1 a 10
for (int i = 1; i <= 10; i++) {
    Console.WriteLine(i);
}

// Iterar de 2 em 2:
for (int i = 0; i < 100; i += 2) { … }

// Iterar para trás:
for (int i = 10; i >= 1; i--) {
    Console.WriteLine(i);
}`}</code></pre>
      <p>
        A variável <code>i</code> só existe dentro do bloco do <code>for</code> — fora dele, o compilador acusa erro. Isso evita poluir o restante do método com variáveis temporárias.
      </p>

      <h2><code>while</code>: enquanto a condição for verdadeira</h2>
      <p>
        Use <code>while</code> quando o número de voltas <strong>não</strong> é conhecido de antemão e depende de algum estado que muda dentro do laço (entrada do usuário, leitura de um arquivo, valor recebido de uma API).
      </p>
      <pre><code>{`int tentativas = 0;
string? senha;

do {
    Console.Write("Digite a senha: ");
    senha = Console.ReadLine();
    tentativas++;
} while (senha != "1234" && tentativas < 3);

// Versão com while normal — note que precisaria inicializar antes:
string? linha = Console.ReadLine();
while (!string.IsNullOrEmpty(linha)) {
    Console.WriteLine($"Você digitou: {linha}");
    linha = Console.ReadLine();
}`}</code></pre>

      <h2><code>do-while</code>: pelo menos uma vez</h2>
      <p>
        Idêntico ao <code>while</code>, mas a condição é testada <strong>depois</strong> do bloco. Garante que o corpo execute pelo menos uma vez. Útil para menus que sempre devem aparecer ao menos uma vez.
      </p>
      <pre><code>{`int opcao;

do {
    Console.WriteLine("1) Listar");
    Console.WriteLine("2) Adicionar");
    Console.WriteLine("0) Sair");
    Console.Write("Escolha: ");
    int.TryParse(Console.ReadLine(), out opcao);

    switch (opcao) {
        case 1: Listar(); break;
        case 2: Adicionar(); break;
    }
} while (opcao != 0);`}</code></pre>

      <h2><code>foreach</code>: iterar coleções</h2>
      <p>
        Esta é a forma idiomática para percorrer arrays, listas, dicionários, strings e qualquer outra coleção. O compilador esconde a "mecânica" do índice — você só lida com os elementos.
      </p>
      <pre><code>{`int[] numeros = { 10, 20, 30, 40 };

foreach (int n in numeros) {
    Console.WriteLine(n);
}

string nome = "Ana";
foreach (char c in nome) {
    Console.WriteLine(c);
}

var capitais = new Dictionary<string, string> {
    ["BR"] = "Brasília",
    ["AR"] = "Buenos Aires"
};
foreach (var (sigla, capital) in capitais) {
    Console.WriteLine($"{sigla} → {capital}");
}`}</code></pre>

      <AlertBox type="warning" title="Não modifique a coleção dentro do foreach">
        Adicionar ou remover itens de uma <code>List&lt;T&gt;</code> dentro de um <code>foreach</code> sobre ela mesma lança <code>InvalidOperationException</code>. Use um <code>for</code> reverso ou colete os índices a remover em outra lista.
      </AlertBox>

      <h2><code>break</code>, <code>continue</code> e <code>goto</code></h2>
      <p>
        Dentro de qualquer loop você pode controlar o fluxo:
      </p>
      <ul>
        <li><code>break</code> sai imediatamente do loop atual.</li>
        <li><code>continue</code> pula o resto desta iteração e vai direto para a próxima.</li>
        <li><code>goto</code> existe, mas raramente é justificado — exceto para sair de loops aninhados (situação rara e que melhor seria refatorada).</li>
      </ul>
      <pre><code>{`// break ao encontrar
foreach (var item in lista) {
    if (item == alvo) {
        Console.WriteLine("Achei!");
        break;
    }
}

// continue para pular ímpares
for (int i = 1; i <= 10; i++) {
    if (i % 2 != 0) continue;
    Console.WriteLine(i); // só pares
}

// goto para sair de loops aninhados (use com parcimônia)
for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
        if (i * j > 50) goto fim;
    }
}
fim:
Console.WriteLine("Saí dos dois loops");`}</code></pre>

      <h2>Loop infinito controlado</h2>
      <p>
        Às vezes você precisa de um laço que roda "para sempre" até que algum evento o interrompa — um servidor que aceita conexões, um daemon que consome fila, um menu interativo. Use <code>while (true)</code> com <code>break</code> para sair.
      </p>
      <pre><code>{`while (true) {
    Console.Write("Comando (sair para terminar): ");
    string? cmd = Console.ReadLine();
    if (cmd == "sair") break;
    Executar(cmd);
}`}</code></pre>

      <AlertBox type="info" title="Como escolher o loop certo">
        <strong>for</strong> quando você sabe o número de voltas.<br />
        <strong>while</strong> quando depende de uma condição externa.<br />
        <strong>do-while</strong> quando precisa rodar pelo menos uma vez.<br />
        <strong>foreach</strong> quando está iterando uma coleção.
      </AlertBox>

      <h2>Aninhamento e desempenho</h2>
      <p>
        Um loop dentro de outro multiplica o trabalho. Imprimir uma matriz 10x10 faz 100 iterações; uma 1000x1000 faz um milhão. Sempre se pergunte: "qual é a ordem de grandeza?"
      </p>
      <pre><code>{`// Matriz multiplicada por escalar
int[,] matriz = new int[3, 3];

for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        matriz[i, j] = (i + 1) * (j + 1);
    }
}

// Mostrar
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        Console.Write($"{matriz[i, j]}\\t");
    }
    Console.WriteLine();
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Loop infinito acidental:</strong> esquecer de incrementar <code>i</code>, ou condição que nunca fica falsa. Pressione Ctrl+C para abortar.</li>
        <li><strong>Off-by-one:</strong> <code>i &lt;= length</code> em vez de <code>i &lt; length</code> acessa um índice inexistente. Para arrays, regra: índices vão de 0 a <code>Length - 1</code>.</li>
        <li><strong>Modificar coleção em <code>foreach</code>:</strong> lança exceção. Itere por cópia ou use <code>for</code> reverso.</li>
        <li><strong>Variável de loop capturada por closure (em delegates):</strong> em versões antigas do C#, todas as iterações compartilhavam a mesma variável. Nas modernas, <code>foreach</code> declara nova variável a cada iteração — em <code>for</code>, declare a cópia local explicitamente.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>for</code> tem inicialização, condição e incremento na cabeça.</li>
        <li><code>while</code> testa antes; <code>do-while</code> testa depois (executa ao menos uma vez).</li>
        <li><code>foreach</code> é a forma idiomática para iterar coleções.</li>
        <li><code>break</code> sai do loop; <code>continue</code> pula para a próxima iteração.</li>
        <li>Cuidado com loops infinitos e índices fora do array.</li>
        <li>Não modifique a coleção dentro de um <code>foreach</code> sobre ela mesma.</li>
      </ul>
    </PageContainer>
  );
}
