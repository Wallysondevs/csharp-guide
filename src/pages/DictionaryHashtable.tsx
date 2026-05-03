import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DictionaryHashtable() {
  return (
    <PageContainer
      title="Dictionary<K,V>: lookup O(1) por chave"
      subtitle="A coleção de pares chave-valor mais usada em C# — entenda como ela funciona, como usar e quando ela é mágica."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Imagine uma agenda telefônica: você procura pelo nome (a <strong>chave</strong>) e obtém o número (o <strong>valor</strong>) instantaneamente, sem ler a lista inteira. É exatamente isso que um <strong>Dictionary&lt;TKey, TValue&gt;</strong> faz em C#: guarda pares chave→valor e te devolve o valor em <em>tempo constante</em> (O(1)), mesmo com milhões de itens. Esse "milagre" se baseia em uma técnica chamada <em>hashing</em>, e neste capítulo você vai entender como usar e por que funciona.
      </p>

      <h2>Criando e adicionando</h2>
      <p>
        O Dictionary é um <em>tipo genérico</em> — você escolhe o tipo da chave e do valor. Chaves não podem repetir; valores podem.
      </p>
      <pre><code>{`using System.Collections.Generic;

// Dicionário com chave string e valor int (idades)
var idades = new Dictionary<string, int>();
idades.Add("Ana", 28);
idades.Add("Bruno", 35);

// Forma curta, com inicializador
var capitais = new Dictionary<string, string>
{
    ["Brasil"] = "Brasília",
    ["França"] = "Paris",
    ["Japão"] = "Tóquio"
};

Console.WriteLine(capitais["Japão"]); // Tóquio`}</code></pre>
      <p>
        O <strong>indexer</strong> <code>[]</code> é a forma mais comum de ler e escrever. Atribuir cria ou sobrescreve. <code>Add</code>, em contraste, lança exceção se a chave já existe — útil quando você quer garantir unicidade.
      </p>

      <h2>TryGetValue: a forma segura de ler</h2>
      <p>
        Acessar uma chave inexistente pelo indexer dispara <code>KeyNotFoundException</code>. Para evitar isso, o método idiomático é <code>TryGetValue</code>: ele devolve <code>true</code>/<code>false</code> e entrega o valor por <code>out</code>.
      </p>
      <pre><code>{`if (capitais.TryGetValue("Brasil", out string? capital))
{
    Console.WriteLine($"Capital: {capital}");
}
else
{
    Console.WriteLine("País não cadastrado.");
}

// Versus o jeito perigoso:
// var x = capitais["Marte"]; // BOOM: KeyNotFoundException`}</code></pre>

      <AlertBox type="success" title="Idiomático: prefira TryGetValue">
        Em código de produção, <code>TryGetValue</code> é quase sempre melhor que <code>ContainsKey</code> seguido por indexer — porque o último faz <em>duas</em> buscas no hash; <code>TryGetValue</code> faz só uma.
      </AlertBox>

      <h2>ContainsKey, Remove e iteração</h2>
      <p>
        <code>ContainsKey</code> verifica existência. <code>Remove</code> exclui (devolve bool). Para iterar, use <code>foreach</code> sobre <code>KeyValuePair&lt;K,V&gt;</code> — ou prefira a sintaxe moderna com <em>tuple deconstruction</em>:
      </p>
      <pre><code>{`var estoque = new Dictionary<string, int>
{
    ["Maçã"] = 100, ["Banana"] = 50, ["Uva"] = 200
};

// Iteração tradicional
foreach (KeyValuePair<string, int> par in estoque)
    Console.WriteLine($"{par.Key}: {par.Value}");

// Iteração moderna (C# 7+) com deconstrução
foreach (var (fruta, qtd) in estoque)
    Console.WriteLine($"{fruta}: {qtd}");

// Apenas chaves ou apenas valores
foreach (var nome in estoque.Keys) { /* ... */ }
foreach (var qtd in estoque.Values) { /* ... */ }`}</code></pre>

      <h2>Por que é O(1)? O papel do GetHashCode</h2>
      <p>
        Quando você adiciona uma chave, o Dictionary chama <code>chave.GetHashCode()</code> para gerar um número (o <em>hash</em>) e usa esse número para escolher um "balde" (bucket) do array interno. Buscar é a mesma coisa: hashea de novo, vai direto ao balde. Como o cálculo do hash não depende do tamanho da coleção, a busca é O(1) <em>amortizado</em>.
      </p>
      <pre><code>{`// Para chaves do tipo string, int, etc., o GetHashCode já vem pronto.
// Mas se você usar uma classe sua como chave, precisa sobrescrever:

public class Cpf
{
    public string Numero { get; }
    public Cpf(string n) => Numero = n;

    // OBRIGATÓRIO sobrescrever ambos quando usar como chave
    public override bool Equals(object? obj) =>
        obj is Cpf c && c.Numero == Numero;

    public override int GetHashCode() => Numero.GetHashCode();
}

var ficha = new Dictionary<Cpf, string>();
ficha[new Cpf("123")] = "Ana";
Console.WriteLine(ficha[new Cpf("123")]); // "Ana"`}</code></pre>

      <AlertBox type="warning" title="Sem GetHashCode bem feito, vira O(n)">
        Se duas chaves "iguais" geram hashes <em>diferentes</em>, o Dictionary não as encontra. Pior: se todas as chaves caem no mesmo balde (hash igual), a busca degrada para O(n). Sempre implemente <code>Equals</code> e <code>GetHashCode</code> juntos — ou prefira <strong>records</strong>, que fazem isso automaticamente.
      </AlertBox>

      <h2>Records como chaves: o jeito moderno</h2>
      <p>
        Desde C# 9, <strong>records</strong> implementam <code>Equals</code> e <code>GetHashCode</code> automaticamente baseados nas propriedades. São perfeitos para chaves compostas:
      </p>
      <pre><code>{`public record Coordenada(int X, int Y);

var mapa = new Dictionary<Coordenada, string>();
mapa[new Coordenada(0, 0)] = "Origem";
mapa[new Coordenada(1, 2)] = "Tesouro";

// Funciona! Records têm igualdade por valor.
Console.WriteLine(mapa[new Coordenada(1, 2)]); // Tesouro`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Acessar chave inexistente com <code>[]</code></strong>: lança <code>KeyNotFoundException</code>. Use <code>TryGetValue</code>.</li>
        <li><strong>Add em chave duplicada</strong>: lança <code>ArgumentException</code>. Use indexer (<code>dict[k] = v</code>) se quiser sobrescrever.</li>
        <li><strong>Modificar dicionário durante <code>foreach</code></strong>: causa <code>InvalidOperationException</code>. Itere sobre uma cópia (<code>dict.Keys.ToList()</code>).</li>
        <li><strong>Usar classe mutável como chave</strong>: se você muda a propriedade depois de inserir, o hash muda e o item fica "perdido" no balde antigo.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Dictionary&lt;K,V&gt; guarda pares chave→valor com lookup O(1).</li>
        <li>Use <code>TryGetValue</code> em vez de <code>ContainsKey</code> + indexer.</li>
        <li>Indexer <code>dict[k] = v</code> cria ou atualiza; <code>Add</code> falha em duplicata.</li>
        <li>Chaves customizadas exigem <code>Equals</code> + <code>GetHashCode</code> — ou use records.</li>
        <li>Não modifique o dicionário durante uma iteração.</li>
      </ul>
    </PageContainer>
  );
}
