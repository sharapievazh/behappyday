import kegelImg from "@/assets/exercises/kegel.jpg";
import bridgeImg from "@/assets/exercises/bridge.jpg";
import bridgeImg2 from "@/assets/exercises/bridge-2.jpg";
import catCowImg from "@/assets/exercises/cat-cow.jpg";
import catCowImg2 from "@/assets/exercises/cat-cow-2.jpg";
import butterflyImg from "@/assets/exercises/butterfly.jpg";
import butterflyImg2 from "@/assets/exercises/butterfly-2.jpg";
import squatsImg from "@/assets/exercises/squats.jpg";
import squatsImg2 from "@/assets/exercises/squats-2.jpg";
import breathingImg from "@/assets/exercises/breathing.jpg";
import lymphBrushImg from "@/assets/exercises/lymph-brush.jpg";
import lymphBrushImg2 from "@/assets/exercises/lymph-brush-2.jpg";
import lymphJumpsImg from "@/assets/exercises/lymph-jumps.jpg";
import lymphJumpsImg2 from "@/assets/exercises/lymph-jumps-2.jpg";
import lymphLegsUpImg from "@/assets/exercises/lymph-legs-up.jpg";
import lymphNeckImg from "@/assets/exercises/lymph-neck.jpg";
import lymphNeckImg2 from "@/assets/exercises/lymph-neck-2.jpg";
import lymphStretchImg from "@/assets/exercises/lymph-stretch.jpg";
import lymphStretchImg2 from "@/assets/exercises/lymph-stretch-2.jpg";

export interface Exercise {
  id: string;
  title: string;
  description: string;
  defaultReps: number;
  image: string;
  image2?: string;
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
    title: "Дыхание 4–8–7",
    description: "Вдох через нос на 4 счёта, задержка дыхания на 8, медленный выдох через рот на 7.",
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

export const LYMPH_EXERCISES: Exercise[] = [
  {
    id: "lymph-stretch",
    title: "Махи руками на носочках",
    description: "Поднимись на носочки и делай махи руками вверх-вниз. Запускает лимфоток.",
    defaultReps: 50,
    image: lymphStretchImg,
    image2: lymphStretchImg2,
  },
  {
    id: "lymph-jumps",
    title: "Мягкие подпрыгивания",
    description: "Лёгкие пружинистые подпрыгивания на месте — стопы почти не отрываются от пола.",
    defaultReps: 50,
    image: lymphJumpsImg,
  },
  {
    id: "lymph-brush",
    title: "Повороты корпуса",
    description: "Стоя, ноги на ширине плеч — плавно поворачивай корпус вправо-влево.",
    defaultReps: 50,
    image: lymphBrushImg,
  },
  {
    id: "lymph-neck",
    title: "Махи руками с приседанием",
    description: "Приседай и одновременно поднимай руки вверх, на подъёме — опускай.",
    defaultReps: 50,
    image: lymphNeckImg,
  },
  {
    id: "lymph-legs-up",
    title: "Ноги вверх по стене",
    description: "Лёжа на спине, подними ноги вертикально (можно к стене). Удерживай позу спокойно.",
    defaultReps: 20,
    image: lymphLegsUpImg,
  },
];
