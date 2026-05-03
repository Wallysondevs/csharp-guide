import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DynamicDlr() {
  return (
    <PageContainer
      title={"dynamic e DLR"}
      subtitle={"Quando vale a pena abrir mão do type checking."}
      difficulty={"avancado"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`dynamic obj = new ExpandoObject();
obj.Nome = "Ana";
obj.Idade = 30;
obj.Cumprimentar = (Action)(() => Console.WriteLine($"Oi, {obj.Nome}"));
obj.Cumprimentar();

// JSON sem schema
dynamic doc = JsonSerializer.Deserialize<dynamic>(json)!;
Console.WriteLine(doc.GetProperty("nome").GetString());`}
      />

      <AlertBox type="warning" title={"Cara, perigoso, sem refactor"}>
        <p>Nada de IntelliSense, nada de refactoring seguro. Use só pra interop ou JSON sem schema.</p>
      </AlertBox>
    </PageContainer>
  );
}
