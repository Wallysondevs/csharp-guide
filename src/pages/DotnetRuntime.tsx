import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DotnetRuntime() {
  return (
    <PageContainer
      title="O que é o .NET? Runtime, SDK e BCL"
      subtitle="Entenda as peças que fazem seu código C# virar um programa rodando: CLR, JIT, AOT, BCL e Garbage Collector."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Quando você instala o ".NET" você está, na verdade, instalando um conjunto de coisas com nomes diferentes. Para um iniciante, esses nomes — <strong>SDK</strong>, <strong>Runtime</strong>, <strong>CLR</strong>, <strong>BCL</strong>, <strong>JIT</strong>, <strong>AOT</strong>, <strong>GC</strong> — formam uma sopa de letrinhas intimidante. Vamos desfazer essa sopa com uma analogia simples: pense em uma cozinha profissional. O .NET é a cozinha inteira. Dentro dela há um <em>fogão</em> (que executa as receitas), uma <em>despensa de ingredientes prontos</em> (que você usa em vez de plantar trigo do zero) e um <em>kit de ferramentas do chef</em> (facas, balanças, termômetros). Cada peça tem seu nome técnico.
      </p>

      <h2>SDK x Runtime: qual é a diferença?</h2>
      <p>
        O <strong>Runtime</strong> é o mínimo necessário para <em>executar</em> um programa .NET já compilado. Se um colega te mandar um <code>.exe</code> ou <code>.dll</code> pronto, você só precisa do Runtime instalado para rodá-lo. Já o <strong>SDK</strong> (Software Development Kit) inclui o Runtime <em>mais</em> tudo que é necessário para <em>construir</em> programas: o compilador C# (Roslyn), os templates de projeto, a CLI <code>dotnet</code>, ferramentas de pacote, etc.
      </p>
      <pre><code>{`# Verifica o que está instalado
dotnet --info

# Lista apenas SDKs instalados
dotnet --list-sdks
# Saída exemplo:
# 8.0.404 [/usr/share/dotnet/sdk]
# 9.0.100 [/usr/share/dotnet/sdk]

# Lista apenas Runtimes
dotnet --list-runtimes`}</code></pre>
      <p>
        Para desenvolver, você quer o SDK. Para apenas <em>rodar</em> um programa pronto em um servidor de produção, o Runtime basta — é mais leve e tem menos superfície de ataque.
      </p>

      <h2>O CLR: o coração que executa</h2>
      <p>
        Dentro do Runtime mora o <strong>CLR</strong> — <em>Common Language Runtime</em>. Ele é o programa que <strong>executa</strong> seu código. Quando você roda <code>dotnet run</code>, o que está acontecendo é: seu código C# foi compilado para uma linguagem intermediária chamada <strong>IL</strong> (Intermediate Language, também chamada de <em>MSIL</em> ou <em>CIL</em>), e essa IL é entregue ao CLR. O CLR então faz três coisas mágicas:
      </p>
      <ol>
        <li><strong>Carrega</strong> as bibliotecas necessárias (assemblies <code>.dll</code>).</li>
        <li><strong>Compila</strong> a IL para código nativo do seu processador (Intel, AMD, ARM) usando o <strong>JIT</strong>.</li>
        <li><strong>Executa</strong> esse código nativo, gerenciando memória, threads e segurança.</li>
      </ol>
      <pre><code>{`// Você escreve isso em C#:
int soma = 2 + 3;

// O compilador Roslyn gera IL parecida com:
// ldc.i4.2
// ldc.i4.3
// add
// stloc.0

// O CLR/JIT converte essa IL para instruções x86/ARM
// no momento em que o método é chamado.`}</code></pre>

      <h2>JIT x AOT: dois jeitos de virar nativo</h2>
      <p>
        O <strong>JIT</strong> (Just-In-Time) compila a IL para código nativo <em>na hora em que o método é chamado pela primeira vez</em>. Vantagem: o JIT conhece o hardware exato e otimiza para ele. Desvantagem: a primeira execução é um pouco mais lenta (o "warm-up") e consome mais memória.
      </p>
      <p>
        O <strong>AOT</strong> (Ahead-Of-Time), introduzido como <em>Native AOT</em> no .NET 7 e amadurecido no .NET 8, compila <em>antes</em> da execução, gerando um único executável nativo que <strong>não precisa do CLR para rodar</strong>. Vantagem: inicia em milissegundos, ideal para containers, CLIs e funções serverless. Desvantagem: tamanho do binário, sem reflection dinâmica completa.
      </p>
      <pre><code>{`# Publicar com AOT (gera binário nativo standalone)
dotnet publish -c Release -r linux-x64 \\
  -p:PublishAot=true`}</code></pre>

      <AlertBox type="info" title="Comparando com Java">
        A JVM (Java Virtual Machine) e o CLR resolvem o mesmo problema (executar bytecode portável) com filosofias parecidas. As diferenças principais: o CLR é mais integrado a Windows historicamente, suporta <em>value types</em> reais (structs), tem genéricos preservados em runtime (Java apaga os tipos), e o GC é menos configurável que o do HotSpot da Oracle.
      </AlertBox>

      <h2>A BCL: a despensa cheia de ingredientes</h2>
      <p>
        A <strong>BCL</strong> (<em>Base Class Library</em>) é o conjunto de classes prontas que você ganha de graça: <code>String</code>, <code>List&lt;T&gt;</code>, <code>File</code>, <code>HttpClient</code>, <code>DateTime</code>, <code>Math</code>, <code>Regex</code>, e milhares de outras. Sem ela, você teria que escrever do zero até as operações mais básicas. A BCL vem dentro de assemblies como <code>System.Runtime.dll</code>, <code>System.Collections.dll</code>, <code>System.Net.Http.dll</code>.
      </p>
      <pre><code>{`using System;
using System.IO;
using System.Net.Http;

// Tudo isto vem da BCL — não instalei nenhum pacote
var conteudo = File.ReadAllText("dados.txt");
using var http = new HttpClient();
var resposta = await http.GetStringAsync("https://api.exemplo.com");
Console.WriteLine($"Hoje é {DateTime.Now:dd/MM/yyyy}");`}</code></pre>

      <h2>O Garbage Collector: limpeza automática</h2>
      <p>
        Em linguagens como C ou C++, você precisa lembrar de liberar a memória que aloca, senão o programa "vaza". Em C#, o <strong>GC</strong> (Garbage Collector) faz isso automaticamente. De tempos em tempos, ele percorre os objetos, identifica os que ninguém mais referencia (lixo) e libera a memória deles. Funciona em <em>gerações</em> (Gen 0, Gen 1, Gen 2): objetos novos vão para Gen 0; os que sobrevivem a uma coleta sobem de geração. Isso é eficiente porque a maioria dos objetos morre jovem.
      </p>
      <pre><code>{`// Você não precisa "delete" nem "free" em C#
var lista = new List<int> { 1, 2, 3, 4, 5 };
// Quando 'lista' sai de escopo, o GC eventualmente a libera.
// Você só precisa lidar manualmente com recursos não-gerenciados
// (arquivos, conexões), via 'using' / IDisposable.`}</code></pre>

      <AlertBox type="warning" title="Cuidado com IDisposable">
        Recursos como arquivos, conexões de banco e sockets <strong>não</strong> são liberados pelo GC sozinho. Use <code>using</code> para garantir o fechamento determinístico: <code>using var sr = new StreamReader("a.txt");</code>.
      </AlertBox>

      <h2>.NET Framework x .NET Core x .NET 5+</h2>
      <p>
        Resumão: <strong>.NET Framework</strong> (1.0–4.8, só Windows, legado, sem novas features); <strong>.NET Core</strong> (1.0–3.1, multiplataforma, open source, descontinuado); <strong>.NET 5+</strong> (a unificação a partir de 2020 — é o que você deve usar hoje). Bibliotecas antigas podem mirar <strong>.NET Standard</strong>, uma especificação que diz "esta DLL roda tanto em Framework quanto em Core/.NET 5+".
      </p>

      <h2>Plataformas suportadas</h2>
      <ul>
        <li><strong>Windows</strong> 10/11, Windows Server 2016+.</li>
        <li><strong>Linux</strong>: Ubuntu, Debian, Fedora, Alpine, RHEL, openSUSE — x64 e ARM64.</li>
        <li><strong>macOS</strong> 11+ (Intel e Apple Silicon).</li>
        <li>Mobile via <strong>.NET MAUI</strong> (iOS, Android).</li>
        <li>WebAssembly via <strong>Blazor WASM</strong> (roda no navegador!).</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>"Instalei o Runtime mas não consigo compilar":</strong> você precisa do SDK, não só do Runtime.</li>
        <li><strong>Misturar versões:</strong> tentar rodar um app feito para .NET 8 com apenas o Runtime do .NET 6. Sempre cheque o <code>TargetFramework</code> do projeto.</li>
        <li><strong>Ignorar o GC pensando em performance:</strong> evite criar milhões de objetos pequenos em loops quentes; use <code>Span&lt;T&gt;</code> e <code>StringBuilder</code> quando preciso.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>SDK = ferramentas para construir + Runtime; Runtime = só executar.</li>
        <li>O CLR carrega, compila (JIT) e executa a IL gerada pelo Roslyn.</li>
        <li>Native AOT compila tudo antes, gerando binário nativo standalone.</li>
        <li>BCL é a biblioteca padrão (Console, File, HttpClient, etc.).</li>
        <li>O GC libera memória automaticamente; você só cuida de recursos via <code>using</code>.</li>
        <li>.NET 8/9 é multiplataforma: Windows, Linux, macOS, mobile e Web.</li>
      </ul>
    </PageContainer>
  );
}
