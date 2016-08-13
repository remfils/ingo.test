-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Авг 13 2016 г., 13:44
-- Версия сервера: 5.5.48
-- Версия PHP: 5.4.45

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `ingo.test`
--

-- --------------------------------------------------------

--
-- Структура таблицы `lang`
--

CREATE TABLE IF NOT EXISTS `lang` (
  `id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `lang`
--

INSERT INTO `lang` (`id`, `name`) VALUES
(1, 'de'),
(2, 'en');

-- --------------------------------------------------------

--
-- Структура таблицы `projects`
--

CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `color` varchar(20) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `logo_short` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `preview_url` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `projects`
--

INSERT INTO `projects` (`id`, `active`, `color`, `logo`, `logo_short`, `year`, `preview_url`) VALUES
(1, 1, '#B5D6B6', 'img/movies/InsuPad-6.png', '', 2001, 'https://player.vimeo.com/video/67123140?color=ffffff'),
(2, 1, '#D3EEDA', 'img/movies/Frame_Renault-5.png\r\n', '', 2012, 'https://player.vimeo.com/video/67123140?color=ffffff'),
(3, 0, '#CCE1EE', 'img/movies/Frame_Poldi-4.png\r\n', '', 1928, 'https://player.vimeo.com/video/67123140?color=ffffff');

-- --------------------------------------------------------

--
-- Структура таблицы `project_comment_lang`
--

CREATE TABLE IF NOT EXISTS `project_comment_lang` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `lang_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `project_comment_lang`
--

INSERT INTO `project_comment_lang` (`id`, `project_id`, `lang_id`, `text`, `image_url`) VALUES
(1, 1, 1, '(de)„Braun Olympia“ 2012\r\n<br/>\r\n<br/>Making of photo´s\r\n<br/>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\r\n<br/>\r\n<br/>Making of photo´s\r\n<br/>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.', 'img/movies/comments/5_comment.png\r\n'),
(2, 1, 2, '(en)„Braun Olympia“ 2012\r\n<br/>\r\n<br/>Making of photo´s\r\n<br/>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\r\n<br/>\r\n<br/>Making of photo´s\r\n<br/>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.', 'img/movies/comments/5_comment.png'),
(3, 1, 1, 'de', 'img/movies/comments/5_comment.png'),
(4, 1, 2, 'en', 'img/movies/comments/5_comment.png'),
(5, 1, 1, 'de dede dede dede dede dede dede dede de', 'img/movies/comments/Ebene_136.png'),
(6, 2, 2, 'en enen enen enen enen enen enen enen enen enen en', 'img/movies/comments/Ebene_136.png'),
(7, 3, 1, '', 'img/movies/comments/Ebene_136.png'),
(8, 3, 2, '', 'img/movies/comments/Ebene_136.png');

-- --------------------------------------------------------

--
-- Структура таблицы `project_field_lang`
--

CREATE TABLE IF NOT EXISTS `project_field_lang` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `lang_id` int(11) NOT NULL,
  `field_name` varchar(255) NOT NULL,
  `field_value` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `project_field_lang`
--

INSERT INTO `project_field_lang` (`id`, `project_id`, `lang_id`, `field_name`, `field_value`) VALUES
(1, 1, 1, 'field de', 'value de'),
(2, 1, 2, 'field en', 'value en'),
(3, 2, 1, 'field de', 'value de'),
(4, 2, 2, 'field en', 'value en'),
(5, 3, 1, 'field de', 'value de'),
(6, 3, 2, 'field en', 'value en'),
(7, 1, 1, 'field de', 'value en'),
(8, 1, 2, 'field en', 'value en');

-- --------------------------------------------------------

--
-- Структура таблицы `project_lang`
--

CREATE TABLE IF NOT EXISTS `project_lang` (
  `project_id` int(11) NOT NULL,
  `lang_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `genre` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `project_lang`
--

INSERT INTO `project_lang` (`project_id`, `lang_id`, `name`, `genre`, `description`) VALUES
(1, 1, 'Insupad', 'Imagefilm', 'Wieder ein gemeinsames Projekt mit dem langjahrigen Partner tsitrone Werbeagentur. Oliver Horst, Inhaber von tsitrone medien GmbH und Co. KG, hatte den Auftrag bekommen, die komplette Entwicklung des Corporate Designs und Inszenierung des Produkts fur das Fachpublikum zu ubernehmen. In diesem Rahmen haben wir dieses Video produziert. Hier kommen sowohl Patienten als auch Arzte zu Wort.'),
(1, 2, 'Insupad(eng)', 'Imagefilm', '\r\nAnother joint project with the long-standing partner tsitrone advertising agency . Oliver Horst , owner of tsitrone media GmbH and Co. KG , had been given the task to take over the complete development of the corporate design and production of the product for the professional audience . In this context, we have produced this video. Here both patients and doctors to speak.'),
(2, 1, 'Renault Twizzy', 'Werbun', 'Wieder ein gemeinsames Projekt mit dem langjahrigen Partner tsitrone Werbeagentur. Oliver Horst, Inhaber von tsitrone medien GmbH und Co. KG, hatte den Auftrag bekommen, die komplette Entwicklung des Corporate Designs und Inszenierung des Produkts fur das Fachpublikum zu ubernehmen. In diesem Rahmen haben wir dieses Video produziert. Hier kommen sowohl Patienten als auch Arzte zu Wort.'),
(2, 2, 'Renault Twizy(eng)', '\r\nadverti', 'Another joint project with the long-standing partner tsitrone advertising agency . Oliver Horst , owner of tsitrone media GmbH and Co. KG , had been given the task to take over the complete development of the corporate design and production of the product for the professional audience . In this context, we have produced this video. Here both patients and doctors to speak.'),
(3, 1, 'Bürstner Elegance', 'Imagefilm', 'Description (de)'),
(3, 2, 'Burstner elegance', 'Imagefilm', 'Description (en)');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `login` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `lang`
--
ALTER TABLE `lang`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `project_comment_lang`
--
ALTER TABLE `project_comment_lang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projectid` (`project_id`,`lang_id`),
  ADD KEY `languageid` (`lang_id`);

--
-- Индексы таблицы `project_field_lang`
--
ALTER TABLE `project_field_lang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projectId` (`project_id`,`lang_id`),
  ADD KEY `languageId` (`lang_id`);

--
-- Индексы таблицы `project_lang`
--
ALTER TABLE `project_lang`
  ADD KEY `projectId` (`project_id`,`lang_id`),
  ADD KEY `langId` (`lang_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `lang`
--
ALTER TABLE `lang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT для таблицы `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT для таблицы `project_comment_lang`
--
ALTER TABLE `project_comment_lang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT для таблицы `project_field_lang`
--
ALTER TABLE `project_field_lang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `project_comment_lang`
--
ALTER TABLE `project_comment_lang`
  ADD CONSTRAINT `project_comment_lang_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `project_comment_lang_ibfk_2` FOREIGN KEY (`lang_id`) REFERENCES `lang` (`id`);

--
-- Ограничения внешнего ключа таблицы `project_field_lang`
--
ALTER TABLE `project_field_lang`
  ADD CONSTRAINT `project_field_lang_ibfk_2` FOREIGN KEY (`lang_id`) REFERENCES `lang` (`id`),
  ADD CONSTRAINT `project_field_lang_ibfk_3` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

--
-- Ограничения внешнего ключа таблицы `project_lang`
--
ALTER TABLE `project_lang`
  ADD CONSTRAINT `project_lang_ibfk_1` FOREIGN KEY (`lang_id`) REFERENCES `lang` (`id`),
  ADD CONSTRAINT `project_lang_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
