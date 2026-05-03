import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(r,{title:"Publish: framework-dependent vs self-contained",subtitle:"Como gerar o pacote final para colocar a sua aplicação em produção.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsxs("p",{children:["Escrever código é só metade do trabalho — em algum momento ele precisa rodar fora da sua máquina. O ",e.jsx("code",{children:"dotnet publish"}),' é o comando que prepara um diretório com tudo o que a aplicação precisa para iniciar. Mas "tudo" pode ter dois significados muito diferentes: ou você assume que o servidor já tem o runtime do .NET instalado (',e.jsx("strong",{children:"framework-dependent"}),"), ou você empacota o runtime junto (",e.jsx("strong",{children:"self-contained"}),"). Pense na analogia: framework-dependent é como mandar um arquivo Word — quem recebe precisa ter o Office; self-contained é como mandar um PDF — abre em qualquer lugar, mas é maior."]}),e.jsxs("h2",{children:["O básico: ",e.jsx("code",{children:"dotnet publish"})]}),e.jsx("pre",{children:e.jsx("code",{children:`# Publica em modo Release (default é Debug — nunca use em produção)
dotnet publish -c Release

# Saída: bin/Release/net9.0/publish/
#   MeuApp.dll          <- o seu código
#   MeuApp.runtimeconfig.json
#   MeuApp.deps.json
#   *.dll               <- dependências NuGet
#   appsettings.json`})}),e.jsxs("p",{children:["Esse é o modo ",e.jsx("strong",{children:"framework-dependent"}),". O servidor precisa ter o ASP.NET Core Runtime ou .NET Runtime instalado (a versão correspondente ao ",e.jsx("code",{children:"TargetFramework"})," do projeto). Para rodar: ",e.jsx("code",{children:"dotnet MeuApp.dll"}),"."]}),e.jsx("h2",{children:"Self-contained: levando o runtime junto"}),e.jsx("pre",{children:e.jsx("code",{children:`# Self-contained para Linux x64
dotnet publish -c Release \\
    --runtime linux-x64 \\
    --self-contained true

# Saída tem ~80 MB (vs ~5 MB do framework-dependent)
# Mas não exige nenhum .NET instalado no servidor
# Para rodar: ./MeuApp (binário standalone, com dotnet embutido)`})}),e.jsxs("p",{children:["Cada Runtime Identifier (RID) gera um pacote diferente: ",e.jsx("code",{children:"linux-x64"}),", ",e.jsx("code",{children:"linux-arm64"}),", ",e.jsx("code",{children:"win-x64"}),", ",e.jsx("code",{children:"osx-arm64"}),", ",e.jsx("code",{children:"linux-musl-x64"})," (para Alpine), etc. Você precisa publicar uma vez por arquitetura alvo."]}),e.jsx(o,{type:"info",title:"Framework-dependent é menor, self-contained é mais portátil",children:"Use framework-dependent em servidores que você controla e mantém atualizados. Use self-contained quando: o servidor não permite instalar runtime, você quer garantir uma versão exata do .NET independente do host, ou está distribuindo uma ferramenta para usuários finais."}),e.jsx("h2",{children:"Single-file: um único executável"}),e.jsx("pre",{children:e.jsx("code",{children:`dotnet publish -c Release \\
    --runtime linux-x64 \\
    --self-contained true \\
    -p:PublishSingleFile=true \\
    -p:IncludeNativeLibrariesForSelfExtract=true`})}),e.jsxs("p",{children:["O resultado é um único arquivo binário (",e.jsx("em",{children:"bundle"}),') que, ao executar pela primeira vez, descompacta as DLLs em uma pasta temporária. Comodidade enorme para distribuição: um arquivo, copia, executa. Mas atenção: o "single file" ainda é grande (~70MB) e o primeiro startup é levemente mais lento por causa da extração.']}),e.jsx("h2",{children:"Trimming + ReadyToRun"}),e.jsx("p",{children:"Duas otimizações úteis para reduzir tamanho e melhorar startup:"}),e.jsx("pre",{children:e.jsx("code",{children:`<!-- .csproj -->
<PropertyGroup>
  <PublishTrimmed>true</PublishTrimmed>     <!-- remove código não usado -->
  <TrimMode>partial</TrimMode>              <!-- ou "full" para AOT -->
  <PublishReadyToRun>true</PublishReadyToRun>  <!-- pré-compila IL para nativo -->
</PropertyGroup>`})}),e.jsxs("p",{children:[e.jsx("strong",{children:"ReadyToRun"}),' (R2R) gera código nativo "preliminar" para os métodos junto com a IL — assim, no startup, o JIT não precisa traduzir do zero, ele já tem uma versão pronta (e depois pode otimizar mais com perfis). Reduz cold start em 30–50%, com custo de aumentar o binário em 30–50%. ReadyToRun é o "meio termo" entre JIT puro e Native AOT.']}),e.jsx("h2",{children:"Configurações por ambiente"}),e.jsxs("p",{children:["Em produção, você raramente quer o ",e.jsx("code",{children:"appsettings.json"})," de desenvolvimento. O .NET carrega automaticamente ",e.jsxs("code",{children:["appsettings.","{Environment}",".json"]})," baseado na variável ",e.jsx("code",{children:"ASPNETCORE_ENVIRONMENT"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Em produção
export ASPNETCORE_ENVIRONMENT=Production
export ConnectionStrings__Default="Server=db;Database=app;User=sa;Password=..."
./MeuApp`})}),e.jsxs("p",{children:["Variáveis de ambiente sobrescrevem JSON, e o duplo underscore ",e.jsx("code",{children:"__"})," mapeia para hierarquia (",e.jsx("code",{children:"ConnectionStrings__Default"})," = ",e.jsxs("code",{children:['"ConnectionStrings": ','{ "Default": ... }']}),")."]}),e.jsx("h2",{children:"Docker: o jeito moderno de empacotar"}),e.jsxs("p",{children:["Para web APIs, a forma padrão hoje é container. Use ",e.jsx("strong",{children:"multi-stage build"})," para deixar a imagem final pequena: a primeira stage compila com SDK (~800MB), a segunda só copia o publish para uma imagem runtime (~200MB) ou Alpine (~120MB)."]}),e.jsx("pre",{children:e.jsx("code",{children:`# Dockerfile multi-stage
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
ENTRYPOINT ["dotnet", "MeuApp.dll"]`})}),e.jsx("pre",{children:e.jsx("code",{children:`docker build -t meuapp:1.0 .
docker run -p 8080:8080 -e ConnectionStrings__Default=... meuapp:1.0`})}),e.jsxs(o,{type:"warning",title:"Imagem chiseled e distroless",children:["Para máxima segurança e tamanho mínimo, troque ",e.jsx("code",{children:"aspnet:9.0"})," por ",e.jsx("code",{children:"aspnet:9.0-noble-chiseled"})," (Microsoft) ou use ",e.jsx("code",{children:"distroless"}),' (Google). Sem shell, sem package manager, sem usuário root. Tamanho cai para ~80MB e a superfície de ataque praticamente some — mas você perde "docker exec" debug interativo.']}),e.jsx("h2",{children:"Comparativo de tamanhos"}),e.jsx("pre",{children:e.jsx("code",{children:`Estratégia                          Tamanho          Pré-requisito do host
----------------------------------- ---------------- --------------------------
Framework-dependent                 ~5 MB            .NET runtime instalado
Self-contained                      ~80 MB           Nenhum
Self-contained + single file        ~70 MB           Nenhum
Self-contained + trimmed            ~30 MB           Nenhum
Native AOT                          ~12 MB           Nenhum (mas com restrições)
Docker (aspnet base)                ~210 MB image    Docker
Docker (chiseled/distroless)        ~80 MB image     Docker`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Subir bin/Debug"})," em produção — assertions, sem otimização do JIT, problemas de performance."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar versões de runtime"})," — projeto em net9.0, servidor com 8.0; ",e.jsx("code",{children:"FrameworkException"})," ao iniciar."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"--runtime"})]})," ao publicar self-contained — gera para a sua plataforma local."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Subir ",e.jsx("code",{children:"appsettings.Development.json"})]})," com connection string local — vaza dados."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Imagem Docker rodando como root"})," — risco de segurança; sempre ",e.jsx("code",{children:"USER app"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Framework-dependent é menor, mas exige runtime no host."}),e.jsx("li",{children:"Self-contained leva tudo junto — mais portátil e maior."}),e.jsx("li",{children:"Single-file empacota num único binário extraível."}),e.jsx("li",{children:"Trimmed + ReadyToRun reduzem tamanho e melhoram cold start."}),e.jsx("li",{children:"Docker multi-stage é o padrão atual para web APIs em produção."})]})]})}export{n as default};
