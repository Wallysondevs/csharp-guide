import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PrimeiroPrograma() {
  return (
    <PageContainer
      title="Seu primeiro programa em C#"
      subtitle="Do terminal vazio ao Hello World rodando: passo a passo, sem mistérios."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Chegou a hora do ritual de passagem de todo programador: escrever um programa que diz "Olá, mundo!" e ver o computador responder. Por mais bobo que pareça, esse momento ensina <em>tudo</em> em pequena escala — você cria um projeto, edita um arquivo, manda compilar, vê a saída. Depois disso, basta repetir o ciclo com problemas mais complexos. É como aprender a ferver água antes de cozinhar lasanha.
      </p>

      <h2>Pré-requisitos</h2>
      <p>
        Você precisa do <strong>.NET SDK</strong> instalado (capítulo anterior) e de um terminal aberto. Pode usar PowerShell, Bash, Zsh, CMD — tanto faz. Confirme com:
      </p>
      <pre><code>{`dotnet --version
# Algo como: 9.0.100 ou 8.0.404

# Se não funcionar, volte ao capítulo de instalação`}</code></pre>

      <h2>Passo 1: Criando o projeto</h2>
      <p>
        Escolha (ou crie) uma pasta onde vai morar seu código. Eu vou usar <code>~/projetos-csharp</code>. Dentro dela, gere um projeto console com <code>dotnet new console</code>:
      </p>
      <pre><code>{`# Cria a pasta de trabalho
mkdir ~/projetos-csharp
cd ~/projetos-csharp

# Cria um projeto console chamado "OlaMundo"
dotnet new console -n OlaMundo

# Entra na pasta gerada
cd OlaMundo

# Lista o conteúdo
ls
# Saída: OlaMundo.csproj  Program.cs  obj/`}</code></pre>
      <p>
        O comando <code>dotnet new console</code> usa um <strong>template</strong> oficial. A opção <code>-n OlaMundo</code> dá nome ao projeto (que vira nome da pasta, do arquivo <code>.csproj</code> e do <em>assembly</em> gerado). Se você omitir <code>-n</code>, ele usa o nome da pasta atual.
      </p>

      <h2>Passo 2: Anatomia da pasta gerada</h2>
      <p>
        O template criou três coisas importantes:
      </p>
      <ul>
        <li><code>OlaMundo.csproj</code> — arquivo XML que descreve o projeto (versão do .NET alvo, dependências, opções de compilação). Voltaremos a ele em outro capítulo.</li>
        <li><code>Program.cs</code> — o arquivo de código C#. <em>Cs</em> de "C-sharp".</li>
        <li><code>obj/</code> — pasta com arquivos intermediários do build. Você nunca edita à mão. Tipicamente entra no <code>.gitignore</code>.</li>
      </ul>
      <p>
        Veja o conteúdo inicial do <code>Program.cs</code>:
      </p>
      <pre><code>{`// File: Program.cs
// Use top-level statements (.NET 6+):
Console.WriteLine("Hello, World!");`}</code></pre>
      <p>
        Sim, <strong>uma linha só</strong>. Esse é o estilo "top-level statements" introduzido no C# 9, que esconde toda a cerimônia de classe e <code>Main</code>. Por baixo dos panos o compilador gera o equivalente clássico, mas você não vê.
      </p>

      <h2>Passo 3: Rodando pela primeira vez</h2>
      <p>
        Ainda dentro da pasta <code>OlaMundo</code>, rode:
      </p>
      <pre><code>{`dotnet run

# Saída esperada:
# Hello, World!`}</code></pre>
      <p>
        O que aconteceu nos bastidores foi muito: a CLI (1) restaurou pacotes NuGet, (2) chamou o compilador Roslyn para transformar <code>Program.cs</code> em IL, (3) gerou um <code>OlaMundo.dll</code> em <code>bin/Debug/net9.0/</code>, (4) iniciou o CLR, que carregou o DLL e executou o método de entrada. Tudo isso em frações de segundo.
      </p>

      <AlertBox type="info" title="Por que .dll e não .exe?">
        Apesar do nome, o <code>OlaMundo.dll</code> é seu programa principal. No mundo .NET moderno, o "exe" gerado é um pequeno launcher que carrega o DLL via runtime. Você roda explicitamente com <code>dotnet OlaMundo.dll</code> ou usa o launcher (<code>./OlaMundo</code> em Linux/Mac, <code>OlaMundo.exe</code> em Windows).
      </AlertBox>

      <h2>Passo 4: Modificando o código</h2>
      <p>
        Abra <code>Program.cs</code> em qualquer editor (VS Code, Notepad, vim, Visual Studio). Substitua o conteúdo por:
      </p>
      <pre><code>{`// Programa que pergunta o nome e cumprimenta
Console.Write("Como você se chama? ");
string? nome = Console.ReadLine();

if (string.IsNullOrWhiteSpace(nome))
{
    Console.WriteLine("Você não digitou nada. Tchau!");
}
else
{
    Console.WriteLine($"Olá, {nome}! Seja bem-vindo ao C#.");
}`}</code></pre>
      <p>
        Salve e rode novamente:
      </p>
      <pre><code>{`dotnet run

# Como você se chama? Maria
# Olá, Maria! Seja bem-vindo ao C#.`}</code></pre>
      <p>
        Note três conceitos novos: <code>Console.Write</code> imprime sem quebra de linha; <code>Console.ReadLine()</code> lê uma linha do teclado; o <code>$"..."</code> é uma <strong>string interpolada</strong> — qualquer expressão entre chaves dentro dela é avaliada e inserida no texto.
      </p>

      <h2>Passo 5: Comparando com o estilo clássico</h2>
      <p>
        O mesmo programa, escrito no formato tradicional anterior ao C# 9, ficaria assim:
      </p>
      <pre><code>{`using System;

namespace OlaMundo
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("Como você se chama? ");
            string? nome = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(nome))
            {
                Console.WriteLine("Você não digitou nada. Tchau!");
            }
            else
            {
                Console.WriteLine($"Olá, {nome}! Seja bem-vindo ao C#.");
            }
        }
    }
}`}</code></pre>
      <p>
        Faz exatamente a mesma coisa, mas com 11 linhas extras de "andaime" (<code>namespace</code>, <code>class</code>, <code>Main</code>). O estilo top-level é ótimo para começar; você verá o estilo clássico em livros antigos, código corporativo legado e quando precisar de várias classes auxiliares.
      </p>

      <AlertBox type="warning" title="Top-level statements têm limites">
        Você só pode ter <strong>um</strong> arquivo com top-level statements por projeto. Se tentar adicionar um segundo, o compilador reclama com erro CS8802. Nesses casos, use <code>class</code>/<code>Main</code> tradicional.
      </AlertBox>

      <h2>Estrutura mínima após o build</h2>
      <pre><code>{`OlaMundo/
├── OlaMundo.csproj      # Configuração do projeto
├── Program.cs           # Seu código
├── bin/
│   └── Debug/
│       └── net9.0/
│           ├── OlaMundo.dll      # Seu binário compilado
│           ├── OlaMundo.pdb      # Símbolos de debug
│           ├── OlaMundo.exe      # (Windows) launcher
│           └── OlaMundo.deps.json
└── obj/                 # Intermediários, ignore`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>"No project found in current directory":</strong> você está rodando <code>dotnet run</code> fora da pasta do projeto. Entre nela primeiro.</li>
        <li><strong>Erros de sintaxe (CS1002, CS1003):</strong> falta <code>;</code> ou parêntese. A IDE costuma sublinhar em vermelho.</li>
        <li><strong>Acentuação esquisita no terminal Windows:</strong> antigo CMD usa codepage 850. Use o novo <em>Windows Terminal</em>, que entende UTF-8 nativamente.</li>
        <li><strong>Mudei o código mas a saída não muda:</strong> esqueceu de salvar o arquivo no editor. (Sim, acontece com todo mundo.)</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dotnet new console -n NomeDoApp</code> cria o esqueleto.</li>
        <li><code>dotnet run</code> compila e executa.</li>
        <li><code>Program.cs</code> é o ponto de entrada; templates novos usam top-level statements.</li>
        <li><code>Console.WriteLine</code>, <code>Console.ReadLine</code> e strings interpoladas com <code>$"..."</code> são as primeiras ferramentas.</li>
        <li>Pasta <code>bin/</code> contém o DLL gerado; <code>obj/</code> são intermediários.</li>
      </ul>
    </PageContainer>
  );
}
