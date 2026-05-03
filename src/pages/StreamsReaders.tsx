import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StreamsReaders() {
  return (
    <PageContainer
      title="Streams, StreamReader e StreamWriter"
      subtitle="Aprenda a ler e escrever dados de qualquer fonte — arquivo, memória, rede — usando a abstração de Stream."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Imagine uma <strong>mangueira de jardim</strong>: a água sai por um lado e é consumida no outro, gota a gota, sem que você precise saber se a outra ponta está num poço, numa caixa d'água ou num caminhão-pipa. No .NET, esse conceito de "fluxo de bytes" é representado pela classe abstrata <code>Stream</code>. Aprender a usá-la bem é o que separa programas que carregam um <em>arquivo de 1 GB inteiro na memória</em> (e quebram) de programas que processam <em>terabytes</em> sem suar.
      </p>

      <h2>O que é uma Stream</h2>
      <p>
        <code>Stream</code> é a classe-base que representa uma <strong>sequência de bytes</strong> com operações de leitura, escrita e posicionamento. Você raramente cria um <code>Stream</code> direto — usa subclasses concretas:
      </p>
      <ul>
        <li><code>FileStream</code>: bytes vindos de um arquivo no disco.</li>
        <li><code>MemoryStream</code>: bytes que vivem inteiramente na RAM.</li>
        <li><code>NetworkStream</code>: bytes trafegando por uma conexão TCP.</li>
        <li><code>GZipStream</code>, <code>CryptoStream</code>: "filtros" que envolvem outra stream.</li>
      </ul>

      <pre><code>{`using System.IO;

// Abre arquivo para leitura — Stream cru, em bytes
using FileStream fs = File.OpenRead("dados.bin");

byte[] buffer = new byte[4096];          // bloco de 4 KB
int lidos = fs.Read(buffer, 0, buffer.Length);
Console.WriteLine($"Li {lidos} bytes");`}</code></pre>

      <AlertBox type="info" title="Por que <code>using</code>?">
        Streams seguram <strong>recursos do sistema operacional</strong> (handles de arquivo, sockets). A palavra-chave <code>using</code> garante que <code>Dispose()</code> seja chamado mesmo se uma exceção ocorrer — fechando o handle e liberando o recurso. Sem isso, em um servidor que abre milhares de arquivos por segundo, você esgota o limite do SO em minutos.
      </AlertBox>

      <h2>FileStream: bytes do disco</h2>
      <p>
        Você controla o modo de abertura via <code>FileMode</code> (criar, abrir, sobrescrever) e o acesso via <code>FileAccess</code> (leitura, escrita ou ambos).
      </p>
      <pre><code>{`// Cria arquivo novo (sobrescreve se existir) só para escrita
using (var fs = new FileStream("saida.bin",
                               FileMode.Create,
                               FileAccess.Write))
{
    byte[] dados = { 0x48, 0x69, 0x21 }; // "Hi!"
    fs.Write(dados, 0, dados.Length);
}   // <- Dispose chamado aqui automaticamente

// Equivalente atalho — File.WriteAllBytes faz por baixo
File.WriteAllBytes("saida.bin", new byte[] { 0x48, 0x69, 0x21 });`}</code></pre>

      <h2>MemoryStream: bytes em RAM</h2>
      <p>
        Útil para testes (simular um arquivo sem tocar disco), para construir respostas binárias na memória ou para encadear filtros.
      </p>
      <pre><code>{`using var ms = new MemoryStream();
byte[] cabecalho = { 0x89, 0x50, 0x4E, 0x47 };  // assinatura PNG
ms.Write(cabecalho, 0, cabecalho.Length);

// Volta o "cursor" para o início para reler
ms.Position = 0;

byte[] buffer = new byte[4];
ms.Read(buffer, 0, 4);
Console.WriteLine(BitConverter.ToString(buffer));  // 89-50-4E-47`}</code></pre>

      <h2>StreamReader: lendo TEXTO de uma Stream</h2>
      <p>
        Stream pura lida com <em>bytes</em>. Para ler <strong>texto</strong> (com decodificação de caracteres — UTF-8, Latin-1 etc.), envolva em <code>StreamReader</code>. Ela cuida de detectar BOM, decodificar e quebrar em linhas.
      </p>
      <pre><code>{`// Lê arquivo texto linha a linha (memória O(1) — bom para 10 GB)
using StreamReader leitor = new("livro.txt");

string? linha;
int total = 0;
while ((linha = leitor.ReadLine()) is not null)
{
    total++;
    if (linha.Contains("rosebud", StringComparison.OrdinalIgnoreCase))
        Console.WriteLine($"Achei na linha {total}");
}
Console.WriteLine($"Total: {total} linhas");`}</code></pre>
      <p>
        <code>ReadLine</code> devolve <code>null</code> quando chega ao fim. Existe também <code>ReadToEnd()</code> (carrega tudo de uma vez — só para arquivos pequenos) e <code>Read(char[], int, int)</code> para controle fino.
      </p>

      <h2>StreamWriter: escrevendo TEXTO</h2>
      <p>
        Espelho de <code>StreamReader</code>. Codifica strings para bytes e <strong>bufferiza</strong>: pequenas chamadas a <code>Write</code> são acumuladas e gravadas em blocos para eficiência.
      </p>
      <pre><code>{`using StreamWriter w = new("relatorio.txt", append: false,
                            encoding: System.Text.Encoding.UTF8);

w.WriteLine("Relatório de vendas");
w.WriteLine("===================");
for (int i = 1; i <= 5; i++)
    w.WriteLine($"Item {i}: R$ {i * 9.9m:F2}");

// w.Flush() é chamado por Dispose; força gravação imediata se preciso`}</code></pre>

      <AlertBox type="warning" title="Buffer e dados perdidos">
        Se o programa é encerrado <em>abruptamente</em> (kill, queda de energia) antes de o buffer ser descarregado, as últimas escritas se perdem. O <code>using</code> resolve no caminho normal — mas para situações críticas (logs de auditoria), chame <code>Flush()</code> manualmente após cada escrita ou use <code>autoFlush: true</code> no construtor.
      </AlertBox>

      <h2>Async: <code>ReadAsync</code> e <code>WriteAsync</code></h2>
      <p>
        Em código de servidor (web API, microsserviços), você quase nunca quer bloquear a thread esperando o disco. Use as versões <code>...Async</code>, que liberam a thread enquanto o sistema operacional faz a I/O.
      </p>
      <pre><code>{`async Task ProcessarAsync(string caminho)
{
    using StreamReader leitor = new(caminho);

    string? linha;
    while ((linha = await leitor.ReadLineAsync()) is not null)
    {
        // processa sem bloquear thread
        await Task.Yield();
    }
}

async Task EscreverAsync(string caminho, IEnumerable<string> linhas)
{
    using StreamWriter w = new(caminho);
    foreach (var l in linhas)
        await w.WriteLineAsync(l);
}`}</code></pre>

      <h2>Encadeando streams: GZip + File</h2>
      <p>
        Streams compõem como peças de Lego. Aqui, <code>GZipStream</code> envolve <code>FileStream</code> para gravar comprimido sem nunca segurar tudo em memória.
      </p>
      <pre><code>{`using System.IO.Compression;

using FileStream fs = File.Create("dados.gz");
using var gz = new GZipStream(fs, CompressionLevel.Optimal);
using StreamWriter w = new(gz);

w.WriteLine("Texto que será gravado já comprimido em GZip!");
// Ao sair dos using (em ordem inversa), tudo é fechado corretamente.`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>using</code></strong> e ter "arquivo em uso" em outras tentativas de abrir.</li>
        <li><strong>Misturar <code>Read</code> binário e <code>StreamReader</code></strong> na mesma stream — o leitor armazena bytes em buffer interno, então você "perde" parte dos bytes para o lado binário.</li>
        <li><strong>Carregar arquivo gigante com <code>ReadToEnd</code></strong>: para 5 GB, o programa morre por falta de memória. Use <code>ReadLine</code> em loop.</li>
        <li><strong>Codificação errada</strong>: ler arquivo Latin-1 com <code>StreamReader</code> padrão (UTF-8) gera caracteres bizarros. Passe a <code>Encoding</code> correta no construtor.</li>
        <li><strong>Não fazer <code>Flush</code> em <code>StreamWriter</code></strong> quando precisar de garantia imediata em disco.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Stream</code> é a abstração base para sequências de bytes (arquivo, memória, rede).</li>
        <li><code>FileStream</code> e <code>MemoryStream</code> são as concretas mais comuns.</li>
        <li><code>StreamReader</code>/<code>StreamWriter</code> envolvem uma Stream para ler/escrever <em>texto</em>.</li>
        <li>Sempre use <code>using</code> para garantir <code>Dispose()</code> e liberar recursos.</li>
        <li>Em loops de I/O, prefira <code>ReadLine</code> a <code>ReadToEnd</code> para arquivos grandes.</li>
        <li>Use <code>...Async</code> em servidores para não bloquear threads.</li>
        <li>Streams encadeiam: <code>GZipStream</code> em cima de <code>FileStream</code>, etc.</li>
      </ul>
    </PageContainer>
  );
}
