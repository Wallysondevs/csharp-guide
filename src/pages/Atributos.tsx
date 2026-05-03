import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Atributos() {
  return (
    <PageContainer
      title={"Atributos customizados"}
      subtitle={"Marcar classes/métodos/props com metadados que o código lê depois."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`[AttributeUsage(AttributeTargets.Property)]
public class MaxLenAttribute : Attribute
{
    public int Max { get; }
    public MaxLenAttribute(int max) => Max = max;
}

public class Pessoa
{
    [MaxLen(50)]
    public string Nome { get; set; } = "";
}

// Lendo
var prop = typeof(Pessoa).GetProperty("Nome")!;
var attr = prop.GetCustomAttribute<MaxLenAttribute>();
if (attr != null) Console.WriteLine($"Max: {attr.Max}");`}
      />

      <h2>Atributos da BCL</h2>

      <ul>
        <li><code>[Obsolete]</code>, <code>[Serializable]</code>, <code>[Flags]</code></li>
        <li><code>[JsonPropertyName]</code>, <code>[JsonIgnore]</code></li>
        <li><code>[Required]</code>, <code>[MaxLength]</code>, <code>[Range]</code></li>
        <li><code>[Conditional("DEBUG")]</code></li>
      </ul>
    </PageContainer>
  );
}
