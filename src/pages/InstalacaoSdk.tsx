import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function InstalacaoSdk() {
  return (
    <PageContainer
      title="Instalando o .NET SDK no Windows, Linux e macOS"
      subtitle="Um passo a passo prático para deixar seu computador pronto para escrever C# em qualquer sistema operacional."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Antes de escrever uma única linha de C#, você precisa instalar o <strong>.NET SDK</strong> — o "kit de desenvolvimento" que inclui o compilador, a CLI e o runtime. É como comprar um piano antes de aprender a tocar: sem o instrumento, nada feito. A boa notícia é que a Microsoft tornou a instalação trivial em qualquer sistema operacional moderno. Em 5 minutos você está pronto.
      </p>

      <h2>SDK ou Runtime? Qual baixar?</h2>
      <p>
        Lembre da distinção do capítulo anterior: o <strong>Runtime</strong> só executa programas .NET; o <strong>SDK</strong> inclui o Runtime <em>e</em> tudo para construir programas. Como você está aprendendo a programar, sempre baixe o <strong>SDK</strong>. Ele já traz o Runtime junto.
      </p>
      <pre><code>{`# Após instalar, este comando deve funcionar em qualquer SO:
dotnet --version
# Saída esperada: 9.0.100 (ou versão mais recente)

dotnet --info
# Mostra SDKs instalados, runtimes, RID atual e variáveis de ambiente`}</code></pre>

      <AlertBox type="info" title="Sempre escolha LTS para produção">
        Versões marcadas como <strong>LTS</strong> (Long-Term Support, ex.: .NET 8) recebem atualizações por 3 anos. As <em>STS</em> (.NET 7, .NET 9) são suportadas por 18 meses. Para aprender, qualquer uma serve; para projetos sérios, prefira LTS.
      </AlertBox>

      <h2>Instalação no Windows</h2>
      <p>
        No Windows 10/11 a forma mais simples é via <strong>winget</strong>, o gerenciador de pacotes que vem instalado por padrão. Abra o PowerShell ou Terminal e rode:
      </p>
      <pre><code>{`# Lista versões disponíveis
winget search Microsoft.DotNet.SDK

# Instala a versão 9 (mais recente)
winget install Microsoft.DotNet.SDK.9

# Ou instala a LTS 8
winget install Microsoft.DotNet.SDK.8`}</code></pre>
      <p>
        Alternativa: baixar o instalador <code>.exe</code> do site oficial em <code>dotnet.microsoft.com/download</code>. Ele cuida do PATH automaticamente. Depois, abra um <em>novo</em> terminal (importante — terminais antigos não enxergam variáveis recém-adicionadas) e rode <code>dotnet --info</code>.
      </p>

      <h2>Instalação no Linux (Ubuntu/Debian)</h2>
      <p>
        Em distros baseadas em Debian, a forma recomendada é o repositório oficial da Microsoft. Em Ubuntu 22.04 ou superior, o pacote já vem nos repositórios padrão do próprio Ubuntu — basta:
      </p>
      <pre><code>{`# Ubuntu 22.04+ (repositório oficial Ubuntu)
sudo apt update
sudo apt install -y dotnet-sdk-8.0

# Verifica
dotnet --version

# Para versão 9 ou em distros mais antigas, adicione o repo da Microsoft:
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-sdk-9.0`}</code></pre>
      <p>
        No Fedora/RHEL use <code>sudo dnf install dotnet-sdk-9.0</code>. No Arch, está disponível via <code>sudo pacman -S dotnet-sdk</code>. Em todos os casos, o binário <code>dotnet</code> fica em <code>/usr/bin/dotnet</code> e já está no PATH.
      </p>

      <h2>Instalação no macOS</h2>
      <p>
        No macOS, a forma mais limpa é via <strong>Homebrew</strong>:
      </p>
      <pre><code>{`# Instala o SDK mais recente
brew install --cask dotnet-sdk

# Para uma versão específica (ex.: 8 LTS):
brew install --cask dotnet-sdk@8

# Confirma
dotnet --info`}</code></pre>
      <p>
        Funciona tanto em Macs Intel quanto Apple Silicon (M1/M2/M3) — o Homebrew baixa automaticamente o binário ARM64 quando apropriado. Alternativa: o <code>.pkg</code> oficial do site da Microsoft.
      </p>

      <h2>Configurando o PATH manualmente</h2>
      <p>
        Em 99% das instalações, o PATH é configurado pelo instalador. Mas se você baixou um tarball <code>.tar.gz</code> manualmente (uso comum em servidores Linux sem repositório), precisa apontar:
      </p>
      <pre><code>{`# Adicione ao seu ~/.bashrc ou ~/.zshrc
export DOTNET_ROOT=$HOME/.dotnet
export PATH=$PATH:$HOME/.dotnet:$HOME/.dotnet/tools

# Recarregue
source ~/.bashrc

# Teste
dotnet --version`}</code></pre>
      <p>
        A variável <strong>DOTNET_ROOT</strong> diz à CLI onde achar o Runtime; o <strong>PATH</strong> permite chamar <code>dotnet</code> de qualquer pasta. A pasta <code>~/.dotnet/tools</code> é onde ficam ferramentas globais instaladas via <code>dotnet tool install -g</code>.
      </p>

      <h2>Múltiplas versões e o global.json</h2>
      <p>
        Você pode ter várias versões do SDK instaladas lado a lado — não há conflito. A CLI escolhe a mais recente por padrão. Mas em projetos profissionais, é comum <strong>fixar</strong> a versão para garantir reprodutibilidade. Isso se faz com um arquivo <code>global.json</code> na raiz do projeto:
      </p>
      <pre><code>{`{
  "sdk": {
    "version": "8.0.404",
    "rollForward": "latestPatch"
  }
}`}</code></pre>
      <p>
        Com isso, qualquer um que rodar <code>dotnet build</code> nessa pasta usará exatamente o SDK 8.0.404 (ou o patch mais recente da mesma minor, conforme <code>rollForward</code>). Outras opções de <code>rollForward</code>: <code>disable</code> (versão exata), <code>major</code> (qualquer 8.x), <code>latestMajor</code> (a mais nova instalada). Crie esse arquivo com <code>dotnet new globaljson --sdk-version 8.0.404</code>.
      </p>

      <AlertBox type="warning" title="global.json incorreto bloqueia o build">
        Se você fixar uma versão que <em>não</em> está instalada, qualquer comando <code>dotnet</code> nessa pasta falha com mensagem do tipo "A compatible installed .NET SDK was not found". Solução: instalar a versão pedida ou ajustar o <code>global.json</code>.
      </AlertBox>

      <h2>Troubleshooting comum</h2>
      <ul>
        <li><strong>"command not found: dotnet"</strong> → PATH não configurado. Reabra o terminal ou edite <code>~/.bashrc</code>/<code>~/.zshrc</code>.</li>
        <li><strong>"Could not load file or assembly"</strong> no Linux → falta o pacote <code>libicu</code> (Unicode). Em Alpine, instale <code>icu-libs</code>; em containers slim, considere a imagem <code>mcr.microsoft.com/dotnet/sdk:9.0</code> que já traz tudo.</li>
        <li><strong>Telemetria irritante:</strong> a CLI envia métricas anônimas por padrão. Para desligar: <code>export DOTNET_CLI_TELEMETRY_OPTOUT=1</code>.</li>
        <li><strong>Avisos de SSL ao baixar pacotes:</strong> verifique relógio do sistema e proxy corporativo. Configure proxy via <code>HTTPS_PROXY</code> se necessário.</li>
        <li><strong>Apple Silicon rodando binário Intel:</strong> instale a versão ARM64 do SDK; rodar via Rosetta funciona mas é mais lento.</li>
      </ul>

      <h2>Verificando que tudo está OK</h2>
      <pre><code>{`# Cria, compila e roda um projeto teste
mkdir teste-instalacao && cd teste-instalacao
dotnet new console
dotnet run
# Saída: Hello, World!

# Apaga o teste
cd .. && rm -rf teste-instalacao`}</code></pre>
      <p>
        Se o "Hello, World!" apareceu, parabéns — sua máquina está pronta para o restante do livro.
      </p>

      <h2>Resumo</h2>
      <ul>
        <li>Instale o <strong>SDK</strong>, não só o Runtime.</li>
        <li>Windows: <code>winget install Microsoft.DotNet.SDK.9</code>.</li>
        <li>Linux: <code>apt</code>/<code>dnf</code>/<code>pacman install dotnet-sdk-9.0</code>.</li>
        <li>macOS: <code>brew install --cask dotnet-sdk</code>.</li>
        <li>Use <code>global.json</code> para fixar versão por projeto.</li>
        <li>Confirme com <code>dotnet --info</code> e um <code>dotnet new console</code> teste.</li>
      </ul>
    </PageContainer>
  );
}
