import { useState } from "react";
import { TabButton } from "@/components/TabButton";
import { MorningSection } from "@/components/sections/MorningSection";
import { DaySection } from "@/components/sections/DaySection";
import { EveningSection } from "@/components/sections/EveningSection";
import { GoalsSection } from "@/components/sections/GoalsSection";
import { Sun, Calendar, Moon, Target } from "lucide-react";
import { DayProgressHeader } from "@/components/DayProgressHeader";
import { Onboarding } from "@/components/Onboarding";
import { useEveningMode } from "@/hooks/useEveningMode";

type TabType = "morning" | "day" | "evening" | "goals";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("morning");
  useEveningMode();

  return (
    <div className="min-h-screen bg-background">
      <Onboarding />
      {/* Main content */}
      <main className="container max-w-lg mx-auto px-4 pb-28 pt-8">
        <DayProgressHeader />
        {activeTab === "morning" && <MorningSection />}
        {activeTab === "day" && <DaySection />}
        {activeTab === "evening" && <EveningSection />}
        {activeTab === "goals" && <GoalsSection />}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border">
        <div className="container max-w-lg mx-auto px-4 py-3">
          <div className="flex gap-2">
            <TabButton
              icon={Sun}
              label="Утро"
              active={activeTab === "morning"}
              onClick={() => setActiveTab("morning")}
            />
            <TabButton
              icon={Calendar}
              label="День"
              active={activeTab === "day"}
              onClick={() => setActiveTab("day")}
            />
            <TabButton
              icon={Moon}
              label="Вечер"
              active={activeTab === "evening"}
              onClick={() => setActiveTab("evening")}
            />
            <TabButton
              icon={Target}
              label="Цели"
              active={activeTab === "goals"}
              onClick={() => setActiveTab("goals")}
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Index;
