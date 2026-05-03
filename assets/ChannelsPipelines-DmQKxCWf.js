import{j as e}from"./index-CzLAthD5.js";import{P as s,A as r}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(s,{title:"Channels: produtor-consumidor moderno em C#",subtitle:"A forma assíncrona, eficiente e idiomática de passar dados entre partes do seu programa.",difficulty:"avancado",timeToRead:"12 min",children:[e.jsxs("p",{children:["Imagine uma esteira de sushi: o chef vai colocando pratos na esteira (produtor), e os clientes vão pegando conforme passam (consumidores). Os dois lados trabalham no próprio ritmo, e a esteira amortece picos. Em código, esse padrão é chamado de ",e.jsx("strong",{children:"produtor-consumidor"}),". O .NET tem várias ferramentas para isso, mas a mais moderna e idiomática é ",e.jsx("strong",{children:"System.Threading.Channels"})," (a partir do .NET Core 3.0). Channels substituem com vantagem o antigo ",e.jsx("code",{children:"BlockingCollection"}),": são totalmente assíncronos, performáticos e desenhados para o mundo ",e.jsx("code",{children:"async/await"}),"."]}),e.jsx("h2",{children:"O que é um Channel"}),e.jsxs("p",{children:["Um ",e.jsx("code",{children:"Channel<T>"})," é uma fila thread-safe com duas pontas:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Writer"}),": lado de quem escreve (produtor)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reader"}),": lado de quem lê (consumidor)."]})]}),e.jsxs("p",{children:["Você cria o canal, distribui o ",e.jsx("code",{children:"Writer"})," para quem produz e o ",e.jsx("code",{children:"Reader"})," para quem consome. Cada lado pode ser uma ou várias tarefas async — o canal coordena tudo sem locks explícitos."]}),e.jsx("h2",{children:"Channel ilimitado vs limitado"}),e.jsx("p",{children:"Há duas variedades:"}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Threading.Channels;

// Ilimitado: aceita quantos itens caibam na memória
var canal = Channel.CreateUnbounded<int>();

// Limitado: capacidade máxima; se cheio, escritor espera
var limitado = Channel.CreateBounded<int>(new BoundedChannelOptions(100)
{
    FullMode = BoundedChannelFullMode.Wait // ou DropOldest, DropNewest, DropWrite
});`})}),e.jsxs("p",{children:["Use o ",e.jsx("strong",{children:"limitado"})," em produção: ele aplica ",e.jsx("em",{children:"backpressure"})," — se o consumidor está lento, o produtor segura o ritmo, evitando que a memória estoure."]}),e.jsx("h2",{children:"Escrevendo: WriteAsync e Complete"}),e.jsxs("p",{children:["O produtor usa o ",e.jsx("code",{children:"Writer"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`var canal = Channel.CreateUnbounded<string>();

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
});`})}),e.jsxs("p",{children:[e.jsx("code",{children:"Complete()"}),' é fundamental: ele avisa "acabou, não vai vir mais nada". Sem essa sinalização, o consumidor com ',e.jsx("code",{children:"ReadAllAsync"})," fica preso para sempre."]}),e.jsxs(r,{type:"info",title:"Múltiplos produtores",children:["Vários produtores podem escrever no mesmo Writer simultaneamente. Mas só ",e.jsx("em",{children:"um"})," deles deve chamar ",e.jsx("code",{children:"Complete()"}),", no fim de tudo. Use uma ",e.jsx("code",{children:"Task.WhenAll(...)"})," dos produtores e chame Complete depois."]}),e.jsx("h2",{children:"Lendo: ReadAllAsync com await foreach"}),e.jsxs("p",{children:["Do lado do consumidor, o jeito moderno é iterar com ",e.jsx("code",{children:"await foreach"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Consumidor
await foreach (var msg in canal.Reader.ReadAllAsync())
{
    Console.WriteLine($"Recebi: {msg}");
}
Console.WriteLine("Canal fechado.");`})}),e.jsxs("p",{children:[e.jsx("code",{children:"ReadAllAsync"})," devolve um ",e.jsx("code",{children:"IAsyncEnumerable<T>"}),". O loop pausa naturalmente quando não há item disponível (sem queimar CPU) e termina quando o Writer chama ",e.jsx("code",{children:"Complete"}),"."]}),e.jsx("h2",{children:"Exemplo completo: log assíncrono"}),e.jsxs("p",{children:["Um caso clássico: várias partes do app querem registrar mensagens, mas escrever em arquivo é lento (bloquearia o processamento principal). Solução — um ",e.jsx("em",{children:"logger assíncrono"})," com Channel:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class LoggerAsync : IAsyncDisposable
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
}`})}),e.jsxs("p",{children:["Quem chama ",e.jsx("code",{children:"LogAsync"})," volta em microssegundos. Uma única tarefa em background grava no disco em ritmo constante. Se o disco engasgar, mensagens antigas são descartadas (graças a ",e.jsx("code",{children:"DropOldest"}),") — o app continua respondendo."]}),e.jsx("h2",{children:"Por que substituir BlockingCollection"}),e.jsxs("p",{children:["Antes do .NET Core 3.0, o padrão era ",e.jsx("code",{children:"BlockingCollection<T>"}),". Problemas:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["API ",e.jsx("em",{children:"bloqueante"})," — ",e.jsx("code",{children:"Take()"})," congela a thread esperando item."]}),e.jsxs("li",{children:["Não funciona bem com ",e.jsx("code",{children:"async/await"}),"."]}),e.jsx("li",{children:"Sem suporte direto a backpressure assíncrono."})]}),e.jsxs("p",{children:["Channels resolvem tudo isso: ",e.jsx("code",{children:"WriteAsync"})," e ",e.jsx("code",{children:"ReadAsync"})," liberam a thread enquanto esperam."]}),e.jsx("h2",{children:"TryWrite: tentar sem bloquear"}),e.jsxs("p",{children:["Para escritores que não podem esperar (caminho ultra-quente), há ",e.jsx("code",{children:"TryWrite"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Tenta enfileirar; se falhar, descarta sem bloquear
if (!canal.Writer.TryWrite(item))
{
    metricas.Increment("descartados");
}`})}),e.jsx("h2",{children:"SingleReader / SingleWriter: micro-otimização"}),e.jsx("p",{children:"Se você sabe que só um produtor e um consumidor existem, configure isso para o canal evitar locks internos:"}),e.jsx("pre",{children:e.jsx("code",{children:`var canal = Channel.CreateBounded<int>(new BoundedChannelOptions(1024)
{
    SingleReader = true,
    SingleWriter = true,
    FullMode = BoundedChannelFullMode.Wait
});`})}),e.jsxs(r,{type:"warning",title:"Não esqueça Complete()",children:["O erro #1 com Channels é esquecer ",e.jsx("code",{children:"Writer.Complete()"}),". O consumidor fica para sempre esperando o próximo item. Em apps reais, registre um ",e.jsx("code",{children:"try/finally"})," no produtor."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"Complete"}),":"]}),' consumidor "trava" no ',e.jsx("code",{children:"await foreach"})," esperando algo que nunca vem."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Múltiplos produtores chamando Complete:"})," dispara exceção. Use coordenação."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Canal ilimitado em produção:"})," se o consumidor falhar/parar, memória explode. Prefira limitado."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar Channel com Task.Run para I/O"})," sem necessidade: a beleza dos Channels é que tudo já é assíncrono."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Channel<T>"})," implementa produtor-consumidor com API assíncrona."]}),e.jsxs("li",{children:[e.jsx("code",{children:"CreateUnbounded"})," vs ",e.jsx("code",{children:"CreateBounded"}),": prefira limitado em produção."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Writer.WriteAsync"})," + ",e.jsx("code",{children:"Writer.Complete"})," do lado produtor."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Reader.ReadAllAsync"})," com ",e.jsx("code",{children:"await foreach"})," do lado consumidor."]}),e.jsxs("li",{children:["Substitui ",e.jsx("code",{children:"BlockingCollection"})," com performance e ergonomia superiores."]}),e.jsxs("li",{children:[e.jsx("code",{children:"SingleReader/SingleWriter"})," otimizam casos específicos."]})]})]})}export{n as default};
