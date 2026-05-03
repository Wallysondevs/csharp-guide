import{j as e}from"./index-CzLAthD5.js";import{P as a,A as r}from"./AlertBox-CWJo3ar5.js";function o(){return e.jsxs(a,{title:"Streams, StreamReader e StreamWriter",subtitle:"Aprenda a ler e escrever dados de qualquer fonte — arquivo, memória, rede — usando a abstração de Stream.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsxs("p",{children:["Imagine uma ",e.jsx("strong",{children:"mangueira de jardim"}),`: a água sai por um lado e é consumida no outro, gota a gota, sem que você precise saber se a outra ponta está num poço, numa caixa d'água ou num caminhão-pipa. No .NET, esse conceito de "fluxo de bytes" é representado pela classe abstrata `,e.jsx("code",{children:"Stream"}),". Aprender a usá-la bem é o que separa programas que carregam um ",e.jsx("em",{children:"arquivo de 1 GB inteiro na memória"})," (e quebram) de programas que processam ",e.jsx("em",{children:"terabytes"})," sem suar."]}),e.jsx("h2",{children:"O que é uma Stream"}),e.jsxs("p",{children:[e.jsx("code",{children:"Stream"})," é a classe-base que representa uma ",e.jsx("strong",{children:"sequência de bytes"})," com operações de leitura, escrita e posicionamento. Você raramente cria um ",e.jsx("code",{children:"Stream"})," direto — usa subclasses concretas:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"FileStream"}),": bytes vindos de um arquivo no disco."]}),e.jsxs("li",{children:[e.jsx("code",{children:"MemoryStream"}),": bytes que vivem inteiramente na RAM."]}),e.jsxs("li",{children:[e.jsx("code",{children:"NetworkStream"}),": bytes trafegando por uma conexão TCP."]}),e.jsxs("li",{children:[e.jsx("code",{children:"GZipStream"}),", ",e.jsx("code",{children:"CryptoStream"}),': "filtros" que envolvem outra stream.']})]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.IO;

// Abre arquivo para leitura — Stream cru, em bytes
using FileStream fs = File.OpenRead("dados.bin");

byte[] buffer = new byte[4096];          // bloco de 4 KB
int lidos = fs.Read(buffer, 0, buffer.Length);
Console.WriteLine($"Li {lidos} bytes");`})}),e.jsxs(r,{type:"info",title:"Por que <code>using</code>?",children:["Streams seguram ",e.jsx("strong",{children:"recursos do sistema operacional"})," (handles de arquivo, sockets). A palavra-chave ",e.jsx("code",{children:"using"})," garante que ",e.jsx("code",{children:"Dispose()"})," seja chamado mesmo se uma exceção ocorrer — fechando o handle e liberando o recurso. Sem isso, em um servidor que abre milhares de arquivos por segundo, você esgota o limite do SO em minutos."]}),e.jsx("h2",{children:"FileStream: bytes do disco"}),e.jsxs("p",{children:["Você controla o modo de abertura via ",e.jsx("code",{children:"FileMode"})," (criar, abrir, sobrescrever) e o acesso via ",e.jsx("code",{children:"FileAccess"})," (leitura, escrita ou ambos)."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Cria arquivo novo (sobrescreve se existir) só para escrita
using (var fs = new FileStream("saida.bin",
                               FileMode.Create,
                               FileAccess.Write))
{
    byte[] dados = { 0x48, 0x69, 0x21 }; // "Hi!"
    fs.Write(dados, 0, dados.Length);
}   // <- Dispose chamado aqui automaticamente

// Equivalente atalho — File.WriteAllBytes faz por baixo
File.WriteAllBytes("saida.bin", new byte[] { 0x48, 0x69, 0x21 });`})}),e.jsx("h2",{children:"MemoryStream: bytes em RAM"}),e.jsx("p",{children:"Útil para testes (simular um arquivo sem tocar disco), para construir respostas binárias na memória ou para encadear filtros."}),e.jsx("pre",{children:e.jsx("code",{children:`using var ms = new MemoryStream();
byte[] cabecalho = { 0x89, 0x50, 0x4E, 0x47 };  // assinatura PNG
ms.Write(cabecalho, 0, cabecalho.Length);

// Volta o "cursor" para o início para reler
ms.Position = 0;

byte[] buffer = new byte[4];
ms.Read(buffer, 0, 4);
Console.WriteLine(BitConverter.ToString(buffer));  // 89-50-4E-47`})}),e.jsx("h2",{children:"StreamReader: lendo TEXTO de uma Stream"}),e.jsxs("p",{children:["Stream pura lida com ",e.jsx("em",{children:"bytes"}),". Para ler ",e.jsx("strong",{children:"texto"})," (com decodificação de caracteres — UTF-8, Latin-1 etc.), envolva em ",e.jsx("code",{children:"StreamReader"}),". Ela cuida de detectar BOM, decodificar e quebrar em linhas."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Lê arquivo texto linha a linha (memória O(1) — bom para 10 GB)
using StreamReader leitor = new("livro.txt");

string? linha;
int total = 0;
while ((linha = leitor.ReadLine()) is not null)
{
    total++;
    if (linha.Contains("rosebud", StringComparison.OrdinalIgnoreCase))
        Console.WriteLine($"Achei na linha {total}");
}
Console.WriteLine($"Total: {total} linhas");`})}),e.jsxs("p",{children:[e.jsx("code",{children:"ReadLine"})," devolve ",e.jsx("code",{children:"null"})," quando chega ao fim. Existe também ",e.jsx("code",{children:"ReadToEnd()"})," (carrega tudo de uma vez — só para arquivos pequenos) e ",e.jsx("code",{children:"Read(char[], int, int)"})," para controle fino."]}),e.jsx("h2",{children:"StreamWriter: escrevendo TEXTO"}),e.jsxs("p",{children:["Espelho de ",e.jsx("code",{children:"StreamReader"}),". Codifica strings para bytes e ",e.jsx("strong",{children:"bufferiza"}),": pequenas chamadas a ",e.jsx("code",{children:"Write"})," são acumuladas e gravadas em blocos para eficiência."]}),e.jsx("pre",{children:e.jsx("code",{children:`using StreamWriter w = new("relatorio.txt", append: false,
                            encoding: System.Text.Encoding.UTF8);

w.WriteLine("Relatório de vendas");
w.WriteLine("===================");
for (int i = 1; i <= 5; i++)
    w.WriteLine($"Item {i}: R$ {i * 9.9m:F2}");

// w.Flush() é chamado por Dispose; força gravação imediata se preciso`})}),e.jsxs(r,{type:"warning",title:"Buffer e dados perdidos",children:["Se o programa é encerrado ",e.jsx("em",{children:"abruptamente"})," (kill, queda de energia) antes de o buffer ser descarregado, as últimas escritas se perdem. O ",e.jsx("code",{children:"using"})," resolve no caminho normal — mas para situações críticas (logs de auditoria), chame ",e.jsx("code",{children:"Flush()"})," manualmente após cada escrita ou use ",e.jsx("code",{children:"autoFlush: true"})," no construtor."]}),e.jsxs("h2",{children:["Async: ",e.jsx("code",{children:"ReadAsync"})," e ",e.jsx("code",{children:"WriteAsync"})]}),e.jsxs("p",{children:["Em código de servidor (web API, microsserviços), você quase nunca quer bloquear a thread esperando o disco. Use as versões ",e.jsx("code",{children:"...Async"}),", que liberam a thread enquanto o sistema operacional faz a I/O."]}),e.jsx("pre",{children:e.jsx("code",{children:`async Task ProcessarAsync(string caminho)
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
}`})}),e.jsx("h2",{children:"Encadeando streams: GZip + File"}),e.jsxs("p",{children:["Streams compõem como peças de Lego. Aqui, ",e.jsx("code",{children:"GZipStream"})," envolve ",e.jsx("code",{children:"FileStream"})," para gravar comprimido sem nunca segurar tudo em memória."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.IO.Compression;

using FileStream fs = File.Create("dados.gz");
using var gz = new GZipStream(fs, CompressionLevel.Optimal);
using StreamWriter w = new(gz);

w.WriteLine("Texto que será gravado já comprimido em GZip!");
// Ao sair dos using (em ordem inversa), tudo é fechado corretamente.`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"using"})]}),' e ter "arquivo em uso" em outras tentativas de abrir.']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Misturar ",e.jsx("code",{children:"Read"})," binário e ",e.jsx("code",{children:"StreamReader"})]}),' na mesma stream — o leitor armazena bytes em buffer interno, então você "perde" parte dos bytes para o lado binário.']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Carregar arquivo gigante com ",e.jsx("code",{children:"ReadToEnd"})]}),": para 5 GB, o programa morre por falta de memória. Use ",e.jsx("code",{children:"ReadLine"})," em loop."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Codificação errada"}),": ler arquivo Latin-1 com ",e.jsx("code",{children:"StreamReader"})," padrão (UTF-8) gera caracteres bizarros. Passe a ",e.jsx("code",{children:"Encoding"})," correta no construtor."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não fazer ",e.jsx("code",{children:"Flush"})," em ",e.jsx("code",{children:"StreamWriter"})]})," quando precisar de garantia imediata em disco."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Stream"})," é a abstração base para sequências de bytes (arquivo, memória, rede)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"FileStream"})," e ",e.jsx("code",{children:"MemoryStream"})," são as concretas mais comuns."]}),e.jsxs("li",{children:[e.jsx("code",{children:"StreamReader"}),"/",e.jsx("code",{children:"StreamWriter"})," envolvem uma Stream para ler/escrever ",e.jsx("em",{children:"texto"}),"."]}),e.jsxs("li",{children:["Sempre use ",e.jsx("code",{children:"using"})," para garantir ",e.jsx("code",{children:"Dispose()"})," e liberar recursos."]}),e.jsxs("li",{children:["Em loops de I/O, prefira ",e.jsx("code",{children:"ReadLine"})," a ",e.jsx("code",{children:"ReadToEnd"})," para arquivos grandes."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"...Async"})," em servidores para não bloquear threads."]}),e.jsxs("li",{children:["Streams encadeiam: ",e.jsx("code",{children:"GZipStream"})," em cima de ",e.jsx("code",{children:"FileStream"}),", etc."]})]})]})}export{o as default};
