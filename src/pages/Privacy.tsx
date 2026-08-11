import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <main className="mx-auto max-w-2xl px-5 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Назад
      </Link>

      <h1 className="mt-6 text-2xl font-semibold text-foreground">
        Политика конфиденциальности BeHappyDay
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Последнее обновление: август 2026
      </p>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/90">
        <p>
          BeHappyDay уважает твою приватность. Это приложение спроектировано так,
          чтобы не собирать личные данные без необходимости.
        </p>

        <h2 className="pt-2 text-base font-medium">Какие данные хранятся</h2>
        <p>
          Все данные, которые ты вводишь в приложении — планы дня, дневник
          благодарности, эмоции, ответы на вопросы для рефлексии, показатели воды,
          цели и намерения — хранятся исключительно локально, на твоём устройстве.
          Приложение не отправляет эти данные на какой-либо сервер и не имеет к ним
          доступа со стороны разработчика.
        </p>

        <h2 className="pt-2 text-base font-medium">
          Что происходит при удалении приложения
        </h2>
        <p>
          При удалении приложения или очистке данных все локально сохранённые записи
          удаляются безвозвратно. Рекомендуем периодически делать резервную копию
          через раздел «Резервная копия» в приложении.
        </p>

        <h2 className="pt-2 text-base font-medium">Аудио- и медиаконтент</h2>
        <p>
          Медитации и музыка в приложении загружаются с защищённого облачного
          хранилища при воспроизведении. Это не связано с передачей личных данных —
          загружается только сам аудиофайл.
        </p>

        <h2 className="pt-2 text-base font-medium">Уведомления</h2>
        <p>
          Если ты разрешишь уведомления, приложение использует их только для
          напоминаний о ритуалах в выбранное тобой время. Эти данные хранятся
          локально.
        </p>

        <h2 className="pt-2 text-base font-medium">Реклама и аналитика</h2>
        <p>
          Приложение не показывает рекламу и не использует сторонние сервисы
          аналитики или трекинга.
        </p>

        <h2 className="pt-2 text-base font-medium">Дети</h2>
        <p>
          Приложение не предназначено для детей и не собирает данные
          несовершеннолетних.
        </p>

        <h2 className="pt-2 text-base font-medium">Изменения политики</h2>
        <p>
          Если в будущем в приложении появятся аккаунты и облачное хранение данных,
          эта политика будет обновлена соответствующим образом.
        </p>

        <h2 className="pt-2 text-base font-medium">Контакты</h2>
        <p>По всем вопросам о конфиденциальности: sharapieva@gmail.com</p>
      </div>
    </main>
  </div>
);

export default Privacy;
