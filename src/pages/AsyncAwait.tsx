import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AsyncAwait() {
  return (
    <PageContainer
      title={"async / await"}
      subtitle={"Estado da arte pra concorrência em C#. O compilador gera uma máquina de estados invisível."}
      difficulty={"intermediario"}
      timeToRead={"8 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public async Task<string> BaixarAsync(string url)
{
    using var http = new HttpClient();
    HttpResponseMessage resp = await http.GetAsync(url);
    string body = await resp.Content.ReadAsStringAsync();
    return body;
}

string html = await BaixarAsync("https://exemplo.com");`}
      />

      <h2>Regras</h2>

      <ul>
        <li>Método async deve retornar <code>Task</code>, <code>Task&lt;T&gt;</code>, <code>ValueTask</code>, <code>ValueTask&lt;T&gt;</code>, <code>void</code> (só pra event handlers), ou <code>IAsyncEnumerable&lt;T&gt;</code>.</li>
        <li>Convenção: nome termina em <code>Async</code>.</li>
        <li>Pode ter quantos <code>await</code> quiser dentro.</li>
      </ul>

      <h2>Nunca .Result ou .Wait()</h2>

      <CodeBlock
        language="csharp"
        code={`// PERIGO — pode causar deadlock em UI/ASP.NET clássico
string x = BaixarAsync(url).Result;

// Certo
string x = await BaixarAsync(url);`}
      />

      <AlertBox type="warning" title={"Async all the way"}>
        <p>Ou tudo é async, ou nada é. Misturar async com .Result/.Wait causa deadlocks que demoram dias pra debugar.</p>
      </AlertBox>
    </PageContainer>
  );
}
