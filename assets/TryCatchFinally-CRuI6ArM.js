import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(r,{title:"Tratamento de exceções: try, catch, finally",subtitle:"Quando algo dá errado em runtime, é o try/catch que decide se o programa morre — ou se segue elegantemente.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs("p",{children:["Pense num restaurante: o garçom pega seu pedido (",e.jsx("code",{children:"try"}),"), mas se a cozinha não tiver um ingrediente (",e.jsx("em",{children:"exceção"}),"), ele volta para te avisar (",e.jsx("code",{children:"catch"}),") e, dê no que der, sempre passa a conta no fim (",e.jsx("code",{children:"finally"}),"). Em C#, esse padrão é a forma idiomática de lidar com erros que ocorrem durante a execução — leitura de arquivo que sumiu, conexão de rede caída, divisão por zero. ",e.jsx("strong",{children:"Exceção"})," é o objeto que o runtime cria quando algo inesperado acontece e que percorre a pilha de chamadas até alguém decidir tratá-lo."]}),e.jsx("h2",{children:"A sintaxe básica"}),e.jsxs("p",{children:["Você protege um trecho de código com ",e.jsxs("code",{children:["try ","{ ... }"]}),", captura erros específicos com um ou mais ",e.jsx("code",{children:"catch (TipoDaExcecao ex)"}),", e opcionalmente coloca código de limpeza em ",e.jsxs("code",{children:["finally ","{ ... }"]}),". O bloco ",e.jsx("code",{children:"finally"})," roda ",e.jsx("strong",{children:"sempre"}),", com ou sem erro, com ou sem ",e.jsx("code",{children:"return"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System;
using System.IO;

try
{
    var conteudo = File.ReadAllText("config.json");
    Console.WriteLine(conteudo);
}
catch (FileNotFoundException ex)
{
    Console.WriteLine($"Arquivo sumiu: {ex.FileName}");
}
catch (UnauthorizedAccessException ex)
{
    Console.WriteLine($"Sem permissão: {ex.Message}");
}
finally
{
    Console.WriteLine("Tentativa de leitura concluída.");
}`})}),e.jsxs("p",{children:["Repare em duas coisas. Primeiro, capturamos ",e.jsx("strong",{children:"tipos específicos"})," antes do genérico — assim cada erro recebe tratamento adequado. Segundo, o ",e.jsx("code",{children:"finally"})," imprime a mensagem mesmo se o arquivo for lido com sucesso ou se a leitura falhar."]}),e.jsx("h2",{children:"A hierarquia de Exception"}),e.jsxs("p",{children:["Toda exceção em .NET herda de ",e.jsx("code",{children:"System.Exception"}),". Existem dois grandes ramos: ",e.jsx("code",{children:"SystemException"})," (lançadas pelo runtime — ",e.jsx("code",{children:"NullReferenceException"}),", ",e.jsx("code",{children:"InvalidOperationException"}),", ",e.jsx("code",{children:"ArgumentException"}),") e exceções de bibliotecas específicas (",e.jsx("code",{children:"HttpRequestException"}),", ",e.jsx("code",{children:"SqlException"}),", etc.)."]}),e.jsx("pre",{children:e.jsx("code",{children:`Exception
├─ SystemException
│   ├─ ArgumentException
│   │   └─ ArgumentNullException
│   ├─ InvalidOperationException
│   │   └─ ObjectDisposedException
│   ├─ NullReferenceException
│   ├─ IndexOutOfRangeException
│   └─ ArithmeticException → DivideByZeroException
└─ IOException
    ├─ FileNotFoundException
    ├─ DirectoryNotFoundException
    └─ PathTooLongException`})}),e.jsxs("p",{children:["Como funciona a captura: o runtime procura o primeiro ",e.jsx("code",{children:"catch"})," cujo tipo seja igual ou ancestral da exceção lançada. Por isso, capturar ",e.jsx("code",{children:"Exception"})," pega ",e.jsx("em",{children:"tudo"})," — útil como rede de segurança, perigoso como hábito."]}),e.jsx("h2",{children:"Catch específico antes do genérico"}),e.jsx("p",{children:"A ordem importa. Coloque o catch mais específico primeiro:"}),e.jsx("pre",{children:e.jsx("code",{children:`try
{
    /* código que pode lançar várias coisas */
}
catch (FileNotFoundException ex)   // específico
{
    Console.WriteLine($"Não achei {ex.FileName}");
}
catch (IOException ex)              // mais genérico
{
    Console.WriteLine($"Erro de I/O: {ex.Message}");
}
catch (Exception ex)                // último recurso
{
    Console.WriteLine($"Erro inesperado: {ex.GetType().Name}");
    throw;                          // relança preservando stack
}`})}),e.jsxs("p",{children:["Se você inverter a ordem (genérico antes do específico), o compilador ",e.jsx("strong",{children:"recusa"}),": ele detecta que o catch específico ficaria inalcançável."]}),e.jsxs(o,{type:"warning",title:"Não engula exceções",children:[e.jsxs("code",{children:["catch (Exception) ","{ }"]})," vazio é o pior pecado do tratamento de erros: você esconde o problema, o programa segue num estado inconsistente, e horas de debugging são desperdiçadas. Se vai capturar, ao menos logue."]}),e.jsxs("h2",{children:["O bloco ",e.jsx("code",{children:"finally"})]}),e.jsxs("p",{children:[e.jsx("code",{children:"finally"})," serve para liberar recursos — fechar arquivo, fechar conexão de banco, devolver semáforo. Roda mesmo se o ",e.jsx("code",{children:"try"})," tiver ",e.jsx("code",{children:"return"}),", mesmo se o ",e.jsx("code",{children:"catch"})," relançar."]}),e.jsx("pre",{children:e.jsx("code",{children:`FileStream? arquivo = null;
try
{
    arquivo = File.OpenRead("dados.bin");
    // ... usa o arquivo ...
    return ProcessarBytes(arquivo);    // finally ainda roda antes de retornar
}
catch (IOException ex)
{
    Console.Error.WriteLine(ex);
    throw;
}
finally
{
    arquivo?.Dispose();    // garante fechamento mesmo em erro
}`})}),e.jsxs("p",{children:["Esse padrão é tão comum que C# criou açúcar sintático para ele: o ",e.jsx("code",{children:"using"}),"."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"using"})," é syntactic sugar para try-finally"]}),e.jsxs("p",{children:["O bloco ",e.jsx("code",{children:"using (var x = ...)"})," é exatamente um ",e.jsx("code",{children:"try-finally"})," que chama ",e.jsx("code",{children:"x.Dispose()"})," no fim. Os dois trechos abaixo geram ",e.jsx("strong",{children:"idêntica"})," IL:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// versão "manual"
{
    var stream = File.OpenRead("a.txt");
    try { /* usa stream */ }
    finally { stream?.Dispose(); }
}

// versão idiomática
using (var stream = File.OpenRead("a.txt"))
{
    /* usa stream */
}

// C# 8+: using declaration sem chaves — Dispose acontece no fim do escopo
{
    using var stream = File.OpenRead("a.txt");
    /* usa stream */
}   // Dispose() chamado aqui`})}),e.jsxs(o,{type:"info",title:"Exceção vs erro de sintaxe",children:["Erros de sintaxe (faltou ponto-e-vírgula) são pegos pelo ",e.jsx("strong",{children:"compilador"})," e nem geram executável. Exceções são erros de ",e.jsx("strong",{children:"execução"}),": só aparecem quando o programa roda. ",e.jsx("code",{children:"try/catch"})," só serve para o segundo tipo."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Capturar ",e.jsx("code",{children:"Exception"})," sem necessidade:"]})," esconde bugs reais. Capture o tipo mais específico possível."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Catch vazio:"}),' "engole" o erro e o programa segue em estado quebrado. No mínimo, logue.']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer de relançar com ",e.jsx("code",{children:"throw;"}),":"]})," se você só logou, alguém lá em cima precisa saber. Use ",e.jsx("code",{children:"throw;"})," sozinho (não ",e.jsx("code",{children:"throw ex;"}),")."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Lógica de negócio dentro de ",e.jsx("code",{children:"finally"}),":"]})," finally é só para limpeza, não para fluxo principal."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar exceção como fluxo de controle:"})," exceções são ",e.jsx("em",{children:"caras"}),'. Para "se não existe, retorne null", use ',e.jsx("code",{children:"TryGetValue"})," ou ",e.jsx("code",{children:"FirstOrDefault"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"try"})," envolve código que pode falhar; ",e.jsx("code",{children:"catch"})," trata; ",e.jsx("code",{children:"finally"})," limpa."]}),e.jsxs("li",{children:["Toda exceção herda de ",e.jsx("code",{children:"System.Exception"}),"."]}),e.jsx("li",{children:"Capture do mais específico para o mais genérico."}),e.jsxs("li",{children:[e.jsx("code",{children:"finally"})," roda sempre — mesmo com ",e.jsx("code",{children:"return"})," ou ",e.jsx("code",{children:"throw"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"using"})," é açúcar para try-finally que chama ",e.jsx("code",{children:"Dispose()"}),"."]}),e.jsx("li",{children:"Nunca engula exceções silenciosamente."})]})]})}export{s as default};
