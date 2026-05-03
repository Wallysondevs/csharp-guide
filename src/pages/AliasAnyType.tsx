import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AliasAnyType() {
  return (
    <PageContainer
      title="Using aliases para qualquer tipo (C# 12)"
      subtitle="Crie apelidos curtos e descritivos para tipos longos — agora também para genéricos, tuplas, arrays e ponteiros."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <p>
        Imagine que toda vez que você fala do seu cachorro precisa dizer "aquele animal de quatro patas, peludo, da raça golden retriever, de nome Rex". Cansativo, né? Você dá um <strong>apelido</strong>: "Rex". Em código acontece o mesmo: alguns nomes de tipos são longos demais (<code>Dictionary&lt;string, List&lt;Pedido&gt;&gt;</code>), e a partir do <strong>C# 12</strong> a diretiva <code>using</code> permite criar apelidos para qualquer tipo, inclusive genéricos, tuplas e arrays — coisa que antes só funcionava para tipos simples.
      </p>

      <h2>Antes do C# 12: aliases existiam, mas limitados</h2>
      <p>
        Desde o C# 1.0 era possível escrever <code>using Apelido = NamespaceCompleto.Tipo;</code>, mas a regra era restritiva: só servia para tipos <em>fechados, sem genéricos abertos, sem tuplas, sem arrays</em>. Isso resolvia colisões de nome, mas não ajudava com a verbosidade de tipos compostos.
      </p>
      <pre><code>{`// C# 1 a 11: válido
using IO = System.IO;
using JsonObj = Newtonsoft.Json.Linq.JObject;

// Inválido até o C# 11 (genérico)
// using IntList = System.Collections.Generic.List<int>;

// Inválido até o C# 11 (tupla)
// using Ponto = (int X, int Y);`}</code></pre>

      <h2>C# 12: agora vale para tudo</h2>
      <p>
        A partir do C# 12 (incluso no .NET 8), a restrição caiu. Você pode dar nome a qualquer tipo construído.
      </p>
      <pre><code>{`// Topo do arquivo .cs
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
}`}</code></pre>

      <AlertBox type="info" title="Escopo do alias">
        O alias declarado em um arquivo <strong>só vale dentro daquele arquivo</strong>. Se você quer compartilhar entre vários arquivos, use <code>global using Alias = ...;</code> em qualquer arquivo do projeto — todos passam a enxergar.
      </AlertBox>

      <h2>Aliases para tuplas nomeadas</h2>
      <p>
        Esse é provavelmente o uso mais útil na prática. Tuplas com campos nomeados ficam ilegíveis quando aparecem em assinaturas de método repetidamente.
      </p>
      <pre><code>{`// Sem alias — repetição cansa
(string Nome, decimal Preco, int Estoque) BuscarProduto(int id) { /*...*/ }
List<(string Nome, decimal Preco, int Estoque)> Listar() { /*...*/ }

// Com alias — intenção fica clara
using Produto = (string Nome, decimal Preco, int Estoque);

Produto BuscarProduto(int id) { /*...*/ }
List<Produto> Listar() { /*...*/ }`}</code></pre>
      <p>
        Atenção: <strong>o alias não cria um tipo novo</strong>. <code>Produto</code> ainda é só um apelido para a tupla; não há encapsulamento, validação ou métodos. Se você precisa disso, use <code>record</code> ou <code>class</code>.
      </p>

      <h2>Aliases para tipos genéricos longos</h2>
      <p>
        Um cenário clássico em código de configuração ou cache.
      </p>
      <pre><code>{`using CacheUsuarios = System.Collections.Concurrent
                            .ConcurrentDictionary<int, Usuario>;
using HandlerHttp   = System.Func<System.Net.Http.HttpRequestMessage,
                                  System.Threading.CancellationToken,
                                  System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage>>;

class Servico
{
    private readonly CacheUsuarios _cache = new();
    private readonly HandlerHttp _handler;

    public Servico(HandlerHttp handler) => _handler = handler;
}`}</code></pre>

      <h2>Aliases para arrays e jagged arrays</h2>
      <pre><code>{`using Linhas = string[];
using Tabela = string[][];     // jagged: vetor de vetores
using Cubo = double[,,];       // 3 dimensões

Linhas cabecalho = { "id", "nome", "email" };
Tabela csv = new[]
{
    new[] { "1", "Ana", "ana@x.com" },
    new[] { "2", "Bia", "bia@y.com" }
};

Cubo voxels = new double[10, 10, 10];`}</code></pre>

      <h2>Aliases globais</h2>
      <p>
        Se vários arquivos usam o mesmo alias, declare-o como <code>global using</code> num arquivo de uso comum (ex.: <code>GlobalUsings.cs</code>).
      </p>
      <pre><code>{`// GlobalUsings.cs
global using IntList = System.Collections.Generic.List<int>;
global using Produto = (string Nome, decimal Preco, int Estoque);

// Qualquer outro arquivo do projeto pode usar IntList e Produto
// sem precisar repetir a diretiva.`}</code></pre>

      <AlertBox type="warning" title="Não exagere">
        Apelidos demais transformam o código em um quebra-cabeça: o leitor precisa pular para o topo do arquivo (ou para <code>GlobalUsings.cs</code>) toda vez para descobrir o que <code>Mapa</code> realmente é. Reserve aliases para tipos que aparecem <em>muitas vezes</em> no mesmo arquivo, ou que comunicam um conceito de domínio (ex.: <code>Coordenada</code>, <code>Produto</code>).
      </AlertBox>

      <h2>O que ainda NÃO é permitido</h2>
      <p>
        Algumas formas continuam fora do alcance do alias:
      </p>
      <ul>
        <li><strong>Genéricos abertos</strong>: <code>using Lista&lt;T&gt; = List&lt;T&gt;;</code> — não funciona; aliases não são tipos novos parametrizáveis.</li>
        <li><strong>Tipos <code>dynamic</code></strong>: continua proibido como alvo de alias.</li>
        <li><strong>Tipos com restrições <code>nint</code>/<code>nuint</code> em alguns cenários</strong>: ponteiros estão OK em contexto <code>unsafe</code>.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar que o alias seja um tipo novo</strong>: <code>Produto</code> e a tupla original são intercambiáveis em qualquer assinatura. Isso pode quebrar encapsulamento se você esperava algo "tipado fortemente".</li>
        <li><strong>Conflito com <code>global using</code></strong>: dois arquivos declarando o mesmo nome global geram erro de duplicidade. Centralize.</li>
        <li><strong>Alias dentro de namespace</strong>: a diretiva <code>using</code> deve ficar no <em>topo</em> do arquivo (ou dentro do namespace, antes de qualquer tipo). Não dá para colocar dentro de uma classe.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>C# 12 permite alias para qualquer tipo construído: genéricos, tuplas, arrays.</li>
        <li>Sintaxe: <code>using Apelido = TipoCompleto;</code> no topo do arquivo.</li>
        <li>Use <code>global using</code> para alias compartilhado em todo o projeto.</li>
        <li>Aliases melhoram legibilidade, mas não criam tipos novos — sem validação ou métodos extras.</li>
        <li>Use com moderação: alias demais esconde o que está acontecendo.</li>
      </ul>
    </PageContainer>
  );
}
