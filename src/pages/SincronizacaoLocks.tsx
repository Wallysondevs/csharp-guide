import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SincronizacaoLocks() {
  return (
    <PageContainer
      title="Sincronização: lock, Monitor e race conditions"
      subtitle="Quando duas threads tocam a mesma variável ao mesmo tempo, o resultado é uma loteria. O lock é o nosso semáforo de trânsito."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine duas pessoas tentando passar pela mesma porta giratória ao mesmo tempo: alguém acaba esmagado. Em programas com várias <strong>threads</strong> (linhas de execução paralelas), o mesmo acontece quando duas tentam modificar a mesma variável simultaneamente. O resultado é a famosa <em>race condition</em>: o valor final depende de qual thread ganhou a "corrida" — algo que nunca queremos no software.
      </p>

      <h2>O problema clássico: contador++</h2>
      <p>
        Parece a operação mais simples do mundo: somar 1 num contador. Mas <code>contador++</code> não é atômico — por baixo dos panos, são <strong>três passos</strong>: ler o valor, somar 1, escrever de volta. Se duas threads lerem 5 ao mesmo tempo, ambas escreverão 6, e perdemos uma contagem.
      </p>
      <pre><code>{`int contador = 0;
Parallel.For(0, 100_000, _ => contador++);
Console.WriteLine(contador);
// Esperado: 100000
// Real: 87432, 91005, 99876... aleatório a cada execução`}</code></pre>
      <p>
        Esse bug é traiçoeiro: roda certo na sua máquina, falha em produção sob carga, e nunca aparece no debugger porque ali a execução vira sequencial.
      </p>

      <h2>A palavra-chave <code>lock</code></h2>
      <p>
        A solução mais comum em C# é <code>lock</code>. Você passa um <strong>objeto</strong> qualquer (que serve de "chave"); apenas uma thread por vez consegue entrar no bloco protegido por aquele objeto. As outras esperam na fila.
      </p>
      <pre><code>{`int contador = 0;
object trava = new();   // objeto exclusivo só para travar

Parallel.For(0, 100_000, _ =>
{
    lock (trava)
    {
        contador++;     // agora atômico
    }
});
Console.WriteLine(contador);  // sempre 100000`}</code></pre>
      <p>
        Pense no objeto <code>trava</code> como uma chave única do banheiro de um restaurante: quem está com a chave entra, os outros esperam na porta. Quando sai, devolve a chave.
      </p>

      <AlertBox type="info" title="lock é açúcar para Monitor">
        Por baixo dos panos, <code>lock (x) {`{ ... }`}</code> vira uma chamada para <code>Monitor.Enter(x)</code> no início e <code>Monitor.Exit(x)</code> no <code>finally</code>. <code>Monitor</code> é a classe de baixo nível; <code>lock</code> só economiza digitação e garante o <code>Exit</code> mesmo em exceções.
      </AlertBox>

      <h2>Monitor explícito (raramente preciso)</h2>
      <p>
        Em casos avançados, você pode querer <code>TryEnter</code> com timeout, ou usar <code>Monitor.Wait</code>/<code>Pulse</code> para sinalização. Para o dia-a-dia, prefira <code>lock</code>.
      </p>
      <pre><code>{`object trava = new();

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
}`}</code></pre>

      <h2>Use um objeto <em>privado</em> para travar</h2>
      <p>
        Uma regra de ouro: o objeto usado em <code>lock</code> deve ser <strong>privado e exclusivo</strong>. Nunca trave em <code>this</code>, em strings, ou em <code>typeof(X)</code>.
      </p>
      <pre><code>{`// ❌ RUIM: qualquer código de fora pode travar this também e gerar deadlock
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
}`}</code></pre>
      <p>
        A razão: se <code>this</code> é público, qualquer outro código pode também fazer <code>lock(minhaConta)</code>, e você perde controle sobre quem participa da fila — abrindo porta para deadlocks impossíveis de depurar.
      </p>

      <h2>Deadlocks: a pior dor de cabeça</h2>
      <p>
        Um <strong>deadlock</strong> acontece quando duas threads esperam uma pela outra para sempre. Thread A segura a trava 1 e pede a 2; thread B segura a 2 e pede a 1. Ninguém libera, ninguém avança, e o programa congela.
      </p>
      <pre><code>{`object travaA = new(), travaB = new();

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
}`}</code></pre>
      <p>
        A regra de prevenção é simples: <strong>sempre adquira travas na mesma ordem</strong> em todo o código. Se todos pegarem A antes de B, deadlock cíclico é impossível.
      </p>

      <AlertBox type="danger" title="Nunca use lock com await">
        <code>lock</code> não é compatível com <code>await</code> — você não pode fazer <code>await</code> dentro de um <code>lock</code> (o compilador proíbe). Para sincronização em código assíncrono, use <code>SemaphoreSlim</code>, que tem <code>WaitAsync()</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Travar em <code>this</code> ou em strings:</strong> abre porta para deadlocks externos.</li>
        <li><strong>Esquecer o finally em <code>Monitor.Enter</code>:</strong> uma exceção deixa a trava presa para sempre.</li>
        <li><strong>Travas em ordens diferentes:</strong> deadlock garantido sob carga.</li>
        <li><strong>Usar lock com await:</strong> nem compila — troque por <code>SemaphoreSlim</code>.</li>
        <li><strong>Confiar em <code>contador++</code> ou <code>i += 1</code>:</strong> não são atômicos. Use <code>Interlocked.Increment(ref contador)</code> para inteiros simples.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Race condition = duas threads modificando a mesma variável sem coordenação.</li>
        <li><code>lock (obj) {`{ ... }`}</code> garante que apenas uma thread entra por vez.</li>
        <li>Por baixo, <code>lock</code> é <code>Monitor.Enter</code>/<code>Exit</code> com try-finally.</li>
        <li>Sempre trave em um objeto <strong>privado</strong> e <strong>readonly</strong>.</li>
        <li>Deadlocks vêm de travas em ordens diferentes — padronize a ordem.</li>
        <li>Para async, use <code>SemaphoreSlim</code>; para inteiros simples, <code>Interlocked</code>.</li>
      </ul>
    </PageContainer>
  );
}
