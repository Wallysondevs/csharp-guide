import { useState, useEffect, lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const HelloExplicado = lazy(() => import("@/pages/HelloExplicado"));
const HistoriaCsharp = lazy(() => import("@/pages/HistoriaCsharp"));
const DotnetRuntime = lazy(() => import("@/pages/DotnetRuntime"));
const InstalacaoSdk = lazy(() => import("@/pages/InstalacaoSdk"));
const DotnetCli = lazy(() => import("@/pages/DotnetCli"));
const PrimeiroPrograma = lazy(() => import("@/pages/PrimeiroPrograma"));
const TopLevelStatements = lazy(() => import("@/pages/TopLevelStatements"));
const CsprojAnatomy = lazy(() => import("@/pages/CsprojAnatomy"));
const NamespacesUsing = lazy(() => import("@/pages/NamespacesUsing"));
const ComentariosXmldoc = lazy(() => import("@/pages/ComentariosXmldoc"));
const IdeVscodeRider = lazy(() => import("@/pages/IdeVscodeRider"));
const DebugBasico = lazy(() => import("@/pages/DebugBasico"));
const BuildVsRun = lazy(() => import("@/pages/BuildVsRun"));
const VariaveisTipos = lazy(() => import("@/pages/VariaveisTipos"));
const TiposValor = lazy(() => import("@/pages/TiposValor"));
const TiposReferencia = lazy(() => import("@/pages/TiposReferencia"));
const Operadores = lazy(() => import("@/pages/Operadores"));
const ConversoesCast = lazy(() => import("@/pages/ConversoesCast"));
const StringsFundamentos = lazy(() => import("@/pages/StringsFundamentos"));
const ConsoleIo = lazy(() => import("@/pages/ConsoleIo"));
const CondicionaisIfSwitch = lazy(() => import("@/pages/CondicionaisIfSwitch"));
const Loops = lazy(() => import("@/pages/Loops"));
const Arrays = lazy(() => import("@/pages/Arrays"));
const MetodosFuncoes = lazy(() => import("@/pages/MetodosFuncoes"));
const ParametrosOutRef = lazy(() => import("@/pages/ParametrosOutRef"));
const ClassesObjetos = lazy(() => import("@/pages/ClassesObjetos"));
const Propriedades = lazy(() => import("@/pages/Propriedades"));
const Construtores = lazy(() => import("@/pages/Construtores"));
const ThisBase = lazy(() => import("@/pages/ThisBase"));
const Encapsulamento = lazy(() => import("@/pages/Encapsulamento"));
const Heranca = lazy(() => import("@/pages/Heranca"));
const Polimorfismo = lazy(() => import("@/pages/Polimorfismo"));
const ClassesAbstract = lazy(() => import("@/pages/ClassesAbstract"));
const Interfaces = lazy(() => import("@/pages/Interfaces"));
const SealedVirtual = lazy(() => import("@/pages/SealedVirtual"));
const ClassesStaticPartial = lazy(() => import("@/pages/ClassesStaticPartial"));
const RecordsVsClass = lazy(() => import("@/pages/RecordsVsClass"));
const Enums = lazy(() => import("@/pages/Enums"));
const Structs = lazy(() => import("@/pages/Structs"));
const Tuplas = lazy(() => import("@/pages/Tuplas"));
const AnonymousTypes = lazy(() => import("@/pages/AnonymousTypes"));
const NullableReference = lazy(() => import("@/pages/NullableReference"));
const ValueVsReference = lazy(() => import("@/pages/ValueVsReference"));
const BoxingUnboxing = lazy(() => import("@/pages/BoxingUnboxing"));
const Immutable = lazy(() => import("@/pages/Immutable"));
const InitOnlyRequired = lazy(() => import("@/pages/InitOnlyRequired"));
const Deconstruction = lazy(() => import("@/pages/Deconstruction"));
const Indexers = lazy(() => import("@/pages/Indexers"));
const PatternMatching = lazy(() => import("@/pages/PatternMatching"));
const CsharpVersionsNovidades = lazy(() => import("@/pages/CsharpVersionsNovidades"));
const FileScopedNamespaces = lazy(() => import("@/pages/FileScopedNamespaces"));
const GlobalUsing = lazy(() => import("@/pages/GlobalUsing"));
const GenericsBasico = lazy(() => import("@/pages/GenericsBasico"));
const GenericsRestricoesWhere = lazy(() => import("@/pages/GenericsRestricoesWhere"));
const GenericsMetodos = lazy(() => import("@/pages/GenericsMetodos"));
const GenericsCovariance = lazy(() => import("@/pages/GenericsCovariance"));
const DefaultKeyword = lazy(() => import("@/pages/DefaultKeyword"));
const GenericMath = lazy(() => import("@/pages/GenericMath"));
const PrimaryConstructors = lazy(() => import("@/pages/PrimaryConstructors"));
const CollectionExpressions = lazy(() => import("@/pages/CollectionExpressions"));
const AliasAnyType = lazy(() => import("@/pages/AliasAnyType"));
const ArrayVsList = lazy(() => import("@/pages/ArrayVsList"));
const ListDetalhado = lazy(() => import("@/pages/ListDetalhado"));
const DictionaryHashtable = lazy(() => import("@/pages/DictionaryHashtable"));
const Hashset = lazy(() => import("@/pages/Hashset"));
const QueueStack = lazy(() => import("@/pages/QueueStack"));
const LinkedList = lazy(() => import("@/pages/LinkedList"));
const ImmutableCollections = lazy(() => import("@/pages/ImmutableCollections"));
const ConcurrentCollections = lazy(() => import("@/pages/ConcurrentCollections"));
const SpanMemory = lazy(() => import("@/pages/SpanMemory"));
const LinqIntro = lazy(() => import("@/pages/LinqIntro"));
const LinqWhereSelect = lazy(() => import("@/pages/LinqWhereSelect"));
const LinqOrderbyGroupby = lazy(() => import("@/pages/LinqOrderbyGroupby"));
const LinqJoins = lazy(() => import("@/pages/LinqJoins"));
const LinqAggregates = lazy(() => import("@/pages/LinqAggregates"));
const LinqSetOperations = lazy(() => import("@/pages/LinqSetOperations"));
const LinqDeferredExecution = lazy(() => import("@/pages/LinqDeferredExecution"));
const LinqQuerySyntax = lazy(() => import("@/pages/LinqQuerySyntax"));
const IenumerableVsIqueryable = lazy(() => import("@/pages/IenumerableVsIqueryable"));
const Stringbuilder = lazy(() => import("@/pages/Stringbuilder"));
const StringInterpolationFormatacao = lazy(() => import("@/pages/StringInterpolationFormatacao"));
const Regex = lazy(() => import("@/pages/Regex"));
const EncodingUnicode = lazy(() => import("@/pages/EncodingUnicode"));
const FileIoFundamentos = lazy(() => import("@/pages/FileIoFundamentos"));
const StreamsReaders = lazy(() => import("@/pages/StreamsReaders"));
const JsonSystemtextjson = lazy(() => import("@/pages/JsonSystemtextjson"));
const XmlLinq = lazy(() => import("@/pages/XmlLinq"));
const PathDirectory = lazy(() => import("@/pages/PathDirectory"));
const ThreadsVsTasks = lazy(() => import("@/pages/ThreadsVsTasks"));
const AsyncAwaitFundamentos = lazy(() => import("@/pages/AsyncAwaitFundamentos"));
const TaskOfT = lazy(() => import("@/pages/TaskOfT"));
const Configureawait = lazy(() => import("@/pages/Configureawait"));
const CancellationToken = lazy(() => import("@/pages/CancellationToken"));
const ParallelForeach = lazy(() => import("@/pages/ParallelForeach"));
const Plinq = lazy(() => import("@/pages/Plinq"));
const ChannelsPipelines = lazy(() => import("@/pages/ChannelsPipelines"));
const AsyncStreamsIasyncenumerable = lazy(() => import("@/pages/AsyncStreamsIasyncenumerable"));
const Valuetask = lazy(() => import("@/pages/Valuetask"));
const SincronizacaoLocks = lazy(() => import("@/pages/SincronizacaoLocks"));
const Semaphore = lazy(() => import("@/pages/Semaphore"));
const TryCatchFinally = lazy(() => import("@/pages/TryCatchFinally"));
const ThrowRethrow = lazy(() => import("@/pages/ThrowRethrow"));
const CustomExceptions = lazy(() => import("@/pages/CustomExceptions"));
const ExceptionFilters = lazy(() => import("@/pages/ExceptionFilters"));
const AggregateException = lazy(() => import("@/pages/AggregateException"));
const ReflectionFundamentos = lazy(() => import("@/pages/ReflectionFundamentos"));
const AttributesCustomizados = lazy(() => import("@/pages/AttributesCustomizados"));
const DynamicKeyword = lazy(() => import("@/pages/DynamicKeyword"));
const ExpressionTrees = lazy(() => import("@/pages/ExpressionTrees"));
const SourceGenerators = lazy(() => import("@/pages/SourceGenerators"));
const RoslynAnalyzers = lazy(() => import("@/pages/RoslynAnalyzers"));
const EfcoreIntro = lazy(() => import("@/pages/EfcoreIntro"));
const EfcoreDbcontext = lazy(() => import("@/pages/EfcoreDbcontext"));
const EfcoreEntities = lazy(() => import("@/pages/EfcoreEntities"));
const EfcoreMigrations = lazy(() => import("@/pages/EfcoreMigrations"));
const EfcoreQueries = lazy(() => import("@/pages/EfcoreQueries"));
const EfcoreRelacionamentos = lazy(() => import("@/pages/EfcoreRelacionamentos"));
const EfcoreTransacoes = lazy(() => import("@/pages/EfcoreTransacoes"));
const EfcorePerformance = lazy(() => import("@/pages/EfcorePerformance"));
const EfcoreRawSql = lazy(() => import("@/pages/EfcoreRawSql"));
const EfcoreInMemory = lazy(() => import("@/pages/EfcoreInMemory"));
const AspnetIntro = lazy(() => import("@/pages/AspnetIntro"));
const MinimalApi = lazy(() => import("@/pages/MinimalApi"));
const MvcControllers = lazy(() => import("@/pages/MvcControllers"));
const RazorPages = lazy(() => import("@/pages/RazorPages"));
const BlazorServer = lazy(() => import("@/pages/BlazorServer"));
const BlazorWasm = lazy(() => import("@/pages/BlazorWasm"));
const Middleware = lazy(() => import("@/pages/Middleware"));
const DependencyInjection = lazy(() => import("@/pages/DependencyInjection"));
const ConfigurationOptions = lazy(() => import("@/pages/ConfigurationOptions"));
const Routing = lazy(() => import("@/pages/Routing"));
const ModelValidation = lazy(() => import("@/pages/ModelValidation"));
const AuthJwt = lazy(() => import("@/pages/AuthJwt"));
const IdentityAspnet = lazy(() => import("@/pages/IdentityAspnet"));
const OpenapiSwagger = lazy(() => import("@/pages/OpenapiSwagger"));
const Signalr = lazy(() => import("@/pages/Signalr"));
const Solid = lazy(() => import("@/pages/Solid"));
const RepositoryPattern = lazy(() => import("@/pages/RepositoryPattern"));
const MediatorCqrs = lazy(() => import("@/pages/MediatorCqrs"));
const HttpclientTyped = lazy(() => import("@/pages/HttpclientTyped"));
const GrpcAspnet = lazy(() => import("@/pages/GrpcAspnet"));
const Serilog = lazy(() => import("@/pages/Serilog"));
const Benchmarkdotnet = lazy(() => import("@/pages/Benchmarkdotnet"));
const NativeAotTrimming = lazy(() => import("@/pages/NativeAotTrimming"));
const PublishDeploy = lazy(() => import("@/pages/PublishDeploy"));
const XunitMoq = lazy(() => import("@/pages/XunitMoq"));
const ProjetoFinalWebapi = lazy(() => import("@/pages/ProjetoFinalWebapi"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location] = useHashLocation();
  useEffect(() => { setIsSidebarOpen(false); window.scrollTo(0, 0); }, [location]);
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
        <Route path="/hello-explicado" component={HelloExplicado} />
        <Route path="/historia-csharp" component={HistoriaCsharp} />
        <Route path="/dotnet-runtime" component={DotnetRuntime} />
        <Route path="/instalacao-sdk" component={InstalacaoSdk} />
        <Route path="/dotnet-cli" component={DotnetCli} />
        <Route path="/primeiro-programa" component={PrimeiroPrograma} />
        <Route path="/top-level-statements" component={TopLevelStatements} />
        <Route path="/csproj-anatomy" component={CsprojAnatomy} />
        <Route path="/namespaces-using" component={NamespacesUsing} />
        <Route path="/comentarios-xmldoc" component={ComentariosXmldoc} />
        <Route path="/ide-vscode-rider" component={IdeVscodeRider} />
        <Route path="/debug-basico" component={DebugBasico} />
        <Route path="/build-vs-run" component={BuildVsRun} />
        <Route path="/variaveis-tipos" component={VariaveisTipos} />
        <Route path="/tipos-valor" component={TiposValor} />
        <Route path="/tipos-referencia" component={TiposReferencia} />
        <Route path="/operadores" component={Operadores} />
        <Route path="/conversoes-cast" component={ConversoesCast} />
        <Route path="/strings-fundamentos" component={StringsFundamentos} />
        <Route path="/console-io" component={ConsoleIo} />
        <Route path="/condicionais-if-switch" component={CondicionaisIfSwitch} />
        <Route path="/loops" component={Loops} />
        <Route path="/arrays" component={Arrays} />
        <Route path="/metodos-funcoes" component={MetodosFuncoes} />
        <Route path="/parametros-out-ref" component={ParametrosOutRef} />
        <Route path="/classes-objetos" component={ClassesObjetos} />
        <Route path="/propriedades" component={Propriedades} />
        <Route path="/construtores" component={Construtores} />
        <Route path="/this-base" component={ThisBase} />
        <Route path="/encapsulamento" component={Encapsulamento} />
        <Route path="/heranca" component={Heranca} />
        <Route path="/polimorfismo" component={Polimorfismo} />
        <Route path="/classes-abstract" component={ClassesAbstract} />
        <Route path="/interfaces" component={Interfaces} />
        <Route path="/sealed-virtual" component={SealedVirtual} />
        <Route path="/classes-static-partial" component={ClassesStaticPartial} />
        <Route path="/records-vs-class" component={RecordsVsClass} />
        <Route path="/enums" component={Enums} />
        <Route path="/structs" component={Structs} />
        <Route path="/tuplas" component={Tuplas} />
        <Route path="/anonymous-types" component={AnonymousTypes} />
        <Route path="/nullable-reference" component={NullableReference} />
        <Route path="/value-vs-reference" component={ValueVsReference} />
        <Route path="/boxing-unboxing" component={BoxingUnboxing} />
        <Route path="/immutable" component={Immutable} />
        <Route path="/init-only-required" component={InitOnlyRequired} />
        <Route path="/deconstruction" component={Deconstruction} />
        <Route path="/indexers" component={Indexers} />
        <Route path="/pattern-matching" component={PatternMatching} />
        <Route path="/csharp-versions-novidades" component={CsharpVersionsNovidades} />
        <Route path="/file-scoped-namespaces" component={FileScopedNamespaces} />
        <Route path="/global-using" component={GlobalUsing} />
        <Route path="/generics-basico" component={GenericsBasico} />
        <Route path="/generics-restricoes-where" component={GenericsRestricoesWhere} />
        <Route path="/generics-metodos" component={GenericsMetodos} />
        <Route path="/generics-covariance" component={GenericsCovariance} />
        <Route path="/default-keyword" component={DefaultKeyword} />
        <Route path="/generic-math" component={GenericMath} />
        <Route path="/primary-constructors" component={PrimaryConstructors} />
        <Route path="/collection-expressions" component={CollectionExpressions} />
        <Route path="/alias-any-type" component={AliasAnyType} />
        <Route path="/array-vs-list" component={ArrayVsList} />
        <Route path="/list-detalhado" component={ListDetalhado} />
        <Route path="/dictionary-hashtable" component={DictionaryHashtable} />
        <Route path="/hashset" component={Hashset} />
        <Route path="/queue-stack" component={QueueStack} />
        <Route path="/linked-list" component={LinkedList} />
        <Route path="/immutable-collections" component={ImmutableCollections} />
        <Route path="/concurrent-collections" component={ConcurrentCollections} />
        <Route path="/span-memory" component={SpanMemory} />
        <Route path="/linq-intro" component={LinqIntro} />
        <Route path="/linq-where-select" component={LinqWhereSelect} />
        <Route path="/linq-orderby-groupby" component={LinqOrderbyGroupby} />
        <Route path="/linq-joins" component={LinqJoins} />
        <Route path="/linq-aggregates" component={LinqAggregates} />
        <Route path="/linq-set-operations" component={LinqSetOperations} />
        <Route path="/linq-deferred-execution" component={LinqDeferredExecution} />
        <Route path="/linq-query-syntax" component={LinqQuerySyntax} />
        <Route path="/ienumerable-vs-iqueryable" component={IenumerableVsIqueryable} />
        <Route path="/stringbuilder" component={Stringbuilder} />
        <Route path="/string-interpolation-formatacao" component={StringInterpolationFormatacao} />
        <Route path="/regex" component={Regex} />
        <Route path="/encoding-unicode" component={EncodingUnicode} />
        <Route path="/file-io-fundamentos" component={FileIoFundamentos} />
        <Route path="/streams-readers" component={StreamsReaders} />
        <Route path="/json-systemtextjson" component={JsonSystemtextjson} />
        <Route path="/xml-linq" component={XmlLinq} />
        <Route path="/path-directory" component={PathDirectory} />
        <Route path="/threads-vs-tasks" component={ThreadsVsTasks} />
        <Route path="/async-await-fundamentos" component={AsyncAwaitFundamentos} />
        <Route path="/task-of-t" component={TaskOfT} />
        <Route path="/configureawait" component={Configureawait} />
        <Route path="/cancellation-token" component={CancellationToken} />
        <Route path="/parallel-foreach" component={ParallelForeach} />
        <Route path="/plinq" component={Plinq} />
        <Route path="/channels-pipelines" component={ChannelsPipelines} />
        <Route path="/async-streams-iasyncenumerable" component={AsyncStreamsIasyncenumerable} />
        <Route path="/valuetask" component={Valuetask} />
        <Route path="/sincronizacao-locks" component={SincronizacaoLocks} />
        <Route path="/semaphore" component={Semaphore} />
        <Route path="/try-catch-finally" component={TryCatchFinally} />
        <Route path="/throw-rethrow" component={ThrowRethrow} />
        <Route path="/custom-exceptions" component={CustomExceptions} />
        <Route path="/exception-filters" component={ExceptionFilters} />
        <Route path="/aggregate-exception" component={AggregateException} />
        <Route path="/reflection-fundamentos" component={ReflectionFundamentos} />
        <Route path="/attributes-customizados" component={AttributesCustomizados} />
        <Route path="/dynamic-keyword" component={DynamicKeyword} />
        <Route path="/expression-trees" component={ExpressionTrees} />
        <Route path="/source-generators" component={SourceGenerators} />
        <Route path="/roslyn-analyzers" component={RoslynAnalyzers} />
        <Route path="/efcore-intro" component={EfcoreIntro} />
        <Route path="/efcore-dbcontext" component={EfcoreDbcontext} />
        <Route path="/efcore-entities" component={EfcoreEntities} />
        <Route path="/efcore-migrations" component={EfcoreMigrations} />
        <Route path="/efcore-queries" component={EfcoreQueries} />
        <Route path="/efcore-relacionamentos" component={EfcoreRelacionamentos} />
        <Route path="/efcore-transacoes" component={EfcoreTransacoes} />
        <Route path="/efcore-performance" component={EfcorePerformance} />
        <Route path="/efcore-raw-sql" component={EfcoreRawSql} />
        <Route path="/efcore-in-memory" component={EfcoreInMemory} />
        <Route path="/aspnet-intro" component={AspnetIntro} />
        <Route path="/minimal-api" component={MinimalApi} />
        <Route path="/mvc-controllers" component={MvcControllers} />
        <Route path="/razor-pages" component={RazorPages} />
        <Route path="/blazor-server" component={BlazorServer} />
        <Route path="/blazor-wasm" component={BlazorWasm} />
        <Route path="/middleware" component={Middleware} />
        <Route path="/dependency-injection" component={DependencyInjection} />
        <Route path="/configuration-options" component={ConfigurationOptions} />
        <Route path="/routing" component={Routing} />
        <Route path="/model-validation" component={ModelValidation} />
        <Route path="/auth-jwt" component={AuthJwt} />
        <Route path="/identity-aspnet" component={IdentityAspnet} />
        <Route path="/openapi-swagger" component={OpenapiSwagger} />
        <Route path="/signalr" component={Signalr} />
        <Route path="/solid" component={Solid} />
        <Route path="/repository-pattern" component={RepositoryPattern} />
        <Route path="/mediator-cqrs" component={MediatorCqrs} />
        <Route path="/httpclient-typed" component={HttpclientTyped} />
        <Route path="/grpc-aspnet" component={GrpcAspnet} />
        <Route path="/serilog" component={Serilog} />
        <Route path="/benchmarkdotnet" component={Benchmarkdotnet} />
        <Route path="/native-aot-trimming" component={NativeAotTrimming} />
        <Route path="/publish-deploy" component={PublishDeploy} />
        <Route path="/xunit-moq" component={XunitMoq} />
        <Route path="/projeto-final-webapi" component={ProjetoFinalWebapi} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Router />
    </WouterRouter>
  );
}

export default App;
