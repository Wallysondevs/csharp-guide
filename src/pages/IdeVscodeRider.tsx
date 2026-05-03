import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IdeVscodeRider() {
  return (
    <PageContainer
      title="Escolhendo seu editor: VS Code, Visual Studio e Rider"
      subtitle="Comparação honesta das três opções dominantes para escrever C# em 2025."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Você pode escrever C# no Bloco de Notas e compilar via <code>dotnet build</code> — funciona. Mas, na prática, ninguém faz isso. Um bom editor com suporte a C# faz <em>autocomplete</em>, <em>refatoração</em>, <em>navegação rápida</em>, <em>debug</em> e <em>integração com testes</em>. Hoje há três opções dominantes: <strong>Visual Studio</strong> (a IDE clássica da Microsoft), <strong>Visual Studio Code</strong> (o editor leve multiplataforma) e <strong>JetBrains Rider</strong> (o concorrente premium da JetBrains). Vamos comparar.
      </p>

      <h2>Visual Studio (Windows / Mac retired)</h2>
      <p>
        A IDE original do C#. Pesada, completa, profundamente integrada ao ecossistema Microsoft. A edição <strong>Community</strong> é gratuita para uso individual e em times pequenos; <strong>Professional</strong> e <strong>Enterprise</strong> são pagas com features avançadas (testes de carga, IntelliCode premium, code coverage).
      </p>
      <ul>
        <li><strong>Pontos fortes:</strong> debugger sensacional, designers visuais (WinForms, WPF, XAML), integração nativa com SQL Server e Azure, profiling avançado, suporte 100% a tudo do .NET.</li>
        <li><strong>Pontos fracos:</strong> Windows-only (a versão para Mac foi descontinuada em 2024), pesada (4-8 GB de instalação), inicialização lenta.</li>
        <li><strong>Ideal para:</strong> desenvolvimento Windows desktop (WinForms/WPF/MAUI), projetos enterprise grandes, quem trabalha exclusivamente no Windows.</li>
      </ul>
      <pre><code>{`# Atalhos básicos no Visual Studio
F5            Iniciar com debug
Ctrl+F5       Iniciar sem debug
F9            Toggle breakpoint
F10 / F11     Step over / Step into
Ctrl+.        Quick actions (refactor)
Ctrl+,        Go to anything (busca global)
F12           Go to definition
Shift+F12     Find all references
Ctrl+R, R     Renomear símbolo`}</code></pre>

      <h2>Visual Studio Code (todos os SOs)</h2>
      <p>
        Editor leve baseado em Electron, gratuito, open source, multiplataforma (Windows, Linux, macOS). Não é uma IDE completa de fábrica — você instala extensões para cada linguagem. Para C#, o pacote oficial é o <strong>C# Dev Kit</strong>, mantido pela Microsoft, que adiciona Solution Explorer, debugger gráfico, gerenciamento de projetos e o Test Explorer.
      </p>
      <pre><code>{`# Após instalar o VS Code, instale a extensão C# Dev Kit:
# - Abra o VS Code
# - Pressione Ctrl+Shift+X (Extensions)
# - Busque "C# Dev Kit" e instale
# - Reabra a pasta do seu projeto

# Ou via CLI:
code --install-extension ms-dotnettools.csdevkit
code --install-extension ms-dotnettools.csharp`}</code></pre>
      <ul>
        <li><strong>Pontos fortes:</strong> leve, multiplataforma, gratuito, ecossistema massivo de extensões (Git, Docker, Remote SSH, Live Share).</li>
        <li><strong>Pontos fracos:</strong> recursos avançados (refactoring complexo, profiling) ficam atrás do Visual Studio e Rider.</li>
        <li><strong>Licença do C# Dev Kit:</strong> gratuito para uso pessoal, educacional e open source; restrito comercialmente para empresas grandes (verifique os termos).</li>
        <li><strong>Ideal para:</strong> Linux, macOS, equipes que já usam VS Code para outras linguagens, projetos web e microservices.</li>
      </ul>

      <h2>JetBrains Rider (todos os SOs)</h2>
      <p>
        IDE comercial da JetBrains (mesma criadora do IntelliJ IDEA, PyCharm, WebStorm). Combina o engine de análise de código <strong>ReSharper</strong> com uma interface multiplataforma. Em novembro de 2024, a JetBrains tornou o Rider gratuito para uso <em>não comercial</em> — uma jogada estratégica para conquistar estudantes e hobbyistas.
      </p>
      <ul>
        <li><strong>Pontos fortes:</strong> análise de código brilhante, refatoração robusta, sugestões inteligentes, suporte multiplataforma de primeira, navegação rápida, integração com testes excelente, suporte a Unity e Unreal.</li>
        <li><strong>Pontos fracos:</strong> licença comercial paga (US$ 159/ano para uso profissional), consome bastante RAM (4-8 GB), inicialização lenta.</li>
        <li><strong>Ideal para:</strong> profissionais que valorizam produtividade e refactoring, devs vindos de outras IDEs JetBrains, jogos com Unity.</li>
      </ul>

      <AlertBox type="info" title="OmniSharp ainda existe?">
        OmniSharp foi por anos o servidor de linguagem usado pela extensão C# original do VS Code. Hoje está sendo substituído pelo novo language server da Microsoft que vem com o C# Dev Kit, baseado no Roslyn. OmniSharp continua disponível como alternativa gratuita e open source para quem prefere evitar a licença do Dev Kit.
      </AlertBox>

      <h2>Comparativo rápido</h2>
      <table>
        <thead>
          <tr><th>Critério</th><th>Visual Studio</th><th>VS Code + Dev Kit</th><th>Rider</th></tr>
        </thead>
        <tbody>
          <tr><td>Plataformas</td><td>Windows</td><td>Win/Linux/Mac</td><td>Win/Linux/Mac</td></tr>
          <tr><td>Custo (pessoal)</td><td>Gratuito (Community)</td><td>Gratuito</td><td>Gratuito (não comercial)</td></tr>
          <tr><td>Custo (empresa)</td><td>Pago (Pro/Ent)</td><td>Verificar Dev Kit</td><td>~US$ 159/ano</td></tr>
          <tr><td>Peso</td><td>Pesado</td><td>Leve</td><td>Médio</td></tr>
          <tr><td>Refactoring</td><td>Muito bom</td><td>Bom</td><td>Excelente</td></tr>
          <tr><td>Designer XAML</td><td>Sim</td><td>Limitado</td><td>Sim (limitado)</td></tr>
          <tr><td>Debugger</td><td>Excelente</td><td>Muito bom</td><td>Excelente</td></tr>
          <tr><td>Unity/Unreal</td><td>OK</td><td>Plugin</td><td>Excelente</td></tr>
        </tbody>
      </table>

      <h2>Configurando o VS Code do zero</h2>
      <p>
        Se você está em Linux ou Mac (ou quer começar com algo leve), o VS Code é uma escolha pragmática. Passo a passo:
      </p>
      <pre><code>{`# 1. Instale o VS Code do site oficial (code.visualstudio.com)

# 2. Instale a extensão C# Dev Kit (inclui o C# tradicional):
code --install-extension ms-dotnettools.csdevkit

# 3. Recomendadas:
code --install-extension ms-dotnettools.vscode-dotnet-runtime
code --install-extension EditorConfig.EditorConfig
code --install-extension ms-azuretools.vscode-docker

# 4. Abra um projeto:
cd ~/MeuProjeto
code .

# 5. Pressione F5 para iniciar debug
#    Pressione Ctrl+Shift+P > "Debug: Start Debugging"`}</code></pre>

      <h2>Atalhos universais que valem ouro</h2>
      <pre><code>{`# Atalhos comuns nos três editores
F5                       Iniciar com debug
F9                       Toggle breakpoint
F10                      Step over (próxima linha)
F11                      Step into (entrar no método)
Shift+F11                Step out (sair do método)

F12                      Ir para definição
Alt+F12                  Peek definition (sem mudar de aba)
Shift+F12                Encontrar todas as referências
F2                       Renomear símbolo

Ctrl+P (VS Code)         Buscar arquivo
Ctrl+T (VS)              Buscar tipo
Ctrl+N, Ctrl+Shift+A     Navegar (Rider)

Ctrl+.                   Quick fix / refactor
Ctrl+K, D                Formatar documento (VS Code)
Shift+Alt+F              Formatar (universal)`}</code></pre>

      <AlertBox type="warning" title="Não fique preso a uma ferramenta">
        Aprenda C# de verdade <em>na CLI</em> (<code>dotnet run</code>, <code>dotnet test</code>) e <em>depois</em> aproveite a IDE para acelerar. Quem só sabe clicar em "Build" no Visual Studio sofre quando precisa rodar algo num servidor Linux sem interface gráfica.
      </AlertBox>

      <h2>Recomendação por sistema operacional</h2>
      <ul>
        <li><strong>Windows + foco desktop ou enterprise:</strong> Visual Studio Community.</li>
        <li><strong>Windows + foco web/microservices:</strong> VS Code ou Rider.</li>
        <li><strong>Linux:</strong> VS Code (mais leve) ou Rider (mais poder).</li>
        <li><strong>macOS:</strong> Rider (a Microsoft descontinuou Visual Studio for Mac) ou VS Code.</li>
        <li><strong>Aprendizado/escola:</strong> VS Code, simples e sem barreira.</li>
        <li><strong>Game dev (Unity):</strong> Rider (suporte de primeira), VS Code com extensão Unity.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>"IntelliSense não funciona":</strong> no VS Code, garanta que o C# Dev Kit foi instalado e que abriu a pasta do <code>.csproj</code>, não um arquivo solto.</li>
        <li><strong>F5 não inicia o debug:</strong> falta o <code>launch.json</code> em <code>.vscode/</code>. O Dev Kit gera automaticamente; force com Run &gt; Add Configuration.</li>
        <li><strong>Diferenças de formatação entre time:</strong> use um arquivo <code>.editorconfig</code> compartilhado no repositório.</li>
        <li><strong>Confundir Visual Studio com VS Code:</strong> são produtos completamente diferentes apesar do nome parecido.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><strong>Visual Studio:</strong> IDE pesada, Windows-only, perfeita para desktop e enterprise.</li>
        <li><strong>VS Code + C# Dev Kit:</strong> leve, multiplataforma, ótima para web e Linux.</li>
        <li><strong>Rider:</strong> premium, refactoring excelente, multiplataforma, gratuito para uso pessoal.</li>
        <li>F5 inicia debug nos três; F9 toggle breakpoint; F12 vai para definição.</li>
        <li>Aprenda também a CLI <code>dotnet</code> — a IDE é só uma camada por cima.</li>
      </ul>
    </PageContainer>
  );
}
