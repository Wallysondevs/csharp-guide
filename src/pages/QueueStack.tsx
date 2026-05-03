import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function QueueStack() {
  return (
    <PageContainer
      title={"Queue, Stack, LinkedList"}
      subtitle={"FIFO, LIFO e lista duplamente ligada — quando cada uma vence."}
      difficulty={"iniciante"}
      timeToRead={"5 min"}
    >
      <h2>Queue (FIFO)</h2>

      <CodeBlock
        language="csharp"
        code={`var fila = new Queue<string>();
fila.Enqueue("a");
fila.Enqueue("b");
string primeiro = fila.Dequeue();   // "a"
string proxSemTirar = fila.Peek();
int n = fila.Count;`}
      />

      <h2>Stack (LIFO)</h2>

      <CodeBlock
        language="csharp"
        code={`var pilha = new Stack<int>();
pilha.Push(1); pilha.Push(2); pilha.Push(3);
int topo = pilha.Pop();          // 3
int olhar = pilha.Peek();        // 2`}
      />

      <h2>LinkedList</h2>

      <CodeBlock
        language="csharp"
        code={`var ll = new LinkedList<int>();
var no = ll.AddLast(1);
ll.AddLast(2);
ll.AddBefore(no, 0);
ll.Remove(no);

foreach (var v in ll) Console.WriteLine(v);`}
      />

      <AlertBox type="info" title={"Quando usar LinkedList"}>
        <p>Raramente. List é melhor em quase tudo (cache do CPU). Só use linked se precisa muito de inserção/remoção O(1) no meio com nó já em mãos.</p>
      </AlertBox>
    </PageContainer>
  );
}
