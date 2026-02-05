import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";


function WelcomeSection(
    {
        title = `Welcome back,`,
        description = "Ready to level up your coding skills?",
        badge = (
            <Badge variant="outline" className="animate-appear">
            <span className="text-card-foreground">Grind Hard</span>
            <ArrowRightIcon className="size-3" />
            </Badge>
        ),
        onCreateSession
    }: any
){
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden w-full">
      <div className="max-w-container mx-auto flex flex-col gap-4 sm:gap-8 pt-4">
        <div className="flex flex-col items-center text-center">
          {badge !== false && badge}
        </div>
        <div className="flex flex-col items-center gap-4 text-center sm:gap-8">
            <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-2xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-4xl sm:leading-tight md:text-6xl md:leading-tight">
                <SparklesIcon className="w-6 h-6 text-white" />
                {title} {user?.firstName} !
            </h1>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-8">
                 <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-medium text-balance opacity-0 delay-100 sm:text">
                {description}
            </p>
          
          <Button
                  variant="default"
                  className="cursor-pointer"
                  onClick={onCreateSession}
                >
                 <ZapIcon className="w-4 h-4 mr-1" />
                  <span>Create Session</span>
                  <ArrowRightIcon className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
           
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;  