import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AnonymousTypes() {
  return (
    <PageContainer
      title="Tipos anônimos: objetos sem nome de classe"
      subtitle="Crie objetos descartáveis e fortemente tipados em uma única linha — perfeitos para projeções LINQ e protótipos."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <p>
        Às vezes você precisa, dentro de um método, agrupar duas ou três informações relacionadas — por exemplo, "nome e total gasto" — só para passar adiante em um cálculo ou exibir na tela. Criar uma classe inteira chamada <code>NomeETotal</code> só para isso é exagero. Para esses momentos, o C# oferece os <strong>tipos anônimos</strong>: objetos cujo tipo é gerado automaticamente pelo compilador, sem que você precise dar um nome a ele. É como um post-it: serve para um momento específico e morre quando o método termina.
      </p>

      <h2>A sintaxe básica</h2>
      <p>
        Você usa <code>new</code> seguido de chaves contendo pares <em>nome = valor</em>. O compilador olha esses pares, deduz os tipos e gera nos bastidores uma classe imutável com aquelas propriedades.
      </p>
      <pre><code>{`var pessoa = new { Nome = "Ana", Idade = 30 };
Console.WriteLine(pessoa.Nome);    // Ana
Console.WriteLine(pessoa.Idade);   // 30
Console.WriteLine(pessoa);         // { Nome = Ana, Idade = 30 }`}</code></pre>
      <p>
        Repare em duas coisas. Primeiro, você é <strong>obrigado</strong> a usar <code>var</code>: o tipo gerado não tem um nome que você possa escrever à mão. Segundo, o <code>ToString()</code> já vem implementado de forma útil — perfeito para diagnóstico rápido em logs.
      </p>

      <h2>Imutabilidade automática</h2>
      <p>
        Toda propriedade de um tipo anônimo é <strong>read-only</strong>: você define os valores na criação e nunca mais consegue alterá-los. Esse é um recurso, não uma limitação — protege contra modificações acidentais e torna o objeto seguro para passar entre métodos.
      </p>
      <pre><code>{`var p = new { X = 10, Y = 20 };
// p.X = 99;     // ERRO: a propriedade X é só de leitura

// Para "modificar", você cria um novo:
var p2 = new { X = p.X + 1, Y = p.Y };`}</code></pre>
      <p>
        O padrão "criar um novo em vez de mutar" lembra muito o que <code>record</code>s fazem com a expressão <code>with</code>. Tipos anônimos foram, na prática, um precursor desse padrão de imutabilidade.
      </p>

      <AlertBox type="info" title="Igualdade por valor — de graça">
        Dois tipos anônimos com as <strong>mesmas propriedades, mesmos tipos e mesma ordem</strong> são considerados o mesmo tipo pelo compilador. E suas instâncias se comparam por valor: <code>{`new { A = 1 }.Equals(new { A = 1 })`}</code> devolve <code>true</code>. Isso é útil em LINQ para agrupar e distinguir.
      </AlertBox>

      <h2>O caso de ouro: projeções em LINQ</h2>
      <p>
        Tipos anônimos brilham quando você precisa, em uma consulta, selecionar um <em>recorte</em> dos dados — algumas colunas calculadas, sem precisar criar uma DTO formal. O método <code>Select</code> de LINQ aceita exatamente esse padrão.
      </p>
      <pre><code>{`var pedidos = new[] {
    new { Cliente = "Ana", Produto = "Livro", Preco = 50m, Qtd = 2 },
    new { Cliente = "Bia", Produto = "Caneta", Preco = 5m, Qtd = 10 },
    new { Cliente = "Ana", Produto = "Mochila", Preco = 120m, Qtd = 1 }
};

// Projeção: nome do cliente + total gasto
var resumo = pedidos
    .Select(p => new { p.Cliente, Total = p.Preco * p.Qtd })
    .GroupBy(x => x.Cliente)
    .Select(g => new { Cliente = g.Key, Total = g.Sum(x => x.Total) });

foreach (var r in resumo) {
    Console.WriteLine($"{r.Cliente}: R$ {r.Total}");
}
// Ana: R$ 220
// Bia: R$ 50`}</code></pre>
      <p>
        Note o atalho <code>new &#123; p.Cliente &#125;</code>: o compilador entende "use o nome <code>Cliente</code> da propriedade que estou copiando". Isso é o <strong>projection initializer</strong>, e funciona sempre que você quer carregar uma propriedade existente para o objeto anônimo.
      </p>

      <h2>Limitações importantes</h2>
      <p>
        Como o tipo só existe dentro do método em que foi criado, você não consegue declarar parâmetros, retornos ou campos com ele. O escopo é local.
      </p>
      <pre><code>{`// IMPOSSÍVEL: não há nome para escrever
public ??? PegarPessoa() {
    return new { Nome = "Ana", Idade = 30 };
}

// Truque: retornar como object — mas perde os nomes
public object PegarObjeto() => new { Nome = "Ana" };

// Para realmente sair do método, use:
//  - record (recomendado)
//  - tupla nomeada
//  - DTO/classe explícita`}</code></pre>
      <p>
        Existe um truque com <em>generics</em> chamado <em>type inference helper</em> (<code>CastByExample</code>) para "transportar" o tipo, mas é hacky. Se você precisa cruzar a fronteira de um método, declare um <code>record</code> — a sintaxe é quase tão curta e o tipo tem nome.
      </p>

      <h2>Anônimos vs Tuplas vs Records</h2>
      <p>
        As três ferramentas servem para "agrupar valores", mas com nuances diferentes. Use a tabela mental abaixo para escolher:
      </p>
      <ul>
        <li><strong>Tipo anônimo:</strong> uso local em um método, projeções LINQ, depuração. Imutável. Tipo escondido.</li>
        <li><strong>Tupla nomeada (<code>(int X, int Y)</code>):</strong> também leve; pode atravessar fronteiras de método; mutável por padrão; igualdade por valor.</li>
        <li><strong>Record:</strong> tipo nomeado e formal, ideal para domínio público, com <code>with</code>, <code>Deconstruct</code>, igualdade estrutural e padrões.</li>
      </ul>
      <pre><code>{`// Mesma ideia, três jeitos:
var anon = new { Nome = "Ana", Idade = 30 };
var tup  = (Nome: "Ana", Idade: 30);
record Pessoa(string Nome, int Idade);
var rec  = new Pessoa("Ana", 30);`}</code></pre>

      <AlertBox type="warning" title="Não tente serializar diretamente">
        Tipos anônimos funcionam com <code>System.Text.Json</code> em <em>serialização</em> (basta passar o objeto), mas <strong>não em desserialização</strong> — não há um construtor público nomeado para o desserializador chamar. Para entrada de dados, use <code>record</code> ou classe.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar atribuir a uma propriedade depois:</strong> não compila. Tipos anônimos são imutáveis.</li>
        <li><strong>Ordem de propriedades importa:</strong> <code>{`new { A = 1, B = 2 }`}</code> e <code>{`new { B = 2, A = 1 }`}</code> são <em>tipos diferentes</em> — não pode atribuir um ao outro.</li>
        <li><strong>Devolver de método público:</strong> impossível sem perder o tipo. Use record/tupla.</li>
        <li><strong>Confundir com <code>dynamic</code>:</strong> tipo anônimo é fortemente tipado, IntelliSense funciona; <code>dynamic</code> é resolvido em runtime e não tem ajuda.</li>
        <li><strong>Lista/array com formatos diferentes:</strong> <code>{`new[] { new { A=1 }, new { A=1, B=2 } }`}</code> não compila — todos os elementos precisam do mesmo "shape".</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Tipos anônimos criam objetos imutáveis sem precisar declarar uma classe.</li>
        <li>Sintaxe: <code>{`var x = new { Nome = "Ana", Idade = 30 };`}</code>.</li>
        <li>Use <code>var</code> obrigatoriamente; o tipo não tem nome escrevível.</li>
        <li>Brilham em projeções LINQ (<code>Select</code>, <code>GroupBy</code>, <code>Join</code>).</li>
        <li>Não cruzam fronteiras de método público — para isso, prefira <code>record</code>.</li>
        <li>Igualdade e <code>ToString</code> automáticos por valor — ótimos para depuração.</li>
      </ul>
    </PageContainer>
  );
}
