import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Indexers() {
  return (
    <PageContainer
      title="Indexers: acessando objetos como arrays"
      subtitle="Aprenda a permitir que seus objetos sejam acessados com colchetes — útil em coleções customizadas, matrizes, dicionários e muito mais."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Em C#, você está acostumado a escrever <code>nomes[3]</code> ou <code>dicionario["chave"]</code>. Esses colchetes não são privilégio de array nem de <code>Dictionary</code>: qualquer classe sua pode oferecer essa sintaxe definindo um <strong>indexer</strong> (em português, "indexador"). É como instalar uma maçaneta lateral no seu objeto: a porta da frente continua sendo o construtor, mas agora há um atalho para entrar e pegar coisas direto. Indexers existem para deixar APIs naturais — você lê <code>tabuleiro[2,3]</code> em vez de <code>tabuleiro.ObterCelula(2,3)</code>.
      </p>

      <h2>O básico: <code>this[int i]</code></h2>
      <p>
        Um indexer é declarado quase como uma propriedade, mas usando a palavra-chave <code>this</code> seguida de colchetes com os parâmetros. Pode ter <code>get</code>, <code>set</code> ou ambos.
      </p>
      <pre><code>{`public class ListaSegura {
    private readonly string[] _itens;

    public ListaSegura(int tamanho) => _itens = new string[tamanho];

    public string this[int i] {
        get {
            if (i < 0 || i >= _itens.Length) return "(vazio)";
            return _itens[i] ?? "(vazio)";
        }
        set {
            if (i < 0 || i >= _itens.Length) return;   // ignora silenciosamente
            _itens[i] = value;
        }
    }
}

var l = new ListaSegura(3);
l[0] = "Ana";
l[1] = "Bia";
Console.WriteLine(l[0]);    // Ana
Console.WriteLine(l[99]);   // (vazio) — sem exceção`}</code></pre>
      <p>
        Repare em <code>value</code>: dentro do <code>set</code>, ele representa o valor que está sendo atribuído (mesma palavra-chave de propriedades). E note como o indexer adiciona <em>comportamento</em> — não é apenas um array exposto, é um array <em>com regras</em>.
      </p>

      <h2>Indexers com mais de um parâmetro</h2>
      <p>
        Você pode declarar quantos parâmetros quiser, de tipos diferentes. É exatamente assim que matrizes de duas dimensões funcionam, e como você implementa estruturas como tabuleiros de jogo, planilhas ou tabelas.
      </p>
      <pre><code>{`public class Matriz {
    private readonly double[,] _data;
    public int Linhas  { get; }
    public int Colunas { get; }

    public Matriz(int linhas, int cols) {
        Linhas = linhas; Colunas = cols;
        _data = new double[linhas, cols];
    }

    // Indexer com DOIS argumentos
    public double this[int linha, int coluna] {
        get => _data[linha, coluna];
        set => _data[linha, coluna] = value;
    }
}

var m = new Matriz(3, 3);
m[0, 0] = 1; m[1, 1] = 1; m[2, 2] = 1;
Console.WriteLine(m[1, 1]);   // 1`}</code></pre>

      <AlertBox type="info" title="Indexers podem ser sobrecarregados">
        Igual a métodos, você pode declarar várias versões de <code>this[...]</code> com tipos ou quantidades diferentes. Por exemplo, <code>this[int]</code> e <code>this[string]</code> coexistem na mesma classe.
      </AlertBox>

      <h2>Chaves não-inteiras: o caso <code>IDictionary</code></h2>
      <p>
        Dicionários são o exemplo clássico de indexer com chave de qualquer tipo. Quando você escreve <code>dict["nome"]</code>, está chamando <code>this[string]</code> da implementação. Você pode fazer o mesmo na sua classe:
      </p>
      <pre><code>{`public class Configuracao {
    private readonly Dictionary<string, string> _valores = new();

    public string this[string chave] {
        get => _valores.TryGetValue(chave, out var v) ? v : "";
        set => _valores[chave] = value;
    }
}

var cfg = new Configuracao();
cfg["host"] = "localhost";
cfg["porta"] = "5432";
Console.WriteLine(cfg["host"]);     // localhost
Console.WriteLine(cfg["nada"]);     // ""  (em vez de exceção)`}</code></pre>
      <p>
        Esse padrão "chave string -&gt; valor com fallback amigável" aparece em ConfigurationManager, IConfiguration, Cache e centenas de APIs do .NET. Ao implementar o seu próprio, você ganha encaixe perfeito com código já existente.
      </p>

      <h2>Indexers com <code>Range</code> e <code>Index</code></h2>
      <p>
        Desde o C# 8, há tipos especiais <code>Index</code> (uma posição que pode ser contada do fim com <code>^1</code>) e <code>Range</code> (uma fatia <code>1..3</code>). Coleções podem implementar indexers que aceitam esses tipos para suportar a sintaxe moderna de slicing.
      </p>
      <pre><code>{`public class Lista<T> {
    private readonly List<T> _itens = new();
    public int Count => _itens.Count;
    public void Add(T x) => _itens.Add(x);

    public T this[Index i] => _itens[i.GetOffset(_itens.Count)];

    public IList<T> this[Range r] {
        get {
            var (offset, length) = r.GetOffsetAndLength(_itens.Count);
            return _itens.GetRange(offset, length);
        }
    }
}

var l = new Lista<string>();
l.Add("a"); l.Add("b"); l.Add("c"); l.Add("d");

Console.WriteLine(l[^1]);             // d  (último)
foreach (var x in l[1..3]) Console.Write(x + " "); // b c`}</code></pre>
      <p>
        <code>^1</code> significa "primeiro do fim", <code>^2</code> "segundo do fim". <code>1..3</code> significa "do índice 1 inclusive até 3 exclusive". Esses operadores se traduzem em chamadas ao indexer apropriado.
      </p>

      <AlertBox type="warning" title="Indexer não é método">
        Indexers não podem ser <code>static</code>, não podem ser referenciados como <em>delegate</em>, e não podem ter o mesmo nome — porque o "nome" deles é o conjunto <code>this</code> + parâmetros. Se você precisa de algo nomeado, prefira um método.
      </AlertBox>

      <h2>Indexers em interfaces</h2>
      <p>
        Você pode declarar indexers em interfaces como contrato. Quem implementa precisa fornecer o indexer — exatamente como faria com uma propriedade.
      </p>
      <pre><code>{`public interface ITradutor {
    string this[string termo] { get; }
}

public class TradutorIngles : ITradutor {
    private readonly Dictionary<string, string> _dic = new() {
        ["hello"] = "olá",
        ["world"] = "mundo"
    };
    public string this[string termo] =>
        _dic.TryGetValue(termo.ToLowerInvariant(), out var v) ? v : termo;
}

ITradutor t = new TradutorIngles();
Console.WriteLine(t["hello"]);   // olá`}</code></pre>

      <h2>Boas práticas e regras de bom gosto</h2>
      <p>
        Indexers tornam APIs concisas, mas usados sem critério deixam o código misterioso. Algumas heurísticas práticas:
      </p>
      <ul>
        <li>Use indexer quando o conceito do tipo for "uma coleção de algo" ou "um mapeamento de chave para valor". Para qualquer outra coisa, prefira método nomeado (<code>cliente.Pedido(2)</code> é mais claro que <code>cliente[2]</code>).</li>
        <li>Mantenha o custo previsível: idealmente O(1) ou O(log n). Indexer caro engana quem usa.</li>
        <li>Nunca lance exceção em indexer só de leitura por um valor "não encontrado" se houver fallback razoável — a sintaxe <code>x[k]</code> é tão simples que parece infalível.</li>
        <li>Documente as exceções que pode lançar (<code>IndexOutOfRangeException</code>, <code>KeyNotFoundException</code>).</li>
        <li>Se o indexer é só leitura, declare apenas <code>get</code> — assim a coleção fica visivelmente imutável de fora.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Confundir indexer com método chamado <code>Item</code>:</strong> sob o capô o compilador gera um <code>get_Item</code>/<code>set_Item</code>; em reflexão, é por aí que você acessa.</li>
        <li><strong>Esquecer de validar limites:</strong> sem <code>if (i &gt;= _itens.Length)</code>, sua aplicação ganha <code>IndexOutOfRangeException</code> em produção.</li>
        <li><strong>Indexer com side-effect:</strong> ler um valor não deveria modificar nada. Quem lê <code>x[k]</code> não espera estado mudando.</li>
        <li><strong>Usar <code>this[int]</code> quando o tipo não é coleção:</strong> torna o código confuso. Prefira método nomeado.</li>
        <li><strong>Não suportar <code>Index</code>/<code>Range</code> em coleção própria:</strong> usuários da .NET 8 esperam essa sintaxe.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Indexer permite usar colchetes em objetos: <code>obj[i]</code>.</li>
        <li>Sintaxe: <code>public T this[Tipo arg] {`{ get; set; }`}</code>.</li>
        <li>Pode ter múltiplos parâmetros (<code>this[int x, int y]</code>) e ser sobrecarregado.</li>
        <li>Aceita <code>Index</code> (<code>^1</code>) e <code>Range</code> (<code>1..3</code>) para slicing moderno.</li>
        <li>Pode ser declarado em interfaces como contrato.</li>
        <li>Use só quando o tipo é semanticamente uma coleção/mapeamento.</li>
      </ul>
    </PageContainer>
  );
}
