import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function LinqJoin() {
  return (
    <PageContainer
      title={"Join, GroupJoin, Zip"}
      subtitle={"Combinar duas coleções como em SQL."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var pessoas = new[] {
    new { Id = 1, Nome = "Ana" },
    new { Id = 2, Nome = "Bia" }
};
var pedidos = new[] {
    new { PessoaId = 1, Valor = 100m },
    new { PessoaId = 1, Valor = 50m },
    new { PessoaId = 2, Valor = 200m }
};

// inner join
var query = from p in pessoas
            join o in pedidos on p.Id equals o.PessoaId
            select new { p.Nome, o.Valor };

// method syntax equivalente
var q2 = pessoas.Join(pedidos,
    p => p.Id,
    o => o.PessoaId,
    (p, o) => new { p.Nome, o.Valor });

// group join (left-style)
var compradores = pessoas
    .GroupJoin(pedidos, p => p.Id, o => o.PessoaId,
               (p, os) => new { p.Nome, Total = os.Sum(o => o.Valor) });

// Zip — combina posição a posição
var nomes = new[] { "a", "b", "c" };
var valores = new[] { 1, 2, 3 };
var zip = nomes.Zip(valores, (n, v) => $"{n}={v}");`}
      />
    </PageContainer>
  );
}
