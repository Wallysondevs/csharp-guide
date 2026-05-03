import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ThreadsVsTasks() {
  return (
    <PageContainer
      title="Threads vs Tasks: por que usar Task hoje"
      subtitle="Entendendo a diferença entre o modelo antigo de threads manuais e a abstração moderna de tarefas."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Para entender concorrência em C#, é preciso voltar ao básico: o que é uma <strong>thread</strong>? Pense num restaurante. O programa é o restaurante, o processo é o prédio, e cada thread é um <em>garçom</em> que pode atender mesas em paralelo. Quanto mais garçons, mais clientes simultâneos — mas cada garçom contratado custa caro, ocupa espaço e precisa de coordenação. O .NET historicamente expôs threads diretamente via a classe <code>System.Threading.Thread</code>. Hoje, porém, a recomendação é usar <strong>Task</strong> — uma abstração de mais alto nível. Vamos entender por quê.
      </p>

      <h2>A classe Thread: poder bruto</h2>
      <p>
        <code>Thread</code> dá controle total: você cria, define prioridade, pausa, aborta. Custo? Cada thread reserva ~1 MB de memória (stack), demora milissegundos para criar e morre depois de uma única tarefa. Isso é caro:
      </p>
      <pre><code>{`using System.Threading;

// Cria uma thread e dá um trabalho a ela
var t = new Thread(() =>
{
    Console.WriteLine($"Rodando na thread {Thread.CurrentThread.ManagedThreadId}");
    Thread.Sleep(2000); // simula trabalho demorado
    Console.WriteLine("Terminei!");
});

t.Start();   // dispara em paralelo
t.Join();    // bloqueia o caller até a thread terminar`}</code></pre>
      <p>
        O modelo é direto, mas você é responsável por <em>tudo</em>: criar, encerrar, capturar exceções, devolver resultados, sincronizar acesso a dados compartilhados. Em programas com milhares de operações pequenas (típico de servidor web), criar uma thread por requisição é proibitivo.
      </p>

      <h2>O ThreadPool: reaproveitando garçons</h2>
      <p>
        A solução clássica do .NET é o <strong>ThreadPool</strong>: um conjunto pré-criado de threads que ficam "esperando trabalho". Você submete uma função; o pool escolhe uma thread livre, executa, e devolve a thread ao pool. Isso elimina o custo de criação repetida.
      </p>
      <pre><code>{`ThreadPool.QueueUserWorkItem(_ =>
{
    Console.WriteLine("Trabalho rodando no ThreadPool");
});`}</code></pre>
      <p>
        Mas a API é primitiva: não há jeito limpo de saber quando terminou, recuperar resultado ou tratar exceção. É aí que entra <code>Task</code>.
      </p>

      <h2>Task: a abstração moderna</h2>
      <p>
        Uma <code>Task</code> representa uma <em>operação que vai terminar no futuro</em> — um "recibo" do trabalho. Ela usa o ThreadPool por baixo dos panos, mas oferece uma API rica: composição (<code>ContinueWith</code>, <code>WhenAll</code>), retorno de valor (<code>Task&lt;T&gt;</code>), exceção propagada e, principalmente, integração com <code>async</code>/<code>await</code>.
      </p>
      <pre><code>{`using System.Threading.Tasks;

// Task.Run agenda uma função no ThreadPool e devolve uma Task
Task<int> calculo = Task.Run(() =>
{
    int soma = 0;
    for (int i = 0; i < 1_000_000; i++) soma += i;
    return soma;
});

int resultado = await calculo; // espera SEM bloquear thread
Console.WriteLine(resultado);`}</code></pre>

      <AlertBox type="info" title="Recibo, não execução">
        Uma analogia: <code>Task</code> é como o ticket que você recebe ao deixar um casaco no chapelaria. O casaco está sendo guardado em paralelo. Quando você quiser, troca o ticket pelo casaco — esse "trocar" é o <code>await</code>.
      </AlertBox>

      <h2>Task.Run: quando faz sentido</h2>
      <p>
        Use <code>Task.Run</code> para <strong>jogar trabalho CPU-intensivo no ThreadPool</strong> e não travar a thread atual (especialmente em apps com UI). Não use para chamar APIs já assíncronas:
      </p>
      <pre><code>{`// CERTO: trabalho síncrono pesado
var hash = await Task.Run(() => CalcularHashEnorme(arquivo));

// ERRADO: HttpClient.GetStringAsync já é assíncrono
var html = await Task.Run(() => http.GetStringAsync(url)); // desperdício!

// CERTO:
var html = await http.GetStringAsync(url);`}</code></pre>

      <h2>Task vs Thread: comparação direta</h2>
      <table>
        <thead>
          <tr><th>Aspecto</th><th>Thread</th><th>Task</th></tr>
        </thead>
        <tbody>
          <tr><td>Custo de criação</td><td>Alto (~1 MB)</td><td>Baixo (reusa pool)</td></tr>
          <tr><td>Retorno de valor</td><td>Manual</td><td><code>Task&lt;T&gt;</code></td></tr>
          <tr><td>Exceções</td><td>Você captura</td><td>Re-lançada no <code>await</code></td></tr>
          <tr><td>Composição</td><td>Manual</td><td><code>WhenAll</code>, <code>WhenAny</code></td></tr>
          <tr><td>Cancelamento</td><td>Sem padrão</td><td><code>CancellationToken</code></td></tr>
          <tr><td>I/O assíncrono</td><td>Bloqueia</td><td>Libera a thread (<code>await</code>)</td></tr>
        </tbody>
      </table>

      <h2>Task não é igual a thread</h2>
      <p>
        Confusão comum: "<em>se eu criar 1.000 Tasks, vou ter 1.000 threads?</em>" Não! Tasks com I/O assíncrono (rede, disco, banco) usam <strong>zero threads enquanto esperam</strong>. Tasks CPU-bound usam threads do pool conforme disponibilidade — tipicamente uma por núcleo lógico. O ThreadPool ajusta dinamicamente.
      </p>
      <pre><code>{`// 1.000 requisições HTTP simultâneas — usa só algumas threads
var tarefas = Enumerable.Range(1, 1000)
    .Select(i => http.GetStringAsync($"https://api.exemplo.com/items/{i}"));

string[] resultados = await Task.WhenAll(tarefas);`}</code></pre>

      <AlertBox type="warning" title="Quando ainda usar Thread">
        Há casos legítimos: criar uma thread <em>dedicada</em> para um loop infinito de processamento prioritário, configurar prioridade do sistema operacional, ou interagir com APIs nativas que exigem thread STA. Para isso, <code>new Thread(...) {`{ IsBackground = true }`}</code> ainda faz sentido.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Criar Thread por requisição:</strong> em servidores web, isso esgota memória rapidamente. Use Tasks.</li>
        <li><strong>Embrulhar tudo em Task.Run:</strong> APIs já assíncronas não precisam disso; só dobra a indireção.</li>
        <li><strong>Esperar com <code>.Result</code> ou <code>.Wait()</code>:</strong> bloqueia a thread, anulando o ganho de assincronia. Use sempre <code>await</code>.</li>
        <li><strong>Confundir paralelismo com assincronia:</strong> assíncrono é "não bloqueia esperando"; paralelo é "executa em mais de um núcleo ao mesmo tempo". Tasks fazem ambos, dependendo do uso.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Thread</code> é a primitiva crua e cara; raramente usada hoje.</li>
        <li><code>ThreadPool</code> reaproveita threads, mas tem API pobre.</li>
        <li><code>Task</code> abstrai o ThreadPool com retorno, composição e exceções limpas.</li>
        <li><code>Task.Run</code> serve para CPU-bound; não use em código que já é assíncrono.</li>
        <li>Tasks de I/O usam <em>zero</em> threads enquanto esperam — escala muito mais que threads.</li>
      </ul>
    </PageContainer>
  );
}
