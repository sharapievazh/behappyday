import { useState } from "react";
import { MentorMessage } from "@/components/MentorMessage";
import { RitualStep } from "@/components/RitualStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Target, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const MENTOR_ENCOURAGEMENTS = [
  "Отметила? Отлично! Каждый шаг — победа.",
  "Молодец! Это твой шаг к цели.",
  "Прими этот момент — он важен.",
  "Каждое маленькое действие создаёт большой результат.",
];

export function DaySection() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Главная задача дня", completed: false },
    { id: "2", title: "Мини-задача 1", completed: false },
    { id: "3", title: "Мини-задача 2", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [currentEncouragement, setCurrentEncouragement] = useState("");

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const handleTaskChange = (id: string, completed: boolean) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));
    
    if (completed) {
      const randomMessage = MENTOR_ENCOURAGEMENTS[Math.floor(Math.random() * MENTOR_ENCOURAGEMENTS.length)];
      setCurrentEncouragement(randomMessage);
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 3000);
    }
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), title: newTask.trim(), completed: false }]);
      setNewTask("");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-primary">
          <Target className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Твой день</span>
        </div>
        <h1 className="font-serif text-3xl text-foreground">
          Фокус на важном
        </h1>
      </div>

      <MentorMessage message="Сосредоточься на важном. Малое = сделано, большое = под контролем." />

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Прогресс дня</span>
          <span className="font-medium text-foreground">{completedCount} из {tasks.length}</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Задачи на сегодня
        </h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          {tasks.map((task, index) => (
            <RitualStep
              key={task.id}
              id={task.id}
              title={task.title}
              checked={task.completed}
              onCheckedChange={(checked) => handleTaskChange(task.id, checked)}
              delay={index * 100}
            />
          ))}
        </div>
      </div>

      {/* Add task */}
      <div className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Добавить задачу..."
          className="flex-1 h-12 rounded-xl border-border bg-card"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <Button
          onClick={addTask}
          size="icon"
          className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Encouragement popup */}
      {showEncouragement && (
        <div className="fixed bottom-24 left-4 right-4 animate-slide-up">
          <MentorMessage message={currentEncouragement} />
        </div>
      )}
    </div>
  );
}
