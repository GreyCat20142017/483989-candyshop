# Учебный проект «Кэндишоп» [![Build status][travis-image]][travis-url]

* Студент: [Наталья](https://up.htmlacademy.ru/javascript/15/user/483989).
* Наставник: `Кэндишоп - "беспризорный" проект, выполненный по остаточному принципу во время и после завершения интенсива.
Посему допущены некоторые вольности в толковании ТЗ и критериев.`

Условия фильтра истолкованы примерно так: (Мороженое || Зефир ...) && (БезСахара && Вегетарианское...) && (ВДиапазонеЦен).
Фильтры Избранное и ВНаличии исключают применение фильтров по видам продукта и свойствам продукта. И наоборот.

Если все количество товара из каталога переносится полностью в корзину, то такая карточка не попадает в условия фильтра ВНаличии.

Поля с личными данными, данными по видам оплаты и доставки заблокированы до нажатия кнопки "Оформляем".
Кнопка "Оформляем" становится доступной и видимой только при наличии товаров в корзине.

После нажатия кнопки Заверните (в случае успешной отправки данных на сервер) - корзина очищается полностью без возврата товаров из корзины обратно в каталог.

Ползунки не связаны ограничениями левый-правый. Ползунок с текущим меньшим значением координаты по X определяет минимум, с большим - максимум.
---

_Не удаляйте и не обращайте внимание на файлы:_<br>
_`.editorconfig`, `.eslintrc`, `.gitattributes`, `.gitignore`, `.travis.yml`, `package-lock.json`, `package.json`._

---

### Памятка

#### 1. Зарегистрируйтесь на Гитхабе

Если у вас ещё нет аккаунта на [github.com](https://github.com/join), скорее зарегистрируйтесь.

#### 2. Создайте форк

Откройте репозиторий и нажмите кнопку «Fork» в правом верхнем углу. Репозиторий из Академии будет скопирован в ваш аккаунт.

<img width="769" alt="" src="https://user-images.githubusercontent.com/10909/35275195-078bb816-0050-11e8-8708-89266d2fae5d.png">

Получится вот так:

<img width="769" alt="" src="https://user-images.githubusercontent.com/10909/35275196-07baf78e-0050-11e8-9275-404a4b63efb1.png">

#### 3. Клонируйте репозиторий на свой компьютер

Будьте внимательны: нужно клонировать свой репозиторий (форк), а не репозиторий Академии. Также обратите внимание, что клонировать репозиторий нужно через SSH, а не через HTTPS. Нажмите зелёную кнопку в правой части экрана, чтобы скопировать SSH-адрес вашего репозитория:

<img width="769" alt="" src="https://user-images.githubusercontent.com/10909/35275197-07d8e79e-0050-11e8-95c1-a30a433687d8.png">

Клонировать репозиторий можно так:

```
git clone SSH-адрес_вашего_форка
```

Команда клонирует репозиторий на ваш компьютер и подготовит всё необходимое для старта работы.

#### 4. Начинайте обучение!

---

<a href="https://htmlacademy.ru/intensive/javascript"><img align="left" width="50" height="50" alt="HTML Academy" src="https://up.htmlacademy.ru/static/img/intensive/javascript/logo-for-github-2.png"></a>

Репозиторий создан для обучения на интенсивном онлайн‑курсе «[Профессиональный JavaScript](https://htmlacademy.ru/intensive/javascript)», уровень 1 от [HTML Academy](https://htmlacademy.ru).

[travis-image]: https://travis-ci.org/htmlacademy-javascript/483989-candyshop.svg?branch=master
[travis-url]: https://travis-ci.org/htmlacademy-javascript/483989-candyshop
