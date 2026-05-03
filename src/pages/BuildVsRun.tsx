import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BuildVsRun() {
  return (
    <PageContainer
      title="Build, Restore, Run: o ciclo completo"
      subtitle="Entenda o que cada comando do .NET CLI faz por baixo dos panos — e por que existem três etapas distintas."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Quando você digita <code>dotnet run</code>, o terminal cospe um "Olá, mundo!" alguns segundos depois. Parece mágica, mas internamente acontecem <strong>três etapas bem definidas</strong>: <em>restore</em> (baixar dependências), <em>build</em> (compilar o código) e <em>run</em> (executar o binário). Entender cada uma transforma você de "alguém que aperta botão" em "alguém que sabe consertar quando algo dá errado". Pense nesse capítulo como abrir o capô do carro: você não vai virar mecânico, mas vai parar de ter medo.
      </p>

      <h2>Restore: baixando os ingredientes</h2>
      <p>
        Quase todo projeto .NET depende de <strong>pacotes NuGet</strong> — bibliotecas reutilizáveis publicadas por terceiros (a Microsoft, comunidades, ou você mesmo). NuGet é o gerenciador de pacotes oficial do .NET, equivalente ao npm do Node.js ou pip do Python. As dependências são listadas no arquivo <code>.csproj</code> (XML que descreve seu projeto) em tags <code>&lt;PackageReference&gt;</code>.
      </p>
      <pre><code>{`<!-- Trecho de um arquivo MeuApp.csproj -->
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net9.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
  </ItemGroup>
</Project>`}</code></pre>
      <p>
        O comando <code>dotnet restore</code> lê esse XML, vai até o servidor do nuget.org, baixa cada pacote (e os pacotes dos quais ele depende, transitivamente) e guarda tudo numa pasta global em <code>~/.nuget/packages</code>. Ele também gera um <code>obj/project.assets.json</code> que mapeia exatamente quais versões foram resolvidas — assim a build seguinte é determinística.
      </p>

      <AlertBox type="info" title="Restore implícito">
        Desde o .NET 5, comandos como <code>dotnet build</code> e <code>dotnet run</code> chamam <code>restore</code> automaticamente quando notam que faltam pacotes. Você só precisa rodar manualmente se quiser forçar uma re-resolução (ex.: <code>dotnet restore --force</code>).
      </AlertBox>

      <h2>Build: do código-fonte ao binário</h2>
      <p>
        <code>dotnet build</code> é onde o <strong>compilador</strong> (chamado <em>Roslyn</em>) entra em cena. Ele lê todos os arquivos <code>.cs</code> do projeto, verifica se a sintaxe e os tipos estão corretos e gera dois tipos de saída na pasta <code>bin/</code>: um arquivo <code>.dll</code> (sua biblioteca/aplicação em <em>IL</em> — Intermediate Language, uma linguagem intermediária parecida com bytecode) e, se for executável, um pequeno wrapper nativo do seu sistema operacional.
      </p>
      <pre><code>{`# Compila em modo Debug (padrão)
dotnet build

# Estrutura gerada:
# MeuApp/
#   bin/
#     Debug/
#       net9.0/
#         MeuApp.dll          <- seu código compilado em IL
#         MeuApp.pdb          <- símbolos para debug
#         MeuApp.deps.json    <- mapa de dependências
#         MeuApp.runtimeconfig.json
#   obj/
#     Debug/net9.0/...        <- arquivos intermediários e cache`}</code></pre>
      <p>
        A pasta <code>bin/</code> contém o <strong>resultado final</strong> que você distribuiria. A pasta <code>obj/</code> guarda <strong>cache de build</strong>: hashes dos arquivos, IL parcial, gráficos de dependência. Isso permite a chamada <em>incremental build</em> — se você mudar só um <code>.cs</code>, o compilador detecta via timestamp/hash e recompila apenas o necessário, em vez de tudo do zero.
      </p>

      <h2>Debug vs Release</h2>
      <p>
        Toda build acontece em uma <strong>configuração</strong>. As duas padrão são <code>Debug</code> (otimizada para depurar: símbolos completos, sem otimizações agressivas, mais rápida de compilar) e <code>Release</code> (otimizada para rodar em produção: o JIT pode reordenar código, inlining agressivo, sem checagens extras).
      </p>
      <pre><code>{`# Build de produção
dotnet build -c Release

# Run em modo Release
dotnet run -c Release

# Você verá agora bin/Release/net9.0/...`}</code></pre>
      <p>
        Nunca distribua a versão Debug para usuários finais: ela é mais lenta e expõe metadados internos. Sempre publique com <code>-c Release</code>.
      </p>

      <AlertBox type="warning" title="Bug que só acontece em Release">
        Às vezes o compilador em modo Release otimiza tão agressivamente que código incorreto (mas que parecia funcionar em Debug) começa a falhar — geralmente por uso indevido de threads ou variáveis não voláteis. Se algo "só dá errado em produção", teste localmente com <code>-c Release</code>.
      </AlertBox>

      <h2>RID: o identificador do runtime</h2>
      <p>
        Por padrão, <code>dotnet build</code> gera um binário <strong>portável</strong>: precisa do .NET instalado na máquina destino. Se você quer um executável <em>self-contained</em> (que carrega o runtime junto), precisa especificar um <strong>RID</strong> (Runtime IDentifier) — uma string que descreve o sistema operacional + arquitetura do CPU.
      </p>
      <pre><code>{`# Publica para Linux x64, com runtime embutido
dotnet publish -c Release -r linux-x64 --self-contained true

# Para Windows ARM64
dotnet publish -c Release -r win-arm64 --self-contained true

# Para macOS Apple Silicon
dotnet publish -c Release -r osx-arm64 --self-contained true`}</code></pre>
      <p>
        RIDs comuns: <code>win-x64</code>, <code>linux-x64</code>, <code>linux-arm64</code>, <code>osx-x64</code>, <code>osx-arm64</code>. O resultado vai parar em <code>bin/Release/net9.0/{`<rid>`}/publish/</code> e contém um único executável que roda mesmo em uma máquina sem .NET instalado.
      </p>

      <h2>Run: executar o que foi compilado</h2>
      <p>
        <code>dotnet run</code> é um atalho conveniente: ele faz restore (se necessário), build (se necessário) e em seguida executa o binário. É ótimo para desenvolvimento, mas <strong>não use em produção</strong> — em produção você usa o resultado de <code>dotnet publish</code> diretamente.
      </p>
      <pre><code>{`# Atalho de desenvolvimento
dotnet run

# Equivale (mais ou menos) a:
dotnet restore
dotnet build
dotnet bin/Debug/net9.0/MeuApp.dll

# Passar argumentos para o programa (note o "--"):
dotnet run -- arg1 arg2 arg3`}</code></pre>

      <h2>Limpando o cache: dotnet clean</h2>
      <p>
        Às vezes a build começa a se comportar de forma estranha (erros que somem ao reiniciar, arquivos antigos sendo carregados). Isso geralmente é cache em <code>bin/</code> ou <code>obj/</code> ficando inconsistente.
      </p>
      <pre><code>{`# Apaga bin/ e obj/ desta configuração
dotnet clean

# Equivalente "marreta": apagar tudo na unha
rm -rf bin obj    # Linux/Mac
# ou no Windows PowerShell:
# Remove-Item -Recurse -Force bin, obj`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>"Unable to find package X"</strong>: pacote escrito errado no <code>.csproj</code>, ou versão inexistente. Confira em nuget.org.</li>
        <li><strong>"Project file does not exist"</strong>: você está rodando <code>dotnet build</code> fora da pasta com o <code>.csproj</code>. Passe o caminho ou entre na pasta.</li>
        <li><strong>Build fica eterna em CI</strong>: cache de NuGet não está sendo reaproveitado entre execuções. Configure cache de <code>~/.nuget/packages</code> no seu pipeline.</li>
        <li><strong>Mudou código mas executa o antigo</strong>: provavelmente está rodando o <code>.dll</code> direto, sem rebuild. Use <code>dotnet run</code> ou rode <code>dotnet build</code> antes.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dotnet restore</code> baixa pacotes NuGet listados no <code>.csproj</code>.</li>
        <li><code>dotnet build</code> compila <code>.cs</code> → <code>.dll</code> em IL, gerando <code>bin/</code> e <code>obj/</code>.</li>
        <li><code>obj/</code> é cache; <code>bin/</code> é resultado distribuível.</li>
        <li>Debug é para desenvolver; Release é para produção (mais otimizado).</li>
        <li>RID descreve o destino: <code>linux-x64</code>, <code>win-arm64</code>, etc., usado em <code>dotnet publish</code>.</li>
        <li><code>dotnet run</code> é atalho dev (restore + build + executar).</li>
        <li><code>dotnet clean</code> apaga caches quando algo emperra.</li>
      </ul>
    </PageContainer>
  );
}
