import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DebugBasico() {
  return (
    <PageContainer
      title="Depurando seu primeiro programa"
      subtitle="Breakpoints, step, watch, call stack: o kit de sobrevivência para encontrar bugs sem chutar."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Mais cedo ou mais tarde — geralmente <em>mais cedo</em> — seu programa vai fazer algo inesperado. A reação amadora é encher o código de <code>Console.WriteLine("cheguei aqui")</code> para ver onde a execução passa. Funciona, mas é primitivo. A reação profissional é usar um <strong>debugger</strong>: uma ferramenta que <em>pausa</em> o programa em qualquer ponto e te deixa <em>inspecionar</em> tudo — variáveis, pilha de chamadas, próximas instruções. Em C#, todo editor sério (VS, VS Code, Rider) tem um debugger gráfico de primeira linha. Aprender a usá-lo é talvez o maior salto de produtividade que existe.
      </p>

      <h2>Conceito-chave: breakpoint</h2>
      <p>
        Um <strong>breakpoint</strong> é um marcador que você coloca em uma linha de código. Quando a execução chega ali, o programa <em>pausa</em> antes de executar a linha. Você então pode olhar variáveis, andar passo a passo e descobrir o estado real do mundo. Para colocar, clique na margem esquerda da linha (ou pressione F9). Surge um círculo vermelho.
      </p>
      <pre><code>{`// Cole isto em Program.cs e coloque um breakpoint na linha do "soma ="
int a = 10;
int b = 5;
int soma = Calcular(a, b);   // <-- breakpoint aqui (F9)
Console.WriteLine($"Resultado: {soma}");

static int Calcular(int x, int y)
{
    int resultado = x * 2 + y;
    return resultado;
}`}</code></pre>
      <p>
        Pressione <strong>F5</strong> para iniciar com debug. O programa roda até a linha marcada e pausa. A linha atual fica destacada em amarelo.
      </p>

      <h2>Os comandos de "step"</h2>
      <ul>
        <li><strong>F10 — Step Over:</strong> executa a linha atual <em>inteira</em> e pausa na próxima. Se a linha chama um método, ele roda sem entrar nele.</li>
        <li><strong>F11 — Step Into:</strong> se a linha chama um método, <em>entra</em> nele e pausa na primeira linha do método.</li>
        <li><strong>Shift+F11 — Step Out:</strong> roda até o método atual retornar, pausando na linha que o chamou.</li>
        <li><strong>F5 — Continue:</strong> roda até o próximo breakpoint (ou até o fim do programa).</li>
        <li><strong>Shift+F5 — Stop:</strong> mata o processo de debug.</li>
      </ul>
      <pre><code>{`// Exemplo de uso de F10 vs F11
int valor = ProcessarItem(42);   // F10: pula direto para 'Console.WriteLine'
                                 // F11: entra dentro de ProcessarItem
Console.WriteLine(valor);

static int ProcessarItem(int x)
{
    int dobro = x * 2;
    return dobro + 1;
}`}</code></pre>

      <h2>Watch, Locals, Autos</h2>
      <p>
        Enquanto o programa está pausado, várias janelas mostram informações úteis:
      </p>
      <ul>
        <li><strong>Locals:</strong> todas as variáveis locais do escopo atual e seus valores.</li>
        <li><strong>Autos:</strong> variáveis e expressões "automaticamente interessantes" perto da linha atual.</li>
        <li><strong>Watch:</strong> expressões personalizadas que você adiciona à mão (ex.: <code>nomes.Count</code>, <code>cliente?.Endereco?.Cidade</code>).</li>
        <li><strong>Immediate Window / Debug Console:</strong> permite executar <em>qualquer</em> expressão C# no contexto atual. Ex.: digite <code>nomes.Count(n =&gt; n.StartsWith("A"))</code> e veja o resultado na hora.</li>
      </ul>
      <pre><code>{`// Exemplo: ponha um breakpoint na última linha
var nomes = new List<string> { "Ana", "Bruno", "Carla", "Adriana" };
var maiusculas = nomes.Select(n => n.ToUpper()).ToList();
Console.WriteLine(maiusculas.Count);   // <-- breakpoint

// Na janela Watch (ou Immediate), digite:
//   nomes.Count(n => n.StartsWith("A"))   -> 2
//   maiusculas[0]                         -> "ANA"
//   string.Join(", ", maiusculas)         -> "ANA, BRUNO, CARLA, ADRIANA"`}</code></pre>

      <h2>Call Stack: por onde a execução chegou aqui?</h2>
      <p>
        A janela <strong>Call Stack</strong> mostra a pilha de métodos chamados — quem chamou quem. Útil para entender contexto de chamada, principalmente quando o bug está três níveis acima.
      </p>
      <pre><code>{`void Main()        // 4 (entry point)
  -> Pedido.Criar()  // 3
       -> Cliente.Validar()  // 2
            -> Email.Verificar()  // 1 (você está aqui pausado)`}</code></pre>
      <p>
        Clicar em qualquer frame da pilha leva você a ver as variáveis daquele contexto, sem perder o ponto de pausa.
      </p>

      <h2>Conditional breakpoints</h2>
      <p>
        Às vezes um bug só acontece para um valor específico. Em vez de pausar 10.000 vezes em um loop, configure o breakpoint para parar <em>apenas quando uma condição for verdadeira</em>. Clique direito no breakpoint &gt; Conditions:
      </p>
      <pre><code>{`for (int i = 0; i < 10000; i++)
{
    var resultado = ProcessarItem(i);   // <-- breakpoint condicional: i == 7382
    if (resultado < 0)
        Console.WriteLine($"Erro no item {i}");
}`}</code></pre>
      <p>
        Outras opções: <strong>Hit Count</strong> (pausar só na N-ésima vez), <strong>Tracepoint</strong> (não pausar, apenas logar uma mensagem — substitui <code>Console.WriteLine</code> de debug sem mudar o código).
      </p>

      <AlertBox type="info" title="Tracepoint: o melhor segredo do debugger">
        Em vez de espalhar <code>Console.WriteLine</code>s e ter que removê-los depois, clique direito num breakpoint &gt; Actions &gt; "Print a message". Marque "Continue execution". O programa não pausa, mas imprime a mensagem no Output. Limpo e descartável.
      </AlertBox>

      <h2>Exceções: pausar quando algo dá errado</h2>
      <p>
        No menu Debug &gt; Windows &gt; Exception Settings, marque "Common Language Runtime Exceptions" para pausar imediatamente quando <em>qualquer</em> exceção for lançada — antes de qualquer <code>catch</code>. Indispensável para investigar erros que estão sendo "engolidos" silenciosamente.
      </p>
      <pre><code>{`try
{
    var json = File.ReadAllText("config.json");
    // FileNotFoundException acontece aqui
}
catch (Exception)
{
    // Sem "Break on Throw", você nunca veria a exceção real
}`}</code></pre>

      <h2><code>launch.json</code> e launch profiles</h2>
      <p>
        No VS Code, o arquivo <code>.vscode/launch.json</code> define perfis de inicialização (qual projeto, quais argumentos, variáveis de ambiente). No projeto, o <code>Properties/launchSettings.json</code> faz algo parecido para o <code>dotnet run</code>:
      </p>
      <pre><code>{`// Properties/launchSettings.json
{
  "profiles": {
    "Desenvolvimento": {
      "commandName": "Project",
      "commandLineArgs": "--ambiente=dev",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development",
        "DB_HOST": "localhost"
      }
    },
    "Producao": {
      "commandName": "Project",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Production"
      }
    }
  }
}`}</code></pre>
      <pre><code>{`# Selecionar perfil pela CLI
dotnet run --launch-profile Desenvolvimento

# No VS Code, F5 usa o perfil ativo na barra de status`}</code></pre>

      <h2>Debug vs Release: a configuração importa</h2>
      <p>
        <strong>Debug</strong> é o build padrão para desenvolvimento: gera <em>símbolos</em> (arquivos <code>.pdb</code>) que mapeiam IL para linhas de código, desliga otimizações (para que o debugger pause exatamente onde você espera) e mantém asserts. <strong>Release</strong> ativa otimizações do compilador, o que melhora performance mas pode reordenar instruções e dificultar o debug.
      </p>
      <pre><code>{`# Debug (padrão)
dotnet build
dotnet run

# Release (otimizado, para produção)
dotnet build -c Release
dotnet run -c Release`}</code></pre>
      <p>
        Os arquivos <strong>.pdb</strong> ("Program Database") são essenciais para o debugger mostrar nomes de variáveis e linhas. Em produção você pode optar por <em>portable PDBs</em> embutidos para ter stack traces legíveis em logs sem expor o código fonte.
      </p>

      <AlertBox type="warning" title="Bug que só aparece em Release?">
        Existe! Otimizações do JIT podem expor problemas de race conditions, ordering ou uso de variáveis não inicializadas. Quando isso acontecer, debugue em Release com símbolos habilitados, ou suspeite de problemas de concorrência.
      </AlertBox>

      <h2>Inspecionando coleções e objetos complexos</h2>
      <p>
        Hover sobre uma variável durante o pause mostra um popup com sua árvore de propriedades. Para <code>List&lt;T&gt;</code>, o debugger mostra todos os itens. Para tipos seus, defina <code>ToString()</code> ou use o atributo <code>[DebuggerDisplay]</code> para uma visualização útil:
      </p>
      <pre><code>{`[System.Diagnostics.DebuggerDisplay("Cliente {Nome} ({Id})")]
public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>"Source not available":</strong> está depurando código sem .pdb. Habilite "Just My Code: false" e configure Symbol Servers em Debug &gt; Options.</li>
        <li><strong>Breakpoint vermelho com bolinha vazia:</strong> a linha não foi compilada — talvez esteja em <code>#if DEBUG</code> que não está ativo.</li>
        <li><strong>Programa rodou direto sem pausar:</strong> esqueceu o F5 e usou Ctrl+F5 (rodar sem debug).</li>
        <li><strong>Variável "no value" durante pause:</strong> ainda não foi declarada ou já saiu de escopo.</li>
        <li><strong>Modificar variável durante o debug:</strong> permitido! Em Locals/Watch, edite o valor e continue. Útil para testar caminhos sem reiniciar.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>F9 = breakpoint; F5 = continue; F10/F11 = step over/into.</li>
        <li>Watch/Locals/Immediate exploram o estado durante a pausa.</li>
        <li>Call Stack mostra como você chegou ali.</li>
        <li>Conditional breakpoints e tracepoints são superpoderes.</li>
        <li>Debug usa otimizações desligadas + .pdb; Release otimiza tudo.</li>
        <li><code>launchSettings.json</code> define perfis com env vars e args.</li>
      </ul>
    </PageContainer>
  );
}
