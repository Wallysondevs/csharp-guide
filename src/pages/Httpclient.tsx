import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Httpclient() {
  return (
    <PageContainer
      title={"HttpClient"}
      subtitle={"API HTTP do .NET. Use sempre singleton ou IHttpClientFactory."}
      difficulty={"intermediario"}
      timeToRead={"7 min"}
    >
      <h2>Uso direto</h2>

      <CodeBlock
        language="csharp"
        code={`using var http = new HttpClient();
http.Timeout = TimeSpan.FromSeconds(10);
http.DefaultRequestHeaders.Add("User-Agent", "MeuApp/1.0");

// GET JSON
var pessoa = await http.GetFromJsonAsync<Pessoa>("https://api/pessoa/1");

// POST JSON
var resp = await http.PostAsJsonAsync("https://api/pessoa", novaPessoa);
resp.EnsureSuccessStatusCode();
var criado = await resp.Content.ReadFromJsonAsync<Pessoa>();

// download bytes/streaming
using var fs = File.Create("img.jpg");
using var stream = await http.GetStreamAsync("https://exemplo.com/img.jpg");
await stream.CopyToAsync(fs);`}
      />

      <AlertBox type="warning" title={"Não new HttpClient em loop"}>
        <p>Cada instância segura sockets. Use <code>IHttpClientFactory</code> via DI ou um singleton estático. <code>HttpClient</code> é thread-safe pra request, não pra mudar config.</p>
      </AlertBox>

      <h2>IHttpClientFactory (ASP.NET Core)</h2>

      <CodeBlock
        language="csharp"
        code={`builder.Services.AddHttpClient("api", c =>
{
    c.BaseAddress = new Uri("https://api/");
    c.DefaultRequestHeaders.Add("X-Key", apiKey);
});

// uso
public class MeuServico(IHttpClientFactory factory)
{
    public Task<X> GetXAsync()
    {
        var http = factory.CreateClient("api");
        return http.GetFromJsonAsync<X>("/x")!;
    }
}`}
      />
    </PageContainer>
  );
}
