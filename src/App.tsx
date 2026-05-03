import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Home from "@/pages/Home";
import OQueECsharp from "@/pages/OQueECsharp";
import DotnetHoje from "@/pages/DotnetHoje";
import HelloWorld from "@/pages/HelloWorld";
import DotnetCli from "@/pages/DotnetCli";
import TiposPrimitivos from "@/pages/TiposPrimitivos";
import VarDynamicObject from "@/pages/VarDynamicObject";
import Operadores from "@/pages/Operadores";
import ControleFluxo from "@/pages/ControleFluxo";
import Strings from "@/pages/Strings";
import Datetime from "@/pages/Datetime";
import ConversoesParsing from "@/pages/ConversoesParsing";
import NullableReference from "@/pages/NullableReference";
import NullableValue from "@/pages/NullableValue";
import ArraysMulti from "@/pages/ArraysMulti";
import ListT from "@/pages/ListT";
import Dictionary from "@/pages/Dictionary";
import Hashset from "@/pages/Hashset";
import QueueStack from "@/pages/QueueStack";
import ImmutableCollections from "@/pages/ImmutableCollections";
import SpanMemory from "@/pages/SpanMemory";
import ReadonlyCollections from "@/pages/ReadonlyCollections";
import CollectionExpressions from "@/pages/CollectionExpressions";
import Classes from "@/pages/Classes";
import Construtores from "@/pages/Construtores";
import Properties from "@/pages/Properties";
import Heranca from "@/pages/Heranca";
import Polimorfismo from "@/pages/Polimorfismo";
import Interfaces from "@/pages/Interfaces";
import AbstractSealed from "@/pages/AbstractSealed";
import StaticMembros from "@/pages/StaticMembros";
import Records from "@/pages/Records";
import StructVsClass from "@/pages/StructVsClass";
import EnumsCsharp from "@/pages/EnumsCsharp";
import Tuples from "@/pages/Tuples";
import GenericosBasico from "@/pages/GenericosBasico";
import Constraints from "@/pages/Constraints";
import Variance from "@/pages/Variance";
import GenericMath from "@/pages/GenericMath";
import GenericMethods from "@/pages/GenericMethods";
import LinqIntro from "@/pages/LinqIntro";
import LinqWhereSelect from "@/pages/LinqWhereSelect";
import LinqOrdenacao from "@/pages/LinqOrdenacao";
import LinqJoin from "@/pages/LinqJoin";
import LinqAgregacao from "@/pages/LinqAgregacao";
import LinqDeferred from "@/pages/LinqDeferred";
import LinqIqueryable from "@/pages/LinqIqueryable";
import LinqSet from "@/pages/LinqSet";
import LinqPaginar from "@/pages/LinqPaginar";
import TaskVsThread from "@/pages/TaskVsThread";
import AsyncAwait from "@/pages/AsyncAwait";
import Configureawait from "@/pages/Configureawait";
import Cancellationtoken from "@/pages/Cancellationtoken";
import ParallelTasks from "@/pages/ParallelTasks";
import IasyncEnumerable from "@/pages/IasyncEnumerable";
import Valuetask from "@/pages/Valuetask";
import AsyncDeadlocks from "@/pages/AsyncDeadlocks";
import PatternMatching from "@/pages/PatternMatching";
import RecordsWith from "@/pages/RecordsWith";
import InitRequired from "@/pages/InitRequired";
import PrimaryConstructors from "@/pages/PrimaryConstructors";
import TopLevelStatements from "@/pages/TopLevelStatements";
import RawStrings from "@/pages/RawStrings";
import GlobalUsings from "@/pages/GlobalUsings";
import SourceGeneratorsUso from "@/pages/SourceGeneratorsUso";
import TryCatchFinally from "@/pages/TryCatchFinally";
import CustomExceptions from "@/pages/CustomExceptions";
import ExceptionFilters from "@/pages/ExceptionFilters";
import AggregateException from "@/pages/AggregateException";
import ExceptionBestPractices from "@/pages/ExceptionBestPractices";
import StackVsHeap from "@/pages/StackVsHeap";
import GarbageCollector from "@/pages/GarbageCollector";
import IdisposableUsing from "@/pages/IdisposableUsing";
import SpanPerf from "@/pages/SpanPerf";
import Arraypool from "@/pages/Arraypool";
import Boxing from "@/pages/Boxing";
import RefStruct from "@/pages/RefStruct";
import Stackalloc from "@/pages/Stackalloc";
import ReflectionBasico from "@/pages/ReflectionBasico";
import Atributos from "@/pages/Atributos";
import ExpressionTrees from "@/pages/ExpressionTrees";
import DynamicDlr from "@/pages/DynamicDlr";
import FileDirectory from "@/pages/FileDirectory";
import Streams from "@/pages/Streams";
import Json from "@/pages/Json";
import Xml from "@/pages/Xml";
import Compressao from "@/pages/Compressao";
import Httpclient from "@/pages/Httpclient";
import Grpc from "@/pages/Grpc";
import Websocket from "@/pages/Websocket";
import Sockets from "@/pages/Sockets";
import RestPatterns from "@/pages/RestPatterns";
import LockMonitor from "@/pages/LockMonitor";
import MutexSemaphore from "@/pages/MutexSemaphore";
import Channels from "@/pages/Channels";
import Interlocked from "@/pages/Interlocked";
import ParallelLinq from "@/pages/ParallelLinq";
import Csproj from "@/pages/Csproj";
import Nuget from "@/pages/Nuget";
import RoslynAnalyzers from "@/pages/RoslynAnalyzers";
import Aot from "@/pages/Aot";
import Trimming from "@/pages/Trimming";
import PublishDeploy from "@/pages/PublishDeploy";
import Xunit from "@/pages/Xunit";
import Moq from "@/pages/Moq";
import Fluentassertions from "@/pages/Fluentassertions";
import Benchmarkdotnet from "@/pages/Benchmarkdotnet";
import AspnetSetup from "@/pages/AspnetSetup";
import Middleware from "@/pages/Middleware";
import RoutingBinding from "@/pages/RoutingBinding";
import ControllersVsMinimal from "@/pages/ControllersVsMinimal";
import DiAspnet from "@/pages/DiAspnet";
import Configuration from "@/pages/Configuration";
import JwtAuth from "@/pages/JwtAuth";
import Cors from "@/pages/Cors";
import Validation from "@/pages/Validation";
import OpenapiSwagger from "@/pages/OpenapiSwagger";
import EfSetup from "@/pages/EfSetup";
import EfDbcontext from "@/pages/EfDbcontext";
import EfMigrations from "@/pages/EfMigrations";
import EfQuerying from "@/pages/EfQuerying";
import EfRelacionamentos from "@/pages/EfRelacionamentos";
import EfPerformance from "@/pages/EfPerformance";
import Solid from "@/pages/Solid";
import CleanArchitecture from "@/pages/CleanArchitecture";
import MediatorCqrs from "@/pages/MediatorCqrs";
import RepositoryPattern from "@/pages/RepositoryPattern";
import DiPadroes from "@/pages/DiPadroes";
import HashCripto from "@/pages/HashCripto";
import JwtDetalhado from "@/pages/JwtDetalhado";
import Owasp from "@/pages/Owasp";
import Identity from "@/pages/Identity";
import Serilog from "@/pages/Serilog";
import Automapper from "@/pages/Automapper";
import Polly from "@/pages/Polly";
import Hangfire from "@/pages/Hangfire";
import Blazor from "@/pages/Blazor";
import MediatorSourceGen from "@/pages/MediatorSourceGen";
import ProjetoCli from "@/pages/ProjetoCli";
import ProjetoWebapiCrud from "@/pages/ProjetoWebapiCrud";
import ProjetoWorker from "@/pages/ProjetoWorker";
import ProjetoGrpc from "@/pages/ProjetoGrpc";
import ProjetoBlazorTodo from "@/pages/ProjetoBlazorTodo";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location] = useHashLocation();
  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 lg:ml-72">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main>{children}</main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
        <Route path="/o-que-e-csharp" component={OQueECsharp} />
        <Route path="/dotnet-hoje" component={DotnetHoje} />
        <Route path="/hello-world" component={HelloWorld} />
        <Route path="/dotnet-cli" component={DotnetCli} />
        <Route path="/tipos-primitivos" component={TiposPrimitivos} />
        <Route path="/var-dynamic-object" component={VarDynamicObject} />
        <Route path="/operadores" component={Operadores} />
        <Route path="/controle-fluxo" component={ControleFluxo} />
        <Route path="/strings" component={Strings} />
        <Route path="/datetime" component={Datetime} />
        <Route path="/conversoes-parsing" component={ConversoesParsing} />
        <Route path="/nullable-reference" component={NullableReference} />
        <Route path="/nullable-value" component={NullableValue} />
        <Route path="/arrays-multi" component={ArraysMulti} />
        <Route path="/list-t" component={ListT} />
        <Route path="/dictionary" component={Dictionary} />
        <Route path="/hashset" component={Hashset} />
        <Route path="/queue-stack" component={QueueStack} />
        <Route path="/immutable-collections" component={ImmutableCollections} />
        <Route path="/span-memory" component={SpanMemory} />
        <Route path="/readonly-collections" component={ReadonlyCollections} />
        <Route path="/collection-expressions" component={CollectionExpressions} />
        <Route path="/classes" component={Classes} />
        <Route path="/construtores" component={Construtores} />
        <Route path="/properties" component={Properties} />
        <Route path="/heranca" component={Heranca} />
        <Route path="/polimorfismo" component={Polimorfismo} />
        <Route path="/interfaces" component={Interfaces} />
        <Route path="/abstract-sealed" component={AbstractSealed} />
        <Route path="/static-membros" component={StaticMembros} />
        <Route path="/records" component={Records} />
        <Route path="/struct-vs-class" component={StructVsClass} />
        <Route path="/enums-csharp" component={EnumsCsharp} />
        <Route path="/tuples" component={Tuples} />
        <Route path="/genericos-basico" component={GenericosBasico} />
        <Route path="/constraints" component={Constraints} />
        <Route path="/variance" component={Variance} />
        <Route path="/generic-math" component={GenericMath} />
        <Route path="/generic-methods" component={GenericMethods} />
        <Route path="/linq-intro" component={LinqIntro} />
        <Route path="/linq-where-select" component={LinqWhereSelect} />
        <Route path="/linq-ordenacao" component={LinqOrdenacao} />
        <Route path="/linq-join" component={LinqJoin} />
        <Route path="/linq-agregacao" component={LinqAgregacao} />
        <Route path="/linq-deferred" component={LinqDeferred} />
        <Route path="/linq-iqueryable" component={LinqIqueryable} />
        <Route path="/linq-set" component={LinqSet} />
        <Route path="/linq-paginar" component={LinqPaginar} />
        <Route path="/task-vs-thread" component={TaskVsThread} />
        <Route path="/async-await" component={AsyncAwait} />
        <Route path="/configureawait" component={Configureawait} />
        <Route path="/cancellationtoken" component={Cancellationtoken} />
        <Route path="/parallel-tasks" component={ParallelTasks} />
        <Route path="/iasync-enumerable" component={IasyncEnumerable} />
        <Route path="/valuetask" component={Valuetask} />
        <Route path="/async-deadlocks" component={AsyncDeadlocks} />
        <Route path="/pattern-matching" component={PatternMatching} />
        <Route path="/records-with" component={RecordsWith} />
        <Route path="/init-required" component={InitRequired} />
        <Route path="/primary-constructors" component={PrimaryConstructors} />
        <Route path="/top-level-statements" component={TopLevelStatements} />
        <Route path="/raw-strings" component={RawStrings} />
        <Route path="/global-usings" component={GlobalUsings} />
        <Route path="/source-generators-uso" component={SourceGeneratorsUso} />
        <Route path="/try-catch-finally" component={TryCatchFinally} />
        <Route path="/custom-exceptions" component={CustomExceptions} />
        <Route path="/exception-filters" component={ExceptionFilters} />
        <Route path="/aggregate-exception" component={AggregateException} />
        <Route path="/exception-best-practices" component={ExceptionBestPractices} />
        <Route path="/stack-vs-heap" component={StackVsHeap} />
        <Route path="/garbage-collector" component={GarbageCollector} />
        <Route path="/idisposable-using" component={IdisposableUsing} />
        <Route path="/span-perf" component={SpanPerf} />
        <Route path="/arraypool" component={Arraypool} />
        <Route path="/boxing" component={Boxing} />
        <Route path="/ref-struct" component={RefStruct} />
        <Route path="/stackalloc" component={Stackalloc} />
        <Route path="/reflection-basico" component={ReflectionBasico} />
        <Route path="/atributos" component={Atributos} />
        <Route path="/expression-trees" component={ExpressionTrees} />
        <Route path="/dynamic-dlr" component={DynamicDlr} />
        <Route path="/file-directory" component={FileDirectory} />
        <Route path="/streams" component={Streams} />
        <Route path="/json" component={Json} />
        <Route path="/xml" component={Xml} />
        <Route path="/compressao" component={Compressao} />
        <Route path="/httpclient" component={Httpclient} />
        <Route path="/grpc" component={Grpc} />
        <Route path="/websocket" component={Websocket} />
        <Route path="/sockets" component={Sockets} />
        <Route path="/rest-patterns" component={RestPatterns} />
        <Route path="/lock-monitor" component={LockMonitor} />
        <Route path="/mutex-semaphore" component={MutexSemaphore} />
        <Route path="/channels" component={Channels} />
        <Route path="/interlocked" component={Interlocked} />
        <Route path="/parallel-linq" component={ParallelLinq} />
        <Route path="/csproj" component={Csproj} />
        <Route path="/nuget" component={Nuget} />
        <Route path="/roslyn-analyzers" component={RoslynAnalyzers} />
        <Route path="/aot" component={Aot} />
        <Route path="/trimming" component={Trimming} />
        <Route path="/publish-deploy" component={PublishDeploy} />
        <Route path="/xunit" component={Xunit} />
        <Route path="/moq" component={Moq} />
        <Route path="/fluentassertions" component={Fluentassertions} />
        <Route path="/benchmarkdotnet" component={Benchmarkdotnet} />
        <Route path="/aspnet-setup" component={AspnetSetup} />
        <Route path="/middleware" component={Middleware} />
        <Route path="/routing-binding" component={RoutingBinding} />
        <Route path="/controllers-vs-minimal" component={ControllersVsMinimal} />
        <Route path="/di-aspnet" component={DiAspnet} />
        <Route path="/configuration" component={Configuration} />
        <Route path="/jwt-auth" component={JwtAuth} />
        <Route path="/cors" component={Cors} />
        <Route path="/validation" component={Validation} />
        <Route path="/openapi-swagger" component={OpenapiSwagger} />
        <Route path="/ef-setup" component={EfSetup} />
        <Route path="/ef-dbcontext" component={EfDbcontext} />
        <Route path="/ef-migrations" component={EfMigrations} />
        <Route path="/ef-querying" component={EfQuerying} />
        <Route path="/ef-relacionamentos" component={EfRelacionamentos} />
        <Route path="/ef-performance" component={EfPerformance} />
        <Route path="/solid" component={Solid} />
        <Route path="/clean-architecture" component={CleanArchitecture} />
        <Route path="/mediator-cqrs" component={MediatorCqrs} />
        <Route path="/repository-pattern" component={RepositoryPattern} />
        <Route path="/di-padroes" component={DiPadroes} />
        <Route path="/hash-cripto" component={HashCripto} />
        <Route path="/jwt-detalhado" component={JwtDetalhado} />
        <Route path="/owasp" component={Owasp} />
        <Route path="/identity" component={Identity} />
        <Route path="/serilog" component={Serilog} />
        <Route path="/automapper" component={Automapper} />
        <Route path="/polly" component={Polly} />
        <Route path="/hangfire" component={Hangfire} />
        <Route path="/blazor" component={Blazor} />
        <Route path="/mediator-source-gen" component={MediatorSourceGen} />
        <Route path="/projeto-cli" component={ProjetoCli} />
        <Route path="/projeto-webapi-crud" component={ProjetoWebapiCrud} />
        <Route path="/projeto-worker" component={ProjetoWorker} />
        <Route path="/projeto-grpc" component={ProjetoGrpc} />
        <Route path="/projeto-blazor-todo" component={ProjetoBlazorTodo} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter hook={useHashLocation}>
        <Layout>
          <AppRoutes />
        </Layout>
      </WouterRouter>
    </QueryClientProvider>
  );
}
