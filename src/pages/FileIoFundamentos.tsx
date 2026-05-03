import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FileIoFundamentos() {
  return (
    <PageContainer
      title="Lendo e escrevendo arquivos com File"
      subtitle="A classe estática File é o jeito mais simples e direto de manipular arquivos texto e binários no .NET."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Trabalhar com arquivos é uma das primeiras tarefas "do mundo real" que todo programador precisa enfrentar: ler um CSV, salvar um log, importar uma configuração. O .NET oferece a classe estática <code>File</code> dentro do namespace <code>System.IO</code> — pense nela como um "controle remoto" que permite operações de alto nível sobre arquivos sem precisar abrir, gerenciar buffers ou fechar manualmente. Para operações pontuais (ler tudo, escrever tudo, mover, copiar, deletar), <code>File</code> é a ferramenta certa. Para arquivos enormes ou processamento contínuo, há os <strong>Streams</strong> (assunto do próximo capítulo).
      </p>

      <h2>Lendo um arquivo inteiro</h2>
      <p>
        Os métodos mais usados são <code>ReadAllText</code> (devolve uma string única), <code>ReadAllLines</code> (devolve um <code>string[]</code> com cada linha) e <code>ReadAllBytes</code> (devolve <code>byte[]</code>, para binários).
      </p>
      <pre><code>{`using System.IO;
using System.Text;

// Texto inteiro como string
string conteudo = File.ReadAllText("config.json");

// Cada linha em uma posição do array
string[] linhas = File.ReadAllLines("dados.csv");
foreach (string linha in linhas)
    Console.WriteLine(linha);

// Bytes crus (imagens, executáveis, qualquer binário)
byte[] bytes = File.ReadAllBytes("foto.jpg");
Console.WriteLine($"{bytes.Length} bytes lidos");

// Para garantir codificação correta (acentos):
string txt = File.ReadAllText("relatorio.txt", Encoding.UTF8);`}</code></pre>

      <AlertBox type="warning" title="ReadAllText carrega TUDO na memória">
        Se o arquivo tem 2 GB, <code>ReadAllText</code> tentará alocar 2 GB de string — e provavelmente vai estourar. Para arquivos grandes, use <code>ReadLines</code> (preguiçoso, item por item) ou um <code>StreamReader</code>.
      </AlertBox>

      <h2>ReadLines: lendo de forma preguiçosa</h2>
      <p>
        Diferente de <code>ReadAllLines</code>, o método <code>ReadLines</code> devolve um <code>IEnumerable&lt;string&gt;</code> que <strong>lê uma linha por vez</strong> conforme você itera. É a escolha certa para arquivos grandes ou quando você não precisa de todas as linhas (vai parar no meio com <code>break</code>, por exemplo).
      </p>
      <pre><code>{`// Memória constante mesmo se o arquivo tiver milhões de linhas
foreach (string linha in File.ReadLines("acessos.log"))
{
    if (linha.Contains("ERROR")) {
        Console.WriteLine(linha);
        // pode dar break aqui sem ler o resto
    }
}

// Combina lindamente com LINQ:
int erros = File.ReadLines("acessos.log")
                .Count(l => l.Contains("ERROR"));`}</code></pre>

      <h2>Escrevendo arquivos</h2>
      <p>
        Os métodos espelhados são <code>WriteAllText</code>, <code>WriteAllLines</code> e <code>WriteAllBytes</code>. Eles <strong>sobrescrevem</strong> o arquivo se ele já existir — sem perguntar. Para acrescentar ao final, use <code>AppendAllText</code> ou <code>AppendAllLines</code>.
      </p>
      <pre><code>{`// Sobrescreve (cria se não existir)
File.WriteAllText("saida.txt", "Olá mundo!\\n");

// Escreve várias linhas
File.WriteAllLines("nomes.txt", new[] { "Ana", "João", "Maria" });

// Acrescenta ao final
File.AppendAllText("log.txt",
    $"[{DateTime.Now:HH:mm:ss}] Login efetuado\\n");

// Bytes binários
byte[] dados = Encoding.UTF8.GetBytes("Olá");
File.WriteAllBytes("teste.bin", dados);`}</code></pre>

      <p>
        Versões assíncronas existem para todos esses métodos (<code>WriteAllTextAsync</code>, <code>ReadAllLinesAsync</code>...) e devem ser preferidas em servidores web, onde bloquear a thread por IO de disco é desperdício.
      </p>

      <h2>Verificando, deletando, movendo e copiando</h2>
      <p>
        Antes de manipular um arquivo, é prudente checar se ele existe. As operações de gestão (deletar, mover, copiar) também são métodos estáticos.
      </p>
      <pre><code>{`if (File.Exists("velho.txt"))
    File.Delete("velho.txt");

// Mover (renomear) — falha se destino já existir
File.Move("origem.txt", "destino.txt");

// .NET 6+: sobrescrever destino se existir
File.Move("origem.txt", "destino.txt", overwrite: true);

// Copiar — segundo overload aceita 'overwrite'
File.Copy("config.json", "config.bak.json", overwrite: true);

// Metadados
DateTime mod = File.GetLastWriteTime("doc.pdf");
long tamanho = new FileInfo("doc.pdf").Length; // bytes`}</code></pre>

      <h2>Path.Combine: nunca concatene caminhos com "+"</h2>
      <p>
        Caminhos de arquivo variam entre sistemas: Windows usa <code>\</code>, Linux/macOS usam <code>/</code>. Concatenar com <code>+</code> ou interpolação resulta em código que <strong>quebra</strong> em produção. Use <code>Path.Combine</code> — ele escolhe o separador correto para o SO atual.
      </p>
      <pre><code>{`// ❌ Frágil:
string ruim = "C:\\dados" + "\\" + "config.json";

// ✅ Portátil:
string bom  = Path.Combine("C:\\dados", "config.json");
// Linux: "C:/dados/config.json" (mesmo no Windows o Combine cuida)

// Path tem várias utilidades:
string abs   = Path.GetFullPath("relativo.txt");
string nome  = Path.GetFileName("/var/log/sys.log");           // "sys.log"
string sExt  = Path.GetFileNameWithoutExtension("foo.bar.txt"); // "foo.bar"
string ext   = Path.GetExtension("foto.JPG");                   // ".JPG"
string dir   = Path.GetDirectoryName("/var/log/sys.log");      // "/var/log"
string tmp   = Path.GetTempFileName();    // arquivo temporário único
string novo  = Path.ChangeExtension("doc.txt", ".bak");`}</code></pre>

      <AlertBox type="info" title="Diretórios: a classe Directory">
        Para criar pastas, listar arquivos de um diretório, ou apagar pastas inteiras, use a classe <code>Directory</code> (estática) ou <code>DirectoryInfo</code> (instância). Exemplos: <code>Directory.CreateDirectory("logs")</code>, <code>Directory.GetFiles("./", "*.txt")</code>, <code>Directory.EnumerateFiles(...)</code> (preguiçoso).
      </AlertBox>

      <h2>Tratamento de erros: as exceções comuns</h2>
      <p>
        Operações de IO podem falhar por mil motivos: arquivo não existe, sem permissão, disco cheio, caminho inválido, arquivo travado por outro processo. As exceções mais comuns são <code>FileNotFoundException</code>, <code>UnauthorizedAccessException</code>, <code>IOException</code> e <code>DirectoryNotFoundException</code>.
      </p>
      <pre><code>{`try {
    string conteudo = File.ReadAllText(caminho);
    // processar...
}
catch (FileNotFoundException) {
    Console.Error.WriteLine($"Arquivo não encontrado: {caminho}");
}
catch (UnauthorizedAccessException) {
    Console.Error.WriteLine($"Sem permissão para ler {caminho}");
}
catch (IOException ex) {
    Console.Error.WriteLine($"Erro de IO: {ex.Message}");
}`}</code></pre>

      <h2>Caminhos relativos vs absolutos</h2>
      <p>
        Caminhos relativos como <code>"dados/foo.txt"</code> são interpretados em relação ao <strong>diretório de trabalho atual</strong> (<code>Environment.CurrentDirectory</code>) — que <em>não</em> é necessariamente onde seu .exe está. Em apps de console iniciados pelo IDE, costuma coincidir; em serviços ou em produção, pode ser <code>C:\Windows\System32</code>. Para evitar surpresas, monte sempre o caminho absoluto:
      </p>
      <pre><code>{`string baseDir = AppContext.BaseDirectory;            // pasta do .exe/.dll
string caminho = Path.Combine(baseDir, "dados", "foo.txt");
string conteudo = File.ReadAllText(caminho);`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Concatenar paths com <code>+</code></strong> — quebra entre Windows/Linux. Sempre <code>Path.Combine</code>.</li>
        <li><strong>Ler arquivo gigante com <code>ReadAllText</code></strong> — explode memória. Use <code>ReadLines</code> ou stream.</li>
        <li><strong>Confundir <code>WriteAllText</code> (sobrescreve) com <code>AppendAllText</code> (acrescenta)</strong> — perde o conteúdo anterior.</li>
        <li><strong>Esquecer encoding</strong> — acentos viram lixo se o arquivo não for UTF-8 padrão.</li>
        <li><strong>Ignorar caminho de trabalho atual</strong> — relativo funciona no IDE e falha em produção.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>File.ReadAllText</code>/<code>WriteAllText</code> para texto inteiro; <code>ReadAllBytes</code>/<code>WriteAllBytes</code> para binário.</li>
        <li><code>File.ReadLines</code> é preguiçoso — ideal para arquivos grandes.</li>
        <li><code>File.AppendAllText</code> acrescenta sem apagar o conteúdo existente.</li>
        <li><code>File.Exists</code>, <code>File.Delete</code>, <code>File.Move</code>, <code>File.Copy</code> gerenciam o ciclo de vida.</li>
        <li>Use <code>Path.Combine</code> para montar caminhos portáveis.</li>
        <li>Trate <code>FileNotFoundException</code>, <code>UnauthorizedAccessException</code> e <code>IOException</code>.</li>
      </ul>
    </PageContainer>
  );
}
