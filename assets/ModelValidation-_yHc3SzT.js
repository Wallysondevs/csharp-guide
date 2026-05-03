import{j as e}from"./index-CzLAthD5.js";import{P as i,A as a}from"./AlertBox-CWJo3ar5.js";function o(){return e.jsxs(i,{title:"Validação de modelos com Data Annotations e FluentValidation",subtitle:"Garanta que os dados que chegam à sua API estejam dentro das regras antes de processá-los — usando atributos do .NET ou bibliotecas dedicadas.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["Toda API recebe dados de fora — formulários, JSON de outros sistemas, parâmetros de query — e ",e.jsx("strong",{children:"nada do que vem de fora é confiável"}),'. Validar significa checar regras antes de seguir adiante: "o nome não pode estar vazio", "a idade tem que ser entre 0 e 120", "o email precisa ter formato válido". Se você não validar, vai gravar lixo no banco, expor mensagens internas ao usuário ou criar brechas de segurança. O ASP.NET Core oferece duas ferramentas principais: ',e.jsx("strong",{children:"Data Annotations"})," (atributos prontos do .NET) e ",e.jsx("strong",{children:"FluentValidation"})," (biblioteca externa para regras complexas). Pense nisso como o porteiro de um prédio que confere documento antes de deixar entrar."]}),e.jsx("h2",{children:"Data Annotations: o jeito built-in"}),e.jsxs("p",{children:["Atributos do namespace ",e.jsx("code",{children:"System.ComponentModel.DataAnnotations"})," ficam diretamente nas propriedades dos seus DTOs (",e.jsx("em",{children:"Data Transfer Objects"}),"). O ASP.NET valida automaticamente antes do método executar — desde que você use ",e.jsx("code",{children:"[ApiController]"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.ComponentModel.DataAnnotations;

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

    [RegularExpression(@"^d{3}.d{3}.d{3}-d{2}$",
        ErrorMessage = "CPF no formato 000.000.000-00")]
    public string Cpf { get; set; } = "";

    [Compare(nameof(Senha))]
    public string ConfirmacaoSenha { get; set; } = "";

    [Required, MinLength(8)]
    public string Senha { get; set; } = "";
}`})}),e.jsx("h2",{children:"Atributos disponíveis"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"[Required]"})," — não pode ser nulo nem string vazia."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[StringLength(max, MinimumLength=n)]"})," — limites de caracteres."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[Range(min, max)]"})," — para números e datas."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[EmailAddress]"}),", ",e.jsx("code",{children:"[Url]"}),", ",e.jsx("code",{children:"[Phone]"})," — formatos comuns."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[RegularExpression(pattern)]"})," — qualquer regex."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[Compare(propName)]"})," — duas propriedades devem ser iguais (ex.: senha + confirmação)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[CreditCard]"}),", ",e.jsx("code",{children:"[FileExtensions]"}),", ",e.jsx("code",{children:"[MinLength]"}),", ",e.jsx("code",{children:"[MaxLength]"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[DataType(DataType.Password)]"})," — informativo, sem validação real."]})]}),e.jsx("h2",{children:"Como o ASP.NET reage a erros"}),e.jsxs("p",{children:["Com ",e.jsx("code",{children:"[ApiController]"}),", se algum atributo falha o framework retorna automaticamente ",e.jsx("strong",{children:"HTTP 400"})," com um JSON no formato ",e.jsx("em",{children:"ProblemDetails"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`// POST /api/usuarios   { "nome": "", "email": "abc", "idade": 200 }
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
}`})}),e.jsxs("p",{children:["Esse formato segue a ",e.jsx("strong",{children:"RFC 7807"}),", então clientes (frontends, outros serviços) sabem como ler. Você não precisa escrever try/catch nenhum — está tudo automatizado."]}),e.jsx("h2",{children:"Validando manualmente"}),e.jsxs("p",{children:["Em cenários sem ",e.jsx("code",{children:"[ApiController]"})," (ou em Razor Pages após ",e.jsx("code",{children:"OnPost"}),"), cheque ",e.jsx("code",{children:"ModelState.IsValid"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`[HttpPost]
public IActionResult Criar(CriarUsuarioDto dto)
{
    if (!ModelState.IsValid)
        return ValidationProblem(ModelState);

    // ... lógica normal ...
    return Created();
}`})}),e.jsx("h2",{children:"Atributo de validação customizado"}),e.jsxs("p",{children:["Quando os atributos prontos não cobrem sua regra, herde de ",e.jsx("code",{children:"ValidationAttribute"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class MaiorDeIdadeAttribute : ValidationAttribute
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
}`})}),e.jsxs(a,{type:"info",title:"IValidatableObject: validação no objeto inteiro",children:["Se sua regra envolve ",e.jsx("em",{children:"várias"}),' propriedades juntas (ex.: "data fim deve ser depois de data início"), implemente a interface ',e.jsx("code",{children:"IValidatableObject"})," no DTO e escreva ",e.jsx("code",{children:"Validate(...)"}),". É chamado depois das Data Annotations."]}),e.jsx("h2",{children:"FluentValidation: para regras complexas"}),e.jsxs("p",{children:["Quando as regras crescem (validação condicional, cross-property, lookup em banco), Data Annotations viram um emaranhado. Aí entra a biblioteca ",e.jsx("strong",{children:"FluentValidation"}),": você descreve regras numa classe separada com sintaxe encadeada, mantendo o DTO limpo."]}),e.jsx("pre",{children:e.jsx("code",{children:`# Instale o pacote
dotnet add package FluentValidation.AspNetCore`})}),e.jsx("pre",{children:e.jsx("code",{children:`using FluentValidation;

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
}`})}),e.jsx("pre",{children:e.jsx("code",{children:`// Em Program.cs
builder.Services.AddValidatorsFromAssemblyContaining<CriarUsuarioValidator>();
builder.Services.AddFluentValidationAutoValidation();   // integra com [ApiController]`})}),e.jsxs("p",{children:["FluentValidation traz: ",e.jsx("strong",{children:"regras assíncronas"})," (consultar banco), ",e.jsx("strong",{children:"cross-property"})," (referenciar outras props), ",e.jsx("strong",{children:"injeção de dependências"})," no validator e ",e.jsx("strong",{children:"localização"})," de mensagens. Para apps grandes, é o padrão de mercado."]}),e.jsx("h2",{children:"Validação no front também?"}),e.jsxs("p",{children:["Não confie no front. Ele ",e.jsx("em",{children:"complementa"})," a validação do servidor (melhora UX) mas não a substitui — qualquer um pode mandar requisições direto via ",e.jsx("code",{children:"curl"})," ou Postman. A regra: ",e.jsx("strong",{children:"front valida para conveniência; backend valida para segurança"}),"."]}),e.jsxs(a,{type:"warning",title:"Sanitização ≠ validação",children:['Validar diz "se está OK ou não". ',e.jsx("strong",{children:"Sanitizar"})," é limpar dados (remover HTML, encode contra XSS, normalizar acentos). Em campos que aparecem em HTML, sempre faça encoding na saída — o ASP.NET Razor faz isso por padrão em ",e.jsx("code",{children:"@variavel"}),"."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"[ApiController]"}),":"]})," validação automática some, e ",e.jsx("code",{children:"ModelState.IsValid"})," precisa ser checado à mão."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar Data Annotations para regra de negócio complexa:"})," vira atributo gigante e ilegível — migre para FluentValidation."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Validar entidade do banco em vez de DTO:"})," a entidade pode ter campos que o cliente não envia (Id, CreatedAt) e gerar falsos positivos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mensagens cruas em inglês para o usuário final:"})," personalize com ",e.jsx("code",{children:"ErrorMessage"})," ou crie resource files de localização."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Validação garante que dados externos respeitam suas regras antes de processar."}),e.jsxs("li",{children:[e.jsx("strong",{children:"Data Annotations"})," são atributos do .NET — bons para validações simples."]}),e.jsxs("li",{children:["Com ",e.jsx("code",{children:"[ApiController]"}),", erros viram automaticamente HTTP 400 + ProblemDetails."]}),e.jsxs("li",{children:["Para regras assíncronas, condicionais ou cross-property, use ",e.jsx("strong",{children:"FluentValidation"}),"."]}),e.jsxs("li",{children:["Crie atributos customizados herdando de ",e.jsx("code",{children:"ValidationAttribute"}),"."]}),e.jsx("li",{children:"Sempre valide no backend — front é só conveniência."})]})]})}export{o as default};
