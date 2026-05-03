import{j as e}from"./index-CzLAthD5.js";import{P as s,A as a}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(s,{title:"Task e Task<T>: tipos de retorno assíncronos",subtitle:"Conhecendo os três tipos canônicos de retorno em métodos async e quando usar cada um.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:["Em C# síncrono, um método ou retorna algo (",e.jsx("code",{children:"int"}),", ",e.jsx("code",{children:"string"}),") ou retorna ",e.jsx("code",{children:"void"}),' (nada). Em código assíncrono a história é parecida, mas com uma camada extra: o resultado vem "embrulhado" em um ',e.jsx("strong",{children:"Task"}),". Pense no Task como uma encomenda em trânsito — você ganha um código de rastreamento agora; o produto chega depois. As três formas mais comuns de retorno assíncrono são ",e.jsx("code",{children:"Task"}),", ",e.jsx("code",{children:"Task<T>"})," e ",e.jsx("code",{children:"ValueTask<T>"}),". Saber qual usar evita bugs e melhora a performance."]}),e.jsx("h2",{children:'Task: o "void assíncrono"'}),e.jsxs("p",{children:["Quando seu método assíncrono ",e.jsx("em",{children:"faz"})," algo mas não devolve valor, retorne ",e.jsx("code",{children:"Task"}),". Ele é o equivalente assíncrono de ",e.jsx("code",{children:"void"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Salva no disco e não devolve nada
public async Task SalvarLogAsync(string mensagem)
{
    await File.AppendAllTextAsync("app.log", mensagem + "\\n");
    // método termina aqui; chamador pode 'await' para saber que acabou
}

// Uso
await SalvarLogAsync("usuário 42 fez login");`})}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"await"})," no chamador serve para esperar o término ",e.jsx("em",{children:"e"}),' propagar exceções. Sem ele, o método dispara em segundo plano (chamado de "fire and forget") — quase sempre uma má ideia em produção, porque erros somem.']}),e.jsx("h2",{children:"Task<T>: retornando um valor"}),e.jsxs("p",{children:["Quando há resultado, declare ",e.jsx("code",{children:"Task<T>"}),", onde ",e.jsx("code",{children:"T"})," é o tipo concreto. ",e.jsx("code",{children:"T"})," em C# é um ",e.jsx("em",{children:"parâmetro genérico"})," — um espaço reservado para qualquer tipo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public async Task<int> ContarLinhasAsync(string caminho)
{
    string[] linhas = await File.ReadAllLinesAsync(caminho);
    return linhas.Length; // valor "embrulhado" automaticamente em Task<int>
}

// Uso
int total = await ContarLinhasAsync("dados.csv");
Console.WriteLine($"{total} linhas");`})}),e.jsxs("p",{children:["Note que dentro do método você escreve ",e.jsx("code",{children:"return linhas.Length;"})," — um simples inteiro. O compilador embrulha em ",e.jsx("code",{children:"Task<int>"})," automaticamente. Quem chama desempacota com ",e.jsx("code",{children:"await"}),", recebendo o ",e.jsx("code",{children:"int"})," diretamente."]}),e.jsxs(a,{type:"info",title:"Por que não retornar T diretamente?",children:["Porque o resultado ",e.jsx("em",{children:"ainda não existe"}),' quando o método retorna! O Task é o "vale-resultado": ele carrega o estado (em andamento, concluído, falhou) e, quando completa, o valor.']}),e.jsx("h2",{children:"ValueTask<T>: otimizando o caso rápido"}),e.jsxs("p",{children:[e.jsx("code",{children:"Task<T>"})," é uma classe — alocada no heap. Em métodos chamados ",e.jsx("em",{children:"milhões de vezes"})," que muitas vezes terminam ",e.jsx("em",{children:"sincronamente"})," (cache hit, valor já disponível), essa alocação vira gargalo. ",e.jsx("code",{children:"ValueTask<T>"})," é uma struct que evita alocação no caminho rápido:"]}),e.jsx("pre",{children:e.jsx("code",{children:`private readonly Dictionary<int, string> cache = new();

public ValueTask<string> ObterUsuarioAsync(int id)
{
    if (cache.TryGetValue(id, out var nome))
    {
        // Caminho síncrono: nada de heap
        return new ValueTask<string>(nome);
    }
    // Caminho assíncrono: delega para uma Task normal
    return new ValueTask<string>(BuscarNoBancoAsync(id));
}`})}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"ValueTask"})," só quando medir mostrar ganho real. Tem regras chatas: não pode ser ",e.jsx("code",{children:"await"}),"-ado mais de uma vez, não pode ser passado para ",e.jsx("code",{children:"Task.WhenAll"})," sem ",e.jsx("code",{children:".AsTask()"}),". Para 99% dos casos, ",e.jsx("code",{children:"Task"}),"/",e.jsx("code",{children:"Task<T>"})," é o certo."]}),e.jsx("h2",{children:"Tasks já completas: FromResult e CompletedTask"}),e.jsxs("p",{children:["Às vezes você implementa uma interface assíncrona, mas seu método ",e.jsx("em",{children:"não"})," tem nada para esperar — talvez seja um stub, ou o valor já está em memória. Em vez de criar um método ",e.jsx("code",{children:"async"})," que retorna imediatamente (gerando overhead da state machine), use:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Para Task<T> já com valor pronto
public Task<int> ObterIdadeAsync() => Task.FromResult(42);

// Para Task sem valor já completa
public Task LimparAsync()
{
    cache.Clear();
    return Task.CompletedTask;
}

// Para sinalizar erro sem método async
public Task<string> FalharAsync() =>
    Task.FromException<string>(new InvalidOperationException("oops"));`})}),e.jsx("h2",{children:"Tratamento de exceções"}),e.jsxs("p",{children:["Em métodos ",e.jsx("code",{children:"async"}),", exceções são ",e.jsx("strong",{children:"capturadas"})," e armazenadas no Task. Quem fizer ",e.jsx("code",{children:"await"})," recebe a exceção ",e.jsx("em",{children:"relançada"}),". Isso é diferente de quem usa ",e.jsx("code",{children:".Result"})," ou ",e.jsx("code",{children:".Wait()"}),", que recebe um ",e.jsx("code",{children:"AggregateException"})," embrulhador:"]}),e.jsx("pre",{children:e.jsx("code",{children:`async Task<int> DividirAsync(int a, int b)
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
}`})}),e.jsxs(a,{type:"warning",title:"Tasks não observadas",children:["Se uma Task falha e ",e.jsx("em",{children:"nunca"})," é await-ada, a exceção fica esquecida. Em versões antigas do .NET isso derrubava o processo no GC; hoje só dispara o evento ",e.jsx("code",{children:"TaskScheduler.UnobservedTaskException"}),". Sempre await suas Tasks (ou capture com ",e.jsx("code",{children:"ContinueWith"}),")."]}),e.jsx("h2",{children:"WhenAll e WhenAny: combinando tasks"}),e.jsx("p",{children:"Quando você dispara várias operações concorrentes, pode esperar todas ou a primeira:"}),e.jsx("pre",{children:e.jsx("code",{children:`Task<string> a = http.GetStringAsync("https://api1.com");
Task<string> b = http.GetStringAsync("https://api2.com");

// Espera todas terminarem; recebe array
string[] ambos = await Task.WhenAll(a, b);

// Espera a primeira que terminar
Task<string> primeira = await Task.WhenAny(a, b);
string conteudo = await primeira;`})}),e.jsx("h2",{children:"async void: evite"}),e.jsxs("p",{children:["Existe um quarto tipo de retorno: ",e.jsx("code",{children:"async void"}),". Permitido apenas em ",e.jsx("strong",{children:"handlers de evento"})," (",e.jsx("code",{children:"void btn_Click(...)"}),"). Em qualquer outro lugar é perigoso: exceções não podem ser capturadas pelo chamador e podem derrubar o processo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// ERRADO em código de aplicação
public async void ProcessarAsync() { await Task.Delay(100); throw new("boom"); }

// CERTO
public async Task ProcessarAsync() { await Task.Delay(100); throw new("boom"); }`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Retornar ",e.jsx("code",{children:"Task<Task<T>>"})," sem perceber:"]})," acontece quando você esquece o ",e.jsx("code",{children:"await"})," dentro de um método async. Habilite avisos do compilador."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar ValueTask sem necessidade:"})," complexidade extra sem ganho. Comece com Task."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"async void fora de handler:"})," bugs intermitentes, processo derruba. Use Task."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"await"}),":"]})," a Task fica órfã, sua operação nem termina, exceção some."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Task"})," = método async sem valor de retorno (equivalente assíncrono de void)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Task<T>"})," = método async que devolve um valor do tipo T."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ValueTask<T>"})," = otimização para caminhos frequentemente síncronos."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Task.FromResult"}),", ",e.jsx("code",{children:"Task.CompletedTask"})," e ",e.jsx("code",{children:"Task.FromException"})," evitam state machine quando não há await."]}),e.jsxs("li",{children:["Exceções em métodos ",e.jsx("code",{children:"async"})," são propagadas no ",e.jsx("code",{children:"await"}),", sem AggregateException."]})]})]})}export{n as default};
