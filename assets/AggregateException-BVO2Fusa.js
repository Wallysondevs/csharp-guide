import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"AggregateException: quando várias falham juntas",subtitle:"Em paralelismo, raramente quebra só uma coisa. O .NET tem um envelope especial para empacotar todas as falhas de uma vez.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:['Quando você dispara muitas tarefas em paralelo, mais de uma pode falhar simultaneamente. O .NET não pode "escolher" qual exceção propagar — então embrulha ',e.jsx("em",{children:"todas"})," em um envelope chamado ",e.jsx("code",{children:"AggregateException"}),". Pense numa caixa de correspondência onde várias cartas chegam juntas: você recebe a caixa, e dentro dela estão os envelopes individuais. Esse padrão aparece em ",e.jsx("code",{children:"Task.WhenAll"}),", ",e.jsx("code",{children:"Parallel.For"}),", ",e.jsx("code",{children:"Parallel.ForEachAsync"})," e qualquer API que rode N coisas concorrentemente."]}),e.jsx("h2",{children:"O cenário: Task.WhenAll com várias falhas"}),e.jsxs("p",{children:[e.jsx("code",{children:"Task.WhenAll"})," espera todas as tarefas terminarem. Se nenhuma falhar, segue normal. Se uma falhar, a tarefa resultante fica em estado ",e.jsx("em",{children:"Faulted"}),". Mas e se duas, três, dez falharem? Todas viram inner exceptions de uma única ",e.jsx("code",{children:"AggregateException"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`Task t1 = Task.Run(() => throw new InvalidOperationException("erro 1"));
Task t2 = Task.Run(() => throw new ArgumentException("erro 2"));
Task t3 = Task.Run(() => throw new TimeoutException("erro 3"));

Task todas = Task.WhenAll(t1, t2, t3);

try { await todas; }
catch (Exception ex)
{
    Console.WriteLine(ex.GetType().Name);   // InvalidOperationException
}

// Mas a Task em si carrega TODAS:
Console.WriteLine(todas.Exception?.InnerExceptions.Count);  // 3`})}),e.jsxs("h2",{children:["O comportamento curioso do ",e.jsx("code",{children:"await"})]}),e.jsxs("p",{children:["Quando você usa ",e.jsx("code",{children:"await"})," em uma Task com ",e.jsx("code",{children:"AggregateException"}),", o C# ",e.jsx("strong",{children:"desembrulha apenas a primeira"})," exceção interna. Isso é proposital — para que ",e.jsx("code",{children:"try/catch"})," em código async pareça com ",e.jsx("code",{children:"try/catch"}),' normal. As demais exceções ficam "escondidas" na Task original.']}),e.jsx("pre",{children:e.jsx("code",{children:`// ❌ Você só vê a primeira; as outras se perdem se ignorar a Task
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
}`})}),e.jsxs(a,{type:"warning",title:"Pegadinha frequente",children:["Quem assume que ",e.jsx("code",{children:"await Task.WhenAll(...)"})," joga uma ",e.jsx("code",{children:"AggregateException"})," se decepciona: joga só a primeira inner. Para enxergar tudo, capture a referência à Task ",e.jsx("strong",{children:"antes"})," do await e depois acesse ",e.jsx("code",{children:".Exception.InnerExceptions"}),"."]}),e.jsx("h2",{children:"Inspecionando inner exceptions"}),e.jsxs("p",{children:["A propriedade ",e.jsx("code",{children:"InnerExceptions"})," (no plural — diferente da ",e.jsx("code",{children:"InnerException"})," singular de qualquer ",e.jsx("code",{children:"Exception"}),") é a chave. Você itera para logar tudo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`try
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
}`})}),e.jsxs("p",{children:[e.jsx("code",{children:"Parallel.For"})," sempre joga ",e.jsx("code",{children:"AggregateException"})," diretamente — ao contrário de ",e.jsx("code",{children:"Task.WhenAll"})," com ",e.jsx("code",{children:"await"}),". Aqui não há desempacotamento mágico: você recebe a caixa fechada e abre."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"Flatten()"}),": achatando árvores aninhadas"]}),e.jsxs("p",{children:["Em pipelines complexos, uma ",e.jsx("code",{children:"AggregateException"})," pode conter outra como inner — formando uma árvore. ",e.jsx("code",{children:"Flatten()"})," percorre recursivamente e devolve uma única ",e.jsx("code",{children:"AggregateException"})," com todas as folhas (exceções não-aggregate)."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Estrutura aninhada:
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
// ArgumentException`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"Handle()"}),": tratar algumas, relançar o resto"]}),e.jsxs("p",{children:["O método ",e.jsx("code",{children:"Handle"}),' recebe um predicado: para cada inner exception, você decide se ela foi "tratada" devolvendo ',e.jsx("code",{children:"true"}),". Quem sobrar é re-lançada em uma nova ",e.jsx("code",{children:"AggregateException"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`try
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
}`})}),e.jsxs("p",{children:["Útil quando você espera ",e.jsx("em",{children:"algumas"})," falhas conhecidas (ex: arquivos opcionais) mas quer que o resto exploda visivelmente."]}),e.jsx("h2",{children:"Quando você verá AggregateException na vida real"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:[e.jsx("code",{children:"Parallel.For"})," e ",e.jsx("code",{children:"Parallel.ForEach"}),":"]})," sempre — mesmo que só uma iteração falhe."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:[e.jsx("code",{children:"Task.Wait()"})," e ",e.jsx("code",{children:"Task.Result"})," síncronos:"]})," jogam ",e.jsx("code",{children:"AggregateException"})," direto (sem desempacotar como o ",e.jsx("code",{children:"await"}),")."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:[e.jsx("code",{children:"Task.WhenAll"})," com várias falhas:"]})," a Task fica com aggregate; o ",e.jsx("code",{children:"await"})," desempacota só a primeira."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["PLINQ (",e.jsx("code",{children:"AsParallel()"}),"):"]})," erros em queries paralelas viram aggregate."]})]}),e.jsxs(a,{type:"info",title:"Task.WhenAll vs Task.WhenAny",children:[e.jsx("code",{children:"WhenAll"})," espera todas e agrega falhas. ",e.jsx("code",{children:"WhenAny"})," retorna assim que ",e.jsx("em",{children:"uma"})," termina (sucesso ou falha) — não há aggregate. Use ",e.jsx("code",{children:"WhenAny"}),' para "qual responde primeiro" (race), não para "rodar várias".']}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Confiar que ",e.jsx("code",{children:"await"})," joga aggregate:"]})," joga só a primeira inner. Inspecione ",e.jsx("code",{children:"task.Exception"})," para ver tudo."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"Flatten()"}),":"]})," em árvores aninhadas, você itera só o topo e perde detalhes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não logar todas as inner:"}),' ver "uma falha em 50 paralelas" sem detalhes inutiliza a investigação.']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:".Result"})," em código async:"]})," além de bloquear, embrulha em aggregate o que ",e.jsx("code",{children:"await"})," entregaria limpo."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Capturar ",e.jsx("code",{children:"Exception"})," e tentar acessar ",e.jsx("code",{children:"InnerExceptions"}),":"]})," só ",e.jsx("code",{children:"AggregateException"})," tem essa propriedade no plural."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"AggregateException"})," empacota várias falhas concorrentes."]}),e.jsxs("li",{children:[e.jsx("code",{children:"InnerExceptions"})," (plural!) lista todas; ",e.jsx("code",{children:"InnerException"})," singular dá só a primeira."]}),e.jsxs("li",{children:[e.jsx("code",{children:"await"})," em ",e.jsx("code",{children:"Task.WhenAll"})," desembrulha apenas a primeira — capture a Task antes para ver tudo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Flatten()"})," achata árvores; ",e.jsx("code",{children:"Handle(pred)"})," trata algumas e relança o resto."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Parallel.For"})," e ",e.jsx("code",{children:".Result"}),"/",e.jsx("code",{children:".Wait()"})," sempre lançam aggregate diretamente."]}),e.jsxs("li",{children:["Sempre logue ",e.jsx("strong",{children:"todas"})," as inner exceptions."]})]})]})}export{i as default};
