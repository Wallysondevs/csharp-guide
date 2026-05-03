import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Polly() {
  return (
    <PageContainer
      title={"Polly: resiliência"}
      subtitle={"Retry, circuit breaker, timeout, bulkhead, fallback."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var pipeline = new ResiliencePipelineBuilder<HttpResponseMessage>()
    .AddRetry(new() { MaxRetryAttempts = 3, BackoffType = DelayBackoffType.Exponential })
    .AddCircuitBreaker(new() { FailureRatio = 0.5, MinimumThroughput = 5 })
    .AddTimeout(TimeSpan.FromSeconds(10))
    .Build();

var resp = await pipeline.ExecuteAsync(async ct => await http.GetAsync(url, ct));`}
      />

      <h2>Integração com HttpClient</h2>

      <CodeBlock
        language="csharp"
        code={`builder.Services.AddHttpClient("api")
    .AddStandardResilienceHandler();   // Microsoft.Extensions.Http.Resilience`}
      />
    </PageContainer>
  );
}
