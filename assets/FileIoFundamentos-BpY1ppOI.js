import{j as e}from"./index-CzLAthD5.js";import{P as i,A as o}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(i,{title:"Lendo e escrevendo arquivos com File",subtitle:"A classe estática File é o jeito mais simples e direto de manipular arquivos texto e binários no .NET.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs("p",{children:['Trabalhar com arquivos é uma das primeiras tarefas "do mundo real" que todo programador precisa enfrentar: ler um CSV, salvar um log, importar uma configuração. O .NET oferece a classe estática ',e.jsx("code",{children:"File"})," dentro do namespace ",e.jsx("code",{children:"System.IO"}),' — pense nela como um "controle remoto" que permite operações de alto nível sobre arquivos sem precisar abrir, gerenciar buffers ou fechar manualmente. Para operações pontuais (ler tudo, escrever tudo, mover, copiar, deletar), ',e.jsx("code",{children:"File"})," é a ferramenta certa. Para arquivos enormes ou processamento contínuo, há os ",e.jsx("strong",{children:"Streams"})," (assunto do próximo capítulo)."]}),e.jsx("h2",{children:"Lendo um arquivo inteiro"}),e.jsxs("p",{children:["Os métodos mais usados são ",e.jsx("code",{children:"ReadAllText"})," (devolve uma string única), ",e.jsx("code",{children:"ReadAllLines"})," (devolve um ",e.jsx("code",{children:"string[]"})," com cada linha) e ",e.jsx("code",{children:"ReadAllBytes"})," (devolve ",e.jsx("code",{children:"byte[]"}),", para binários)."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.IO;
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
string txt = File.ReadAllText("relatorio.txt", Encoding.UTF8);`})}),e.jsxs(o,{type:"warning",title:"ReadAllText carrega TUDO na memória",children:["Se o arquivo tem 2 GB, ",e.jsx("code",{children:"ReadAllText"})," tentará alocar 2 GB de string — e provavelmente vai estourar. Para arquivos grandes, use ",e.jsx("code",{children:"ReadLines"})," (preguiçoso, item por item) ou um ",e.jsx("code",{children:"StreamReader"}),"."]}),e.jsx("h2",{children:"ReadLines: lendo de forma preguiçosa"}),e.jsxs("p",{children:["Diferente de ",e.jsx("code",{children:"ReadAllLines"}),", o método ",e.jsx("code",{children:"ReadLines"})," devolve um ",e.jsx("code",{children:"IEnumerable<string>"})," que ",e.jsx("strong",{children:"lê uma linha por vez"})," conforme você itera. É a escolha certa para arquivos grandes ou quando você não precisa de todas as linhas (vai parar no meio com ",e.jsx("code",{children:"break"}),", por exemplo)."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Memória constante mesmo se o arquivo tiver milhões de linhas
foreach (string linha in File.ReadLines("acessos.log"))
{
    if (linha.Contains("ERROR")) {
        Console.WriteLine(linha);
        // pode dar break aqui sem ler o resto
    }
}

// Combina lindamente com LINQ:
int erros = File.ReadLines("acessos.log")
                .Count(l => l.Contains("ERROR"));`})}),e.jsx("h2",{children:"Escrevendo arquivos"}),e.jsxs("p",{children:["Os métodos espelhados são ",e.jsx("code",{children:"WriteAllText"}),", ",e.jsx("code",{children:"WriteAllLines"})," e ",e.jsx("code",{children:"WriteAllBytes"}),". Eles ",e.jsx("strong",{children:"sobrescrevem"})," o arquivo se ele já existir — sem perguntar. Para acrescentar ao final, use ",e.jsx("code",{children:"AppendAllText"})," ou ",e.jsx("code",{children:"AppendAllLines"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Sobrescreve (cria se não existir)
File.WriteAllText("saida.txt", "Olá mundo!\\n");

// Escreve várias linhas
File.WriteAllLines("nomes.txt", new[] { "Ana", "João", "Maria" });

// Acrescenta ao final
File.AppendAllText("log.txt",
    $"[{DateTime.Now:HH:mm:ss}] Login efetuado\\n");

// Bytes binários
byte[] dados = Encoding.UTF8.GetBytes("Olá");
File.WriteAllBytes("teste.bin", dados);`})}),e.jsxs("p",{children:["Versões assíncronas existem para todos esses métodos (",e.jsx("code",{children:"WriteAllTextAsync"}),", ",e.jsx("code",{children:"ReadAllLinesAsync"}),"...) e devem ser preferidas em servidores web, onde bloquear a thread por IO de disco é desperdício."]}),e.jsx("h2",{children:"Verificando, deletando, movendo e copiando"}),e.jsx("p",{children:"Antes de manipular um arquivo, é prudente checar se ele existe. As operações de gestão (deletar, mover, copiar) também são métodos estáticos."}),e.jsx("pre",{children:e.jsx("code",{children:`if (File.Exists("velho.txt"))
    File.Delete("velho.txt");

// Mover (renomear) — falha se destino já existir
File.Move("origem.txt", "destino.txt");

// .NET 6+: sobrescrever destino se existir
File.Move("origem.txt", "destino.txt", overwrite: true);

// Copiar — segundo overload aceita 'overwrite'
File.Copy("config.json", "config.bak.json", overwrite: true);

// Metadados
DateTime mod = File.GetLastWriteTime("doc.pdf");
long tamanho = new FileInfo("doc.pdf").Length; // bytes`})}),e.jsx("h2",{children:'Path.Combine: nunca concatene caminhos com "+"'}),e.jsxs("p",{children:["Caminhos de arquivo variam entre sistemas: Windows usa ",e.jsx("code",{children:"\\"}),", Linux/macOS usam ",e.jsx("code",{children:"/"}),". Concatenar com ",e.jsx("code",{children:"+"})," ou interpolação resulta em código que ",e.jsx("strong",{children:"quebra"})," em produção. Use ",e.jsx("code",{children:"Path.Combine"})," — ele escolhe o separador correto para o SO atual."]}),e.jsx("pre",{children:e.jsx("code",{children:`// ❌ Frágil:
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
string novo  = Path.ChangeExtension("doc.txt", ".bak");`})}),e.jsxs(o,{type:"info",title:"Diretórios: a classe Directory",children:["Para criar pastas, listar arquivos de um diretório, ou apagar pastas inteiras, use a classe ",e.jsx("code",{children:"Directory"})," (estática) ou ",e.jsx("code",{children:"DirectoryInfo"})," (instância). Exemplos: ",e.jsx("code",{children:'Directory.CreateDirectory("logs")'}),", ",e.jsx("code",{children:'Directory.GetFiles("./", "*.txt")'}),", ",e.jsx("code",{children:"Directory.EnumerateFiles(...)"})," (preguiçoso)."]}),e.jsx("h2",{children:"Tratamento de erros: as exceções comuns"}),e.jsxs("p",{children:["Operações de IO podem falhar por mil motivos: arquivo não existe, sem permissão, disco cheio, caminho inválido, arquivo travado por outro processo. As exceções mais comuns são ",e.jsx("code",{children:"FileNotFoundException"}),", ",e.jsx("code",{children:"UnauthorizedAccessException"}),", ",e.jsx("code",{children:"IOException"})," e ",e.jsx("code",{children:"DirectoryNotFoundException"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`try {
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
}`})}),e.jsx("h2",{children:"Caminhos relativos vs absolutos"}),e.jsxs("p",{children:["Caminhos relativos como ",e.jsx("code",{children:'"dados/foo.txt"'})," são interpretados em relação ao ",e.jsx("strong",{children:"diretório de trabalho atual"})," (",e.jsx("code",{children:"Environment.CurrentDirectory"}),") — que ",e.jsx("em",{children:"não"})," é necessariamente onde seu .exe está. Em apps de console iniciados pelo IDE, costuma coincidir; em serviços ou em produção, pode ser ",e.jsx("code",{children:"C:\\Windows\\System32"}),". Para evitar surpresas, monte sempre o caminho absoluto:"]}),e.jsx("pre",{children:e.jsx("code",{children:`string baseDir = AppContext.BaseDirectory;            // pasta do .exe/.dll
string caminho = Path.Combine(baseDir, "dados", "foo.txt");
string conteudo = File.ReadAllText(caminho);`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Concatenar paths com ",e.jsx("code",{children:"+"})]})," — quebra entre Windows/Linux. Sempre ",e.jsx("code",{children:"Path.Combine"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Ler arquivo gigante com ",e.jsx("code",{children:"ReadAllText"})]})," — explode memória. Use ",e.jsx("code",{children:"ReadLines"})," ou stream."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"WriteAllText"})," (sobrescreve) com ",e.jsx("code",{children:"AppendAllText"})," (acrescenta)"]})," — perde o conteúdo anterior."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer encoding"})," — acentos viram lixo se o arquivo não for UTF-8 padrão."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Ignorar caminho de trabalho atual"})," — relativo funciona no IDE e falha em produção."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"File.ReadAllText"}),"/",e.jsx("code",{children:"WriteAllText"})," para texto inteiro; ",e.jsx("code",{children:"ReadAllBytes"}),"/",e.jsx("code",{children:"WriteAllBytes"})," para binário."]}),e.jsxs("li",{children:[e.jsx("code",{children:"File.ReadLines"})," é preguiçoso — ideal para arquivos grandes."]}),e.jsxs("li",{children:[e.jsx("code",{children:"File.AppendAllText"})," acrescenta sem apagar o conteúdo existente."]}),e.jsxs("li",{children:[e.jsx("code",{children:"File.Exists"}),", ",e.jsx("code",{children:"File.Delete"}),", ",e.jsx("code",{children:"File.Move"}),", ",e.jsx("code",{children:"File.Copy"})," gerenciam o ciclo de vida."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"Path.Combine"})," para montar caminhos portáveis."]}),e.jsxs("li",{children:["Trate ",e.jsx("code",{children:"FileNotFoundException"}),", ",e.jsx("code",{children:"UnauthorizedAccessException"})," e ",e.jsx("code",{children:"IOException"}),"."]})]})]})}export{n as default};
