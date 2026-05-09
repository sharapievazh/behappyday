export interface LibraryItem {
  type: "book" | "film";
  title: string;
  author: string;
  note?: string;
}

export const LIBRARY: Record<string, LibraryItem[]> = {
  "Здоровье и тело": [
    { type: "book", title: "Тело помнит всё", author: "Бессел ван дер Колк" },
    { type: "book", title: "Женское здоровье", author: "Лиза Ранкин" },
    { type: "book", title: "Интуитивное питание", author: "Светлана Бронникова" },
    { type: "film", title: "Ешь, молись, люби", author: "Райан Мёрфи, 2010" },
  ],
  "Любовь к себе": [
    { type: "book", title: "Дары несовершенства", author: "Брене Браун" },
    { type: "book", title: "Хватит быть хорошей девочкой", author: "Беверли Энгл" },
    { type: "book", title: "Самосострадание", author: "Кристин Нефф" },
    { type: "film", title: "Я худею", author: "Алексей Нужный, 2018" },
  ],
  "Отношения": [
    { type: "book", title: "Хочу и буду", author: "Михаил Лабковский" },
    { type: "book", title: "Пять языков любви", author: "Гэри Чепмен" },
    { type: "book", title: "Женщины, которые любят слишком сильно", author: "Робин Норвуд" },
    { type: "film", title: "Перед рассветом", author: "Ричард Линклейтер, 1995" },
  ],
  "Финансы": [
    { type: "book", title: "Думай и богатей", author: "Наполеон Хилл" },
    { type: "book", title: "Психология денег", author: "Морган Хаузел" },
    { type: "book", title: "Богатая женщина", author: "Ким Кийосаки" },
    { type: "film", title: "В погоне за счастьем", author: "Габриэле Муччино, 2006" },
  ],
  "Творчество": [
    { type: "book", title: "Большое волшебство", author: "Элизабет Гилберт" },
    { type: "book", title: "Путь художника", author: "Джулия Кэмерон" },
    { type: "book", title: "Кради как художник", author: "Остин Клеон" },
    { type: "film", title: "Фрида", author: "Джули Тэймор, 2002" },
  ],
  "Карьера": [
    { type: "book", title: "Не бойся действовать", author: "Шерил Сэндберг" },
    { type: "book", title: "От хорошего к великому", author: "Джим Коллинз" },
    { type: "book", title: "Думай медленно… решай быстро", author: "Даниэль Канеман" },
    { type: "film", title: "Стажёр", author: "Нэнси Майерс, 2015" },
  ],
  "Спокойствие": [
    { type: "book", title: "Сила настоящего", author: "Экхарт Толле" },
    { type: "book", title: "Куда бы ты ни шёл — ты уже там", author: "Джон Кабат-Зинн" },
    { type: "book", title: "Радость изнутри", author: "Тит Нат Хан" },
    { type: "film", title: "Ешь, молись, люби", author: "Райан Мёрфи, 2010" },
  ],
  "Энергия": [
    { type: "book", title: "Магия утра", author: "Хэл Элрод" },
    { type: "book", title: "Жизнь на полной мощности", author: "Джим Лоэр, Тони Шварц" },
    { type: "book", title: "Атомные привычки", author: "Джеймс Клир" },
    { type: "film", title: "Дикая", author: "Жан-Марк Валле, 2014" },
  ],
};
