import{j as e}from"./index-CzLAthD5.js";import{P as o,A as s}from"./AlertBox-CWJo3ar5.js";function r(){return e.jsxs(o,{title:"Using aliases para qualquer tipo (C# 12)",subtitle:"Crie apelidos curtos e descritivos para tipos longos — agora também para genéricos, tuplas, arrays e ponteiros.",difficulty:"intermediario",timeToRead:"10 min",children:[e.jsxs("p",{children:['Imagine que toda vez que você fala do seu cachorro precisa dizer "aquele animal de quatro patas, peludo, da raça golden retriever, de nome Rex". Cansativo, né? Você dá um ',e.jsx("strong",{children:"apelido"}),': "Rex". Em código acontece o mesmo: alguns nomes de tipos são longos demais (',e.jsx("code",{children:"Dictionary<string, List<Pedido>>"}),"), e a partir do ",e.jsx("strong",{children:"C# 12"})," a diretiva ",e.jsx("code",{children:"using"})," permite criar apelidos para qualquer tipo, inclusive genéricos, tuplas e arrays — coisa que antes só funcionava para tipos simples."]}),e.jsx("h2",{children:"Antes do C# 12: aliases existiam, mas limitados"}),e.jsxs("p",{children:["Desde o C# 1.0 era possível escrever ",e.jsx("code",{children:"using Apelido = NamespaceCompleto.Tipo;"}),", mas a regra era restritiva: só servia para tipos ",e.jsx("em",{children:"fechados, sem genéricos abertos, sem tuplas, sem arrays"}),". Isso resolvia colisões de nome, mas não ajudava com a verbosidade de tipos compostos."]}),e.jsx("pre",{children:e.jsx("code",{children:`// C# 1 a 11: válido
using IO = System.IO;
using JsonObj = Newtonsoft.Json.Linq.JObject;

// Inválido até o C# 11 (genérico)
// using IntList = System.Collections.Generic.List<int>;

// Inválido até o C# 11 (tupla)
// using Ponto = (int X, int Y);`})}),e.jsx("h2",{children:"C# 12: agora vale para tudo"}),e.jsx("p",{children:"A partir do C# 12 (incluso no .NET 8), a restrição caiu. Você pode dar nome a qualquer tipo construído."}),e.jsx("pre",{children:e.jsx("code",{children:`// Topo do arquivo .cs
using IntList = System.Collections.Generic.List<int>;
using Mapa = System.Collections.Generic.Dictionary<string, int>;
using Ponto = (int X, int Y);
using Matriz = int[,];
using Bytes = byte[];

class Programa
{
    static void Main()
    {
        IntList numeros = new() { 1, 2, 3 };
        Mapa pontuacao = new() { ["Ana"] = 10, ["Bia"] = 7 };
        Ponto origem = (0, 0);
        Matriz tabuleiro = new int[3, 3];
        Bytes buffer = new byte[1024];

        Console.WriteLine(numeros.Count);  // 3
        Console.WriteLine(origem.X);       // 0
    }
}`})}),e.jsxs(s,{type:"info",title:"Escopo do alias",children:["O alias declarado em um arquivo ",e.jsx("strong",{children:"só vale dentro daquele arquivo"}),". Se você quer compartilhar entre vários arquivos, use ",e.jsx("code",{children:"global using Alias = ...;"})," em qualquer arquivo do projeto — todos passam a enxergar."]}),e.jsx("h2",{children:"Aliases para tuplas nomeadas"}),e.jsx("p",{children:"Esse é provavelmente o uso mais útil na prática. Tuplas com campos nomeados ficam ilegíveis quando aparecem em assinaturas de método repetidamente."}),e.jsx("pre",{children:e.jsx("code",{children:`// Sem alias — repetição cansa
(string Nome, decimal Preco, int Estoque) BuscarProduto(int id) { /*...*/ }
List<(string Nome, decimal Preco, int Estoque)> Listar() { /*...*/ }

// Com alias — intenção fica clara
using Produto = (string Nome, decimal Preco, int Estoque);

Produto BuscarProduto(int id) { /*...*/ }
List<Produto> Listar() { /*...*/ }`})}),e.jsxs("p",{children:["Atenção: ",e.jsx("strong",{children:"o alias não cria um tipo novo"}),". ",e.jsx("code",{children:"Produto"})," ainda é só um apelido para a tupla; não há encapsulamento, validação ou métodos. Se você precisa disso, use ",e.jsx("code",{children:"record"})," ou ",e.jsx("code",{children:"class"}),"."]}),e.jsx("h2",{children:"Aliases para tipos genéricos longos"}),e.jsx("p",{children:"Um cenário clássico em código de configuração ou cache."}),e.jsx("pre",{children:e.jsx("code",{children:`using CacheUsuarios = System.Collections.Concurrent
                            .ConcurrentDictionary<int, Usuario>;
using HandlerHttp   = System.Func<System.Net.Http.HttpRequestMessage,
                                  System.Threading.CancellationToken,
                                  System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage>>;

class Servico
{
    private readonly CacheUsuarios _cache = new();
    private readonly HandlerHttp _handler;

    public Servico(HandlerHttp handler) => _handler = handler;
}`})}),e.jsx("h2",{children:"Aliases para arrays e jagged arrays"}),e.jsx("pre",{children:e.jsx("code",{children:`using Linhas = string[];
using Tabela = string[][];     // jagged: vetor de vetores
using Cubo = double[,,];       // 3 dimensões

Linhas cabecalho = { "id", "nome", "email" };
Tabela csv = new[]
{
    new[] { "1", "Ana", "ana@x.com" },
    new[] { "2", "Bia", "bia@y.com" }
};

Cubo voxels = new double[10, 10, 10];`})}),e.jsx("h2",{children:"Aliases globais"}),e.jsxs("p",{children:["Se vários arquivos usam o mesmo alias, declare-o como ",e.jsx("code",{children:"global using"})," num arquivo de uso comum (ex.: ",e.jsx("code",{children:"GlobalUsings.cs"}),")."]}),e.jsx("pre",{children:e.jsx("code",{children:`// GlobalUsings.cs
global using IntList = System.Collections.Generic.List<int>;
global using Produto = (string Nome, decimal Preco, int Estoque);

// Qualquer outro arquivo do projeto pode usar IntList e Produto
// sem precisar repetir a diretiva.`})}),e.jsxs(s,{type:"warning",title:"Não exagere",children:["Apelidos demais transformam o código em um quebra-cabeça: o leitor precisa pular para o topo do arquivo (ou para ",e.jsx("code",{children:"GlobalUsings.cs"}),") toda vez para descobrir o que ",e.jsx("code",{children:"Mapa"})," realmente é. Reserve aliases para tipos que aparecem ",e.jsx("em",{children:"muitas vezes"})," no mesmo arquivo, ou que comunicam um conceito de domínio (ex.: ",e.jsx("code",{children:"Coordenada"}),", ",e.jsx("code",{children:"Produto"}),")."]}),e.jsx("h2",{children:"O que ainda NÃO é permitido"}),e.jsx("p",{children:"Algumas formas continuam fora do alcance do alias:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Genéricos abertos"}),": ",e.jsx("code",{children:"using Lista<T> = List<T>;"})," — não funciona; aliases não são tipos novos parametrizáveis."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tipos ",e.jsx("code",{children:"dynamic"})]}),": continua proibido como alvo de alias."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tipos com restrições ",e.jsx("code",{children:"nint"}),"/",e.jsx("code",{children:"nuint"})," em alguns cenários"]}),": ponteiros estão OK em contexto ",e.jsx("code",{children:"unsafe"}),"."]})]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar que o alias seja um tipo novo"}),": ",e.jsx("code",{children:"Produto"}),' e a tupla original são intercambiáveis em qualquer assinatura. Isso pode quebrar encapsulamento se você esperava algo "tipado fortemente".']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Conflito com ",e.jsx("code",{children:"global using"})]}),": dois arquivos declarando o mesmo nome global geram erro de duplicidade. Centralize."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Alias dentro de namespace"}),": a diretiva ",e.jsx("code",{children:"using"})," deve ficar no ",e.jsx("em",{children:"topo"})," do arquivo (ou dentro do namespace, antes de qualquer tipo). Não dá para colocar dentro de uma classe."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"C# 12 permite alias para qualquer tipo construído: genéricos, tuplas, arrays."}),e.jsxs("li",{children:["Sintaxe: ",e.jsx("code",{children:"using Apelido = TipoCompleto;"})," no topo do arquivo."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"global using"})," para alias compartilhado em todo o projeto."]}),e.jsx("li",{children:"Aliases melhoram legibilidade, mas não criam tipos novos — sem validação ou métodos extras."}),e.jsx("li",{children:"Use com moderação: alias demais esconde o que está acontecendo."})]})]})}export{r as default};
