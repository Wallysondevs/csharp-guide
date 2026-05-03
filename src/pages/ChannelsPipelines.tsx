import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ChannelsPipelines() {
  return (
    <PageContainer
      title="Channels: produtor-consumidor moderno em C#"
      subtitle="A forma assíncrona, eficiente e idiomática de passar dados entre partes do seu programa."
      difficulty="avancado"
      timeToRead="12 min"
    >
      <p>
        Imagine uma esteira de sushi: o chef vai colocando pratos na esteira (produtor), e os clientes vão pegando conforme passam (consumidores). Os dois lados trabalham no próprio ritmo, e a esteira amortece picos. Em código, esse padrão é chamado de <strong>produtor-consumidor</strong>. O .NET tem várias ferramentas para isso, mas a mais moderna e idiomática é <strong>System.Threading.Channels</strong> (a partir do .NET Core 3.0). Channels substituem com vantagem o antigo <code>BlockingCollection</code>: são totalmente assíncronos, performáticos e desenhados para o mundo <code>async/await</code>.
      </p>

      <h2>O que é um Channel</h2>
      <p>
        Um <code>Channel&lt;T&gt;</code> é uma fila thread-safe com duas pontas:
      </p>
      <ul>
        <li><strong>Writer</strong>: lado de quem escreve (produtor).</li>
        <li><strong>Reader</strong>: lado de quem lê (consumidor).</li>
      </ul>
      <p>
        Você cria o canal, distribui o <code>Writer</code> para quem produz e o <code>Reader</code> para quem consome. Cada lado pode ser uma ou várias tarefas async — o canal coordena tudo sem locks explícitos.
      </p>

      <h2>Channel ilimitado vs limitado</h2>
      <p>
        Há duas variedades:
      </p>
      <pre><code>{`using System.Threading.Channels;

// Ilimitado: aceita quantos itens caibam na memória
var canal = Channel.CreateUnbounded<int>();

// Limitado: capacidade máxima; se cheio, escritor espera
var limitado = Channel.CreateBounded<int>(new BoundedChannelOptions(100)
{
    FullMode = BoundedChannelFullMode.Wait // ou DropOldest, DropNewest, DropWrite
});`}</code></pre>
      <p>
        Use o <strong>limitado</strong> em produção: ele aplica <em>backpressure</em> — se o consumidor está lento, o produtor segura o ritmo, evitando que a memória estoure.
      </p>

      <h2>Escrevendo: WriteAsync e Complete</h2>
      <p>
        O produtor usa o <code>Writer</code>:
      </p>
      <pre><code>{`var canal = Channel.CreateUnbounded<string>();

// Produtor
_ = Task.Run(async () =>
{
    for (int i = 0; i < 10; i++)
    {
        await canal.Writer.WriteAsync($"mensagem {i}");
        await Task.Delay(100); // simula trabalho variado
    }
    // Sinaliza fim — sem isso, o Reader fica esperando para sempre
    canal.Writer.Complete();
});`}</code></pre>
      <p>
        <code>Complete()</code> é fundamental: ele avisa "acabou, não vai vir mais nada". Sem essa sinalização, o consumidor com <code>ReadAllAsync</code> fica preso para sempre.
      </p>

      <AlertBox type="info" title="Múltiplos produtores">
        Vários produtores podem escrever no mesmo Writer simultaneamente. Mas só <em>um</em> deles deve chamar <code>Complete()</code>, no fim de tudo. Use uma <code>Task.WhenAll(...)</code> dos produtores e chame Complete depois.
      </AlertBox>

      <h2>Lendo: ReadAllAsync com await foreach</h2>
      <p>
        Do lado do consumidor, o jeito moderno é iterar com <code>await foreach</code>:
      </p>
      <pre><code>{`// Consumidor
await foreach (var msg in canal.Reader.ReadAllAsync())
{
    Console.WriteLine($"Recebi: {msg}");
}
Console.WriteLine("Canal fechado.");`}</code></pre>
      <p>
        <code>ReadAllAsync</code> devolve um <code>IAsyncEnumerable&lt;T&gt;</code>. O loop pausa naturalmente quando não há item disponível (sem queimar CPU) e termina quando o Writer chama <code>Complete</code>.
      </p>

      <h2>Exemplo completo: log assíncrono</h2>
      <p>
        Um caso clássico: várias partes do app querem registrar mensagens, mas escrever em arquivo é lento (bloquearia o processamento principal). Solução — um <em>logger assíncrono</em> com Channel:
      </p>
      <pre><code>{`public class LoggerAsync : IAsyncDisposable
{
    private readonly Channel<string> _canal;
    private readonly Task _consumidor;
    private readonly StreamWriter _arq;

    public LoggerAsync(string caminho)
    {
        _arq = new StreamWriter(caminho, append: true) { AutoFlush = true };
        _canal = Channel.CreateBounded<string>(new BoundedChannelOptions(10_000)
        {
            FullMode = BoundedChannelFullMode.DropOldest
        });
        _consumidor = ConsumirAsync();
    }

    public ValueTask LogAsync(string msg) =>
        _canal.Writer.WriteAsync($"[{DateTime.Now:HH:mm:ss}] {msg}");

    private async Task ConsumirAsync()
    {
        await foreach (var linha in _canal.Reader.ReadAllAsync())
            await _arq.WriteLineAsync(linha);
    }

    public async ValueTask DisposeAsync()
    {
        _canal.Writer.Complete();
        await _consumidor;       // espera processar tudo pendente
        await _arq.DisposeAsync();
    }
}`}</code></pre>
      <p>
        Quem chama <code>LogAsync</code> volta em microssegundos. Uma única tarefa em background grava no disco em ritmo constante. Se o disco engasgar, mensagens antigas são descartadas (graças a <code>DropOldest</code>) — o app continua respondendo.
      </p>

      <h2>Por que substituir BlockingCollection</h2>
      <p>
        Antes do .NET Core 3.0, o padrão era <code>BlockingCollection&lt;T&gt;</code>. Problemas:
      </p>
      <ul>
        <li>API <em>bloqueante</em> — <code>Take()</code> congela a thread esperando item.</li>
        <li>Não funciona bem com <code>async/await</code>.</li>
        <li>Sem suporte direto a backpressure assíncrono.</li>
      </ul>
      <p>
        Channels resolvem tudo isso: <code>WriteAsync</code> e <code>ReadAsync</code> liberam a thread enquanto esperam.
      </p>

      <h2>TryWrite: tentar sem bloquear</h2>
      <p>
        Para escritores que não podem esperar (caminho ultra-quente), há <code>TryWrite</code>:
      </p>
      <pre><code>{`// Tenta enfileirar; se falhar, descarta sem bloquear
if (!canal.Writer.TryWrite(item))
{
    metricas.Increment("descartados");
}`}</code></pre>

      <h2>SingleReader / SingleWriter: micro-otimização</h2>
      <p>
        Se você sabe que só um produtor e um consumidor existem, configure isso para o canal evitar locks internos:
      </p>
      <pre><code>{`var canal = Channel.CreateBounded<int>(new BoundedChannelOptions(1024)
{
    SingleReader = true,
    SingleWriter = true,
    FullMode = BoundedChannelFullMode.Wait
});`}</code></pre>

      <AlertBox type="warning" title="Não esqueça Complete()">
        O erro #1 com Channels é esquecer <code>Writer.Complete()</code>. O consumidor fica para sempre esperando o próximo item. Em apps reais, registre um <code>try/finally</code> no produtor.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>Complete</code>:</strong> consumidor "trava" no <code>await foreach</code> esperando algo que nunca vem.</li>
        <li><strong>Múltiplos produtores chamando Complete:</strong> dispara exceção. Use coordenação.</li>
        <li><strong>Canal ilimitado em produção:</strong> se o consumidor falhar/parar, memória explode. Prefira limitado.</li>
        <li><strong>Misturar Channel com Task.Run para I/O</strong> sem necessidade: a beleza dos Channels é que tudo já é assíncrono.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Channel&lt;T&gt;</code> implementa produtor-consumidor com API assíncrona.</li>
        <li><code>CreateUnbounded</code> vs <code>CreateBounded</code>: prefira limitado em produção.</li>
        <li><code>Writer.WriteAsync</code> + <code>Writer.Complete</code> do lado produtor.</li>
        <li><code>Reader.ReadAllAsync</code> com <code>await foreach</code> do lado consumidor.</li>
        <li>Substitui <code>BlockingCollection</code> com performance e ergonomia superiores.</li>
        <li><code>SingleReader/SingleWriter</code> otimizam casos específicos.</li>
      </ul>
    </PageContainer>
  );
}
