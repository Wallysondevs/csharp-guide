import{j as e}from"./index-CzLAthD5.js";import{P as d,A as o}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(d,{title:"O CLI dotnet: comandos essenciais",subtitle:"Domine os comandos de linha que você vai digitar todo santo dia: criar, compilar, rodar, testar, publicar.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs("p",{children:["A CLI ",e.jsx("code",{children:"dotnet"})," é o canivete suíço do desenvolvedor C#. Tudo o que uma IDE pesada como o Visual Studio faz por baixo dos panos pode ser feito a partir do terminal com ",e.jsx("code",{children:"dotnet algo"}),'. Aprender esses comandos é libertador: você fica independente de IDE, consegue automatizar builds em servidores, escrever scripts e entender o que o "botão verde" da IDE realmente faz. Pense no ',e.jsx("code",{children:"dotnet"})," como o ",e.jsx("code",{children:"git"})," do mundo .NET — ubíquo, indispensável."]}),e.jsx("h2",{children:"Anatomia de um comando dotnet"}),e.jsxs("p",{children:["Todo comando segue o padrão ",e.jsx("code",{children:"dotnet <verbo> [argumentos] [opções]"}),". O verbo é a ação (",e.jsx("code",{children:"new"}),", ",e.jsx("code",{children:"build"}),", ",e.jsx("code",{children:"run"}),"...), os argumentos especificam o alvo, e as opções refinam o comportamento (geralmente começam com ",e.jsx("code",{children:"-"})," ou ",e.jsx("code",{children:"--"}),"). Quando em dúvida, ",e.jsx("code",{children:"dotnet --help"})," e ",e.jsx("code",{children:"dotnet <verbo> --help"})," mostram tudo."]}),e.jsx("pre",{children:e.jsx("code",{children:`# Estrutura geral
dotnet <verbo> [args] [--opcao valor]

# Exemplos:
dotnet new console -n MeuApp -o ./pasta-app
dotnet build --configuration Release
dotnet run --project ./MeuApp/MeuApp.csproj
dotnet test --filter "Category=Integration"`})}),e.jsx("h2",{children:"Tabela dos comandos que você usará 90% do tempo"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Comando"}),e.jsx("th",{children:"O que faz"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"dotnet new"})}),e.jsx("td",{children:"Cria projeto/arquivo a partir de template (console, web, classlib, gitignore, etc.)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"dotnet restore"})}),e.jsx("td",{children:"Baixa pacotes NuGet listados no .csproj"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"dotnet build"})}),e.jsxs("td",{children:["Compila o projeto, gera .dll em ",e.jsx("code",{children:"bin/"})]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"dotnet run"})}),e.jsx("td",{children:"Compila (se necessário) e executa o projeto"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"dotnet watch"})}),e.jsx("td",{children:"Roda o projeto e reinicia automaticamente quando arquivos mudam"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"dotnet test"})}),e.jsx("td",{children:"Executa testes (xUnit, NUnit, MSTest)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"dotnet publish"})}),e.jsx("td",{children:"Gera artefato final pronto para deploy"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"dotnet add package"})}),e.jsx("td",{children:"Adiciona dependência NuGet ao .csproj"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"dotnet add reference"})}),e.jsx("td",{children:"Referencia outro projeto da solução"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"dotnet tool install"})}),e.jsxs("td",{children:["Instala ferramenta global (ex.: ",e.jsx("code",{children:"dotnet-ef"}),")"]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"dotnet --list-sdks"})}),e.jsx("td",{children:"Lista versões de SDK instaladas"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"dotnet clean"})}),e.jsxs("td",{children:["Apaga ",e.jsx("code",{children:"bin/"})," e ",e.jsx("code",{children:"obj/"})]})]})]})]}),e.jsxs("h2",{children:["Criando projetos com ",e.jsx("code",{children:"dotnet new"})]}),e.jsxs("p",{children:["O verbo ",e.jsx("code",{children:"new"})," aceita dezenas de templates. Veja o que está disponível com ",e.jsx("code",{children:"dotnet new list"}),". Os mais comuns:"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Aplicação console (a base de tudo)
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
dotnet new gitignore`})}),e.jsxs("p",{children:["A opção ",e.jsx("code",{children:"-n"})," define o nome (que vira nome do diretório, do .csproj e do namespace raiz). A opção ",e.jsx("code",{children:"-o"})," define a pasta de saída. Sem ",e.jsx("code",{children:"-o"}),", o template é criado dentro do diretório atual."]}),e.jsx("h2",{children:"Compilando e executando"}),e.jsxs("p",{children:[e.jsx("code",{children:"dotnet build"})," compila o projeto e coloca os artefatos em ",e.jsx("code",{children:"bin/Debug/net9.0/"}),". ",e.jsx("code",{children:"dotnet run"})," faz a mesma coisa ",e.jsx("em",{children:"e"})," executa o resultado. A diferença importa em CI/CD, onde você pode querer só compilar para depois rodar testes."]}),e.jsx("pre",{children:e.jsx("code",{children:`# Build em modo Debug (padrão)
dotnet build

# Build otimizado para produção
dotnet build -c Release

# Roda o projeto e passa argumentos para Main
dotnet run -- ola tchau
# (tudo após o "--" vai para args)

# Hot reload: reinicia ao salvar arquivo
dotnet watch run`})}),e.jsxs(o,{type:"info",title:"dotnet watch é mágico",children:["Em desenvolvimento web (",e.jsx("code",{children:"dotnet watch"}),' em projetos ASP.NET Core), além de reiniciar o app, o navegador conectado é atualizado automaticamente — equivalente ao "live reload" do mundo JS. Para apps console, ele apenas reinicia o processo.']}),e.jsx("h2",{children:"Gerenciando pacotes NuGet"}),e.jsxs("p",{children:[e.jsx("strong",{children:"NuGet"})," é o repositório oficial de bibliotecas .NET (equivalente ao npm do Node.js, ao Maven Central do Java). Adicionar uma dependência é trivial:"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Adiciona Newtonsoft.Json (JSON popular)
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
dotnet restore`})}),e.jsx("h2",{children:"Publicando para produção"}),e.jsxs("p",{children:[e.jsx("code",{children:"dotnet publish"}),' empacota tudo necessário para rodar o app em outra máquina. Você escolhe se quer um build "framework-dependent" (precisa do Runtime instalado no destino, mais leve) ou "self-contained" (traz tudo junto, ~70 MB, roda em máquina limpa).']}),e.jsx("pre",{children:e.jsx("code",{children:`# Publicação padrão (precisa do .NET no destino)
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
  -p:PublishAot=true`})}),e.jsx("h2",{children:"Ferramentas globais"}),e.jsx("p",{children:"Você pode instalar utilitários de linha de comando escritos em .NET globalmente — eles ficam disponíveis em qualquer pasta. As mais úteis:"}),e.jsx("pre",{children:e.jsx("code",{children:`# Entity Framework Core CLI (migrations)
dotnet tool install --global dotnet-ef

# Gerador de manifesto OpenAPI
dotnet tool install --global Microsoft.dotnet-openapi

# Ferramenta de formatação de código
dotnet tool install --global dotnet-format

# Listar instaladas
dotnet tool list --global

# Atualizar todas
dotnet tool update --global dotnet-ef`})}),e.jsxs(o,{type:"warning",title:"Adicione ~/.dotnet/tools ao PATH",children:["Ferramentas globais ficam em ",e.jsx("code",{children:"~/.dotnet/tools"})," (Linux/Mac) ou ",e.jsx("code",{children:"%USERPROFILE%\\\\.dotnet\\\\tools"}),' (Windows). Se o comando "não foi encontrado" após instalar, garanta que essa pasta está no seu PATH.']}),e.jsx("h2",{children:"Workflow típico do dia a dia"}),e.jsx("pre",{children:e.jsx("code",{children:`# 1. Clonou um repositório novo
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
dotnet clean`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:'"No project found":'})," rodando ",e.jsx("code",{children:"dotnet build"})," em pasta sem ",e.jsx("code",{children:".csproj"}),". Entre na pasta certa ou aponte: ",e.jsx("code",{children:"dotnet build ./caminho/MeuApp.csproj"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"Could not execute because the specified command was not found":'})," ferramenta global instalada mas PATH não inclui ",e.jsx("code",{children:"~/.dotnet/tools"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer o ",e.jsx("code",{children:"--"})," em ",e.jsx("code",{children:"dotnet run"}),":"]})," sem ele, opções são interpretadas pela CLI, não pelo seu app. Use ",e.jsx("code",{children:"dotnet run -- meusargs"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Build em Debug enviado para produção:"})," sempre publique com ",e.jsx("code",{children:"-c Release"})," — Debug é mais lento e contém metadados extras."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"dotnet new"})," cria projeto a partir de template."]}),e.jsxs("li",{children:[e.jsx("code",{children:"dotnet build"})," compila; ",e.jsx("code",{children:"dotnet run"})," compila e executa."]}),e.jsxs("li",{children:[e.jsx("code",{children:"dotnet watch"})," reinicia ao salvar; ótimo para desenvolvimento."]}),e.jsxs("li",{children:[e.jsx("code",{children:"dotnet add package"})," instala dependências NuGet."]}),e.jsxs("li",{children:[e.jsx("code",{children:"dotnet publish -c Release"})," gera artefato de produção."]}),e.jsxs("li",{children:[e.jsx("code",{children:"dotnet tool install -g"})," instala utilitários globais."]})]})]})}export{s as default};
