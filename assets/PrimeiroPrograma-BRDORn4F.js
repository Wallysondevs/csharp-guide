import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(s,{title:"Seu primeiro programa em C#",subtitle:"Do terminal vazio ao Hello World rodando: passo a passo, sem mistérios.",difficulty:"iniciante",timeToRead:"10 min",children:[e.jsxs("p",{children:['Chegou a hora do ritual de passagem de todo programador: escrever um programa que diz "Olá, mundo!" e ver o computador responder. Por mais bobo que pareça, esse momento ensina ',e.jsx("em",{children:"tudo"})," em pequena escala — você cria um projeto, edita um arquivo, manda compilar, vê a saída. Depois disso, basta repetir o ciclo com problemas mais complexos. É como aprender a ferver água antes de cozinhar lasanha."]}),e.jsx("h2",{children:"Pré-requisitos"}),e.jsxs("p",{children:["Você precisa do ",e.jsx("strong",{children:".NET SDK"})," instalado (capítulo anterior) e de um terminal aberto. Pode usar PowerShell, Bash, Zsh, CMD — tanto faz. Confirme com:"]}),e.jsx("pre",{children:e.jsx("code",{children:`dotnet --version
# Algo como: 9.0.100 ou 8.0.404

# Se não funcionar, volte ao capítulo de instalação`})}),e.jsx("h2",{children:"Passo 1: Criando o projeto"}),e.jsxs("p",{children:["Escolha (ou crie) uma pasta onde vai morar seu código. Eu vou usar ",e.jsx("code",{children:"~/projetos-csharp"}),". Dentro dela, gere um projeto console com ",e.jsx("code",{children:"dotnet new console"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Cria a pasta de trabalho
mkdir ~/projetos-csharp
cd ~/projetos-csharp

# Cria um projeto console chamado "OlaMundo"
dotnet new console -n OlaMundo

# Entra na pasta gerada
cd OlaMundo

# Lista o conteúdo
ls
# Saída: OlaMundo.csproj  Program.cs  obj/`})}),e.jsxs("p",{children:["O comando ",e.jsx("code",{children:"dotnet new console"})," usa um ",e.jsx("strong",{children:"template"})," oficial. A opção ",e.jsx("code",{children:"-n OlaMundo"})," dá nome ao projeto (que vira nome da pasta, do arquivo ",e.jsx("code",{children:".csproj"})," e do ",e.jsx("em",{children:"assembly"})," gerado). Se você omitir ",e.jsx("code",{children:"-n"}),", ele usa o nome da pasta atual."]}),e.jsx("h2",{children:"Passo 2: Anatomia da pasta gerada"}),e.jsx("p",{children:"O template criou três coisas importantes:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"OlaMundo.csproj"})," — arquivo XML que descreve o projeto (versão do .NET alvo, dependências, opções de compilação). Voltaremos a ele em outro capítulo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Program.cs"})," — o arquivo de código C#. ",e.jsx("em",{children:"Cs"}),' de "C-sharp".']}),e.jsxs("li",{children:[e.jsx("code",{children:"obj/"})," — pasta com arquivos intermediários do build. Você nunca edita à mão. Tipicamente entra no ",e.jsx("code",{children:".gitignore"}),"."]})]}),e.jsxs("p",{children:["Veja o conteúdo inicial do ",e.jsx("code",{children:"Program.cs"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`// File: Program.cs
// Use top-level statements (.NET 6+):
Console.WriteLine("Hello, World!");`})}),e.jsxs("p",{children:["Sim, ",e.jsx("strong",{children:"uma linha só"}),'. Esse é o estilo "top-level statements" introduzido no C# 9, que esconde toda a cerimônia de classe e ',e.jsx("code",{children:"Main"}),". Por baixo dos panos o compilador gera o equivalente clássico, mas você não vê."]}),e.jsx("h2",{children:"Passo 3: Rodando pela primeira vez"}),e.jsxs("p",{children:["Ainda dentro da pasta ",e.jsx("code",{children:"OlaMundo"}),", rode:"]}),e.jsx("pre",{children:e.jsx("code",{children:`dotnet run

# Saída esperada:
# Hello, World!`})}),e.jsxs("p",{children:["O que aconteceu nos bastidores foi muito: a CLI (1) restaurou pacotes NuGet, (2) chamou o compilador Roslyn para transformar ",e.jsx("code",{children:"Program.cs"})," em IL, (3) gerou um ",e.jsx("code",{children:"OlaMundo.dll"})," em ",e.jsx("code",{children:"bin/Debug/net9.0/"}),", (4) iniciou o CLR, que carregou o DLL e executou o método de entrada. Tudo isso em frações de segundo."]}),e.jsxs(o,{type:"info",title:"Por que .dll e não .exe?",children:["Apesar do nome, o ",e.jsx("code",{children:"OlaMundo.dll"}),' é seu programa principal. No mundo .NET moderno, o "exe" gerado é um pequeno launcher que carrega o DLL via runtime. Você roda explicitamente com ',e.jsx("code",{children:"dotnet OlaMundo.dll"})," ou usa o launcher (",e.jsx("code",{children:"./OlaMundo"})," em Linux/Mac, ",e.jsx("code",{children:"OlaMundo.exe"})," em Windows)."]}),e.jsx("h2",{children:"Passo 4: Modificando o código"}),e.jsxs("p",{children:["Abra ",e.jsx("code",{children:"Program.cs"})," em qualquer editor (VS Code, Notepad, vim, Visual Studio). Substitua o conteúdo por:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Programa que pergunta o nome e cumprimenta
Console.Write("Como você se chama? ");
string? nome = Console.ReadLine();

if (string.IsNullOrWhiteSpace(nome))
{
    Console.WriteLine("Você não digitou nada. Tchau!");
}
else
{
    Console.WriteLine($"Olá, {nome}! Seja bem-vindo ao C#.");
}`})}),e.jsx("p",{children:"Salve e rode novamente:"}),e.jsx("pre",{children:e.jsx("code",{children:`dotnet run

# Como você se chama? Maria
# Olá, Maria! Seja bem-vindo ao C#.`})}),e.jsxs("p",{children:["Note três conceitos novos: ",e.jsx("code",{children:"Console.Write"})," imprime sem quebra de linha; ",e.jsx("code",{children:"Console.ReadLine()"})," lê uma linha do teclado; o ",e.jsx("code",{children:'$"..."'})," é uma ",e.jsx("strong",{children:"string interpolada"})," — qualquer expressão entre chaves dentro dela é avaliada e inserida no texto."]}),e.jsx("h2",{children:"Passo 5: Comparando com o estilo clássico"}),e.jsx("p",{children:"O mesmo programa, escrito no formato tradicional anterior ao C# 9, ficaria assim:"}),e.jsx("pre",{children:e.jsx("code",{children:`using System;

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
}`})}),e.jsxs("p",{children:['Faz exatamente a mesma coisa, mas com 11 linhas extras de "andaime" (',e.jsx("code",{children:"namespace"}),", ",e.jsx("code",{children:"class"}),", ",e.jsx("code",{children:"Main"}),"). O estilo top-level é ótimo para começar; você verá o estilo clássico em livros antigos, código corporativo legado e quando precisar de várias classes auxiliares."]}),e.jsxs(o,{type:"warning",title:"Top-level statements têm limites",children:["Você só pode ter ",e.jsx("strong",{children:"um"})," arquivo com top-level statements por projeto. Se tentar adicionar um segundo, o compilador reclama com erro CS8802. Nesses casos, use ",e.jsx("code",{children:"class"}),"/",e.jsx("code",{children:"Main"})," tradicional."]}),e.jsx("h2",{children:"Estrutura mínima após o build"}),e.jsx("pre",{children:e.jsx("code",{children:`OlaMundo/
├── OlaMundo.csproj      # Configuração do projeto
├── Program.cs           # Seu código
├── bin/
│   └── Debug/
│       └── net9.0/
│           ├── OlaMundo.dll      # Seu binário compilado
│           ├── OlaMundo.pdb      # Símbolos de debug
│           ├── OlaMundo.exe      # (Windows) launcher
│           └── OlaMundo.deps.json
└── obj/                 # Intermediários, ignore`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:'"No project found in current directory":'})," você está rodando ",e.jsx("code",{children:"dotnet run"})," fora da pasta do projeto. Entre nela primeiro."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Erros de sintaxe (CS1002, CS1003):"})," falta ",e.jsx("code",{children:";"})," ou parêntese. A IDE costuma sublinhar em vermelho."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Acentuação esquisita no terminal Windows:"})," antigo CMD usa codepage 850. Use o novo ",e.jsx("em",{children:"Windows Terminal"}),", que entende UTF-8 nativamente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mudei o código mas a saída não muda:"})," esqueceu de salvar o arquivo no editor. (Sim, acontece com todo mundo.)"]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"dotnet new console -n NomeDoApp"})," cria o esqueleto."]}),e.jsxs("li",{children:[e.jsx("code",{children:"dotnet run"})," compila e executa."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Program.cs"})," é o ponto de entrada; templates novos usam top-level statements."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Console.WriteLine"}),", ",e.jsx("code",{children:"Console.ReadLine"})," e strings interpoladas com ",e.jsx("code",{children:'$"..."'})," são as primeiras ferramentas."]}),e.jsxs("li",{children:["Pasta ",e.jsx("code",{children:"bin/"})," contém o DLL gerado; ",e.jsx("code",{children:"obj/"})," são intermediários."]})]})]})}export{n as default};
