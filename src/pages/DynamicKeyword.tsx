import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DynamicKeyword() {
  return (
    <PageContainer
      title="A palavra dynamic e o DLR"
      subtitle="Quando você diz ao compilador: 'confia em mim, eu sei o que faço' — e a checagem de tipos só acontece quando o código roda."
      difficulty="avancado"
      timeToRead="12 min"
    >
      <p>
        C# é uma linguagem <strong>estaticamente tipada</strong>: o compilador valida cada chamada de método e cada acesso a propriedade <em>antes</em> do programa rodar. É um dos motivos pelos quais bugs aparecem no editor, não em produção. Mas existe uma palavra-chave especial que rompe esse contrato — <code>dynamic</code>. Ela diz ao compilador: "não verifique nada, eu garanto que vai funcionar; se eu mentir, o erro acontece em runtime". Por trás dela vive o <strong>DLR</strong> (Dynamic Language Runtime), uma camada do .NET projetada para hospedar linguagens dinâmicas como Python e Ruby.
      </p>

      <h2>O conceito básico</h2>
      <p>
        Uma variável <code>dynamic</code> aceita qualquer atribuição e qualquer chamada — o IntelliSense desliga, o compilador para de avisar, e tudo é resolvido durante a execução:
      </p>
      <pre><code>{`dynamic algo = "Olá";
Console.WriteLine(algo.Length);   // 3 — string.Length, ok

algo = 42;
Console.WriteLine(algo + 8);      // 50 — int

algo = new { Nome = "Ana" };
Console.WriteLine(algo.Nome);     // "Ana" — propriedade do anônimo

algo = 99;
Console.WriteLine(algo.Nome);     // 💥 RuntimeBinderException em runtime`}</code></pre>
      <p>
        O ponto-chave: a última linha <strong>compila sem erro</strong>. O compilador acreditou em você. Só na hora de rodar é que o DLR descobre que <code>int</code> não tem <code>.Nome</code> e lança <code>RuntimeBinderException</code>.
      </p>

      <AlertBox type="warning" title="dynamic ≠ var ≠ object">
        <code>var</code> é apenas inferência: o tipo é fixado em compilação (<code>var x = 10</code> é tão <code>int</code> quanto <code>int x = 10</code>). <code>object</code> aceita tudo, mas você precisa fazer cast para chamar métodos. <code>dynamic</code> é <em>verdadeiramente dinâmico</em>: nenhuma checagem em compilação, sem cast.
      </AlertBox>

      <h2>ExpandoObject: dicionário com cara de objeto</h2>
      <p>
        Junto com <code>dynamic</code>, o .NET oferece <code>ExpandoObject</code>: um objeto cujo conjunto de propriedades pode crescer em runtime, como um JavaScript object literal ou um <code>dict</code> de Python.
      </p>
      <pre><code>{`using System.Dynamic;

dynamic config = new ExpandoObject();
config.Nome = "MeuApp";
config.Versao = "1.0.0";
config.Debug = true;

Console.WriteLine($"{config.Nome} v{config.Versao}");

// Você também pode iterar como dicionário
var dict = (IDictionary<string, object>)config;
foreach (var par in dict)
    Console.WriteLine($"{par.Key} = {par.Value}");`}</code></pre>
      <p>
        Útil em cenários de scripting ou quando você está montando um payload livre — embora um <code>Dictionary&lt;string, object&gt;</code> normal frequentemente seja mais honesto.
      </p>

      <h2>Caso legítimo #1: COM Interop</h2>
      <p>
        <strong>COM</strong> (Component Object Model) é o sistema de componentes da Microsoft, base do Office, do Windows Shell e de muito código legado. Antes de <code>dynamic</code>, automatizar Excel em C# era torturante: dezenas de casts e tipos optional. Com <code>dynamic</code>, vira algo natural:
      </p>
      <pre><code>{`// Antes do C# 4 (sem dynamic):
Excel.Range range = (Excel.Range)((Excel.Worksheet)workbook.Sheets[1]).Cells[1, 1];

// Com dynamic:
dynamic sheet = workbook.Sheets[1];
sheet.Cells[1, 1].Value = "Olá";
sheet.Cells[1, 1].Font.Bold = true;`}</code></pre>

      <h2>Caso legítimo #2: interop com linguagens dinâmicas</h2>
      <p>
        Bibliotecas como <strong>IronPython</strong> permitem rodar código Python dentro de um app .NET. O DLR é o ponto de encontro: scripts Python expõem objetos como <code>dynamic</code> em C#:
      </p>
      <pre><code>{`// pseudo-código com IronPython
var engine = IronPython.Hosting.Python.CreateEngine();
dynamic script = engine.Execute(@"
def saudar(nome):
    return f'Olá, {nome}!'
");
Console.WriteLine(script.saudar("Maria"));   // resolvido em runtime`}</code></pre>

      <h2>Caso legítimo #3: parsing de JSON ad hoc</h2>
      <p>
        Para JSONs heterogêneos onde criar uma classe POCO é exagero, bibliotecas como <strong>Newtonsoft.Json</strong> oferecem <code>JObject</code> que pode ser tratado como <code>dynamic</code>:
      </p>
      <pre><code>{`using Newtonsoft.Json.Linq;

string json = "{ \\"usuario\\": { \\"nome\\": \\"Lia\\", \\"idade\\": 30 } }";
dynamic obj = JObject.Parse(json);

Console.WriteLine(obj.usuario.nome);    // "Lia"
Console.WriteLine(obj.usuario.idade);   // 30`}</code></pre>
      <p>
        No System.Text.Json moderno, prefira <code>JsonNode</code> ou desserializar para <code>JsonDocument</code>. Mas a opção dinâmica continua existindo.
      </p>

      <h2>Performance: dynamic não é grátis</h2>
      <p>
        Cada operação em <code>dynamic</code> passa pelo DLR, que faz <em>call site caching</em>: a primeira chamada é cara (algo como reflection), as subsequentes são rápidas porque o resolvedor é cacheado. Ainda assim, é <strong>mais lento</strong> que código estático e mais rápido que reflection pura.
      </p>
      <pre><code>{`// Benchmark grosseiro (1 milhão de iterações)
// Estático (int):           ~5 ms
// dynamic:                  ~80 ms
// Reflection (MethodInfo):  ~1500 ms`}</code></pre>

      <AlertBox type="danger" title="Não é uma desculpa para não tipar">
        <code>dynamic</code> esconde bugs até produção. Use SOMENTE quando o tipo é genuinamente desconhecido em compilação (interop COM, scripts, JSON livre). Para "facilitar" um código bem-tipado, é uma péssima ferramenta.
      </AlertBox>

      <h2>Como o DLR funciona por baixo</h2>
      <p>
        Quando o compilador encontra uma operação em <code>dynamic</code>, gera código que cria um <em>call site</em> — um cache de qual operação executar dependendo do tipo real. Na primeira execução, o DLR consulta um <strong>binder</strong> (<code>CSharpBinder</code> para C#, outros para Python/Ruby) que descobre o método/propriedade adequado. O resultado vai para o cache; chamadas seguintes pulam direto para a versão correta. É reflection com cache esperto.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Confundir com <code>var</code>:</strong> <code>var</code> é estático; <code>dynamic</code> é runtime. Erros completamente diferentes.</li>
        <li><strong>Achar que o IDE vai te avisar:</strong> autocomplete e refactoring não funcionam em <code>dynamic</code>. Você está por sua conta.</li>
        <li><strong>Renomear um método e esquecer chamadas dynamic:</strong> a busca por referências do IDE ignora chamadas dinâmicas. Bug em produção garantido.</li>
        <li><strong>Usar para "simplificar" código tipado:</strong> a leitura piora, performance cai, bugs ficam latentes.</li>
        <li><strong>Não capturar <code>RuntimeBinderException</code>:</strong> em código que de fato precisa ser dinâmico, blindar com try/catch é boa prática.</li>
        <li><strong>Esperar que <code>dynamic</code> resolva interface implícita:</strong> se a interface tem método <code>Foo</code> e o tipo concreto também, em <code>dynamic</code> a chamada vai pelo nome — pode pegar a sobrecarga errada.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dynamic</code> desliga checagem de tipos em compilação — tudo resolve em runtime.</li>
        <li>Diferente de <code>var</code> (inferência) e <code>object</code> (precisa cast).</li>
        <li><code>ExpandoObject</code> permite propriedades dinâmicas estilo JavaScript.</li>
        <li>Usado legitimamente em COM interop, IronPython/scripting e JSON ad hoc.</li>
        <li>Performance ~10–20× pior que código estático, mas cacheada via DLR.</li>
        <li>Casos raros — em código C# normal, prefira tipos fortes sempre.</li>
      </ul>
    </PageContainer>
  );
}
