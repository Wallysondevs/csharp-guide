import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AggregateException() {
  return (
    <PageContainer
      title="AggregateException: quando várias falham juntas"
      subtitle="Em paralelismo, raramente quebra só uma coisa. O .NET tem um envelope especial para empacotar todas as falhas de uma vez."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Quando você dispara muitas tarefas em paralelo, mais de uma pode falhar simultaneamente. O .NET não pode "escolher" qual exceção propagar — então embrulha <em>todas</em> em um envelope chamado <code>AggregateException</code>. Pense numa caixa de correspondência onde várias cartas chegam juntas: você recebe a caixa, e dentro dela estão os envelopes individuais. Esse padrão aparece em <code>Task.WhenAll</code>, <code>Parallel.For</code>, <code>Parallel.ForEachAsync</code> e qualquer API que rode N coisas concorrentemente.
      </p>

      <h2>O cenário: Task.WhenAll com várias falhas</h2>
      <p>
        <code>Task.WhenAll</code> espera todas as tarefas terminarem. Se nenhuma falhar, segue normal. Se uma falhar, a tarefa resultante fica em estado <em>Faulted</em>. Mas e se duas, três, dez falharem? Todas viram inner exceptions de uma única <code>AggregateException</code>.
      </p>
      <pre><code>{`Task t1 = Task.Run(() => throw new InvalidOperationException("erro 1"));
Task t2 = Task.Run(() => throw new ArgumentException("erro 2"));
Task t3 = Task.Run(() => throw new TimeoutException("erro 3"));

Task todas = Task.WhenAll(t1, t2, t3);

try { await todas; }
catch (Exception ex)
{
    Console.WriteLine(ex.GetType().Name);   // InvalidOperationException
}

// Mas a Task em si carrega TODAS:
Console.WriteLine(todas.Exception?.InnerExceptions.Count);  // 3`}</code></pre>

      <h2>O comportamento curioso do <code>await</code></h2>
      <p>
        Quando você usa <code>await</code> em uma Task com <code>AggregateException</code>, o C# <strong>desembrulha apenas a primeira</strong> exceção interna. Isso é proposital — para que <code>try/catch</code> em código async pareça com <code>try/catch</code> normal. As demais exceções ficam "escondidas" na Task original.
      </p>
      <pre><code>{`// ❌ Você só vê a primeira; as outras se perdem se ignorar a Task
try
{
    await Task.WhenAll(t1, t2, t3);
}
catch (Exception ex)
{
    // ex é UMA das três (geralmente a primeira a falhar)
}

// ✅ Para ver todas, inspecione a Task antes/depois do await
var tudo = Task.WhenAll(t1, t2, t3);
try { await tudo; }
catch
{
    foreach (var inner in tudo.Exception!.InnerExceptions)
        Console.WriteLine(inner.Message);
}`}</code></pre>

      <AlertBox type="warning" title="Pegadinha frequente">
        Quem assume que <code>await Task.WhenAll(...)</code> joga uma <code>AggregateException</code> se decepciona: joga só a primeira inner. Para enxergar tudo, capture a referência à Task <strong>antes</strong> do await e depois acesse <code>.Exception.InnerExceptions</code>.
      </AlertBox>

      <h2>Inspecionando inner exceptions</h2>
      <p>
        A propriedade <code>InnerExceptions</code> (no plural — diferente da <code>InnerException</code> singular de qualquer <code>Exception</code>) é a chave. Você itera para logar tudo:
      </p>
      <pre><code>{`try
{
    Parallel.For(0, 100, i =>
    {
        if (i % 7 == 0)
            throw new InvalidOperationException($"falhei em {i}");
    });
}
catch (AggregateException agg)
{
    Console.WriteLine($"Total de falhas: {agg.InnerExceptions.Count}");
    foreach (var ex in agg.InnerExceptions)
        Console.WriteLine($" - {ex.Message}");
}`}</code></pre>
      <p>
        <code>Parallel.For</code> sempre joga <code>AggregateException</code> diretamente — ao contrário de <code>Task.WhenAll</code> com <code>await</code>. Aqui não há desempacotamento mágico: você recebe a caixa fechada e abre.
      </p>

      <h2><code>Flatten()</code>: achatando árvores aninhadas</h2>
      <p>
        Em pipelines complexos, uma <code>AggregateException</code> pode conter outra como inner — formando uma árvore. <code>Flatten()</code> percorre recursivamente e devolve uma única <code>AggregateException</code> com todas as folhas (exceções não-aggregate).
      </p>
      <pre><code>{`// Estrutura aninhada:
// AggregateException
//   ├─ AggregateException
//   │   ├─ IOException
//   │   └─ TimeoutException
//   └─ ArgumentException

AggregateException agg = ObterErrosAninhados();
AggregateException plano = agg.Flatten();

// agora plano.InnerExceptions tem 3 itens, todos não-aggregate
foreach (var inner in plano.InnerExceptions)
    Console.WriteLine(inner.GetType().Name);
// IOException
// TimeoutException
// ArgumentException`}</code></pre>

      <h2><code>Handle()</code>: tratar algumas, relançar o resto</h2>
      <p>
        O método <code>Handle</code> recebe um predicado: para cada inner exception, você decide se ela foi "tratada" devolvendo <code>true</code>. Quem sobrar é re-lançada em uma nova <code>AggregateException</code>.
      </p>
      <pre><code>{`try
{
    Parallel.ForEach(arquivos, ProcessarArquivo);
}
catch (AggregateException agg)
{
    agg.Handle(ex =>
    {
        if (ex is FileNotFoundException fnf)
        {
            Logger.Warn($"Arquivo sumiu: {fnf.FileName}");
            return true;     // tratada — não relança
        }
        return false;        // não sei lidar → vai relançar
    });
}`}</code></pre>
      <p>
        Útil quando você espera <em>algumas</em> falhas conhecidas (ex: arquivos opcionais) mas quer que o resto exploda visivelmente.
      </p>

      <h2>Quando você verá AggregateException na vida real</h2>
      <ul>
        <li><strong><code>Parallel.For</code> e <code>Parallel.ForEach</code>:</strong> sempre — mesmo que só uma iteração falhe.</li>
        <li><strong><code>Task.Wait()</code> e <code>Task.Result</code> síncronos:</strong> jogam <code>AggregateException</code> direto (sem desempacotar como o <code>await</code>).</li>
        <li><strong><code>Task.WhenAll</code> com várias falhas:</strong> a Task fica com aggregate; o <code>await</code> desempacota só a primeira.</li>
        <li><strong>PLINQ (<code>AsParallel()</code>):</strong> erros em queries paralelas viram aggregate.</li>
      </ul>

      <AlertBox type="info" title="Task.WhenAll vs Task.WhenAny">
        <code>WhenAll</code> espera todas e agrega falhas. <code>WhenAny</code> retorna assim que <em>uma</em> termina (sucesso ou falha) — não há aggregate. Use <code>WhenAny</code> para "qual responde primeiro" (race), não para "rodar várias".
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Confiar que <code>await</code> joga aggregate:</strong> joga só a primeira inner. Inspecione <code>task.Exception</code> para ver tudo.</li>
        <li><strong>Esquecer <code>Flatten()</code>:</strong> em árvores aninhadas, você itera só o topo e perde detalhes.</li>
        <li><strong>Não logar todas as inner:</strong> ver "uma falha em 50 paralelas" sem detalhes inutiliza a investigação.</li>
        <li><strong>Usar <code>.Result</code> em código async:</strong> além de bloquear, embrulha em aggregate o que <code>await</code> entregaria limpo.</li>
        <li><strong>Capturar <code>Exception</code> e tentar acessar <code>InnerExceptions</code>:</strong> só <code>AggregateException</code> tem essa propriedade no plural.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>AggregateException</code> empacota várias falhas concorrentes.</li>
        <li><code>InnerExceptions</code> (plural!) lista todas; <code>InnerException</code> singular dá só a primeira.</li>
        <li><code>await</code> em <code>Task.WhenAll</code> desembrulha apenas a primeira — capture a Task antes para ver tudo.</li>
        <li><code>Flatten()</code> achata árvores; <code>Handle(pred)</code> trata algumas e relança o resto.</li>
        <li><code>Parallel.For</code> e <code>.Result</code>/<code>.Wait()</code> sempre lançam aggregate diretamente.</li>
        <li>Sempre logue <strong>todas</strong> as inner exceptions.</li>
      </ul>
    </PageContainer>
  );
}
