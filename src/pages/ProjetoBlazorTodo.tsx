import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function ProjetoBlazorTodo() {
  return (
    <PageContainer
      title={"Projeto: Blazor TODO app"}
      subtitle={"SPA simples em C# puro, sem JavaScript."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="razor"
        title="Tarefas.razor"
        code={`@page "/"
@inject ILocalStorageService Storage

<h1>Minhas Tarefas</h1>

<input @bind="_nova" @bind:event="oninput" placeholder="Nova tarefa" />
<button @onclick="Adicionar">+</button>

<ul>
@foreach (var t in _tarefas)
{
    <li>
        <input type="checkbox" checked="@t.Feita" @onchange="() => Marcar(t)" />
        <span style="@(t.Feita ? "text-decoration: line-through" : "")">@t.Texto</span>
        <button @onclick="() => Remover(t)">x</button>
    </li>
}
</ul>

@code {
    record Tarefa(string Texto, bool Feita);
    List<Tarefa> _tarefas = new();
    string _nova = "";

    void Adicionar() {
        if (!string.IsNullOrWhiteSpace(_nova))
        {
            _tarefas.Add(new(_nova, false));
            _nova = "";
        }
    }

    void Marcar(Tarefa t) {
        var i = _tarefas.IndexOf(t);
        _tarefas[i] = t with { Feita = !t.Feita };
    }

    void Remover(Tarefa t) => _tarefas.Remove(t);
}`}
      />
    </PageContainer>
  );
}
