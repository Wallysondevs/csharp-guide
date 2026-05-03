import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Classes() {
  return (
    <PageContainer
      title={"Classes e objetos"}
      subtitle={"Definição, instanciação, campos, propriedades, métodos. A base de tudo que é orientado em C#."}
      difficulty={"iniciante"}
      timeToRead={"8 min"}
    >
      <h2>Anatomia</h2>

      <CodeBlock
        language="csharp"
        code={`public class Pessoa
{
    // campo privado
    private string _nome;

    // propriedade auto
    public int Idade { get; set; }

    // construtor
    public Pessoa(string nome, int idade)
    {
        _nome = nome;
        Idade = idade;
    }

    // método
    public string Apresentar() => $"Sou {_nome}, {Idade} anos";
}

var p = new Pessoa("Ana", 30);
Console.WriteLine(p.Apresentar());`}
      />

      <h2>Modificadores de acesso</h2>

      <ul>
        <li><code>public</code> — acessível de qualquer lugar</li>
        <li><code>private</code> — só dentro da classe (padrão para membros)</li>
        <li><code>protected</code> — classe e derivadas</li>
        <li><code>internal</code> — mesmo assembly (padrão para classes top-level)</li>
        <li><code>protected internal</code> — derivadas OU mesmo assembly</li>
        <li><code>private protected</code> — derivadas no mesmo assembly</li>
        <li><code>file</code> (C# 11) — só o arquivo atual</li>
      </ul>

      <AlertBox type="info" title={"Convenções"}>
        <p>Classes e métodos em <code>PascalCase</code>. Campos privados costumam ser <code>_camelCase</code>. Propriedades sempre <code>PascalCase</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
