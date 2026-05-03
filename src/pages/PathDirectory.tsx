import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PathDirectory() {
  return (
    <PageContainer
      title="Path e Directory: manipulando caminhos e pastas"
      subtitle="Como construir caminhos de arquivo de forma segura e percorrer diretórios de modo eficiente."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Manipular caminhos de arquivo parece simples — basta concatenar strings, certo? <strong>Errado.</strong> Windows usa <code>\</code>, Linux e macOS usam <code>/</code>. Existem caminhos relativos, absolutos, com barra no fim, sem barra, com espaços, com acentos. Para resolver tudo isso de forma portável, o .NET oferece duas classes estáticas no namespace <code>System.IO</code>: <strong>Path</strong> (manipula <em>strings</em> de caminho) e <strong>Directory</strong> (manipula <em>pastas reais</em> no disco). Pense em <code>Path</code> como uma calculadora de caminhos, e em <code>Directory</code> como o gerente do sistema de arquivos.
      </p>

      <h2>Path: combinando caminhos com segurança</h2>
      <p>
        Nunca, <em>nunca</em> faça <code>"pasta" + "/" + "arquivo.txt"</code>. Use <code>Path.Combine</code>, que resolve o separador correto do sistema operacional e remove barras duplicadas:
      </p>
      <pre><code>{`using System.IO;

// Combina segmentos de forma portável
string caminho = Path.Combine("dados", "usuarios", "alice.json");
// No Windows: "dados\\usuarios\\alice.json"
// No Linux:   "dados/usuarios/alice.json"

// Aceita N argumentos
string log = Path.Combine(Environment.CurrentDirectory, "logs", "app.log");`}</code></pre>
      <p>
        Outra coisa importante: se um dos segmentos for <em>absoluto</em>, ele <strong>descarta</strong> o que veio antes. Isso é proposital, mas confunde:
      </p>
      <pre><code>{`Path.Combine("/etc", "/usr/local"); // -> "/usr/local"
Path.Combine("C:\\\\app", "config"); // -> "C:\\\\app\\\\config"`}</code></pre>

      <h2>Extraindo partes do caminho</h2>
      <p>
        <code>Path</code> tem dezenas de métodos de inspeção. Os essenciais:
      </p>
      <pre><code>{`string p = "/home/maria/relatorio_2025.pdf";

Path.GetFileName(p);              // "relatorio_2025.pdf"
Path.GetFileNameWithoutExtension(p); // "relatorio_2025"
Path.GetExtension(p);             // ".pdf"
Path.GetDirectoryName(p);         // "/home/maria"
Path.GetFullPath("relativo.txt"); // resolve para absoluto
Path.IsPathRooted(p);             // true (começa com /)

// Trocar a extensão preservando o resto
Path.ChangeExtension(p, ".docx"); // "/home/maria/relatorio_2025.docx"`}</code></pre>
      <p>
        Esses métodos são <strong>puramente textuais</strong> — não tocam no disco e não verificam se o arquivo existe. Eles servem para você manipular caminhos como dados.
      </p>

      <AlertBox type="info" title="Caminhos temporários e do usuário">
        Use <code>Path.GetTempPath()</code> para a pasta temporária do sistema (<code>/tmp</code> no Linux, <code>%TEMP%</code> no Windows) e <code>Path.GetTempFileName()</code> para criar um arquivo temporário com nome único. Para a pasta home do usuário, use <code>Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)</code>.
      </AlertBox>

      <h2>Directory: criando, removendo, listando</h2>
      <p>
        Enquanto <code>Path</code> mexe com strings, <code>Directory</code> efetivamente <em>cria</em>, <em>apaga</em> e <em>lista</em> pastas:
      </p>
      <pre><code>{`// Cria pasta (e todas as intermediárias) — não falha se já existir
Directory.CreateDirectory("/var/app/dados/2025/01");

// Verificar existência
bool existe = Directory.Exists("/var/app");

// Remover (recursive: true apaga tudo dentro também — CUIDADO)
Directory.Delete("/tmp/cache_velho", recursive: true);

// Mover/renomear
Directory.Move("dados_antigos", "dados_v1");

// Pasta atual de trabalho
string atual = Directory.GetCurrentDirectory();
Directory.SetCurrentDirectory("/home/usuario");`}</code></pre>

      <h2>EnumerateFiles vs GetFiles</h2>
      <p>
        Para listar arquivos dentro de uma pasta há dois métodos parecidos, mas com diferença <strong>crucial</strong> em performance:
      </p>
      <ul>
        <li><code>GetFiles</code>: retorna um <code>string[]</code> com <em>todos</em> os caminhos. Tem que percorrer tudo antes de devolver — se a pasta tem 500 mil arquivos, sua aplicação trava por segundos.</li>
        <li><code>EnumerateFiles</code>: retorna um <code>IEnumerable&lt;string&gt;</code> que produz cada arquivo <em>conforme você itera</em>. Você pode parar no meio, filtrar, paginar.</li>
      </ul>
      <pre><code>{`// Listar arquivos .log da pasta atual (não recursivo)
foreach (var arq in Directory.EnumerateFiles(".", "*.log"))
{
    Console.WriteLine(arq);
}

// Buscar recursivamente todos os .cs em /projeto
var fontes = Directory.EnumerateFiles(
    "/projeto",
    "*.cs",
    SearchOption.AllDirectories);

// Pegar só os 10 primeiros — sem percorrer o resto
var amostra = fontes.Take(10).ToList();`}</code></pre>

      <AlertBox type="warning" title="Use EnumerateFiles por padrão">
        Quase sempre que você for iterar resultados, prefira <code>EnumerateFiles</code>/<code>EnumerateDirectories</code>. Use <code>GetFiles</code> apenas se realmente precisa do array completo na memória.
      </AlertBox>

      <h2>Filtros e padrões glob</h2>
      <p>
        O segundo argumento aceita um <em>search pattern</em> simples (não é regex):
      </p>
      <ul>
        <li><code>*</code> casa zero ou mais caracteres.</li>
        <li><code>?</code> casa exatamente um caractere.</li>
        <li>Sem extensão? Use <code>"*"</code>. Para múltiplas extensões, faça duas chamadas e concatene.</li>
      </ul>
      <pre><code>{`var imagens = Directory.EnumerateFiles("fotos", "*.*", SearchOption.AllDirectories)
    .Where(f => f.EndsWith(".jpg") || f.EndsWith(".png"))
    .ToList();`}</code></pre>

      <h2>EnumerationOptions: controle fino</h2>
      <p>
        Desde .NET Core 2.1, você pode passar um <code>EnumerationOptions</code> com flags como <code>IgnoreInaccessible</code> (não estoura erro em pasta sem permissão), <code>RecurseSubdirectories</code>, <code>MaxRecursionDepth</code> e <code>MatchCasing</code>:
      </p>
      <pre><code>{`var opcoes = new EnumerationOptions
{
    RecurseSubdirectories = true,
    IgnoreInaccessible = true,
    MaxRecursionDepth = 3
};

foreach (var f in Directory.EnumerateFiles("/", "*.conf", opcoes))
{
    Console.WriteLine(f);
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Concatenar com <code>+</code>:</strong> gera caminhos não-portáveis e barras duplicadas. Use <code>Path.Combine</code>.</li>
        <li><strong>Esquecer de checar existência antes de <code>Delete</code>:</strong> em algumas versões antigas estoura. <code>Directory.CreateDirectory</code> é seguro chamar em pasta existente, mas <code>Delete</code> não.</li>
        <li><strong>Usar <code>GetFiles</code> em pasta gigante:</strong> trava o app. Prefira <code>EnumerateFiles</code>.</li>
        <li><strong>Não tratar <code>UnauthorizedAccessException</code>:</strong> em recursão pode aparecer em qualquer pasta protegida. Use <code>IgnoreInaccessible = true</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Path</code> manipula strings de caminho de forma portável; não toca no disco.</li>
        <li><code>Path.Combine</code>, <code>GetFileName</code>, <code>GetExtension</code>, <code>ChangeExtension</code> são essenciais.</li>
        <li><code>Directory</code> cria, apaga, move e lista pastas reais.</li>
        <li><code>EnumerateFiles</code> é preguiçoso e eficiente; <code>GetFiles</code> carrega tudo em memória.</li>
        <li><code>EnumerationOptions</code> permite recursão segura com filtros avançados.</li>
      </ul>
    </PageContainer>
  );
}
