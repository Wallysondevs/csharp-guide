import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DotnetCli() {
  return (
    <PageContainer
      title="O CLI dotnet: comandos essenciais"
      subtitle="Domine os comandos de linha que você vai digitar todo santo dia: criar, compilar, rodar, testar, publicar."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        A CLI <code>dotnet</code> é o canivete suíço do desenvolvedor C#. Tudo o que uma IDE pesada como o Visual Studio faz por baixo dos panos pode ser feito a partir do terminal com <code>dotnet algo</code>. Aprender esses comandos é libertador: você fica independente de IDE, consegue automatizar builds em servidores, escrever scripts e entender o que o "botão verde" da IDE realmente faz. Pense no <code>dotnet</code> como o <code>git</code> do mundo .NET — ubíquo, indispensável.
      </p>

      <h2>Anatomia de um comando dotnet</h2>
      <p>
        Todo comando segue o padrão <code>dotnet &lt;verbo&gt; [argumentos] [opções]</code>. O verbo é a ação (<code>new</code>, <code>build</code>, <code>run</code>...), os argumentos especificam o alvo, e as opções refinam o comportamento (geralmente começam com <code>-</code> ou <code>--</code>). Quando em dúvida, <code>dotnet --help</code> e <code>dotnet &lt;verbo&gt; --help</code> mostram tudo.
      </p>
      <pre><code>{`# Estrutura geral
dotnet <verbo> [args] [--opcao valor]

# Exemplos:
dotnet new console -n MeuApp -o ./pasta-app
dotnet build --configuration Release
dotnet run --project ./MeuApp/MeuApp.csproj
dotnet test --filter "Category=Integration"`}</code></pre>

      <h2>Tabela dos comandos que você usará 90% do tempo</h2>
      <table>
        <thead>
          <tr><th>Comando</th><th>O que faz</th></tr>
        </thead>
        <tbody>
          <tr><td><code>dotnet new</code></td><td>Cria projeto/arquivo a partir de template (console, web, classlib, gitignore, etc.)</td></tr>
          <tr><td><code>dotnet restore</code></td><td>Baixa pacotes NuGet listados no .csproj</td></tr>
          <tr><td><code>dotnet build</code></td><td>Compila o projeto, gera .dll em <code>bin/</code></td></tr>
          <tr><td><code>dotnet run</code></td><td>Compila (se necessário) e executa o projeto</td></tr>
          <tr><td><code>dotnet watch</code></td><td>Roda o projeto e reinicia automaticamente quando arquivos mudam</td></tr>
          <tr><td><code>dotnet test</code></td><td>Executa testes (xUnit, NUnit, MSTest)</td></tr>
          <tr><td><code>dotnet publish</code></td><td>Gera artefato final pronto para deploy</td></tr>
          <tr><td><code>dotnet add package</code></td><td>Adiciona dependência NuGet ao .csproj</td></tr>
          <tr><td><code>dotnet add reference</code></td><td>Referencia outro projeto da solução</td></tr>
          <tr><td><code>dotnet tool install</code></td><td>Instala ferramenta global (ex.: <code>dotnet-ef</code>)</td></tr>
          <tr><td><code>dotnet --list-sdks</code></td><td>Lista versões de SDK instaladas</td></tr>
          <tr><td><code>dotnet clean</code></td><td>Apaga <code>bin/</code> e <code>obj/</code></td></tr>
        </tbody>
      </table>

      <h2>Criando projetos com <code>dotnet new</code></h2>
      <p>
        O verbo <code>new</code> aceita dezenas de templates. Veja o que está disponível com <code>dotnet new list</code>. Os mais comuns:
      </p>
      <pre><code>{`# Aplicação console (a base de tudo)
dotnet new console -n CalculadoraApp

# Biblioteca de classes (DLL reutilizável)
dotnet new classlib -n MinhaLib

# API web minimalista
dotnet new web -n MinhaApi

# API web com controllers
dotnet new webapi -n MinhaApi

# Projeto de teste xUnit
dotnet new xunit -n MinhaApp.Tests

# Solution (.sln) — agrupa vários projetos
dotnet new sln -n MeuSistema

# Adicionar projeto à solution
dotnet sln add ./CalculadoraApp/CalculadoraApp.csproj

# .gitignore padrão para projetos .NET
dotnet new gitignore`}</code></pre>
      <p>
        A opção <code>-n</code> define o nome (que vira nome do diretório, do .csproj e do namespace raiz). A opção <code>-o</code> define a pasta de saída. Sem <code>-o</code>, o template é criado dentro do diretório atual.
      </p>

      <h2>Compilando e executando</h2>
      <p>
        <code>dotnet build</code> compila o projeto e coloca os artefatos em <code>bin/Debug/net9.0/</code>. <code>dotnet run</code> faz a mesma coisa <em>e</em> executa o resultado. A diferença importa em CI/CD, onde você pode querer só compilar para depois rodar testes.
      </p>
      <pre><code>{`# Build em modo Debug (padrão)
dotnet build

# Build otimizado para produção
dotnet build -c Release

# Roda o projeto e passa argumentos para Main
dotnet run -- ola tchau
# (tudo após o "--" vai para args)

# Hot reload: reinicia ao salvar arquivo
dotnet watch run`}</code></pre>

      <AlertBox type="info" title="dotnet watch é mágico">
        Em desenvolvimento web (<code>dotnet watch</code> em projetos ASP.NET Core), além de reiniciar o app, o navegador conectado é atualizado automaticamente — equivalente ao "live reload" do mundo JS. Para apps console, ele apenas reinicia o processo.
      </AlertBox>

      <h2>Gerenciando pacotes NuGet</h2>
      <p>
        <strong>NuGet</strong> é o repositório oficial de bibliotecas .NET (equivalente ao npm do Node.js, ao Maven Central do Java). Adicionar uma dependência é trivial:
      </p>
      <pre><code>{`# Adiciona Newtonsoft.Json (JSON popular)
dotnet add package Newtonsoft.Json

# Versão específica
dotnet add package Serilog --version 4.0.1

# Remover
dotnet remove package Newtonsoft.Json

# Listar pacotes do projeto
dotnet list package

# Ver atualizações disponíveis
dotnet list package --outdated

# Restaurar todos os pacotes (depois de git clone)
dotnet restore`}</code></pre>

      <h2>Publicando para produção</h2>
      <p>
        <code>dotnet publish</code> empacota tudo necessário para rodar o app em outra máquina. Você escolhe se quer um build "framework-dependent" (precisa do Runtime instalado no destino, mais leve) ou "self-contained" (traz tudo junto, ~70 MB, roda em máquina limpa).
      </p>
      <pre><code>{`# Publicação padrão (precisa do .NET no destino)
dotnet publish -c Release -o ./dist

# Self-contained para Linux x64
dotnet publish -c Release -r linux-x64 --self-contained -o ./dist

# Single-file: tudo em um único executável
dotnet publish -c Release -r win-x64 \\
  --self-contained \\
  -p:PublishSingleFile=true \\
  -p:IncludeNativeLibrariesForSelfExtract=true

# Native AOT (compilação ahead-of-time, sem CLR)
dotnet publish -c Release -r linux-x64 \\
  -p:PublishAot=true`}</code></pre>

      <h2>Ferramentas globais</h2>
      <p>
        Você pode instalar utilitários de linha de comando escritos em .NET globalmente — eles ficam disponíveis em qualquer pasta. As mais úteis:
      </p>
      <pre><code>{`# Entity Framework Core CLI (migrations)
dotnet tool install --global dotnet-ef

# Gerador de manifesto OpenAPI
dotnet tool install --global Microsoft.dotnet-openapi

# Ferramenta de formatação de código
dotnet tool install --global dotnet-format

# Listar instaladas
dotnet tool list --global

# Atualizar todas
dotnet tool update --global dotnet-ef`}</code></pre>

      <AlertBox type="warning" title="Adicione ~/.dotnet/tools ao PATH">
        Ferramentas globais ficam em <code>~/.dotnet/tools</code> (Linux/Mac) ou <code>%USERPROFILE%\\.dotnet\\tools</code> (Windows). Se o comando "não foi encontrado" após instalar, garanta que essa pasta está no seu PATH.
      </AlertBox>

      <h2>Workflow típico do dia a dia</h2>
      <pre><code>{`# 1. Clonou um repositório novo
git clone https://github.com/exemplo/projeto.git
cd projeto

# 2. Restaura pacotes (geralmente automático no build)
dotnet restore

# 3. Compila e roda
dotnet run --project src/Api

# 4. Roda os testes
dotnet test

# 5. Publica para deploy
dotnet publish src/Api -c Release -o ./out

# 6. Limpa artefatos
dotnet clean`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>"No project found":</strong> rodando <code>dotnet build</code> em pasta sem <code>.csproj</code>. Entre na pasta certa ou aponte: <code>dotnet build ./caminho/MeuApp.csproj</code>.</li>
        <li><strong>"Could not execute because the specified command was not found":</strong> ferramenta global instalada mas PATH não inclui <code>~/.dotnet/tools</code>.</li>
        <li><strong>Esquecer o <code>--</code> em <code>dotnet run</code>:</strong> sem ele, opções são interpretadas pela CLI, não pelo seu app. Use <code>dotnet run -- meusargs</code>.</li>
        <li><strong>Build em Debug enviado para produção:</strong> sempre publique com <code>-c Release</code> — Debug é mais lento e contém metadados extras.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dotnet new</code> cria projeto a partir de template.</li>
        <li><code>dotnet build</code> compila; <code>dotnet run</code> compila e executa.</li>
        <li><code>dotnet watch</code> reinicia ao salvar; ótimo para desenvolvimento.</li>
        <li><code>dotnet add package</code> instala dependências NuGet.</li>
        <li><code>dotnet publish -c Release</code> gera artefato de produção.</li>
        <li><code>dotnet tool install -g</code> instala utilitários globais.</li>
      </ul>
    </PageContainer>
  );
}
