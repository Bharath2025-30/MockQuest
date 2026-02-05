import {
  PROBLEMS,
  type Problem,
  type SupportedLanguage,
} from "@/data/Problems";
import {
  useEndSession,
  useJoinSession,
  useSessionById,
} from "@/hooks/useSessions";
import { ExecuteCode } from "@/lib/piston";
import {
  getDifficultyBadgeClass,
  getDifficutyName,
  SessionStatus,
} from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useNavigate, useParams } from "react-router";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import CodeEditor from "../sections/panels/CodeEditor";
import OutputTab from "../sections/panels/OutputTab";
import useStreamClient from "@/hooks/useStreamClient";
import { StreamVideo, StreamCall } from "@stream-io/video-react-sdk";
import VideoCallUI from "../sections/sessions/VideoCallU";

const Session = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const {
    data: sessionData,
    isLoading: loadingSession,
    refetch,
  } = useSessionById(sessionId ?? "");
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  console.log(sessionData);

  const session = { ...sessionData };
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  console.log(isHost);
  console.log(user);

  const {call, channel, chatClient, isInitializingCall, streamClient} = useStreamClient(session, loadingSession, isHost, isParticipant);

  // finding problem data based on session problem title
  const problemData: Problem | null | undefined = session?.problemTitle
    ? Object.values(PROBLEMS).find((p) => p.title === session.problemTitle)
    : null;

  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>("javascript");
  const [code, setCode] = useState(
    problemData?.starterCode[selectedLanguage as SupportedLanguage] || "",
  );

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(sessionId ?? "", {
      onSuccess: refetch,
    });
  }, [session, loadingSession, isHost, isParticipant, sessionId]);

  // redirect the participant when sessionEnds
  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  useEffect(() => {
    if (problemData?.starterCode[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);


  const handleLanguageChange = (language: string) => {
    const newLang: SupportedLanguage = language as SupportedLanguage;
    setSelectedLanguage(newLang);
    const starterCode =
      problemData?.starterCode[newLang as SupportedLanguage] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    const result = await ExecuteCode(
      selectedLanguage as SupportedLanguage,
      code,
    );
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (
      confirm(
        "Are you sure you want to end this session? All partcipants will be notified..",
      )
    ) {
      // this will navigate host to dashboard
      endSessionMutation.mutate(sessionId ?? "", {
        onSuccess: () => navigate("/dashboard"),
      });
    }
  };

  return (
    <div className="h-[150vh] flex flex-col ">
      <div className="flex-1">
        <PanelGroup direction={window.innerWidth >= 900 ? "horizontal" : "vertical"}>
          {/* Left panel - CODE editor & problem details */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Problem Description Panel*/}
              <Panel defaultSize={50} minSize={20}>
                {/* Header Section */}
                <div
                  className="h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] 
  [&::-webkit-scrollbar]:hidden"
                >
                  <div className="p-6 bg-base-100 border-b border-base-300">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-3xl font-bold text-base-content">
                          {session?.problemTitle || "Loading..."}
                        </h1>
                        {problemData?.category && (
                          <p className="text-base-content/60 mt-1">
                            {problemData.category}
                          </p>
                        )}
                        <p className="text-base-content/60 mt-2 text-sm">
                          <span className="text-brand-foreground">Host:</span>{" "}
                          {session?.host?.name || "Loading..."} •{" "}
                          <span className="text-success">
                            {session?.participant ? 2 : 1}/2{" "}
                          </span>
                          participants
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          variant={getDifficultyBadgeClass(
                            getDifficutyName(session.problemDifficulty),
                          )}
                        >
                          {getDifficutyName(session.problemDifficulty)}
                        </Badge>
                        {isHost && session?.status === SessionStatus.Active && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-4 h-4" />
                            )}
                            End Session
                          </Button>
                        )}
                        {session?.status === SessionStatus.Completed && (
                          <span className="badge badge-ghost badge-lg">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="h-full p-2 space-y-6">
                    {/* PROBLEM DESC */}
                    <div className="fade-top bg-background backdrop-blur-lg bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                      <h2 className="text-base sm:text-base md:text-xl lg:text-2xl font-bold text-balance inline-block bg-clip-text bg-linear-to-r from-foreground to-foreground dark:to-muted-foreground text-transparent drop-shadow mb-3">
                        Description
                      </h2>
                      <div className="space-y-3 text-sm sm:text-sm md:text-sm leading-relaxed text-secondary-foreground">
                        <p className="text-base-content/90">
                          {problemData?.description.text}
                        </p>
                        {problemData?.description &&
                          problemData?.description.notes.map((note, idx) => (
                            <p key={idx} className="text-base-content/90">
                              {note}
                            </p>
                          ))}
                      </div>
                    </div>

                    {/* EXAMPLES SECTION */}
                    <div className="fade-right bg-background backdrop-blur-lg bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-4 text-balance inline-block bg-clip-text bg-linear-to-r from-foreground to-foreground dark:to-muted-foreground text-transparent drop-shadow">
                        Examples
                      </h2>
                      <div className="space-y-4">
                        {problemData?.examples &&
                          problemData.examples.map((example, idx) => (
                            <div key={idx}>
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-sm sm:text-base md:text-base text-base-content">
                                  Example {idx + 1}
                                </p>
                              </div>
                              <div className="bg-background rounded-lg p-4 font-mono text-xs sm:text-sm md:text-sm space-y-1.5">
                                <div className="flex gap-2">
                                  <span className="text-primary font-bold min-w-[70px]">
                                    Input:
                                  </span>
                                  <span>{example.input}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-brand font-bold min-w-[70px]">
                                    Output:
                                  </span>
                                  <span>{example.output}</span>
                                </div>
                                {example.explanation && (
                                  <div className="pt-2 border-t border-base-300 mt-2 text-gray-500">
                                    <span className="text-base-content/60 font-sans text-xs sm:text-sm">
                                      <span className="font-semibold">
                                        Explanation:
                                      </span>{" "}
                                      {example.explanation}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* CONSTRAINTS */}
                    <div className="fade-bottom bg-background backdrop-blur-lg bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-4 text-balance inline-block bg-clip-text bg-linear-to-r from-foreground to-foreground dark:to-muted-foreground text-transparent drop-shadow">
                        Constraints
                      </h2>
                      <ul className="space-y-2 text-sm sm:text-base md:text-sm text-base-content/90">
                        {problemData?.constraints &&
                          problemData.constraints.map((constraint, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <code>{constraint}</code>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle
                className="h-1 cursor-col-resize 
                bg-brand/40
                hover:bg-brand-foreground 
                rounded
                hover:drop-shadow-[0_0_3px_var(--brand-foreground/30)] 
                transition-all duration-300"
              />

              {/* Code Editor Panel */}

              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  {/* Code Editor Panel */}
                  <Panel defaultSize={90} minSize={30}>
                    <CodeEditor
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={setCode}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle
                    className="h-1 cursor-col-resize 
                bg-brand/40
                hover:bg-brand-foreground 
                rounded
                hover:drop-shadow-[0_0_3px_var(--brand-foreground/30)] 
                transition-all duration-300"
                  />

                  {/* Output Tab Panel */}
                  <Panel defaultSize={10} minSize={10}>
                    <OutputTab output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle
            className="w-1 cursor-col-resize 
                bg-brand/40
                hover:bg-brand-foreground 
                rounded
                hover:drop-shadow-[0_0_3px_var(--brand-foreground/30)] 
                transition-all duration-300"
          />

          {/* Video calling panel */}
          <Panel defaultSize={50} minSize={30}>
            {/* <div className="h-full bg-base-200 p-4 overflow-auto">
                {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="card bg-base-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-base-content/70">Unable to connect to the video call</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div> */}
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default Session;
