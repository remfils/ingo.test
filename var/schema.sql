-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июл 12 2016 г., 20:36
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
  `logo_short` varchar(255) NOT NULL,
  `movie_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=8192;

--
-- Дамп данных таблицы `projects`
--

INSERT INTO `projects` (`id`, `name`, `genre`, `color`, `year`, `logo`, `logo_short`, `movie_id`) VALUES
(1, 'Bürstner Elegance', 'Imagefilm', '#CCE1EE', 2001, 'img/movies/1_Ebene-181.jpg', 'img/movies/images_small/1_ebene_small_181.jpg', NULL),
(2, 'Jack Wolfskin', 'Werbung', '#D7E3FF', 2001, 'img/movies/2_Ebene-156.jpg', 'img/movies/images_small/2_ebene_small_156.jpg', NULL),
(3, 'Insupad', 'Imagefilm', '#B5D6B6', 2001, 'img/movies/3_Ebene-158.jpg', 'img/movies/images_small/3_ebene_small_158.jpg', NULL),
(4, 'Renault Twizzy', 'Werbung', '#D3EEDA', 2001, 'img/movies/4_Ebene-159.jpg', 'img/movies/images_small/4_ebene_small_159.jpg', NULL),
(5, 'Braun Olympia', 'Werbung', '#A28665', 2001, 'img/movies/5_Ebene-157.jpg', 'img/movies/images_small/5_ebene_small_157.jpg', NULL),
(6, 'Loose Connection', 'Kurzfilm', '#A0996A', 2001, 'img/movies/6_Ebene-164.jpg', 'img/movies/images_small/6_ebene_small_164.jpg', NULL),
(7, 'Lukas Podolski', 'Online Testimonial', '#C5CDCD', 2001, 'img/movies/7_Ebene-160.jpg', 'img/movies/images_small/7_ebene_small_160.jpg', NULL),
(8, 'Rosia Montana', 'Dokumentarfilm', '#9BAA9D', 2001, 'img/movies/8_Ebene-180.jpg', 'img/movies/images_small/8_ebene_small_180.jpg', NULL),
(9, 'Lilith', 'Kurzfilm', '#86AFB1', 2001, 'img/movies/9_Ebene-165.jpg', 'img/movies/images_small/9_ebene_small_165.jpg', NULL),
(10, 'Fußball ist unser Bier', 'Veltins', '#86AFB1', 2001, 'img/movies/10_Ebene-177.jpg', 'img/movies/images_small/10_ebene_small_177.jpg', NULL),
(11, 'Der Liebhaber', 'Testimonial', '#A1A67D', 2001, 'img/movies/11_Ebene-162.jpg', 'img/movies/images_small/11_ebene_small_162.jpg', NULL),
(12, 'man stirbt.', 'Experimenteller Dokumentarfilm', '#C2C37D', 2001, 'img/movies/12_Ebene-182.jpg', 'img/movies/images_small/12_ebene_small_182.jpg', NULL);

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
(1, 1, 'img/movies/comments/5_comment.png', '„Braun Olympia“ 2012\r\n\r\nMaking of photo´s\r\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\r\n\r\nMaking of photo´s\r\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.'),
(2, 1, 'img/movies/comments/5_comment.png', '„Braun Olympia“ 2012\r\n\r\nMaking of photo´s\r\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.'),
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
  `short_description` text NOT NULL,
  `movie_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=8192;

--
-- Дамп данных таблицы `project_description`
--

INSERT INTO `project_description` (`id`, `preview_url`, `description`, `short_description`, `movie_id`) VALUES
(1, 'https://player.vimeo.com/video/67123140?color=ffffff', 'Bürstner war ein besonderes Projekt. Die Aufgabe: Einen emotionalen Imagefilm für das Reisemobilunternehmen herzustellen. Dafür sind wir nach Südfrankreich gefahren und haben dort vor einer großartigen Landschaft eine anstrengende aber auch (...)', 'Bürstner war ein besonderes Projekt. Die Aufgabe: Einen emotionalen Imagefilm für das Reisemobilunternehmen herzustellen. Dafür sind wir nach Südfrankreich gefahren und haben dort vor einer großartigen Landschaft eine anstrengende aber auch (...)', 1),
(2, 'https://player.vimeo.com/video/67123140?color=ffffff', 'Für Jack Wolfskin in den Dolomiten. Ich wurde als „Kletterkameramann“ engagiert. Das Konzept bestand aus einem losen rotem Faden (3 abenteuerlustige Kletterer ziehen durch die Dolomiten) und viel Improvisation in und an den wunderschönen Motiven. (...)', 'Für Jack Wolfskin in den Dolomiten. Ich wurde als „Kletterkameramann“ engagiert. Das Konzept bestand aus einem losen rotem Faden (3 abenteuerlustige Kletterer ziehen durch die Dolomiten) und viel Improvisation in und an den wunderschönen Motiven. (...)', 2),
(3, 'https://www.youtube.com/embed/JL3HeSxWJuY', 'Wieder ein gemeinsames Projekt mit dem langjährigen Partner tsitrone Werbeagentur. Oliver Horst, Inhaber von tsitrone medien GmbH und Co. KG, hatte den Auftrag bekommen, die komplette Entwicklung des Corporate Designs und Inszenierung des Produkts für das (...)', 'Wieder ein gemeinsames Projekt mit dem langjährigen Partner tsitrone Werbeagentur. Oliver Horst, Inhaber von tsitrone medien GmbH und Co. KG, hatte den Auftrag bekommen, die komplette Entwicklung des Corporate Designs und Inszenierung des Produkts für das (...)', 3),
(4, 'https://player.vimeo.com/video/67123140?color=ffffff', '10 Renault Twizzy Clips in 5 verschiedenen Städten. Ein enger Zeitplan und Drehen nach dem Motto „run and gun“ - das waren die Zutaten für die Renault Twizzy Spots, konzipiert im Rahmen einer Guerilla Marketing Kampagne für den Elektro – Funflitzer von Renault. (...)', '10 Renault Twizzy Clips in 5 verschiedenen Städten. Ein enger Zeitplan und Drehen nach dem Motto „run and gun“ - das waren die Zutaten für die Renault Twizzy Spots, konzipiert im Rahmen einer Guerilla Marketing Kampagne für den Elektro – Funflitzer von Renault. (...)', 4),
(5, 'https://player.vimeo.com/video/39619408', 'Hier existierte ein bereits fertig geschnittener Spot, der dem Kunden Braun so gut gefallen hatte, dass ich im Auftrag von congaz Düsseldorf nicht - lizensiertes Material im Studio so nachdrehen sollte dass sich die Aufnahmen von Getty mit den von mir nachträglich (...)', 'Hier existierte ein bereits fertig geschnittener Spot, der dem Kunden Braun so gut gefallen hatte, dass ich im Auftrag von congaz Düsseldorf nicht - lizensiertes Material im Studio so nachdrehen sollte dass sich die Aufnahmen von Getty mit den von mir nachträglich (...)', 5),
(6, 'https://player.vimeo.com/video/61895862', '„Loose Connection“ war mein Diplomfilm als Abschlussarbeit an der Fachhochschule Dortmund, Fachbereich Kamera. Mit diesem Film konnte ich im Jahre 2009 den Deutschen Kamerapreis als Förderpreis gewinnen. (...)', '„Loose Connection“ war mein Diplomfilm als Abschlussarbeit an der Fachhochschule Dortmund, Fachbereich Kamera. Mit diesem Film konnte ich im Jahre 2009 den Deutschen Kamerapreis als Förderpreis gewinnen. (...)', 6),
(7, 'https://www.youtube.com/embed/U3doC7qQ350', 'Für diesen kurzen „Social Spot“ hat mich Lukas Podolski beauftragt, wobei Lukas zusammen mit Per Mertesacker dieses Projekt ins Leben gerufen hat, um mit zahlreichen Prominenten ein Benefiz Fußballturnier zu veranstalten. Die Erlöse kommen der Lukas Podolski Stiftung (...)', 'Für diesen kurzen „Social Spot“ hat mich Lukas Podolski beauftragt, wobei Lukas zusammen mit Per Mertesacker dieses Projekt ins Leben gerufen hat, um mit zahlreichen Prominenten ein Benefiz Fußballturnier zu veranstalten. Die Erlöse kommen der Lukas Podolski Stiftung (...)', 7),
(8, 'https://player.vimeo.com/video/67123140?color=ffffff', 'Die Gold- und Silberminen von Rosia Montana, einer kleinen Stadt am Rande der Karpaten sollen wieder in Betrieb genommen werden. Den Gewinn teilen sich die kanadische Rohstofffirma und eine rumänische Staatsgesellschaft im Verhältnis 4:1. Schäden an der (...)', 'Die Gold- und Silberminen von Rosia Montana, einer kleinen Stadt am Rande der Karpaten sollen wieder in Betrieb genommen werden. Den Gewinn teilen sich die kanadische Rohstofffirma und eine rumänische Staatsgesellschaft im Verhältnis 4:1. Schäden an der (...)', 8),
(9, 'https://player.vimeo.com/video/54154392', 'In diesem Kurzspielfilm, ausgezeichnet mit dem Prädikat „Besonders Wertvoll“ macht eine Frau im fortgeschrittenen Alter eine unerwartete Entdeckung. Durch intensive Vorbereitungen und viel Einsatz vom ganzen Team ist es uns gelungen, einen Film zu erzählen, der (...)', 'In diesem Kurzspielfilm, ausgezeichnet mit dem Prädikat „Besonders Wertvoll“ macht eine Frau im fortgeschrittenen Alter eine unerwartete Entdeckung. Durch intensive Vorbereitungen und viel Einsatz vom ganzen Team ist es uns gelungen, einen Film zu erzählen, der (...)', 9),
(10, 'https://www.youtube.com/embed/FFF5vsMjtBM', 'Web – Spot mit Gerald Asamoah in der Hauptrolle. Die Brauerei Veltins hat für diesen Dreh 4 Trickfußballer engagiert, die sich auf dem Brauereigelände austoben durften. Dies wurde in einem dokumentarischen Stil mit zwei eher roughen Handkameras langbrennweitig (...)', 'Web – Spot mit Gerald Asamoah in der Hauptrolle. Die Brauerei Veltins hat für diesen Dreh 4 Trickfußballer engagiert, die sich auf dem Brauereigelände austoben durften. Dies wurde in einem dokumentarischen Stil mit zwei eher roughen Handkameras langbrennweitig (...)', 10),
(11, 'https://player.vimeo.com/video/67123140?color=ffffff', 'Mit wenig Budget in einer Privatwohnung auf 16 mm gedreht, war hier das Licht-Setup nicht ganz unspannend. Mittels frei hängender Rohrkonstruktion über dem Bett konnten wir das weiche Top-Light über den Darstellern realisieren. (...)', 'Mit wenig Budget in einer Privatwohnung auf 16 mm gedreht, war hier das Licht-Setup nicht ganz unspannend. Mittels frei hängender Rohrkonstruktion über dem Bett konnten wir das weiche Top-Light über den Darstellern realisieren. (...)', 11),
(12, 'https://player.vimeo.com/video/67123140?color=ffffff', 'Experimenteller Dokumentarfilm über ein häufig tabuisiertes Thema. Zahlreiche Preise und Auszeichnungen: „Bester Deutscher Film“ beim Kurzfilmfestival Hamburg, 2009;  Lobende Erwähnung der Jury, Kategorie „Bestes Drehbuch“, Internationales Festival (...) 1. Preis der Jury beim Kurzfilmfestival „unlimited“, Köln 2009 (...)', 'Experimenteller Dokumentarfilm über ein häufig tabuisiertes Thema. Zahlreiche Preise und Auszeichnungen: „Bester Deutscher Film“ beim Kurzfilmfestival Hamburg, 2009;  Lobende Erwähnung der Jury, Kategorie „Bestes Drehbuch“, Internationales Festival (...) 1. Preis der Jury beim Kurzfilmfestival „unlimited“, Köln 2009 (...)', 12);

-- --------------------------------------------------------

--
-- Структура таблицы `project_fields`
--

CREATE TABLE IF NOT EXISTS `project_fields` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `field_name` varchar(255) DEFAULT NULL,
  `field_value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=2730;

--
-- Дамп данных таблицы `project_fields`
--

INSERT INTO `project_fields` (`id`, `movie_id`, `field_name`, `field_value`) VALUES
(1, 1, 'Kamera', 'Ingo Scheel 1'),
(2, 1, 'Camera', 'Ingo Scheel 2'),
(3, 1, 'Test', 'Test'),
(4, 2, 'Kamera', 'Ingo Scheel 1'),
(5, 2, 'Camera', 'Ingo Scheel 2'),
(6, 2, 'Test', 'Test'),
(7, 3, 'Kamera', 'Ingo Scheel 1'),
(8, 3, 'Camera', 'Ingo Scheel 2'),
(9, 3, 'Test', 'Test'),
(10, 4, 'Kamera', 'Ingo Scheel 1'),
(11, 4, 'Camera', 'Ingo Scheel 2'),
(12, 4, 'Test', 'Test'),
(13, 5, 'Kamera', 'Ingo Scheel 1'),
(14, 5, 'Camera', 'Ingo Scheel 2'),
(15, 5, 'Test', 'Test'),
(16, 6, 'Kamera', 'Ingo Scheel 1'),
(17, 6, 'Camera', 'Ingo Scheel 2'),
(18, 6, 'Test', 'Test'),
(19, 7, 'Kamera', 'Ingo Scheel 1'),
(20, 7, 'Camera', 'Ingo Scheel 2'),
(21, 7, 'Test', 'Test'),
(22, 8, 'Kamera', 'Ingo Scheel 1'),
(23, 8, 'Camera', 'Ingo Scheel 2'),
(24, 8, 'Test', 'Test'),
(25, 9, 'Kamera', 'Ingo Scheel 1'),
(26, 9, 'Camera', 'Ingo Scheel 2'),
(27, 9, 'Test', 'Test'),
(28, 10, 'Kamera', 'Ingo Scheel 1'),
(29, 10, 'Camera', 'Ingo Scheel 2'),
(30, 10, 'Test', 'Test'),
(31, 11, 'Kamera', 'Ingo Scheel 1'),
(32, 11, 'Camera', 'Ingo Scheel 2'),
(33, 11, 'Test', 'Test'),
(34, 12, 'Kamera', 'Ingo Scheel 1'),
(35, 12, 'Camera', 'Ingo Scheel 2'),
(36, 12, 'Test', 'Test');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT для таблицы `project_comments`
--
ALTER TABLE `project_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT для таблицы `project_description`
--
ALTER TABLE `project_description`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT для таблицы `project_fields`
--
ALTER TABLE `project_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
