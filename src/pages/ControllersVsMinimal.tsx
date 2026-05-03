import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function ControllersVsMinimal() {
  return (
    <PageContainer
      title={"Controllers vs Minimal API"}
      subtitle={"Quando cada um vence."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Pessoa>> Get(int id)
    {
        var p = await _repo.ObterAsync(id);
        return p is null ? NotFound() : Ok(p);
    }

    [HttpPost]
    public async Task<ActionResult<Pessoa>> Post(Pessoa nova)
    {
        await _repo.SalvarAsync(nova);
        return CreatedAtAction(nameof(Get), new { id = nova.Id }, nova);
    }
}`}
      />

      <ul>
        <li><strong>Minimal</strong>: APIs pequenas, microsserviços, performance pura.</li>
        <li><strong>Controllers</strong>: filters maduros, [Authorize] por classe, MVC views, padrões herdados.</li>
      </ul>
    </PageContainer>
  );
}
