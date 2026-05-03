import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Middleware() {
  return (
    <PageContainer
      title={"Middleware"}
      subtitle={"Pipeline de processamento de request. Use, Run, Map."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`app.Use(async (ctx, next) =>
{
    var sw = Stopwatch.StartNew();
    await next();
    sw.Stop();
    Console.WriteLine($"{ctx.Request.Path}: {sw.ElapsedMilliseconds}ms");
});

app.UseMiddleware<MeuMiddleware>();   // classe

// Branch
app.MapWhen(ctx => ctx.Request.Path.StartsWithSegments("/admin"), branch =>
{
    branch.UseAuthentication();
    branch.UseAuthorization();
});`}
      />

      <h2>Classe própria</h2>

      <CodeBlock
        language="csharp"
        code={`public class TempoMw
{
    private readonly RequestDelegate _next;
    public TempoMw(RequestDelegate next) => _next = next;
    public async Task InvokeAsync(HttpContext ctx, ILogger<TempoMw> log)
    {
        var sw = Stopwatch.StartNew();
        await _next(ctx);
        log.LogInformation("{Path} {Ms}ms", ctx.Request.Path, sw.ElapsedMilliseconds);
    }
}`}
      />
    </PageContainer>
  );
}
