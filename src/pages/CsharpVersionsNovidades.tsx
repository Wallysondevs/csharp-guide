import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CsharpVersionsNovidades() {
  return (
    <PageContainer
      title="C# 7 a C# 13: novidades versão a versão"
      subtitle="Um passeio cronológico pelas features mais marcantes de cada versão do C#, do que mudou na sintaxe ao que você ganha de produtividade."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        O C# evolui em <strong>ciclos anuais</strong> desde 2017. Cada versão traz açúcar sintático (formas mais curtas de escrever a mesma coisa), novos recursos do compilador (que é o programa que traduz seu código em algo que o computador entende) e às vezes mudanças que dependem do <strong>runtime</strong> — o ambiente de execução do .NET. Saber em qual versão cada coisa apareceu te ajuda a ler código antigo, configurar projetos legados e escolher quais recursos usar.
      </p>

      <p>
        Pense nas versões do C# como <em>edições anuais de um livro</em>: a história principal continua, mas cada edição ganha capítulos novos. Você sempre pode ler uma edição mais recente, mas se trabalhar num projeto preso a uma edição antiga, precisa respeitar o vocabulário da época.
      </p>

      <h2>Tabela cronológica resumida</h2>
      <p>
        A tabela abaixo lista as versões do C# da era moderna, o ano de lançamento e <strong>uma a duas features-chave</strong> de cada — aquelas que você verá em código real com mais frequência. As versões antigas (1.0 a 6.0) tinham ciclos longos de 2 a 4 anos; depois de C# 7 o ritmo virou anual.
      </p>
      <table>
        <thead>
          <tr><th>Versão</th><th>Ano</th><th>Destaques</th></tr>
        </thead>
        <tbody>
          <tr><td>C# 7.0/7.3</td><td>2017–18</td><td>Tuples, pattern matching básico, <code>out var</code>, funções locais</td></tr>
          <tr><td>C# 8.0</td><td>2019</td><td>Reference types nullable (<code>string?</code>), <code>switch</code> expression, default interface members, <code>using</code> declaration</td></tr>
          <tr><td>C# 9.0</td><td>2020</td><td><code>record</code>, init-only setters, top-level statements, target-typed <code>new()</code></td></tr>
          <tr><td>C# 10</td><td>2021</td><td>File-scoped namespaces, global usings, <code>record struct</code>, interpolação constante</td></tr>
          <tr><td>C# 11</td><td>2022</td><td>Raw string literals, <code>required</code> members, list patterns, generic math</td></tr>
          <tr><td>C# 12</td><td>2023</td><td>Primary constructors em classes, collection expressions, <code>using</code> alias para qualquer tipo</td></tr>
          <tr><td>C# 13</td><td>2024</td><td>Params <code>collections</code>, novo <code>lock</code> tipo, <code>field</code> keyword (preview)</td></tr>
        </tbody>
      </table>

      <h2>Como escolher a versão no <code>.csproj</code></h2>
      <p>
        Cada projeto .NET tem um arquivo <code>.csproj</code> (XML de configuração). A versão do C# é controlada pela propriedade <code>&lt;LangVersion&gt;</code>. Por padrão, o SDK escolhe automaticamente a versão associada ao <strong>TFM</strong> (Target Framework Moniker — o "alvo" do binário, ex.: <code>net8.0</code>). Mas você pode forçar:
      </p>
      <pre><code>{`<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <!-- Forçar uma versão específica do compilador -->
    <LangVersion>12.0</LangVersion>
    <!-- Ou "latest", "preview", "default" -->
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>`}</code></pre>
      <p>
        Os valores especiais valem ouro: <code>latest</code> usa a versão estável mais nova suportada pelo SDK instalado; <code>preview</code> habilita features experimentais (cuidado em produção); <code>default</code> deixa o SDK decidir conforme o TFM.
      </p>

      <h2>Tuples e pattern matching (C# 7)</h2>
      <p>
        Tuples permitem retornar múltiplos valores sem criar uma classe inteira. <strong>Pattern matching</strong> é uma forma de "perguntar e desconstruir" valores ao mesmo tempo — tipo um interrogatório: "você é um <code>Cliente</code>? Se sim, me dê o nome dele."
      </p>
      <pre><code>{`// Retorno em tupla nomeada
(string nome, int idade) ObterPessoa() => ("Ana", 30);

var p = ObterPessoa();
Console.WriteLine($"{p.nome} tem {p.idade} anos");

// Pattern matching com 'is'
object obj = 42;
if (obj is int n && n > 0) {
    Console.WriteLine($"Inteiro positivo: {n}");
}`}</code></pre>

      <AlertBox type="info" title="Tuple não é record">
        Tuples são leves e ótimas para retornos internos. Para tipos públicos compartilhados entre módulos, prefira <code>record</code> — eles têm nome próprio, igualdade por valor e ficam mais legíveis em APIs.
      </AlertBox>

      <h2>Records, init e top-level (C# 9)</h2>
      <p>
        Records são tipos de referência <em>imutáveis por convenção</em> com igualdade por valor — perfeitos para DTOs (objetos só de transporte de dados). Setters <code>init</code> permitem definir uma propriedade só durante a construção. Top-level statements eliminam a "cerimônia" de ter que escrever <code>class Program</code> + <code>Main</code> só para um script rápido.
      </p>
      <pre><code>{`// Record posicional: cria propriedades, ctor, Equals, GetHashCode e Deconstruct
public record Produto(string Nome, decimal Preco);

// Init-only: só pode atribuir no construtor ou no inicializador
public class Config {
    public string Host { get; init; } = "localhost";
}

// Top-level: o arquivo inteiro é o Main
Console.WriteLine("Olá sem cerimônia!");`}</code></pre>

      <h2>Raw strings e required (C# 11)</h2>
      <p>
        Raw string literals usam três ou mais aspas (<code>"""</code>) para conter qualquer texto sem escape — JSON, HTML, regex viram naturalmente legíveis. <code>required</code> obriga o chamador a definir uma propriedade na criação, mesmo sem ctor explícito.
      </p>
      <pre><code>{`string json = """
{
  "nome": "Ana",
  "idade": 30
}
""";

public class Usuario {
    public required string Email { get; init; }
}
// Erro de compilação se não definir Email:
var u = new Usuario { Email = "a@b.com" };`}</code></pre>

      <h2>Primary ctors e collection expressions (C# 12)</h2>
      <p>
        C# 12 levou a sintaxe de <em>parâmetros na linha da classe</em> (que já existia em records) para classes comuns, e introduziu literais únicos <code>[1, 2, 3]</code> que servem para arrays, listas, spans e qualquer coleção compatível.
      </p>
      <pre><code>{`// Primary constructor em classe
public class Pedido(Guid id, decimal total) {
    public override string ToString() => $"#{id} R$ {total}";
}

// Collection expressions
int[] arr = [1, 2, 3];
List<int> lista = [..arr, 4, 5];`}</code></pre>

      <AlertBox type="warning" title="Compatibilidade vs. SDK">
        Atualizar <code>LangVersion</code> não substitui o runtime. Se seu projeto está em <code>net6.0</code>, mesmo definindo <code>LangVersion=12</code>, alguns recursos (como generic math) precisam de runtime mais novo. Atualize o TFM junto sempre que possível.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar feature nova com SDK antigo:</strong> o erro <em>"Feature X is not available in C# 9"</em> indica que falta subir o <code>LangVersion</code>.</li>
        <li><strong>Achar que record é mutável:</strong> os <code>set</code> de record posicional são <code>init</code>; tente <code>p with {`{ Nome = "X" }`}</code> para criar uma cópia modificada.</li>
        <li><strong>Misturar top-level com <code>Main</code> manual:</strong> só pode haver um arquivo de top-level statements por projeto, e ele não pode coexistir com outro <code>Main</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>C# evolui anualmente; cada versão tem um conjunto bem definido de features.</li>
        <li><code>LangVersion</code> no <code>.csproj</code> controla qual versão você está escrevendo.</li>
        <li>Tuples (7), records (9), file-scoped ns (10), raw strings (11), primary ctor + collection expressions (12) são divisores de água.</li>
        <li>Atualizar o C# nem sempre exige atualizar o TFM, mas algumas features (generic math) sim.</li>
      </ul>
    </PageContainer>
  );
}
