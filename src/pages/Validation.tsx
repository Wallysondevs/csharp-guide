import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Validation() {
  return (
    <PageContainer
      title={"Validação de DTOs"}
      subtitle={"DataAnnotations, FluentValidation e ProblemDetails."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public class CriarPessoaDto
{
    [Required, StringLength(100)]
    public string Nome { get; set; } = "";

    [Required, EmailAddress]
    public string Email { get; set; } = "";

    [Range(0, 120)]
    public int Idade { get; set; }
}

// Em controller [ApiController], modelo inválido vira 400 automático com ProblemDetails`}
      />

      <h2>FluentValidation</h2>

      <CodeBlock
        language="csharp"
        code={`public class CriarPessoaValidator : AbstractValidator<CriarPessoaDto>
{
    public CriarPessoaValidator()
    {
        RuleFor(x => x.Nome).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).EmailAddress();
        RuleFor(x => x.Idade).InclusiveBetween(0, 120);
    }
}`}
      />
    </PageContainer>
  );
}
