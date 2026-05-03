import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TryCatchFinally() {
  return (
    <PageContainer
      title="Tratamento de exceções: try, catch, finally"
      subtitle="Quando algo dá errado em runtime, é o try/catch que decide se o programa morre — ou se segue elegantemente."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Pense num restaurante: o garçom pega seu pedido (<code>try</code>), mas se a cozinha não tiver um ingrediente (<em>exceção</em>), ele volta para te avisar (<code>catch</code>) e, dê no que der, sempre passa a conta no fim (<code>finally</code>). Em C#, esse padrão é a forma idiomática de lidar com erros que ocorrem durante a execução — leitura de arquivo que sumiu, conexão de rede caída, divisão por zero. <strong>Exceção</strong> é o objeto que o runtime cria quando algo inesperado acontece e que percorre a pilha de chamadas até alguém decidir tratá-lo.
      </p>

      <h2>A sintaxe básica</h2>
      <p>
        Você protege um trecho de código com <code>try {`{ ... }`}</code>, captura erros específicos com um ou mais <code>catch (TipoDaExcecao ex)</code>, e opcionalmente coloca código de limpeza em <code>finally {`{ ... }`}</code>. O bloco <code>finally</code> roda <strong>sempre</strong>, com ou sem erro, com ou sem <code>return</code>.
      </p>
      <pre><code>{`using System;
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
}`}</code></pre>
      <p>
        Repare em duas coisas. Primeiro, capturamos <strong>tipos específicos</strong> antes do genérico — assim cada erro recebe tratamento adequado. Segundo, o <code>finally</code> imprime a mensagem mesmo se o arquivo for lido com sucesso ou se a leitura falhar.
      </p>

      <h2>A hierarquia de Exception</h2>
      <p>
        Toda exceção em .NET herda de <code>System.Exception</code>. Existem dois grandes ramos: <code>SystemException</code> (lançadas pelo runtime — <code>NullReferenceException</code>, <code>InvalidOperationException</code>, <code>ArgumentException</code>) e exceções de bibliotecas específicas (<code>HttpRequestException</code>, <code>SqlException</code>, etc.).
      </p>
      <pre><code>{`Exception
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
    └─ PathTooLongException`}</code></pre>
      <p>
        Como funciona a captura: o runtime procura o primeiro <code>catch</code> cujo tipo seja igual ou ancestral da exceção lançada. Por isso, capturar <code>Exception</code> pega <em>tudo</em> — útil como rede de segurança, perigoso como hábito.
      </p>

      <h2>Catch específico antes do genérico</h2>
      <p>
        A ordem importa. Coloque o catch mais específico primeiro:
      </p>
      <pre><code>{`try
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
}`}</code></pre>
      <p>
        Se você inverter a ordem (genérico antes do específico), o compilador <strong>recusa</strong>: ele detecta que o catch específico ficaria inalcançável.
      </p>

      <AlertBox type="warning" title="Não engula exceções">
        <code>catch (Exception) {`{ }`}</code> vazio é o pior pecado do tratamento de erros: você esconde o problema, o programa segue num estado inconsistente, e horas de debugging são desperdiçadas. Se vai capturar, ao menos logue.
      </AlertBox>

      <h2>O bloco <code>finally</code></h2>
      <p>
        <code>finally</code> serve para liberar recursos — fechar arquivo, fechar conexão de banco, devolver semáforo. Roda mesmo se o <code>try</code> tiver <code>return</code>, mesmo se o <code>catch</code> relançar.
      </p>
      <pre><code>{`FileStream? arquivo = null;
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
}`}</code></pre>
      <p>
        Esse padrão é tão comum que C# criou açúcar sintático para ele: o <code>using</code>.
      </p>

      <h2><code>using</code> é syntactic sugar para try-finally</h2>
      <p>
        O bloco <code>using (var x = ...)</code> é exatamente um <code>try-finally</code> que chama <code>x.Dispose()</code> no fim. Os dois trechos abaixo geram <strong>idêntica</strong> IL:
      </p>
      <pre><code>{`// versão "manual"
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
}   // Dispose() chamado aqui`}</code></pre>

      <AlertBox type="info" title="Exceção vs erro de sintaxe">
        Erros de sintaxe (faltou ponto-e-vírgula) são pegos pelo <strong>compilador</strong> e nem geram executável. Exceções são erros de <strong>execução</strong>: só aparecem quando o programa roda. <code>try/catch</code> só serve para o segundo tipo.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Capturar <code>Exception</code> sem necessidade:</strong> esconde bugs reais. Capture o tipo mais específico possível.</li>
        <li><strong>Catch vazio:</strong> "engole" o erro e o programa segue em estado quebrado. No mínimo, logue.</li>
        <li><strong>Esquecer de relançar com <code>throw;</code>:</strong> se você só logou, alguém lá em cima precisa saber. Use <code>throw;</code> sozinho (não <code>throw ex;</code>).</li>
        <li><strong>Lógica de negócio dentro de <code>finally</code>:</strong> finally é só para limpeza, não para fluxo principal.</li>
        <li><strong>Usar exceção como fluxo de controle:</strong> exceções são <em>caras</em>. Para "se não existe, retorne null", use <code>TryGetValue</code> ou <code>FirstOrDefault</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>try</code> envolve código que pode falhar; <code>catch</code> trata; <code>finally</code> limpa.</li>
        <li>Toda exceção herda de <code>System.Exception</code>.</li>
        <li>Capture do mais específico para o mais genérico.</li>
        <li><code>finally</code> roda sempre — mesmo com <code>return</code> ou <code>throw</code>.</li>
        <li><code>using</code> é açúcar para try-finally que chama <code>Dispose()</code>.</li>
        <li>Nunca engula exceções silenciosamente.</li>
      </ul>
    </PageContainer>
  );
}
