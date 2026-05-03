import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PublishDeploy() {
  return (
    <PageContainer
      title="Publish: framework-dependent vs self-contained"
      subtitle="Como gerar o pacote final para colocar a sua aplicação em produção."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <p>
        Escrever código é só metade do trabalho — em algum momento ele precisa rodar fora da sua máquina. O <code>dotnet publish</code> é o comando que prepara um diretório com tudo o que a aplicação precisa para iniciar. Mas "tudo" pode ter dois significados muito diferentes: ou você assume que o servidor já tem o runtime do .NET instalado (<strong>framework-dependent</strong>), ou você empacota o runtime junto (<strong>self-contained</strong>). Pense na analogia: framework-dependent é como mandar um arquivo Word — quem recebe precisa ter o Office; self-contained é como mandar um PDF — abre em qualquer lugar, mas é maior.
      </p>

      <h2>O básico: <code>dotnet publish</code></h2>
      <pre><code>{`# Publica em modo Release (default é Debug — nunca use em produção)
dotnet publish -c Release

# Saída: bin/Release/net9.0/publish/
#   MeuApp.dll          <- o seu código
#   MeuApp.runtimeconfig.json
#   MeuApp.deps.json
#   *.dll               <- dependências NuGet
#   appsettings.json`}</code></pre>
      <p>
        Esse é o modo <strong>framework-dependent</strong>. O servidor precisa ter o ASP.NET Core Runtime ou .NET Runtime instalado (a versão correspondente ao <code>TargetFramework</code> do projeto). Para rodar: <code>dotnet MeuApp.dll</code>.
      </p>

      <h2>Self-contained: levando o runtime junto</h2>
      <pre><code>{`# Self-contained para Linux x64
dotnet publish -c Release \\
    --runtime linux-x64 \\
    --self-contained true

# Saída tem ~80 MB (vs ~5 MB do framework-dependent)
# Mas não exige nenhum .NET instalado no servidor
# Para rodar: ./MeuApp (binário standalone, com dotnet embutido)`}</code></pre>
      <p>
        Cada Runtime Identifier (RID) gera um pacote diferente: <code>linux-x64</code>, <code>linux-arm64</code>, <code>win-x64</code>, <code>osx-arm64</code>, <code>linux-musl-x64</code> (para Alpine), etc. Você precisa publicar uma vez por arquitetura alvo.
      </p>

      <AlertBox type="info" title="Framework-dependent é menor, self-contained é mais portátil">
        Use framework-dependent em servidores que você controla e mantém atualizados. Use self-contained quando: o servidor não permite instalar runtime, você quer garantir uma versão exata do .NET independente do host, ou está distribuindo uma ferramenta para usuários finais.
      </AlertBox>

      <h2>Single-file: um único executável</h2>
      <pre><code>{`dotnet publish -c Release \\
    --runtime linux-x64 \\
    --self-contained true \\
    -p:PublishSingleFile=true \\
    -p:IncludeNativeLibrariesForSelfExtract=true`}</code></pre>
      <p>
        O resultado é um único arquivo binário (<em>bundle</em>) que, ao executar pela primeira vez, descompacta as DLLs em uma pasta temporária. Comodidade enorme para distribuição: um arquivo, copia, executa. Mas atenção: o "single file" ainda é grande (~70MB) e o primeiro startup é levemente mais lento por causa da extração.
      </p>

      <h2>Trimming + ReadyToRun</h2>
      <p>
        Duas otimizações úteis para reduzir tamanho e melhorar startup:
      </p>
      <pre><code>{`<!-- .csproj -->
<PropertyGroup>
  <PublishTrimmed>true</PublishTrimmed>     <!-- remove código não usado -->
  <TrimMode>partial</TrimMode>              <!-- ou "full" para AOT -->
  <PublishReadyToRun>true</PublishReadyToRun>  <!-- pré-compila IL para nativo -->
</PropertyGroup>`}</code></pre>
      <p>
        <strong>ReadyToRun</strong> (R2R) gera código nativo "preliminar" para os métodos junto com a IL — assim, no startup, o JIT não precisa traduzir do zero, ele já tem uma versão pronta (e depois pode otimizar mais com perfis). Reduz cold start em 30–50%, com custo de aumentar o binário em 30–50%. ReadyToRun é o "meio termo" entre JIT puro e Native AOT.
      </p>

      <h2>Configurações por ambiente</h2>
      <p>
        Em produção, você raramente quer o <code>appsettings.json</code> de desenvolvimento. O .NET carrega automaticamente <code>appsettings.{`{Environment}`}.json</code> baseado na variável <code>ASPNETCORE_ENVIRONMENT</code>:
      </p>
      <pre><code>{`# Em produção
export ASPNETCORE_ENVIRONMENT=Production
export ConnectionStrings__Default="Server=db;Database=app;User=sa;Password=..."
./MeuApp`}</code></pre>
      <p>
        Variáveis de ambiente sobrescrevem JSON, e o duplo underscore <code>__</code> mapeia para hierarquia (<code>ConnectionStrings__Default</code> = <code>"ConnectionStrings": {`{ "Default": ... }`}</code>).
      </p>

      <h2>Docker: o jeito moderno de empacotar</h2>
      <p>
        Para web APIs, a forma padrão hoje é container. Use <strong>multi-stage build</strong> para deixar a imagem final pequena: a primeira stage compila com SDK (~800MB), a segunda só copia o publish para uma imagem runtime (~200MB) ou Alpine (~120MB).
      </p>
      <pre><code>{`# Dockerfile multi-stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# 1) Restore separado para aproveitar cache de camada
COPY *.csproj ./
RUN dotnet restore

# 2) Copia o resto e publica
COPY . ./
RUN dotnet publish -c Release -o /app/publish \\
    /p:UseAppHost=false

# 3) Imagem final, sem SDK
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
USER app                  # imagens oficiais já têm usuário 'app' não-root
ENTRYPOINT ["dotnet", "MeuApp.dll"]`}</code></pre>
      <pre><code>{`docker build -t meuapp:1.0 .
docker run -p 8080:8080 -e ConnectionStrings__Default=... meuapp:1.0`}</code></pre>

      <AlertBox type="warning" title="Imagem chiseled e distroless">
        Para máxima segurança e tamanho mínimo, troque <code>aspnet:9.0</code> por <code>aspnet:9.0-noble-chiseled</code> (Microsoft) ou use <code>distroless</code> (Google). Sem shell, sem package manager, sem usuário root. Tamanho cai para ~80MB e a superfície de ataque praticamente some — mas você perde "docker exec" debug interativo.
      </AlertBox>

      <h2>Comparativo de tamanhos</h2>
      <pre><code>{`Estratégia                          Tamanho          Pré-requisito do host
----------------------------------- ---------------- --------------------------
Framework-dependent                 ~5 MB            .NET runtime instalado
Self-contained                      ~80 MB           Nenhum
Self-contained + single file        ~70 MB           Nenhum
Self-contained + trimmed            ~30 MB           Nenhum
Native AOT                          ~12 MB           Nenhum (mas com restrições)
Docker (aspnet base)                ~210 MB image    Docker
Docker (chiseled/distroless)        ~80 MB image     Docker`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Subir bin/Debug</strong> em produção — assertions, sem otimização do JIT, problemas de performance.</li>
        <li><strong>Misturar versões de runtime</strong> — projeto em net9.0, servidor com 8.0; <code>FrameworkException</code> ao iniciar.</li>
        <li><strong>Esquecer <code>--runtime</code></strong> ao publicar self-contained — gera para a sua plataforma local.</li>
        <li><strong>Subir <code>appsettings.Development.json</code></strong> com connection string local — vaza dados.</li>
        <li><strong>Imagem Docker rodando como root</strong> — risco de segurança; sempre <code>USER app</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Framework-dependent é menor, mas exige runtime no host.</li>
        <li>Self-contained leva tudo junto — mais portátil e maior.</li>
        <li>Single-file empacota num único binário extraível.</li>
        <li>Trimmed + ReadyToRun reduzem tamanho e melhoram cold start.</li>
        <li>Docker multi-stage é o padrão atual para web APIs em produção.</li>
      </ul>
    </PageContainer>
  );
}
