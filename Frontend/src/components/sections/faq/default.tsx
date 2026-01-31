import {Link} from "react-router-dom";
import type { ReactNode } from "react";


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Section } from "../../ui/section";

interface FAQItemProps {
  question: string;
  answer: ReactNode;
  value?: string;
}

interface FAQProps {
  title?: string;
  items?: FAQItemProps[] | false;
  className?: string;
}

export default function FAQ({
  title = "Questions and Answers",
  items = [
    {
      question: "Why is preparing with MockQuest critical for your career?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            In today&apos;s competitive job market, standing out in interviews
            is harder than ever. While anyone can apply for a role, the
            candidates who practice effectively are the ones who succeed.
          </p>
          <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            MockQuest helps you sharpen your skills with realistic mock
            interviews, live coding sessions, and instant feedback — giving you
            the confidence to perform at your best.
          </p>
        </>
      ),
    },
    {
      question: "Why use MockQuest instead of generic interview prep tools?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[600px]">
            Generic tools often provide static questions or limited practice
            scenarios. They don&apos;t replicate the real interview environment
            and leave you underprepared.
          </p>
          <p className="text-muted-foreground mb-4 max-w-[600px]">
            With MockQuest, you get HD video calls, a collaborative live code
            editor, and AI-powered guidance — all designed to simulate
            real-world interviews.
          </p>
          <p className="text-muted-foreground mb-4 max-w-[600px]">
            What might seem like enough preparation elsewhere could leave gaps
            in your readiness. MockQuest ensures you practice in conditions that
            mirror actual interviews, helping you scale your confidence and
            adaptability.
          </p>
        </>
      ),
    },
    {
      question: "How is MockQuest different from other interview platforms?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            MockQuest stands out with its combination of crystal-clear video
            calls, real-time collaborative coding, and AI-driven feedback.
          </p>
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            Every feature is designed to make your practice sessions feel like
            the real thing, so you&apos;re never caught off guard in an actual
            interview.
          </p>
          <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            Unlike platforms that rely on outdated formats or limited question
            banks, MockQuest evolves with industry trends and best practices to
            keep you ahead.
          </p>
        </>
      ),
    },
    {
      question: 'What does it mean when we say "The practice is yours"?',
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            MockQuest gives you full control over your interview preparation
            journey. You can practice unlimited sessions, revisit past attempts,
            and track your progress without restrictions.
          </p>
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            Whether you&apos;re preparing for technical, behavioral, or system
            design interviews, MockQuest adapts to your needs — no hidden fees
            or locked features.
          </p>
        </>
      ),
    },
    {
      question: "Are practice templates and resources included?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[580px]">
          Yes! MockQuest provides curated interview question sets, coding
          challenges, and behavioral templates — all included to help you
          prepare comprehensively.
        </p>
      ),
    },
    {
      question: "Is MockQuest free to use?",
      answer: (
        <>
          {" "}
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            {" "}
            Yes! MockQuest offers free access so you can start practicing
            interviews right away. You can experience HD video calls, live
            coding sessions, and collaboration tools without any upfront
            cost.{" "}
          </p>{" "}
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            {" "}
            Advanced features and premium resources are available through our
            paid plans, but the core platform is free to help everyone prepare
            effectively.{" "}
          </p>{" "}
        </>
      ),
    },
  ],
  className,
}: FAQProps) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <h2 className="text-center text-3xl font-semibold sm:text-5xl">
          {title}
        </h2>
        {items !== false && items.length > 0 && (
          <Accordion type="single" collapsible className="w-full max-w-[800px]">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={item.value || `item-${index + 1}`}
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Section>
  );
}
