import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(s,{title:"Instalando o .NET SDK no Windows, Linux e macOS",subtitle:"Um passo a passo prático para deixar seu computador pronto para escrever C# em qualquer sistema operacional.",difficulty:"iniciante",timeToRead:"10 min",children:[e.jsxs("p",{children:["Antes de escrever uma única linha de C#, você precisa instalar o ",e.jsx("strong",{children:".NET SDK"}),' — o "kit de desenvolvimento" que inclui o compilador, a CLI e o runtime. É como comprar um piano antes de aprender a tocar: sem o instrumento, nada feito. A boa notícia é que a Microsoft tornou a instalação trivial em qualquer sistema operacional moderno. Em 5 minutos você está pronto.']}),e.jsx("h2",{children:"SDK ou Runtime? Qual baixar?"}),e.jsxs("p",{children:["Lembre da distinção do capítulo anterior: o ",e.jsx("strong",{children:"Runtime"})," só executa programas .NET; o ",e.jsx("strong",{children:"SDK"})," inclui o Runtime ",e.jsx("em",{children:"e"})," tudo para construir programas. Como você está aprendendo a programar, sempre baixe o ",e.jsx("strong",{children:"SDK"}),". Ele já traz o Runtime junto."]}),e.jsx("pre",{children:e.jsx("code",{children:`# Após instalar, este comando deve funcionar em qualquer SO:
dotnet --version
# Saída esperada: 9.0.100 (ou versão mais recente)

dotnet --info
# Mostra SDKs instalados, runtimes, RID atual e variáveis de ambiente`})}),e.jsxs(o,{type:"info",title:"Sempre escolha LTS para produção",children:["Versões marcadas como ",e.jsx("strong",{children:"LTS"})," (Long-Term Support, ex.: .NET 8) recebem atualizações por 3 anos. As ",e.jsx("em",{children:"STS"})," (.NET 7, .NET 9) são suportadas por 18 meses. Para aprender, qualquer uma serve; para projetos sérios, prefira LTS."]}),e.jsx("h2",{children:"Instalação no Windows"}),e.jsxs("p",{children:["No Windows 10/11 a forma mais simples é via ",e.jsx("strong",{children:"winget"}),", o gerenciador de pacotes que vem instalado por padrão. Abra o PowerShell ou Terminal e rode:"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Lista versões disponíveis
winget search Microsoft.DotNet.SDK

# Instala a versão 9 (mais recente)
winget install Microsoft.DotNet.SDK.9

# Ou instala a LTS 8
winget install Microsoft.DotNet.SDK.8`})}),e.jsxs("p",{children:["Alternativa: baixar o instalador ",e.jsx("code",{children:".exe"})," do site oficial em ",e.jsx("code",{children:"dotnet.microsoft.com/download"}),". Ele cuida do PATH automaticamente. Depois, abra um ",e.jsx("em",{children:"novo"})," terminal (importante — terminais antigos não enxergam variáveis recém-adicionadas) e rode ",e.jsx("code",{children:"dotnet --info"}),"."]}),e.jsx("h2",{children:"Instalação no Linux (Ubuntu/Debian)"}),e.jsx("p",{children:"Em distros baseadas em Debian, a forma recomendada é o repositório oficial da Microsoft. Em Ubuntu 22.04 ou superior, o pacote já vem nos repositórios padrão do próprio Ubuntu — basta:"}),e.jsx("pre",{children:e.jsx("code",{children:`# Ubuntu 22.04+ (repositório oficial Ubuntu)
sudo apt update
sudo apt install -y dotnet-sdk-8.0

# Verifica
dotnet --version

# Para versão 9 ou em distros mais antigas, adicione o repo da Microsoft:
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-sdk-9.0`})}),e.jsxs("p",{children:["No Fedora/RHEL use ",e.jsx("code",{children:"sudo dnf install dotnet-sdk-9.0"}),". No Arch, está disponível via ",e.jsx("code",{children:"sudo pacman -S dotnet-sdk"}),". Em todos os casos, o binário ",e.jsx("code",{children:"dotnet"})," fica em ",e.jsx("code",{children:"/usr/bin/dotnet"})," e já está no PATH."]}),e.jsx("h2",{children:"Instalação no macOS"}),e.jsxs("p",{children:["No macOS, a forma mais limpa é via ",e.jsx("strong",{children:"Homebrew"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Instala o SDK mais recente
brew install --cask dotnet-sdk

# Para uma versão específica (ex.: 8 LTS):
brew install --cask dotnet-sdk@8

# Confirma
dotnet --info`})}),e.jsxs("p",{children:["Funciona tanto em Macs Intel quanto Apple Silicon (M1/M2/M3) — o Homebrew baixa automaticamente o binário ARM64 quando apropriado. Alternativa: o ",e.jsx("code",{children:".pkg"})," oficial do site da Microsoft."]}),e.jsx("h2",{children:"Configurando o PATH manualmente"}),e.jsxs("p",{children:["Em 99% das instalações, o PATH é configurado pelo instalador. Mas se você baixou um tarball ",e.jsx("code",{children:".tar.gz"})," manualmente (uso comum em servidores Linux sem repositório), precisa apontar:"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Adicione ao seu ~/.bashrc ou ~/.zshrc
export DOTNET_ROOT=$HOME/.dotnet
export PATH=$PATH:$HOME/.dotnet:$HOME/.dotnet/tools

# Recarregue
source ~/.bashrc

# Teste
dotnet --version`})}),e.jsxs("p",{children:["A variável ",e.jsx("strong",{children:"DOTNET_ROOT"})," diz à CLI onde achar o Runtime; o ",e.jsx("strong",{children:"PATH"})," permite chamar ",e.jsx("code",{children:"dotnet"})," de qualquer pasta. A pasta ",e.jsx("code",{children:"~/.dotnet/tools"})," é onde ficam ferramentas globais instaladas via ",e.jsx("code",{children:"dotnet tool install -g"}),"."]}),e.jsx("h2",{children:"Múltiplas versões e o global.json"}),e.jsxs("p",{children:["Você pode ter várias versões do SDK instaladas lado a lado — não há conflito. A CLI escolhe a mais recente por padrão. Mas em projetos profissionais, é comum ",e.jsx("strong",{children:"fixar"})," a versão para garantir reprodutibilidade. Isso se faz com um arquivo ",e.jsx("code",{children:"global.json"})," na raiz do projeto:"]}),e.jsx("pre",{children:e.jsx("code",{children:`{
  "sdk": {
    "version": "8.0.404",
    "rollForward": "latestPatch"
  }
}`})}),e.jsxs("p",{children:["Com isso, qualquer um que rodar ",e.jsx("code",{children:"dotnet build"})," nessa pasta usará exatamente o SDK 8.0.404 (ou o patch mais recente da mesma minor, conforme ",e.jsx("code",{children:"rollForward"}),"). Outras opções de ",e.jsx("code",{children:"rollForward"}),": ",e.jsx("code",{children:"disable"})," (versão exata), ",e.jsx("code",{children:"major"})," (qualquer 8.x), ",e.jsx("code",{children:"latestMajor"})," (a mais nova instalada). Crie esse arquivo com ",e.jsx("code",{children:"dotnet new globaljson --sdk-version 8.0.404"}),"."]}),e.jsxs(o,{type:"warning",title:"global.json incorreto bloqueia o build",children:["Se você fixar uma versão que ",e.jsx("em",{children:"não"})," está instalada, qualquer comando ",e.jsx("code",{children:"dotnet"}),' nessa pasta falha com mensagem do tipo "A compatible installed .NET SDK was not found". Solução: instalar a versão pedida ou ajustar o ',e.jsx("code",{children:"global.json"}),"."]}),e.jsx("h2",{children:"Troubleshooting comum"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:'"command not found: dotnet"'})," → PATH não configurado. Reabra o terminal ou edite ",e.jsx("code",{children:"~/.bashrc"}),"/",e.jsx("code",{children:"~/.zshrc"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"Could not load file or assembly"'})," no Linux → falta o pacote ",e.jsx("code",{children:"libicu"})," (Unicode). Em Alpine, instale ",e.jsx("code",{children:"icu-libs"}),"; em containers slim, considere a imagem ",e.jsx("code",{children:"mcr.microsoft.com/dotnet/sdk:9.0"})," que já traz tudo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Telemetria irritante:"})," a CLI envia métricas anônimas por padrão. Para desligar: ",e.jsx("code",{children:"export DOTNET_CLI_TELEMETRY_OPTOUT=1"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Avisos de SSL ao baixar pacotes:"})," verifique relógio do sistema e proxy corporativo. Configure proxy via ",e.jsx("code",{children:"HTTPS_PROXY"})," se necessário."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Apple Silicon rodando binário Intel:"})," instale a versão ARM64 do SDK; rodar via Rosetta funciona mas é mais lento."]})]}),e.jsx("h2",{children:"Verificando que tudo está OK"}),e.jsx("pre",{children:e.jsx("code",{children:`# Cria, compila e roda um projeto teste
mkdir teste-instalacao && cd teste-instalacao
dotnet new console
dotnet run
# Saída: Hello, World!

# Apaga o teste
cd .. && rm -rf teste-instalacao`})}),e.jsx("p",{children:'Se o "Hello, World!" apareceu, parabéns — sua máquina está pronta para o restante do livro.'}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Instale o ",e.jsx("strong",{children:"SDK"}),", não só o Runtime."]}),e.jsxs("li",{children:["Windows: ",e.jsx("code",{children:"winget install Microsoft.DotNet.SDK.9"}),"."]}),e.jsxs("li",{children:["Linux: ",e.jsx("code",{children:"apt"}),"/",e.jsx("code",{children:"dnf"}),"/",e.jsx("code",{children:"pacman install dotnet-sdk-9.0"}),"."]}),e.jsxs("li",{children:["macOS: ",e.jsx("code",{children:"brew install --cask dotnet-sdk"}),"."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"global.json"})," para fixar versão por projeto."]}),e.jsxs("li",{children:["Confirme com ",e.jsx("code",{children:"dotnet --info"})," e um ",e.jsx("code",{children:"dotnet new console"})," teste."]})]})]})}export{i as default};
