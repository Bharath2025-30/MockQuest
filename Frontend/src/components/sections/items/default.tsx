import {
  BlocksIcon,
  EclipseIcon,
  FastForwardIcon,
  LanguagesIcon,
  MonitorSmartphoneIcon,
  RocketIcon,
  ScanFaceIcon,
  SquarePenIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Item, ItemDescription,ItemIcon, ItemTitle } from "../../ui/item";
import { Section } from "../../ui/section";

interface ItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface ItemsProps {
  title?: string;
  items?: ItemProps[] | false;
  className?: string;
}

export default function Items({
  title = "Everything you need. Nothing you don't.",
  items = [
  {
    title: "Crystal-clear video calls",
    description: "HD video conferencing for smooth and professional interview experiences",
    icon: <ScanFaceIcon className="size-5 stroke-1" />,
  },
  {
    title: "Live code editor",
    description: "Collaborative coding in real time with built-in compiler support",
    icon: <SquarePenIcon className="size-5 stroke-1" />,
  },
  {
    title: "Easy collaboration",
    description: "Pair programming, instant chat, and interactive reactions",
    icon: <BlocksIcon className="size-5 stroke-1" />,
  },
  {
    title: "AI assistance",
    description: "Smart interview guidance with instant feedback and insights.",
    icon: <LanguagesIcon className="size-5 stroke-1" />,
  },
  {
    title: "Top-level performance",
    description: "Optimized for lightning-fast load times and seamless interactions",
    icon: <FastForwardIcon className="size-5 stroke-1" />,
  },
  {
    title: "Responsive design",
    description: "Works flawlessly across all devices and screen sizes",
    icon: <MonitorSmartphoneIcon className="size-5 stroke-1" />,
  },
  {
    title: "Flexible themes",
    description: "Effortless switching between light and dark modes for comfort",
    icon: <EclipseIcon className="size-5 stroke-1" />,
  },
  {
    title: "Frequent updates",
    description: "Regular improvements to ensure a seamless and reliable experience",
    icon: <RocketIcon className="size-5 stroke-1" />,
  },
],
  className,
}: ItemsProps) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-6 sm:gap-20">
        <h2 className="max-w-[560px] text-center text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
          {title}
        </h2>
        {items !== false && items.length > 0 && (
          <div className="grid auto-rows-fr grid-cols-2 gap-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {items.map((item, index) => (
              <Item key={index}>
                <ItemTitle className="flex items-center gap-2">
                  <ItemIcon>{item.icon}</ItemIcon>
                  {item.title}
                </ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </Item>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
