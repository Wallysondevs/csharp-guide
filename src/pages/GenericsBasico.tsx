import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GenericsBasico() {
  return (
    <PageContainer
      title="Generics: tipos parametrizados sem boxing"
      subtitle="A ideia mais poderosa do C# moderno: criar coleções e algoritmos que funcionam para qualquer tipo, mantendo segurança e performance."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine que você quer escrever uma função "primeiro elemento de uma lista". Você precisa escrever uma versão para listas de inteiros, outra para listas de strings, outra para listas de clientes? Não. Os <strong>generics</strong> (em português, "tipos genéricos") permitem escrever a função <em>uma única vez</em> e usá-la com qualquer tipo, sem perder a verificação de tipos. Pense numa fôrma de bolo: a fôrma é genérica, e o "tipo" do bolo (chocolate, baunilha, cenoura) é o parâmetro que você escolhe na hora de assar.
      </p>

      <h2>O problema antes dos generics: <code>ArrayList</code></h2>
      <p>
        No C# 1.0 (2002), não existiam generics. Para uma coleção que aceitasse "qualquer coisa", usava-se <code>ArrayList</code>, que guardava tudo como <code>object</code> — o tipo-pai de todos os tipos no .NET. Isso causava dois problemas graves:
      </p>
      <pre><code>{`using System.Collections;

ArrayList lista = new ArrayList();
lista.Add(10);          // int -> object (boxing)
lista.Add("texto");     // string -> object (sem erro!)
lista.Add(3.14);        // double -> object

foreach (object item in lista) {
    int n = (int)item;  // Cast obrigatório, e CRASHA no "texto"!
    Console.WriteLine(n * 2);
}`}</code></pre>
      <p>
        Os dois problemas são: <strong>(1) sem segurança de tipo</strong> — a lista aceita qualquer mistura, e o erro só aparece em runtime; <strong>(2) boxing</strong>, que é o processo de embrulhar um valor primitivo (como <code>int</code>) num objeto na memória. Boxing aloca lixo no heap e degrada performance.
      </p>

      <AlertBox type="info" title="O que é boxing?">
        Tipos como <code>int</code> e <code>double</code> são <em>value types</em>: vivem direto na pilha (stack), são pequenos e rápidos. <code>object</code> é <em>reference type</em>: vive no heap. Quando você atribui um <code>int</code> a uma variável <code>object</code>, o runtime cria um "embrulho" no heap. Isso é boxing — o oposto, desembrulhar, é unboxing. Tudo isso custa CPU e gera trabalho para o garbage collector.
      </AlertBox>

      <h2>A solução: <code>List&lt;T&gt;</code></h2>
      <p>
        O C# 2.0 introduziu generics. A coleção genérica <code>List&lt;T&gt;</code> recebe um <strong>parâmetro de tipo</strong> chamado <code>T</code> (de "Type"). Você escolhe qual tipo concreto quando cria a instância:
      </p>
      <pre><code>{`using System.Collections.Generic;

// Lista que SÓ aceita int — verificado pelo compilador
List<int> numeros = new List<int>();
numeros.Add(10);
numeros.Add(20);
// numeros.Add("texto");  // ERRO de COMPILAÇÃO: cannot convert string to int

foreach (int n in numeros) {  // Sem cast, sem boxing
    Console.WriteLine(n * 2);
}

// Lista de strings, mesma classe genérica
List<string> nomes = new List<string> { "Ana", "Bruno" };`}</code></pre>
      <p>
        Resultados: o compilador <em>recusa</em> qualquer coisa que não seja <code>int</code>; não há boxing porque a lista internamente armazena um <code>int[]</code>; não precisa de cast. É como se o compilador <strong>especializasse</strong> a classe para o tipo escolhido.
      </p>

      <h2>Definindo seu próprio tipo genérico</h2>
      <p>
        Você pode declarar suas próprias classes e structs genéricos. A sintaxe coloca o parâmetro de tipo entre <code>&lt;</code> e <code>&gt;</code> logo após o nome:
      </p>
      <pre><code>{`// Caixa que guarda um item de qualquer tipo
public class Caixa<T> {
    public T Conteudo { get; set; } = default!;

    public void Mostrar() {
        Console.WriteLine($"A caixa contém: {Conteudo}");
    }
}

// Uso
Caixa<int> caixaDeNumero = new Caixa<int> { Conteudo = 42 };
Caixa<string> caixaDeTexto = new Caixa<string> { Conteudo = "olá" };
caixaDeNumero.Mostrar();   // A caixa contém: 42
caixaDeTexto.Mostrar();    // A caixa contém: olá`}</code></pre>
      <p>
        Note: <code>T</code> não é uma palavra mágica, é só convenção. Poderia ser <code>TItem</code>, <code>TValue</code>, ou qualquer nome (a tradição é começar com <code>T</code> maiúsculo). Para tipos genéricos com mais de um parâmetro, use nomes descritivos: <code>Dictionary&lt;TKey, TValue&gt;</code>.
      </p>

      <h2>Métodos genéricos</h2>
      <p>
        Não precisa que a classe inteira seja genérica — um único método pode ter seus próprios parâmetros de tipo:
      </p>
      <pre><code>{`public static class Util {
    // Método genérico em classe não-genérica
    public static T PrimeiroOuPadrao<T>(IEnumerable<T> origem) {
        foreach (var item in origem) return item;
        return default!;
    }
}

int n = Util.PrimeiroOuPadrao(new[] { 1, 2, 3 });   // T inferido como int
string s = Util.PrimeiroOuPadrao(new[] { "a", "b" }); // T inferido como string`}</code></pre>
      <p>
        Repare que você <strong>não precisou escrever</strong> <code>Util.PrimeiroOuPadrao&lt;int&gt;(...)</code>. O compilador olha para o argumento e <em>infere</em> o tipo — isso é a <strong>type inference</strong>. Você ainda pode ser explícito quando a inferência falha ou para legibilidade.
      </p>

      <h2>O tipo só é conhecido em compile-time</h2>
      <p>
        Generics não são "verificados em runtime" — todo o trabalho é feito pelo compilador. Quando você escreve <code>List&lt;int&gt;</code>, o JIT (compilador just-in-time do runtime) gera código nativo otimizado especificamente para <code>int</code>. Para <em>reference types</em> (classes), o runtime compartilha uma única implementação. Esse design é o segredo de por que generics em C# são <strong>tão rápidos quanto código manual</strong>, ao contrário de outras linguagens onde generics têm overhead.
      </p>
      <pre><code>{`// O compilador trata cada combinação como tipo distinto
List<int> a = new();
List<string> b = new();
Console.WriteLine(a.GetType());   // System.Collections.Generic.List\`1[System.Int32]
Console.WriteLine(b.GetType());   // System.Collections.Generic.List\`1[System.String]
// 'List\`1' significa List com 1 parâmetro genérico`}</code></pre>

      <h2>Exemplo prático: par chave-valor</h2>
      <pre><code>{`public class Par<TChave, TValor> {
    public TChave Chave { get; }
    public TValor Valor { get; }

    public Par(TChave chave, TValor valor) {
        Chave = chave;
        Valor = valor;
    }

    public override string ToString() => $"({Chave}, {Valor})";
}

var p1 = new Par<string, int>("idade", 30);
var p2 = new Par<int, List<string>>(1, new() { "a", "b" });
Console.WriteLine(p1);  // (idade, 30)`}</code></pre>

      <AlertBox type="warning" title="Diamond operator implícito">
        No C# moderno, <code>new Par&lt;string, int&gt;("idade", 30)</code> pode virar <code>new("idade", 30)</code> se o tipo da variável for declarado (chamado <em>target-typed new</em>). Use com moderação — explícito ainda é mais legível em código compartilhado.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Achar que <code>List&lt;object&gt;</code> resolve tudo:</strong> isso volta ao problema de boxing/cast. Sempre prefira o tipo concreto.</li>
        <li><strong>Esquecer o parâmetro de tipo:</strong> <code>List lista = new();</code> dá erro — o C# moderno exige <code>List&lt;T&gt;</code>.</li>
        <li><strong>Confundir parâmetro de tipo com argumento:</strong> em <code>List&lt;T&gt;</code>, <code>T</code> é parâmetro (na declaração); em <code>List&lt;int&gt;</code>, <code>int</code> é argumento (no uso).</li>
        <li><strong>Forçar inferência onde não dá:</strong> se o compilador não consegue inferir, especifique: <code>Util.Cria&lt;int&gt;()</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Generics permitem escrever código uma vez para qualquer tipo, com segurança e performance.</li>
        <li><code>List&lt;T&gt;</code> substituiu <code>ArrayList</code> eliminando boxing e casts.</li>
        <li>Parâmetros de tipo (<code>T</code>) são resolvidos em <strong>compile-time</strong>.</li>
        <li>Você pode criar suas próprias classes genéricas, métodos genéricos, structs genéricos.</li>
        <li>Type inference deixa o compilador deduzir os tipos a partir dos argumentos.</li>
      </ul>
    </PageContainer>
  );
}
