import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function RestPatterns() {
  return (
    <PageContainer
      title={"Padrões REST com HttpClient"}
      subtitle={"Refit, Polly, retry, circuit breaker, timeouts."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <h2>Refit — cliente declarativo</h2>

      <CodeBlock
        language="csharp"
        code={`public interface IGitHubApi
{
    [Get("/users/{user}")]
    Task<User> GetUserAsync(string user);
}

var api = RestService.For<IGitHubApi>("https://api.github.com");
var u = await api.GetUserAsync("torvalds");`}
      />

      <h2>Polly — políticas de resiliência</h2>

      <CodeBlock
        language="csharp"
        code={`var pipeline = new ResiliencePipelineBuilder()
    .AddRetry(new RetryStrategyOptions { MaxRetryAttempts = 3 })
    .AddCircuitBreaker(new CircuitBreakerStrategyOptions
    { FailureRatio = 0.5, MinimumThroughput = 10 })
    .AddTimeout(TimeSpan.FromSeconds(5))
    .Build();

var resp = await pipeline.ExecuteAsync(async ct => await http.GetAsync(url, ct));`}
      />
    </PageContainer>
  );
}
