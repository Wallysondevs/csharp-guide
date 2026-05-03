import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GlobalUsing() {
  return (
    <PageContainer
      title="Global using e ImplicitUsings: imports para o projeto inteiro"
      subtitle="Como deixar de repetir using System; em todo arquivo, e o que o SDK adiciona automaticamente para você."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <p>
        Toda linguagem tem o conceito de "importar" código de outras partes do programa. Em C#, isso é feito com a diretiva <code>using</code>, que diz ao <strong>compilador</strong> (programa que traduz seu código em algo executável): "neste arquivo, eu quero usar tipos do <em>namespace</em> tal sem precisar repetir o nome dele toda hora". Mas e quando você usa <code>System</code> em <em>todos</em> os arquivos do projeto? Repetir <code>using System;</code> 200 vezes é cansativo. O C# 10 trouxe duas soluções: <strong>global using</strong> e <strong>ImplicitUsings</strong>.
      </p>

      <h2>O problema: usings repetidos em todo arquivo</h2>
      <p>
        Em qualquer projeto real, no topo de cada arquivo aparecem os mesmos suspeitos: <code>System</code>, <code>System.Collections.Generic</code>, <code>System.Linq</code>, <code>System.Threading.Tasks</code>... Você gasta linhas, polui o diff (mudança no controle de versão) e às vezes esquece um, gerando erro <em>"The name 'List' does not exist in the current context"</em>.
      </p>
      <pre><code>{`// Antes do C# 10: cada arquivo começa assim
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MeuApp;

public class Service {
    public async Task<List<int>> Numeros() => Enumerable.Range(1, 10).ToList();
}`}</code></pre>

      <h2>A solução 1: <code>global using</code></h2>
      <p>
        A palavra-chave <code>global using</code> faz o import valer para <strong>todos os arquivos</strong> do projeto, não só onde foi declarada. Por convenção, você cria um arquivo dedicado, geralmente chamado <code>GlobalUsings.cs</code>, no topo do projeto:
      </p>
      <pre><code>{`// Arquivo: GlobalUsings.cs
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading.Tasks;
global using System.Text.Json;

// Aliases também funcionam globais
global using StringMap = System.Collections.Generic.Dictionary<string, string>;

// E usings 'static' (importa membros estáticos) também
global using static System.Math;`}</code></pre>
      <p>
        A partir desse ponto, qualquer arquivo do projeto pode usar <code>List</code>, <code>Sqrt</code>, <code>JsonSerializer</code> sem nenhum <code>using</code> local. O <code>StringMap</code> alias também fica disponível em todo lugar.
      </p>

      <AlertBox type="info" title="Onde colocar?">
        Tecnicamente, <code>global using</code> pode aparecer em qualquer arquivo <code>.cs</code> do projeto, mas precisa vir <em>antes</em> de qualquer <code>using</code> normal e antes de qualquer namespace. Por sanidade, concentre todos em um único <code>GlobalUsings.cs</code>.
      </AlertBox>

      <h2>A solução 2: <code>ImplicitUsings</code> no <code>.csproj</code></h2>
      <p>
        O .NET 6 trouxe um truque ainda mais radical: o SDK pode gerar um arquivo de global usings <strong>automaticamente</strong> com base no tipo do projeto. Você só liga uma flag no <code>.csproj</code>:
      </p>
      <pre><code>{`<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>`}</code></pre>
      <p>
        Quando ativado, o SDK gera durante o build um arquivo invisível com <code>global using</code> dos namespaces "óbvios" daquele tipo de projeto.
      </p>

      <h2>O que cada SDK adiciona automaticamente</h2>
      <p>
        Os usings implícitos <strong>variam por tipo de projeto</strong>. Não é o mesmo conjunto para um console e para um web API. Os principais:
      </p>
      <table>
        <thead>
          <tr><th>SDK</th><th>Namespaces adicionados</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Microsoft.NET.Sdk</code> (console/lib)</td>
            <td><code>System</code>, <code>System.Collections.Generic</code>, <code>System.IO</code>, <code>System.Linq</code>, <code>System.Net.Http</code>, <code>System.Threading</code>, <code>System.Threading.Tasks</code></td>
          </tr>
          <tr>
            <td><code>Microsoft.NET.Sdk.Web</code></td>
            <td>Tudo do anterior + <code>System.Net.Http.Json</code>, <code>Microsoft.AspNetCore.Builder</code>, <code>Microsoft.AspNetCore.Hosting</code>, <code>Microsoft.AspNetCore.Http</code>, <code>Microsoft.AspNetCore.Routing</code>, <code>Microsoft.Extensions.*</code></td>
          </tr>
          <tr>
            <td><code>Microsoft.NET.Sdk.Worker</code></td>
            <td>Tudo do base + <code>Microsoft.Extensions.Configuration</code>, <code>Microsoft.Extensions.DependencyInjection</code>, <code>Microsoft.Extensions.Hosting</code>, <code>Microsoft.Extensions.Logging</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Adicionando ou removendo namespaces implícitos</h2>
      <p>
        Você pode <strong>customizar</strong> o conjunto via <code>&lt;ItemGroup&gt;</code>. Adicione com <code>&lt;Using Include="..."/&gt;</code>, remova com <code>&lt;Using Remove="..."/&gt;</code>:
      </p>
      <pre><code>{`<ItemGroup>
  <!-- Adiciona namespace para todo o projeto -->
  <Using Include="System.Text" />
  <Using Include="MeuApp.Common" />

  <!-- Adiciona com 'static' (membros viram chamáveis sem prefixo) -->
  <Using Include="System.Math" Static="True" />

  <!-- Adiciona alias -->
  <Using Include="System.Collections.Generic.Dictionary&lt;string,string&gt;" Alias="StringMap" />

  <!-- Remove um implícito que não quero -->
  <Using Remove="System.Net.Http" />
</ItemGroup>`}</code></pre>
      <p>
        Note o <code>&amp;lt;</code> e <code>&amp;gt;</code> no XML — é necessário escapar <code>&lt;</code> e <code>&gt;</code> dentro de atributos XML.
      </p>

      <h2>Conflitos entre namespaces</h2>
      <p>
        Quando dois namespaces importados têm um tipo com <strong>mesmo nome</strong>, o compilador acusa ambiguidade. Isso é mais comum com global usings, justamente porque você importa muito sem ver. Exemplo clássico: <code>System.Timers.Timer</code> vs <code>System.Threading.Timer</code> vs <code>System.Windows.Forms.Timer</code>.
      </p>
      <pre><code>{`// Erro: 'Timer' is ambiguous between ...
global using System.Timers;
global using System.Threading;

// Solução: alias específico
global using ThreadTimer = System.Threading.Timer;
global using TimersTimer = System.Timers.Timer;`}</code></pre>

      <AlertBox type="warning" title="Cuidado com a magia">
        Global usings são poderosos mas <em>escondem</em> dependências. Em código novo é confortável, mas ao ler um arquivo isolado fica difícil saber de onde vem cada tipo. Prefira manter o conjunto enxuto e bem documentado em um único <code>GlobalUsings.cs</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Misturar <code>global using</code> com <code>using</code> normal:</strong> os <code>global</code> precisam vir <em>antes</em> dos não-globais no mesmo arquivo. Senão dá erro CS8915.</li>
        <li><strong>Esperar que <code>ImplicitUsings</code> traga tudo:</strong> ele traz só os "óbvios" do SDK; tipos como <code>System.Text.Json</code> ou <code>System.IO.Compression</code> precisam ser adicionados manualmente.</li>
        <li><strong>Importar muito e gerar ambiguidades:</strong> resolva com aliases ou removendo o using mais raro.</li>
        <li><strong>Esquecer de habilitar no <code>.csproj</code> antigo:</strong> projetos pré-net6.0 precisam atualizar o TFM ou pelo menos ter <code>LangVersion</code> 10+.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>global using</code> faz um import valer para todo o projeto.</li>
        <li>Convenção: agrupe em <code>GlobalUsings.cs</code> na raiz.</li>
        <li><code>&lt;ImplicitUsings&gt;enable&lt;/ImplicitUsings&gt;</code> deixa o SDK importar o "óbvio" automaticamente.</li>
        <li>Conjunto importado varia por SDK: web traz mais coisas que console.</li>
        <li>Customize com <code>&lt;Using Include/Remove/&gt;</code> no <code>.csproj</code>.</li>
      </ul>
    </PageContainer>
  );
}
