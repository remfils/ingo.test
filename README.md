* НЕОБХОДИМЫЕ ТЕХНОЛОГИИ
    - composer
    - nodejs и npm
    - webpack

* ДАННЫЕ ХОСТИНГА

хостинг: https://neon1.web-shop-hosting.com/ispmgr
логин: wsh1490
пароль: 5MARSxe2

база данных:
название БД: ingo
пользователь: ingo
пароль: 777qwe777

* УСТАНОВКА ПРОЕКТА
    + установить php модули
        запустить команду:
        composer install

    + установить js модули
        запустить команду:
        npm install

    + собрать bundle.js
        запустить команду:
        webpack
    + записать в ~/app/config.php правильные параметры

* ДОП ДАННЫЕ
** админка

%site-name%/admin

логин: test
пароль: admin

** API:
%site-name%/api/all-movies
Возвращает основную инфу по всем фильмам в виде массива.

%site-name%/api/movie/{id}
Возвращает все данные конкретного фильма по id.