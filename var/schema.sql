-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Апр 27 2016 г., 01:25
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
-- Структура таблицы `projects`
--

CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `movie_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=8192;

--
-- Дамп данных таблицы `projects`
--

INSERT INTO `projects` (`id`, `name`, `color`, `year`, `logo`, `movie_id`) VALUES
(1, 'INSULINE MEDICAL - INSUPAD', '#cbfdcb', 2001, 'img/movies/InsuPad-6.png', 1),
(2, 'Renault Twizzy Brand Campaign', '#ccf6e2', 2012, 'img/movies/Frame_Renault-5.png', 2);

-- --------------------------------------------------------

--
-- Структура таблицы `project_comments`
--

CREATE TABLE IF NOT EXISTS `project_comments` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `text` text
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `project_comments`
--

INSERT INTO `project_comments` (`id`, `movie_id`, `image_url`, `text`) VALUES
(1, 1, 'img/movies/comments/Ebene_136.png', '„Braun Olympia“ 2012<br/>\r\n<br/>\r\nMaking of photo´s<br/>\r\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.');

-- --------------------------------------------------------

--
-- Структура таблицы `project_description`
--

CREATE TABLE IF NOT EXISTS `project_description` (
  `id` int(11) NOT NULL,
  `preview_url` varchar(255) DEFAULT NULL,
  `description` text,
  `movie_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=8192;

--
-- Дамп данных таблицы `project_description`
--

INSERT INTO `project_description` (`id`, `preview_url`, `description`, `movie_id`) VALUES
(1, 'https://player.vimeo.com/video/67123140?color=ffffff', 'Wieder ein gemeinsames Projekt mit dem langjahrigen Partner tsitrone Werbeagentur. Oliver Horst, Inhaber von tsitrone medien GmbH und Co. KG, hatte den Auftrag bekommen, die komplette Entwicklung des Corporate Designs und Inszenierung des Produkts fur das Fachpublikum zu ubernehmen. In diesem Rahmen haben wir dieses Video produziert. Hier kommen sowohl Patienten als auch Arzte zu Wort.', 1),
(2, 'https://player.vimeo.com/video/67123140?color=ffffff', 'Wieder ein gemeinsames Projekt mit dem langjahrigen Partner tsitrone Werbeagentur. Oliver Horst, Inhaber von tsitrone medien GmbH und Co. KG, hatte den Auftrag bekommen, die komplette Entwicklung des Corporate Designs und Inszenierung des Produkts fur das Fachpublikum zu ubernehmen. In diesem Rahmen haben wir dieses Video produziert. Hier kommen sowohl Patienten als auch Arzte zu Wort.', 2);

-- --------------------------------------------------------

--
-- Структура таблицы `project_fields`
--

CREATE TABLE IF NOT EXISTS `project_fields` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `field_name` varchar(255) DEFAULT NULL,
  `field_value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=2730;

--
-- Дамп данных таблицы `project_fields`
--

INSERT INTO `project_fields` (`id`, `movie_id`, `field_name`, `field_value`) VALUES
(1, 1, 'Agentur', 'tsitrone medien GmbH & Co. KG'),
(2, 1, 'Kamera', 'Ingo Scheel'),
(3, 1, 'Schnitt', 'Ingo Scheel'),
(4, 2, 'Produktion', 'Ingo Scheel'),
(5, 2, 'DoP', 'Ingo Scheel'),
(6, 2, 'Schnitt', 'Ingo Scheel');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` mediumint(9) NOT NULL,
  `login` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=8192;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `role`) VALUES
(1, 'user', 'user', 'ROLE_USER'),
(2, 'test', 'nhDr7OyKlXQju+Ge/WKGrPQ9lPBSUFfpK+B1xqx/+8zLZqRNX0+5G1zBQklXUFy86lCpkAofsExlXiorUcKSNQ==', 'ROLE_USER');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `project_comments`
--
ALTER TABLE `project_comments`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `project_description`
--
ALTER TABLE `project_description`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `project_fields`
--
ALTER TABLE `project_fields`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT для таблицы `project_comments`
--
ALTER TABLE `project_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT для таблицы `project_description`
--
ALTER TABLE `project_description`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT для таблицы `project_fields`
--
ALTER TABLE `project_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
