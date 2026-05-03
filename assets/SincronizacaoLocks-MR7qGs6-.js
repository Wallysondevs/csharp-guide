import{j as e}from"./index-CzLAthD5.js";import{P as a,A as o}from"./AlertBox-CWJo3ar5.js";function c(){return e.jsxs(a,{title:"Sincronização: lock, Monitor e race conditions",subtitle:"Quando duas threads tocam a mesma variável ao mesmo tempo, o resultado é uma loteria. O lock é o nosso semáforo de trânsito.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["Imagine duas pessoas tentando passar pela mesma porta giratória ao mesmo tempo: alguém acaba esmagado. Em programas com várias ",e.jsx("strong",{children:"threads"})," (linhas de execução paralelas), o mesmo acontece quando duas tentam modificar a mesma variável simultaneamente. O resultado é a famosa ",e.jsx("em",{children:"race condition"}),': o valor final depende de qual thread ganhou a "corrida" — algo que nunca queremos no software.']}),e.jsx("h2",{children:"O problema clássico: contador++"}),e.jsxs("p",{children:["Parece a operação mais simples do mundo: somar 1 num contador. Mas ",e.jsx("code",{children:"contador++"})," não é atômico — por baixo dos panos, são ",e.jsx("strong",{children:"três passos"}),": ler o valor, somar 1, escrever de volta. Se duas threads lerem 5 ao mesmo tempo, ambas escreverão 6, e perdemos uma contagem."]}),e.jsx("pre",{children:e.jsx("code",{children:`int contador = 0;
Parallel.For(0, 100_000, _ => contador++);
Console.WriteLine(contador);
// Esperado: 100000
// Real: 87432, 91005, 99876... aleatório a cada execução`})}),e.jsx("p",{children:"Esse bug é traiçoeiro: roda certo na sua máquina, falha em produção sob carga, e nunca aparece no debugger porque ali a execução vira sequencial."}),e.jsxs("h2",{children:["A palavra-chave ",e.jsx("code",{children:"lock"})]}),e.jsxs("p",{children:["A solução mais comum em C# é ",e.jsx("code",{children:"lock"}),". Você passa um ",e.jsx("strong",{children:"objeto"}),' qualquer (que serve de "chave"); apenas uma thread por vez consegue entrar no bloco protegido por aquele objeto. As outras esperam na fila.']}),e.jsx("pre",{children:e.jsx("code",{children:`int contador = 0;
object trava = new();   // objeto exclusivo só para travar

Parallel.For(0, 100_000, _ =>
{
    lock (trava)
    {
        contador++;     // agora atômico
    }
});
Console.WriteLine(contador);  // sempre 100000`})}),e.jsxs("p",{children:["Pense no objeto ",e.jsx("code",{children:"trava"})," como uma chave única do banheiro de um restaurante: quem está com a chave entra, os outros esperam na porta. Quando sai, devolve a chave."]}),e.jsxs(o,{type:"info",title:"lock é açúcar para Monitor",children:["Por baixo dos panos, ",e.jsxs("code",{children:["lock (x) ","{ ... }"]})," vira uma chamada para ",e.jsx("code",{children:"Monitor.Enter(x)"})," no início e ",e.jsx("code",{children:"Monitor.Exit(x)"})," no ",e.jsx("code",{children:"finally"}),". ",e.jsx("code",{children:"Monitor"})," é a classe de baixo nível; ",e.jsx("code",{children:"lock"})," só economiza digitação e garante o ",e.jsx("code",{children:"Exit"})," mesmo em exceções."]}),e.jsx("h2",{children:"Monitor explícito (raramente preciso)"}),e.jsxs("p",{children:["Em casos avançados, você pode querer ",e.jsx("code",{children:"TryEnter"})," com timeout, ou usar ",e.jsx("code",{children:"Monitor.Wait"}),"/",e.jsx("code",{children:"Pulse"})," para sinalização. Para o dia-a-dia, prefira ",e.jsx("code",{children:"lock"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`object trava = new();

if (Monitor.TryEnter(trava, TimeSpan.FromSeconds(2)))
{
    try
    {
        // entrei dentro de 2s
    }
    finally { Monitor.Exit(trava); }   // SEMPRE no finally
}
else
{
    Console.WriteLine("Desisti de esperar");
}`})}),e.jsxs("h2",{children:["Use um objeto ",e.jsx("em",{children:"privado"})," para travar"]}),e.jsxs("p",{children:["Uma regra de ouro: o objeto usado em ",e.jsx("code",{children:"lock"})," deve ser ",e.jsx("strong",{children:"privado e exclusivo"}),". Nunca trave em ",e.jsx("code",{children:"this"}),", em strings, ou em ",e.jsx("code",{children:"typeof(X)"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`// ❌ RUIM: qualquer código de fora pode travar this também e gerar deadlock
public class Conta
{
    public void Sacar() { lock (this) { /* ... */ } }
}

// ❌ PIOR: strings interned são compartilhadas pelo CLR todo
lock ("minha-trava") { }

// ✅ CERTO: objeto privado, criado só para isso
public class Conta
{
    private readonly object _trava = new();
    public void Sacar() { lock (_trava) { /* ... */ } }
}`})}),e.jsxs("p",{children:["A razão: se ",e.jsx("code",{children:"this"})," é público, qualquer outro código pode também fazer ",e.jsx("code",{children:"lock(minhaConta)"}),", e você perde controle sobre quem participa da fila — abrindo porta para deadlocks impossíveis de depurar."]}),e.jsx("h2",{children:"Deadlocks: a pior dor de cabeça"}),e.jsxs("p",{children:["Um ",e.jsx("strong",{children:"deadlock"})," acontece quando duas threads esperam uma pela outra para sempre. Thread A segura a trava 1 e pede a 2; thread B segura a 2 e pede a 1. Ninguém libera, ninguém avança, e o programa congela."]}),e.jsx("pre",{children:e.jsx("code",{children:`object travaA = new(), travaB = new();

// Thread 1
lock (travaA)
{
    Thread.Sleep(100);
    lock (travaB) { /* nunca chega aqui */ }
}

// Thread 2
lock (travaB)
{
    Thread.Sleep(100);
    lock (travaA) { /* nem aqui */ }
}`})}),e.jsxs("p",{children:["A regra de prevenção é simples: ",e.jsx("strong",{children:"sempre adquira travas na mesma ordem"})," em todo o código. Se todos pegarem A antes de B, deadlock cíclico é impossível."]}),e.jsxs(o,{type:"danger",title:"Nunca use lock com await",children:[e.jsx("code",{children:"lock"})," não é compatível com ",e.jsx("code",{children:"await"})," — você não pode fazer ",e.jsx("code",{children:"await"})," dentro de um ",e.jsx("code",{children:"lock"})," (o compilador proíbe). Para sincronização em código assíncrono, use ",e.jsx("code",{children:"SemaphoreSlim"}),", que tem ",e.jsx("code",{children:"WaitAsync()"}),"."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Travar em ",e.jsx("code",{children:"this"})," ou em strings:"]})," abre porta para deadlocks externos."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer o finally em ",e.jsx("code",{children:"Monitor.Enter"}),":"]})," uma exceção deixa a trava presa para sempre."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Travas em ordens diferentes:"})," deadlock garantido sob carga."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar lock com await:"})," nem compila — troque por ",e.jsx("code",{children:"SemaphoreSlim"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confiar em ",e.jsx("code",{children:"contador++"})," ou ",e.jsx("code",{children:"i += 1"}),":"]})," não são atômicos. Use ",e.jsx("code",{children:"Interlocked.Increment(ref contador)"})," para inteiros simples."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Race condition = duas threads modificando a mesma variável sem coordenação."}),e.jsxs("li",{children:[e.jsxs("code",{children:["lock (obj) ","{ ... }"]})," garante que apenas uma thread entra por vez."]}),e.jsxs("li",{children:["Por baixo, ",e.jsx("code",{children:"lock"})," é ",e.jsx("code",{children:"Monitor.Enter"}),"/",e.jsx("code",{children:"Exit"})," com try-finally."]}),e.jsxs("li",{children:["Sempre trave em um objeto ",e.jsx("strong",{children:"privado"})," e ",e.jsx("strong",{children:"readonly"}),"."]}),e.jsx("li",{children:"Deadlocks vêm de travas em ordens diferentes — padronize a ordem."}),e.jsxs("li",{children:["Para async, use ",e.jsx("code",{children:"SemaphoreSlim"}),"; para inteiros simples, ",e.jsx("code",{children:"Interlocked"}),"."]})]})]})}export{c as default};
