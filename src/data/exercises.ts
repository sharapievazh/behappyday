import bridgeImg from "@/assets/exercises/bridge.jpg";
import bridgeImg2 from "@/assets/exercises/bridge-2.jpg";
import catCowImg from "@/assets/exercises/cat-cow.jpg";
import catCowImg2 from "@/assets/exercises/cat-cow-2.jpg";
import butterflyImg from "@/assets/exercises/butterfly.jpg";
import butterflyImg2 from "@/assets/exercises/butterfly-2.jpg";
import lymphBrushImg from "@/assets/exercises/lymph-brush.jpg";
import lymphBrushImg2 from "@/assets/exercises/lymph-brush-2.jpg";
import lymphJumpsImg from "@/assets/exercises/lymph-jumps.jpg";
import lymphJumpsImg2 from "@/assets/exercises/lymph-jumps-2.jpg";
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
    id: "lymph-stretch",
    title: "Махи руками на носочках",
    description: "Поднимись на носочки и делай махи руками вверх-вниз. Запускает лимфоток.",
    defaultReps: 1,
    image: lymphStretchImg,
    image2: lymphStretchImg2,
  },
  {
    id: "lymph-jumps",
    title: "Мягкие подпрыгивания",
    description: "Лёгкие пружинистые подпрыгивания на месте — стопы почти не отрываются от пола.",
    defaultReps: 1,
    image: lymphJumpsImg,
    image2: lymphJumpsImg2,
  },
  {
    id: "lymph-brush",
    title: "Повороты корпуса",
    description: "Стоя, ноги на ширине плеч — плавно поворачивай корпус вправо-влево.",
    defaultReps: 1,
    image: lymphBrushImg,
    image2: lymphBrushImg2,
  },
  {
    id: "lymph-neck",
    title: "Махи руками с приседанием",
    description: "Приседай и одновременно поднимай руки вверх, на подъёме — опускай.",
    defaultReps: 1,
    image: lymphNeckImg,
    image2: lymphNeckImg2,
  },
  {
    id: "butterfly",
    title: "Бабочка",
    description: "Сидя, соедини стопы и мягко опускай колени к полу.",
    defaultReps: 1,
    image: butterflyImg,
    image2: butterflyImg2,
  },
  {
    id: "cat-cow",
    title: "Кошка-корова",
    description: "Плавный прогиб и округление спины на четвереньках.",
    defaultReps: 1,
    image: catCowImg,
    image2: catCowImg2,
  },
  {
    id: "bridge",
    title: "Мостик (полумост)",
    description: "Лёжа на спине, поднимай таз вверх, удерживай 2–3 секунды.",
    defaultReps: 1,
    image: bridgeImg,
    image2: bridgeImg2,
  },
];

export const LYMPH_EXERCISES: Exercise[] = [];
