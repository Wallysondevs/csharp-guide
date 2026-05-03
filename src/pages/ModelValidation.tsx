import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ModelValidation() {
  return (
    <PageContainer
      title="Validação de modelos com Data Annotations e FluentValidation"
      subtitle="Garanta que os dados que chegam à sua API estejam dentro das regras antes de processá-los — usando atributos do .NET ou bibliotecas dedicadas."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Toda API recebe dados de fora — formulários, JSON de outros sistemas, parâmetros de query — e <strong>nada do que vem de fora é confiável</strong>. Validar significa checar regras antes de seguir adiante: "o nome não pode estar vazio", "a idade tem que ser entre 0 e 120", "o email precisa ter formato válido". Se você não validar, vai gravar lixo no banco, expor mensagens internas ao usuário ou criar brechas de segurança. O ASP.NET Core oferece duas ferramentas principais: <strong>Data Annotations</strong> (atributos prontos do .NET) e <strong>FluentValidation</strong> (biblioteca externa para regras complexas). Pense nisso como o porteiro de um prédio que confere documento antes de deixar entrar.
      </p>

      <h2>Data Annotations: o jeito built-in</h2>
      <p>
        Atributos do namespace <code>System.ComponentModel.DataAnnotations</code> ficam diretamente nas propriedades dos seus DTOs (<em>Data Transfer Objects</em>). O ASP.NET valida automaticamente antes do método executar — desde que você use <code>[ApiController]</code>:
      </p>
      <pre><code>{`using System.ComponentModel.DataAnnotations;

public class CriarUsuarioDto
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(80, MinimumLength = 2)]
    public string Nome { get; set; } = "";

    [Required, EmailAddress]
    public string Email { get; set; } = "";

    [Range(18, 120, ErrorMessage = "Idade deve estar entre 18 e 120")]
    public int Idade { get; set; }

    [Url]
    public string? SiteWeb { get; set; }

    [Phone]
    public string? Telefone { get; set; }

    [RegularExpression(@"^\d{3}\.\d{3}\.\d{3}-\d{2}$",
        ErrorMessage = "CPF no formato 000.000.000-00")]
    public string Cpf { get; set; } = "";

    [Compare(nameof(Senha))]
    public string ConfirmacaoSenha { get; set; } = "";

    [Required, MinLength(8)]
    public string Senha { get; set; } = "";
}`}</code></pre>

      <h2>Atributos disponíveis</h2>
      <ul>
        <li><code>[Required]</code> — não pode ser nulo nem string vazia.</li>
        <li><code>[StringLength(max, MinimumLength=n)]</code> — limites de caracteres.</li>
        <li><code>[Range(min, max)]</code> — para números e datas.</li>
        <li><code>[EmailAddress]</code>, <code>[Url]</code>, <code>[Phone]</code> — formatos comuns.</li>
        <li><code>[RegularExpression(pattern)]</code> — qualquer regex.</li>
        <li><code>[Compare(propName)]</code> — duas propriedades devem ser iguais (ex.: senha + confirmação).</li>
        <li><code>[CreditCard]</code>, <code>[FileExtensions]</code>, <code>[MinLength]</code>, <code>[MaxLength]</code>.</li>
        <li><code>[DataType(DataType.Password)]</code> — informativo, sem validação real.</li>
      </ul>

      <h2>Como o ASP.NET reage a erros</h2>
      <p>
        Com <code>[ApiController]</code>, se algum atributo falha o framework retorna automaticamente <strong>HTTP 400</strong> com um JSON no formato <em>ProblemDetails</em>:
      </p>
      <pre><code>{`// POST /api/usuarios   { "nome": "", "email": "abc", "idade": 200 }
// HTTP/1.1 400 Bad Request
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Nome": ["Nome é obrigatório"],
    "Email": ["The Email field is not a valid e-mail address."],
    "Idade": ["Idade deve estar entre 18 e 120"]
  }
}`}</code></pre>
      <p>
        Esse formato segue a <strong>RFC 7807</strong>, então clientes (frontends, outros serviços) sabem como ler. Você não precisa escrever try/catch nenhum — está tudo automatizado.
      </p>

      <h2>Validando manualmente</h2>
      <p>
        Em cenários sem <code>[ApiController]</code> (ou em Razor Pages após <code>OnPost</code>), cheque <code>ModelState.IsValid</code>:
      </p>
      <pre><code>{`[HttpPost]
public IActionResult Criar(CriarUsuarioDto dto)
{
    if (!ModelState.IsValid)
        return ValidationProblem(ModelState);

    // ... lógica normal ...
    return Created();
}`}</code></pre>

      <h2>Atributo de validação customizado</h2>
      <p>
        Quando os atributos prontos não cobrem sua regra, herde de <code>ValidationAttribute</code>:
      </p>
      <pre><code>{`public class MaiorDeIdadeAttribute : ValidationAttribute
{
    public int IdadeMinima { get; set; } = 18;

    protected override ValidationResult? IsValid(
        object? value, ValidationContext context)
    {
        if (value is not DateTime nascimento)
            return new ValidationResult("Data inválida");

        var idade = DateTime.Today.Year - nascimento.Year;
        if (nascimento.Date > DateTime.Today.AddYears(-idade)) idade--;

        return idade >= IdadeMinima
            ? ValidationResult.Success
            : new ValidationResult($"Idade mínima é {IdadeMinima} anos");
    }
}

public class CadastroDto
{
    [Required, MaiorDeIdade(IdadeMinima = 18)]
    public DateTime DataNascimento { get; set; }
}`}</code></pre>

      <AlertBox type="info" title="IValidatableObject: validação no objeto inteiro">
        Se sua regra envolve <em>várias</em> propriedades juntas (ex.: "data fim deve ser depois de data início"), implemente a interface <code>IValidatableObject</code> no DTO e escreva <code>Validate(...)</code>. É chamado depois das Data Annotations.
      </AlertBox>

      <h2>FluentValidation: para regras complexas</h2>
      <p>
        Quando as regras crescem (validação condicional, cross-property, lookup em banco), Data Annotations viram um emaranhado. Aí entra a biblioteca <strong>FluentValidation</strong>: você descreve regras numa classe separada com sintaxe encadeada, mantendo o DTO limpo.
      </p>
      <pre><code>{`# Instale o pacote
dotnet add package FluentValidation.AspNetCore`}</code></pre>
      <pre><code>{`using FluentValidation;

public class CriarUsuarioValidator : AbstractValidator<CriarUsuarioDto>
{
    public CriarUsuarioValidator(IUsuarioRepository repo)
    {
        RuleFor(u => u.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .Length(2, 80);

        RuleFor(u => u.Email)
            .NotEmpty()
            .EmailAddress()
            .MustAsync(async (email, ct) => !await repo.ExisteEmailAsync(email))
            .WithMessage("Email já cadastrado");

        RuleFor(u => u.Idade)
            .InclusiveBetween(18, 120);

        RuleFor(u => u.Senha)
            .MinimumLength(8)
            .Matches("[A-Z]").WithMessage("Precisa de pelo menos uma maiúscula")
            .Matches("[0-9]").WithMessage("Precisa de pelo menos um número");

        // Validação condicional
        When(u => !string.IsNullOrEmpty(u.SiteWeb), () =>
        {
            RuleFor(u => u.SiteWeb).Must(s => Uri.IsWellFormedUriString(s, UriKind.Absolute));
        });
    }
}`}</code></pre>
      <pre><code>{`// Em Program.cs
builder.Services.AddValidatorsFromAssemblyContaining<CriarUsuarioValidator>();
builder.Services.AddFluentValidationAutoValidation();   // integra com [ApiController]`}</code></pre>
      <p>
        FluentValidation traz: <strong>regras assíncronas</strong> (consultar banco), <strong>cross-property</strong> (referenciar outras props), <strong>injeção de dependências</strong> no validator e <strong>localização</strong> de mensagens. Para apps grandes, é o padrão de mercado.
      </p>

      <h2>Validação no front também?</h2>
      <p>
        Não confie no front. Ele <em>complementa</em> a validação do servidor (melhora UX) mas não a substitui — qualquer um pode mandar requisições direto via <code>curl</code> ou Postman. A regra: <strong>front valida para conveniência; backend valida para segurança</strong>.
      </p>

      <AlertBox type="warning" title="Sanitização ≠ validação">
        Validar diz "se está OK ou não". <strong>Sanitizar</strong> é limpar dados (remover HTML, encode contra XSS, normalizar acentos). Em campos que aparecem em HTML, sempre faça encoding na saída — o ASP.NET Razor faz isso por padrão em <code>@variavel</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>[ApiController]</code>:</strong> validação automática some, e <code>ModelState.IsValid</code> precisa ser checado à mão.</li>
        <li><strong>Usar Data Annotations para regra de negócio complexa:</strong> vira atributo gigante e ilegível — migre para FluentValidation.</li>
        <li><strong>Validar entidade do banco em vez de DTO:</strong> a entidade pode ter campos que o cliente não envia (Id, CreatedAt) e gerar falsos positivos.</li>
        <li><strong>Mensagens cruas em inglês para o usuário final:</strong> personalize com <code>ErrorMessage</code> ou crie resource files de localização.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Validação garante que dados externos respeitam suas regras antes de processar.</li>
        <li><strong>Data Annotations</strong> são atributos do .NET — bons para validações simples.</li>
        <li>Com <code>[ApiController]</code>, erros viram automaticamente HTTP 400 + ProblemDetails.</li>
        <li>Para regras assíncronas, condicionais ou cross-property, use <strong>FluentValidation</strong>.</li>
        <li>Crie atributos customizados herdando de <code>ValidationAttribute</code>.</li>
        <li>Sempre valide no backend — front é só conveniência.</li>
      </ul>
    </PageContainer>
  );
}
