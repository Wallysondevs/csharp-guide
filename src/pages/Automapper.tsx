import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Automapper() {
  return (
    <PageContainer
      title={"AutoMapper"}
      subtitle={"DTO ↔ entidade sem boilerplate. Usar com moderação."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var config = new MapperConfiguration(c =>
{
    c.CreateMap<Pessoa, PessoaDto>()
     .ForMember(d => d.NomeCompleto, o => o.MapFrom(s => $"{s.Nome} {s.Sobrenome}"));
    c.CreateMap<PessoaDto, Pessoa>();
});
var mapper = config.CreateMapper();

PessoaDto dto = mapper.Map<PessoaDto>(pessoa);`}
      />

      <AlertBox type="warning" title={"Polêmica"}>
        <p>Comunidade tá dividida — muitos preferem mapping explícito (record + métodos de extensão / Mapperly source-gen). Mais código, mas sem mágica e zero reflection.</p>
      </AlertBox>
    </PageContainer>
  );
}
