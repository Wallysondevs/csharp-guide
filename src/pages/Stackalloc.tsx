import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Stackalloc() {
  return (
    <PageContainer
      title={"stackalloc"}
      subtitle={"Alocar array na stack. Sem GC, mas escopo limitado."}
      difficulty={"avancado"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`Span<int> nums = stackalloc int[64];
for (int i = 0; i < nums.Length; i++) nums[i] = i;

// Pra strings pequenas
Span<char> buf = stackalloc char[32];
buf[0] = 'h'; buf[1] = 'i';
string s = new string(buf[..2]);`}
      />

      <AlertBox type="warning" title={"Cuidado com tamanho"}>
        <p>Stack tem ~1MB. Alocar 1MB com stackalloc dá StackOverflow. Sempre limite o tamanho ou caia pro heap se &gt; 1KB.</p>
      </AlertBox>
    </PageContainer>
  );
}
