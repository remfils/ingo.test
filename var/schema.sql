-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июн 06 2016 г., 15:56
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
  `genre` tinytext NOT NULL,
  `color` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `movie_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=8192;

--
-- Дамп данных таблицы `projects`
--

INSERT INTO `projects` (`id`, `name`, `genre`, `color`, `year`, `logo`, `movie_id`) VALUES
(1, 'Insupad', 'Imagefilm', '#B5D6B6', 2001, 'img/movies/InsuPad-6.png', 1),
(2, 'Renault Twizzy', 'Werbung', '#D3EEDA', 2012, 'img/movies/Frame_Renault-5.png', 2),
(7, 'Bürstner Elegance', 'Imagefilm', '#CCE1EE', 0, 'img/movies/Frame_Poldi-4.png', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `project_comments`
--

CREATE TABLE IF NOT EXISTS `project_comments` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `text` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `project_comments`
--

INSERT INTO `project_comments` (`id`, `movie_id`, `image_url`, `text`) VALUES
(1, 1, 'img/movies/comments/5_comment.png', '„Braun Olympia“ 2012\r<br/>\r<br/>Making of photo´s\r<br/>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\r<br/>\r<br/>Making of photo´s\r<br/>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.'),
(2, 1, 'img/movies/comments/5_comment.png', '„Braun Olympia“ 2012\r<br/>\r<br/>Making of photo´s\r<br/>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.'),
(3, 7, 'img/movies/comments/Ebene_136.png', 'adsf'),
(4, 2, 'img/movies/comments/Ebene_136.png', '');

-- --------------------------------------------------------

--
-- Структура таблицы `project_description`
--

CREATE TABLE IF NOT EXISTS `project_description` (
  `id` int(11) NOT NULL,
  `preview_url` varchar(255) DEFAULT NULL,
  `description` text,
  `movie_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=8192;

--
-- Дамп данных таблицы `project_description`
--

INSERT INTO `project_description` (`id`, `preview_url`, `description`, `movie_id`) VALUES
(1, 'https://player.vimeo.com/video/67123140?color=ffffff', 'Wieder ein gemeinsames Projekt mit dem langjahrigen Partner tsitrone Werbeagentur. Oliver Horst, Inhaber von tsitrone medien GmbH und Co. KG, hatte den Auftrag bekommen, die komplette Entwicklung des Corporate Designs und Inszenierung des Produkts fur das Fachpublikum zu ubernehmen. In diesem Rahmen haben wir dieses Video produziert. Hier kommen sowohl Patienten als auch Arzte zu Wort.', 1),
(2, 'https://player.vimeo.com/video/67123140?color=ffffff', 'Wieder ein gemeinsames Projekt mit dem langjahrigen Partner tsitrone Werbeagentur. Oliver Horst, Inhaber von tsitrone medien GmbH und Co. KG, hatte den Auftrag bekommen, die komplette Entwicklung des Corporate Designs und Inszenierung des Produkts fur das Fachpublikum zu ubernehmen. In diesem Rahmen haben wir dieses Video produziert. Hier kommen sowohl Patienten als auch Arzte zu Wort.', 2),
(3, '', 'asdf', 7);

-- --------------------------------------------------------

--
-- Структура таблицы `project_fields`
--

CREATE TABLE IF NOT EXISTS `project_fields` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `field_name` varchar(255) DEFAULT NULL,
  `field_value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=2730;

--
-- Дамп данных таблицы `project_fields`
--

INSERT INTO `project_fields` (`id`, `movie_id`, `field_name`, `field_value`) VALUES
(1, 1, 'Kamera', 'tsitrone medien GmbH & Co. KG'),
(2, 1, 'Kamera', 'Ingo Scheel 2'),
(8, 3, 'Camera', 'username'),
(9, 3, 'Field', 'username'),
(10, 4, '1', '1'),
(11, 4, '1', '1'),
(12, 4, '1', '1'),
(13, 5, 'Actor', 'username'),
(14, 5, 'Camera', 'username'),
(15, 5, 'Name', 'username'),
(16, 6, 'Agentur', 'This'),
(17, 6, 'Kamera', 'Name'),
(18, 6, 'Schnitt', 'teset'),
(22, 7, 'Agentur', 'asdf'),
(23, 7, 'Kamera', 'asdf'),
(24, 7, 'Schnitt', 'asdf'),
(25, 2, 'field', 'name');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT для таблицы `project_comments`
--
ALTER TABLE `project_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT для таблицы `project_description`
--
ALTER TABLE `project_description`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT для таблицы `project_fields`
--
ALTER TABLE `project_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
