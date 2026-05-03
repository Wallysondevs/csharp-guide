import{j as e}from"./index-CzLAthD5.js";import{P as o,A as a}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(o,{title:"Depurando seu primeiro programa",subtitle:"Breakpoints, step, watch, call stack: o kit de sobrevivência para encontrar bugs sem chutar.",difficulty:"iniciante",timeToRead:"11 min",children:[e.jsxs("p",{children:["Mais cedo ou mais tarde — geralmente ",e.jsx("em",{children:"mais cedo"})," — seu programa vai fazer algo inesperado. A reação amadora é encher o código de ",e.jsx("code",{children:'Console.WriteLine("cheguei aqui")'})," para ver onde a execução passa. Funciona, mas é primitivo. A reação profissional é usar um ",e.jsx("strong",{children:"debugger"}),": uma ferramenta que ",e.jsx("em",{children:"pausa"})," o programa em qualquer ponto e te deixa ",e.jsx("em",{children:"inspecionar"})," tudo — variáveis, pilha de chamadas, próximas instruções. Em C#, todo editor sério (VS, VS Code, Rider) tem um debugger gráfico de primeira linha. Aprender a usá-lo é talvez o maior salto de produtividade que existe."]}),e.jsx("h2",{children:"Conceito-chave: breakpoint"}),e.jsxs("p",{children:["Um ",e.jsx("strong",{children:"breakpoint"})," é um marcador que você coloca em uma linha de código. Quando a execução chega ali, o programa ",e.jsx("em",{children:"pausa"})," antes de executar a linha. Você então pode olhar variáveis, andar passo a passo e descobrir o estado real do mundo. Para colocar, clique na margem esquerda da linha (ou pressione F9). Surge um círculo vermelho."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Cole isto em Program.cs e coloque um breakpoint na linha do "soma ="
int a = 10;
int b = 5;
int soma = Calcular(a, b);   // <-- breakpoint aqui (F9)
Console.WriteLine($"Resultado: {soma}");

static int Calcular(int x, int y)
{
    int resultado = x * 2 + y;
    return resultado;
}`})}),e.jsxs("p",{children:["Pressione ",e.jsx("strong",{children:"F5"})," para iniciar com debug. O programa roda até a linha marcada e pausa. A linha atual fica destacada em amarelo."]}),e.jsx("h2",{children:'Os comandos de "step"'}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"F10 — Step Over:"})," executa a linha atual ",e.jsx("em",{children:"inteira"})," e pausa na próxima. Se a linha chama um método, ele roda sem entrar nele."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"F11 — Step Into:"})," se a linha chama um método, ",e.jsx("em",{children:"entra"})," nele e pausa na primeira linha do método."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Shift+F11 — Step Out:"})," roda até o método atual retornar, pausando na linha que o chamou."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"F5 — Continue:"})," roda até o próximo breakpoint (ou até o fim do programa)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Shift+F5 — Stop:"})," mata o processo de debug."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// Exemplo de uso de F10 vs F11
int valor = ProcessarItem(42);   // F10: pula direto para 'Console.WriteLine'
                                 // F11: entra dentro de ProcessarItem
Console.WriteLine(valor);

static int ProcessarItem(int x)
{
    int dobro = x * 2;
    return dobro + 1;
}`})}),e.jsx("h2",{children:"Watch, Locals, Autos"}),e.jsx("p",{children:"Enquanto o programa está pausado, várias janelas mostram informações úteis:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Locals:"})," todas as variáveis locais do escopo atual e seus valores."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Autos:"}),' variáveis e expressões "automaticamente interessantes" perto da linha atual.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Watch:"})," expressões personalizadas que você adiciona à mão (ex.: ",e.jsx("code",{children:"nomes.Count"}),", ",e.jsx("code",{children:"cliente?.Endereco?.Cidade"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Immediate Window / Debug Console:"})," permite executar ",e.jsx("em",{children:"qualquer"})," expressão C# no contexto atual. Ex.: digite ",e.jsx("code",{children:'nomes.Count(n => n.StartsWith("A"))'})," e veja o resultado na hora."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// Exemplo: ponha um breakpoint na última linha
var nomes = new List<string> { "Ana", "Bruno", "Carla", "Adriana" };
var maiusculas = nomes.Select(n => n.ToUpper()).ToList();
Console.WriteLine(maiusculas.Count);   // <-- breakpoint

// Na janela Watch (ou Immediate), digite:
//   nomes.Count(n => n.StartsWith("A"))   -> 2
//   maiusculas[0]                         -> "ANA"
//   string.Join(", ", maiusculas)         -> "ANA, BRUNO, CARLA, ADRIANA"`})}),e.jsx("h2",{children:"Call Stack: por onde a execução chegou aqui?"}),e.jsxs("p",{children:["A janela ",e.jsx("strong",{children:"Call Stack"})," mostra a pilha de métodos chamados — quem chamou quem. Útil para entender contexto de chamada, principalmente quando o bug está três níveis acima."]}),e.jsx("pre",{children:e.jsx("code",{children:`void Main()        // 4 (entry point)
  -> Pedido.Criar()  // 3
       -> Cliente.Validar()  // 2
            -> Email.Verificar()  // 1 (você está aqui pausado)`})}),e.jsx("p",{children:"Clicar em qualquer frame da pilha leva você a ver as variáveis daquele contexto, sem perder o ponto de pausa."}),e.jsx("h2",{children:"Conditional breakpoints"}),e.jsxs("p",{children:["Às vezes um bug só acontece para um valor específico. Em vez de pausar 10.000 vezes em um loop, configure o breakpoint para parar ",e.jsx("em",{children:"apenas quando uma condição for verdadeira"}),". Clique direito no breakpoint > Conditions:"]}),e.jsx("pre",{children:e.jsx("code",{children:`for (int i = 0; i < 10000; i++)
{
    var resultado = ProcessarItem(i);   // <-- breakpoint condicional: i == 7382
    if (resultado < 0)
        Console.WriteLine($"Erro no item {i}");
}`})}),e.jsxs("p",{children:["Outras opções: ",e.jsx("strong",{children:"Hit Count"})," (pausar só na N-ésima vez), ",e.jsx("strong",{children:"Tracepoint"})," (não pausar, apenas logar uma mensagem — substitui ",e.jsx("code",{children:"Console.WriteLine"})," de debug sem mudar o código)."]}),e.jsxs(a,{type:"info",title:"Tracepoint: o melhor segredo do debugger",children:["Em vez de espalhar ",e.jsx("code",{children:"Console.WriteLine"}),'s e ter que removê-los depois, clique direito num breakpoint > Actions > "Print a message". Marque "Continue execution". O programa não pausa, mas imprime a mensagem no Output. Limpo e descartável.']}),e.jsx("h2",{children:"Exceções: pausar quando algo dá errado"}),e.jsxs("p",{children:['No menu Debug > Windows > Exception Settings, marque "Common Language Runtime Exceptions" para pausar imediatamente quando ',e.jsx("em",{children:"qualquer"})," exceção for lançada — antes de qualquer ",e.jsx("code",{children:"catch"}),'. Indispensável para investigar erros que estão sendo "engolidos" silenciosamente.']}),e.jsx("pre",{children:e.jsx("code",{children:`try
{
    var json = File.ReadAllText("config.json");
    // FileNotFoundException acontece aqui
}
catch (Exception)
{
    // Sem "Break on Throw", você nunca veria a exceção real
}`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"launch.json"})," e launch profiles"]}),e.jsxs("p",{children:["No VS Code, o arquivo ",e.jsx("code",{children:".vscode/launch.json"})," define perfis de inicialização (qual projeto, quais argumentos, variáveis de ambiente). No projeto, o ",e.jsx("code",{children:"Properties/launchSettings.json"})," faz algo parecido para o ",e.jsx("code",{children:"dotnet run"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Properties/launchSettings.json
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
}`})}),e.jsx("pre",{children:e.jsx("code",{children:`# Selecionar perfil pela CLI
dotnet run --launch-profile Desenvolvimento

# No VS Code, F5 usa o perfil ativo na barra de status`})}),e.jsx("h2",{children:"Debug vs Release: a configuração importa"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Debug"})," é o build padrão para desenvolvimento: gera ",e.jsx("em",{children:"símbolos"})," (arquivos ",e.jsx("code",{children:".pdb"}),") que mapeiam IL para linhas de código, desliga otimizações (para que o debugger pause exatamente onde você espera) e mantém asserts. ",e.jsx("strong",{children:"Release"})," ativa otimizações do compilador, o que melhora performance mas pode reordenar instruções e dificultar o debug."]}),e.jsx("pre",{children:e.jsx("code",{children:`# Debug (padrão)
dotnet build
dotnet run

# Release (otimizado, para produção)
dotnet build -c Release
dotnet run -c Release`})}),e.jsxs("p",{children:["Os arquivos ",e.jsx("strong",{children:".pdb"}),' ("Program Database") são essenciais para o debugger mostrar nomes de variáveis e linhas. Em produção você pode optar por ',e.jsx("em",{children:"portable PDBs"})," embutidos para ter stack traces legíveis em logs sem expor o código fonte."]}),e.jsx(a,{type:"warning",title:"Bug que só aparece em Release?",children:"Existe! Otimizações do JIT podem expor problemas de race conditions, ordering ou uso de variáveis não inicializadas. Quando isso acontecer, debugue em Release com símbolos habilitados, ou suspeite de problemas de concorrência."}),e.jsx("h2",{children:"Inspecionando coleções e objetos complexos"}),e.jsxs("p",{children:["Hover sobre uma variável durante o pause mostra um popup com sua árvore de propriedades. Para ",e.jsx("code",{children:"List<T>"}),", o debugger mostra todos os itens. Para tipos seus, defina ",e.jsx("code",{children:"ToString()"})," ou use o atributo ",e.jsx("code",{children:"[DebuggerDisplay]"})," para uma visualização útil:"]}),e.jsx("pre",{children:e.jsx("code",{children:`[System.Diagnostics.DebuggerDisplay("Cliente {Nome} ({Id})")]
public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
}`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:'"Source not available":'}),' está depurando código sem .pdb. Habilite "Just My Code: false" e configure Symbol Servers em Debug > Options.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Breakpoint vermelho com bolinha vazia:"})," a linha não foi compilada — talvez esteja em ",e.jsx("code",{children:"#if DEBUG"})," que não está ativo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Programa rodou direto sem pausar:"})," esqueceu o F5 e usou Ctrl+F5 (rodar sem debug)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'Variável "no value" durante pause:'})," ainda não foi declarada ou já saiu de escopo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Modificar variável durante o debug:"})," permitido! Em Locals/Watch, edite o valor e continue. Útil para testar caminhos sem reiniciar."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"F9 = breakpoint; F5 = continue; F10/F11 = step over/into."}),e.jsx("li",{children:"Watch/Locals/Immediate exploram o estado durante a pausa."}),e.jsx("li",{children:"Call Stack mostra como você chegou ali."}),e.jsx("li",{children:"Conditional breakpoints e tracepoints são superpoderes."}),e.jsx("li",{children:"Debug usa otimizações desligadas + .pdb; Release otimiza tudo."}),e.jsxs("li",{children:[e.jsx("code",{children:"launchSettings.json"})," define perfis com env vars e args."]})]})]})}export{s as default};
