import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TaskOfT() {
  return (
    <PageContainer
      title="Task e Task<T>: tipos de retorno assíncronos"
      subtitle="Conhecendo os três tipos canônicos de retorno em métodos async e quando usar cada um."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Em C# síncrono, um método ou retorna algo (<code>int</code>, <code>string</code>) ou retorna <code>void</code> (nada). Em código assíncrono a história é parecida, mas com uma camada extra: o resultado vem "embrulhado" em um <strong>Task</strong>. Pense no Task como uma encomenda em trânsito — você ganha um código de rastreamento agora; o produto chega depois. As três formas mais comuns de retorno assíncrono são <code>Task</code>, <code>Task&lt;T&gt;</code> e <code>ValueTask&lt;T&gt;</code>. Saber qual usar evita bugs e melhora a performance.
      </p>

      <h2>Task: o "void assíncrono"</h2>
      <p>
        Quando seu método assíncrono <em>faz</em> algo mas não devolve valor, retorne <code>Task</code>. Ele é o equivalente assíncrono de <code>void</code>:
      </p>
      <pre><code>{`// Salva no disco e não devolve nada
public async Task SalvarLogAsync(string mensagem)
{
    await File.AppendAllTextAsync("app.log", mensagem + "\\n");
    // método termina aqui; chamador pode 'await' para saber que acabou
}

// Uso
await SalvarLogAsync("usuário 42 fez login");`}</code></pre>
      <p>
        O <code>await</code> no chamador serve para esperar o término <em>e</em> propagar exceções. Sem ele, o método dispara em segundo plano (chamado de "fire and forget") — quase sempre uma má ideia em produção, porque erros somem.
      </p>

      <h2>Task&lt;T&gt;: retornando um valor</h2>
      <p>
        Quando há resultado, declare <code>Task&lt;T&gt;</code>, onde <code>T</code> é o tipo concreto. <code>T</code> em C# é um <em>parâmetro genérico</em> — um espaço reservado para qualquer tipo:
      </p>
      <pre><code>{`public async Task<int> ContarLinhasAsync(string caminho)
{
    string[] linhas = await File.ReadAllLinesAsync(caminho);
    return linhas.Length; // valor "embrulhado" automaticamente em Task<int>
}

// Uso
int total = await ContarLinhasAsync("dados.csv");
Console.WriteLine($"{total} linhas");`}</code></pre>
      <p>
        Note que dentro do método você escreve <code>return linhas.Length;</code> — um simples inteiro. O compilador embrulha em <code>Task&lt;int&gt;</code> automaticamente. Quem chama desempacota com <code>await</code>, recebendo o <code>int</code> diretamente.
      </p>

      <AlertBox type="info" title="Por que não retornar T diretamente?">
        Porque o resultado <em>ainda não existe</em> quando o método retorna! O Task é o "vale-resultado": ele carrega o estado (em andamento, concluído, falhou) e, quando completa, o valor.
      </AlertBox>

      <h2>ValueTask&lt;T&gt;: otimizando o caso rápido</h2>
      <p>
        <code>Task&lt;T&gt;</code> é uma classe — alocada no heap. Em métodos chamados <em>milhões de vezes</em> que muitas vezes terminam <em>sincronamente</em> (cache hit, valor já disponível), essa alocação vira gargalo. <code>ValueTask&lt;T&gt;</code> é uma struct que evita alocação no caminho rápido:
      </p>
      <pre><code>{`private readonly Dictionary<int, string> cache = new();

public ValueTask<string> ObterUsuarioAsync(int id)
{
    if (cache.TryGetValue(id, out var nome))
    {
        // Caminho síncrono: nada de heap
        return new ValueTask<string>(nome);
    }
    // Caminho assíncrono: delega para uma Task normal
    return new ValueTask<string>(BuscarNoBancoAsync(id));
}`}</code></pre>
      <p>
        Use <code>ValueTask</code> só quando medir mostrar ganho real. Tem regras chatas: não pode ser <code>await</code>-ado mais de uma vez, não pode ser passado para <code>Task.WhenAll</code> sem <code>.AsTask()</code>. Para 99% dos casos, <code>Task</code>/<code>Task&lt;T&gt;</code> é o certo.
      </p>

      <h2>Tasks já completas: FromResult e CompletedTask</h2>
      <p>
        Às vezes você implementa uma interface assíncrona, mas seu método <em>não</em> tem nada para esperar — talvez seja um stub, ou o valor já está em memória. Em vez de criar um método <code>async</code> que retorna imediatamente (gerando overhead da state machine), use:
      </p>
      <pre><code>{`// Para Task<T> já com valor pronto
public Task<int> ObterIdadeAsync() => Task.FromResult(42);

// Para Task sem valor já completa
public Task LimparAsync()
{
    cache.Clear();
    return Task.CompletedTask;
}

// Para sinalizar erro sem método async
public Task<string> FalharAsync() =>
    Task.FromException<string>(new InvalidOperationException("oops"));`}</code></pre>

      <h2>Tratamento de exceções</h2>
      <p>
        Em métodos <code>async</code>, exceções são <strong>capturadas</strong> e armazenadas no Task. Quem fizer <code>await</code> recebe a exceção <em>relançada</em>. Isso é diferente de quem usa <code>.Result</code> ou <code>.Wait()</code>, que recebe um <code>AggregateException</code> embrulhador:
      </p>
      <pre><code>{`async Task<int> DividirAsync(int a, int b)
{
    await Task.Delay(10);
    return a / b; // pode lançar DivideByZeroException
}

try
{
    int r = await DividirAsync(10, 0);
}
catch (DivideByZeroException ex)
{
    // capturado limpinho, sem AggregateException
    Console.WriteLine("Não dá pra dividir por zero");
}`}</code></pre>

      <AlertBox type="warning" title="Tasks não observadas">
        Se uma Task falha e <em>nunca</em> é await-ada, a exceção fica esquecida. Em versões antigas do .NET isso derrubava o processo no GC; hoje só dispara o evento <code>TaskScheduler.UnobservedTaskException</code>. Sempre await suas Tasks (ou capture com <code>ContinueWith</code>).
      </AlertBox>

      <h2>WhenAll e WhenAny: combinando tasks</h2>
      <p>
        Quando você dispara várias operações concorrentes, pode esperar todas ou a primeira:
      </p>
      <pre><code>{`Task<string> a = http.GetStringAsync("https://api1.com");
Task<string> b = http.GetStringAsync("https://api2.com");

// Espera todas terminarem; recebe array
string[] ambos = await Task.WhenAll(a, b);

// Espera a primeira que terminar
Task<string> primeira = await Task.WhenAny(a, b);
string conteudo = await primeira;`}</code></pre>

      <h2>async void: evite</h2>
      <p>
        Existe um quarto tipo de retorno: <code>async void</code>. Permitido apenas em <strong>handlers de evento</strong> (<code>void btn_Click(...)</code>). Em qualquer outro lugar é perigoso: exceções não podem ser capturadas pelo chamador e podem derrubar o processo:
      </p>
      <pre><code>{`// ERRADO em código de aplicação
public async void ProcessarAsync() { await Task.Delay(100); throw new("boom"); }

// CERTO
public async Task ProcessarAsync() { await Task.Delay(100); throw new("boom"); }`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Retornar <code>Task&lt;Task&lt;T&gt;&gt;</code> sem perceber:</strong> acontece quando você esquece o <code>await</code> dentro de um método async. Habilite avisos do compilador.</li>
        <li><strong>Usar ValueTask sem necessidade:</strong> complexidade extra sem ganho. Comece com Task.</li>
        <li><strong>async void fora de handler:</strong> bugs intermitentes, processo derruba. Use Task.</li>
        <li><strong>Esquecer <code>await</code>:</strong> a Task fica órfã, sua operação nem termina, exceção some.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Task</code> = método async sem valor de retorno (equivalente assíncrono de void).</li>
        <li><code>Task&lt;T&gt;</code> = método async que devolve um valor do tipo T.</li>
        <li><code>ValueTask&lt;T&gt;</code> = otimização para caminhos frequentemente síncronos.</li>
        <li><code>Task.FromResult</code>, <code>Task.CompletedTask</code> e <code>Task.FromException</code> evitam state machine quando não há await.</li>
        <li>Exceções em métodos <code>async</code> são propagadas no <code>await</code>, sem AggregateException.</li>
      </ul>
    </PageContainer>
  );
}
