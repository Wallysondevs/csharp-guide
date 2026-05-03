import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function EfRelacionamentos() {
  return (
    <PageContainer
      title={"Relacionamentos"}
      subtitle={"1:1, 1:N, N:N, conventions."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public class Pessoa
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public List<Pedido> Pedidos { get; set; } = new();   // 1:N
}

public class Pedido
{
    public int Id { get; set; }
    public int PessoaId { get; set; }                    // FK por convenção
    public Pessoa Pessoa { get; set; } = null!;          // navegação inversa
}

// N:N (auto-detect em EF 5+)
public class Aluno
{
    public List<Curso> Cursos { get; set; } = new();
}
public class Curso
{
    public List<Aluno> Alunos { get; set; } = new();
}
// EF cria tabela de junção AlunoCurso automática`}
      />
    </PageContainer>
  );
}
