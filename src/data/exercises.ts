import kegelImg from "@/assets/exercises/kegel.jpg";
import bridgeImg from "@/assets/exercises/bridge.jpg";
import catCowImg from "@/assets/exercises/cat-cow.jpg";
import butterflyImg from "@/assets/exercises/butterfly.jpg";
import squatsImg from "@/assets/exercises/squats.jpg";
import breathingImg from "@/assets/exercises/breathing.jpg";

export interface Exercise {
  id: string;
  title: string;
  description: string;
  defaultReps: number;
  image: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: "kegel",
    title: "Упражнения Кегеля",
    description: "Сжимай и расслабляй мышцы тазового дна, удерживая 3–5 секунд.",
    defaultReps: 30,
    image: kegelImg,
  },
  {
    id: "breathing",
    title: "Диафрагмальное дыхание",
    description: "Глубокий вдох животом, медленный выдох. Расслабляет тазовое дно.",
    defaultReps: 20,
    image: breathingImg,
  },
  {
    id: "bridge",
    title: "Мостик (полумост)",
    description: "Лёжа на спине, поднимай таз вверх, удерживай 2–3 секунды.",
    defaultReps: 25,
    image: bridgeImg,
  },
  {
    id: "cat-cow",
    title: "Кошка-корова",
    description: "Плавный прогиб и округление спины на четвереньках.",
    defaultReps: 20,
    image: catCowImg,
  },
  {
    id: "butterfly",
    title: "Бабочка",
    description: "Сидя, соедини стопы и мягко опускай колени к полу.",
    defaultReps: 30,
    image: butterflyImg,
  },
  {
    id: "squats",
    title: "Приседания плие",
    description: "Широкая стойка, носки врозь, плавно приседай и поднимайся.",
    defaultReps: 25,
    image: squatsImg,
  },
];
