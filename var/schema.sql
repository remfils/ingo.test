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

INSERT INTO `projects` (`id`, `active`, `color`, `year`, `logo`, `logo_short`, `preview_url`) VALUES
(1,1,'#CCE1EE',2011,'img/movies/1_Ebene-181.jpg','img/movies/images_small/1_ebene_small_181.jpg','https://player.vimeo.com/video/174101800'),
(2,1,'#D7E3FF',2011,'img/movies/2_Ebene-156.jpg','img/movies/images_small/2_ebene_small_156.jpg','https://player.vimeo.com/video/174098946'),
(3,1,'#B5D6B6',2011,'img/movies/3_Ebene-158.jpg','img/movies/images_small/3_ebene_small_158.jpg','https://www.youtube.com/embed/JL3HeSxWJuY'),
(4,1,'#D3EEDA',2012,'img/movies/4_Ebene-159.jpg','img/movies/images_small/4_ebene_small_159.jpg','https://player.vimeo.com/video/67123140?color=ffffff'),
(5,1,'#A28665',2012,'img/movies/5_Ebene-157.jpg','img/movies/images_small/5_ebene_small_157.jpg','https://player.vimeo.com/video/39619408'),
(6,1,'#A0996A',2009,'img/movies/6_Ebene-164.jpg','img/movies/images_small/6_ebene_small_164.jpg','https://player.vimeo.com/video/61895862'),
(7,1,'#C5CDCD',2013,'img/movies/7_Ebene-160.jpg','img/movies/images_small/7_ebene_small_160.jpg','https://www.youtube.com/embed/U3doC7qQ350'),
(8,1,'#9BAA9D',2011,'img/movies/8_Ebene-180.jpg','img/movies/images_small/8_ebene_small_180.jpg','https://www.youtube.com/embed/3tdYGIhXUT0'),
(9,1,'#86AFB1',2012,'img/movies/9_Ebene-165.jpg','img/movies/images_small/9_ebene_small_165.jpg','https://player.vimeo.com/video/54154392'),
(10,1,'#86AFB1',2013,'img/movies/10_Ebene-177.jpg','img/movies/images_small/10_ebene_small_177.jpg','https://www.youtube.com/embed/FFF5vsMjtBM'),
(11,1,'#A1A67D',2009,'img/movies/11_Ebene-162.jpg','img/movies/images_small/11_ebene_small_162.jpg','https://player.vimeo.com/video/174627469'),
(12,1,'#C2C37D',2009,'img/movies/12_Ebene-182.jpg','img/movies/images_small/12_ebene_small_182.jpg','https://player.vimeo.com/video/41249930');

-- --------------------------------------------------------

--
-- Структура таблицы `project_comment_lang`
--

CREATE TABLE IF NOT EXISTS `project_comment_lang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `lang_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `project_comment_lang`
--

INSERT INTO `project_comment_lang` (`project_id`, `lang_id`, `image_url`, `text` ) VALUES
(1,1,'img/movies/comments/buerstner-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\r\nMaking of photo´s\r\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.'),
(7,1,'img/movies/comments/Lucas-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(1,1,'img/movies/comments/Buerstener.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(2,1,'img/movies/comments/Jack-Wolfskin-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(2,1,'img/movies/comments/jack-w.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(4,1,'img/movies/comments/Renault-1a.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(4,1,'img/movies/comments/Renault-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(5,1,'img/movies/comments/braun-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(5,1,'img/movies/comments/braun-2.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(6,1,'img/movies/comments/Loose_con.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(6,1,'img/movies/comments/Loose-Con.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(7,1,'img/movies/comments/Lukas.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(8,1,'img/movies/comments/montana.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(8,1,'img/movies/comments/montana-2.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(9,1,'img/movies/comments/Lilith-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(9,1,'img/movies/comments/Lilith-2.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(10,1,'img/movies/comments/fussball-ist-unser-bier.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(10,1,'img/movies/comments/fussball-ist-unser-bier2.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(11,1,'img/movies/comments/Liebhaber-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(12,1,'img/movies/comments/man-stirbt-1a.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(12,1,'img/movies/comments/man-stirbt-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(3,1,'img/movies/comments/insupad-3.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(1,2,'img/movies/comments/buerstner-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\r\nMaking of photo´s\r\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.'),
(7,2,'img/movies/comments/Lucas-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(1,2,'img/movies/comments/Buerstener.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(2,2,'img/movies/comments/Jack-Wolfskin-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(2,2,'img/movies/comments/jack-w.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(4,2,'img/movies/comments/Renault-1a.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(4,2,'img/movies/comments/Renault-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(5,2,'img/movies/comments/braun-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(5,2,'img/movies/comments/braun-2.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(6,2,'img/movies/comments/Loose_con.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(6,2,'img/movies/comments/Loose-Con.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(7,2,'img/movies/comments/Lukas.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(8,2,'img/movies/comments/montana.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(8,2,'img/movies/comments/montana-2.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(9,2,'img/movies/comments/Lilith-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(9,2,'img/movies/comments/Lilith-2.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(10,2,'img/movies/comments/fussball-ist-unser-bier.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(10,2,'img/movies/comments/fussball-ist-unser-bier2.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(11,2,'img/movies/comments/Liebhaber-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(12,2,'img/movies/comments/man-stirbt-1a.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(12,2,'img/movies/comments/man-stirbt-1.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'),
(3,2,'img/movies/comments/insupad-3.jpg','Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.');

-- --------------------------------------------------------

--
-- Структура таблицы `project_field_lang`
--

CREATE TABLE IF NOT EXISTS `project_field_lang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `lang_id` int(11) NOT NULL,
  `field_name` varchar(255) NOT NULL,
  `field_value` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `project_field_lang`
--

INSERT INTO `project_field_lang` (`project_id`, `lang_id`, `field_name`, `field_value`) VALUES
(1,1,'Kamera','Ingo Scheel 1'),
(1,1,'Camera','Ingo Scheel 2'),
(1,1,'Test','Test'),
(3,1,'Agentur','tsitrone medien GmbH & Co. KG'),
(3,1,'Kamera','Ingo Scheel '),
(3,1,'Schnitt','Ingo Scheel '),
(4,1,'Agentur','Werbeagentur Federstein Bonn GmbH '),
(4,1,'Prod./DoP/Schnitt','Ingo Scheel '),
(5,1,'Client','Braun'),
(5,1,'Agency','BBDO Düsseldorf'),
(5,1,'Production','congaz Düsseldorf'),
(6,1,'Regie','Jan Häring'),
(6,1,'Produktion','Fachhochschule Dortmund / Ingo Scheel'),
(6,1,'Kamera','Ingo Scheel'),
(7,1,'Produktion','Ingo Scheel '),
(7,1,'Kamera','Ingo Scheel '),
(7,1,'Schnitt','Ingo Scheel '),
(8,1,'Produktion','Bildfolge Hamburg'),
(8,1,'Regie','Fabian Daub'),
(8,1,'Kamera','Ulf Behrens, Ingo Scheel'),
(9,1,'Produktion','Homoludens-Pictures'),
(9,1,'Regie','Aleksandra Szymanska'),
(9,1,'Kamera','Ingo Scheel'),
(10,1,'Agentur','milk GmbH'),
(10,1,'Regie','Lukas Keller'),
(11,1,'Produktion','Kunsthochschule für Medien Köln'),
(11,1,'Regie','Marina Klauser, Pia Hellenthal'),
(11,1,'Kamera','Ingo Scheel'),
(12,1,'Produktion','Kunsthochschule für Medien Köln'),
(12,1,'Regie','Patrick Doberenz'),
(12,1,'Kamera','Ingo Scheel, Frank Mai'),
(2,1,'Regie','Andreas Arntz'),
(2,1,'DoP','Andrés Marder'),
(2,1,'2. Kamera','Ingo Scheel'),
(2,1,'Produktion','Trias'),
(2,1,'Agentur','Intention'),
(5,1,'DoP','Ingo Scheel'),
(5,1,'Stockfootage','Getty Images'),
(10,1,'DoP','Dany Schelby'),
(10,1,'2. Kamera','Ingo Scheel'),
(1,2,'Kamera','Ingo Scheel 1'),
(1,2,'Camera','Ingo Scheel 2'),
(1,2,'Test','Test'),
(3,2,'Agentur','tsitrone medien GmbH & Co. KG'),
(3,2,'Kamera','Ingo Scheel '),
(3,2,'Schnitt','Ingo Scheel '),
(4,2,'Agentur','Werbeagentur Federstein Bonn GmbH '),
(4,2,'Prod./DoP/Schnitt','Ingo Scheel '),
(5,2,'Client','Braun'),
(5,2,'Agency','BBDO Düsseldorf'),
(5,2,'Production','congaz Düsseldorf'),
(6,2,'Regie','Jan Häring'),
(6,2,'Produktion','Fachhochschule Dortmund / Ingo Scheel'),
(6,2,'Kamera','Ingo Scheel'),
(7,2,'Produktion','Ingo Scheel '),
(7,2,'Kamera','Ingo Scheel '),
(7,2,'Schnitt','Ingo Scheel '),
(8,2,'Produktion','Bildfolge Hamburg'),
(8,2,'Regie','Fabian Daub'),
(8,2,'Kamera','Ulf Behrens, Ingo Scheel'),
(9,2,'Produktion','Homoludens-Pictures'),
(9,2,'Regie','Aleksandra Szymanska'),
(9,2,'Kamera','Ingo Scheel'),
(10,2,'Agentur','milk GmbH'),
(10,2,'Regie','Lukas Keller'),
(11,2,'Produktion','Kunsthochschule für Medien Köln'),
(11,2,'Regie','Marina Klauser, Pia Hellenthal'),
(11,2,'Kamera','Ingo Scheel'),
(12,2,'Produktion','Kunsthochschule für Medien Köln'),
(12,2,'Regie','Patrick Doberenz'),
(12,2,'Kamera','Ingo Scheel, Frank Mai'),
(2,2,'Regie','Andreas Arntz'),
(2,2,'DoP','Andrés Marder'),
(2,2,'2. Kamera','Ingo Scheel'),
(2,2,'Produktion','Trias'),
(2,2,'Agentur','Intention'),
(5,2,'DoP','Ingo Scheel'),
(5,2,'Stockfootage','Getty Images'),
(10,2,'DoP','Dany Schelby'),
(10,2,'2. Kamera','Ingo Scheel');
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
(1,1,'Bürstner Elegance','Imagefilm','Bürstner war ein besonderes Projekt.\r<br/>Die Aufgabe: Einen emotionalen Imagefilm für das Reisemobilunternehmen herzustellen.\r<br/>Dafür sind wir nach Südfrankreich gefahren und haben dort vor einer großartigen Landschaft eine anstrengende aber auch sehr schöne und intensive Drehwoche erlebt.\r<br/>Der Film sollte eine leichte, von Landschaft, Natur und Licht inspirierte Stimmung erzeugen. Das ist uns sehr gut gelungen, wie ich finde.'),
(2,1,'Jack Wolfskin','Werbung','Für Jack Wolfskin in den Dolomiten. Ich wurde als „Kletterkameramann“ engagiert. Das Konzept bestand aus einem losen rotem Faden (3 abenteuerlustige Kletterer ziehen durch die Dolomiten) und viel Improvisation in und an den wunderschönen Motiven. DoP Andrés Marder und Regisseur Andreas Arntz ließen sich teilweise vor Ort inspirieren und gaben den Models Gelegenheit, in der Natur teilweise frei zu agieren.  Meine Aufgabe als 2. Kameramann bestand hauptsächlich darin, in ausgesetzten Passagen und an Steilwänden zu filmen.'),
(3,1,'Insupad','Imagefilm','Wieder ein gemeinsames Projekt mit dem langjährigen Partner tsitrone Werbeagentur. Oliver Horst, Inhaber von tsitrone medien GmbH und Co. KG, hatte den Auftrag bekommen, die komplette Entwicklung des Corporate Designs und Inszenierung des Produkts für das Fachpublikum zu übernehmen. In diesem Rahmen haben wir dieses Video produziert. Hier kommen sowohl Patienten als auch Ärzte zu Wort.'),
(4,1,'Renault Twizzy','Werbung','10 Renault Twizzy Clips in 5 verschiedenen Städten. Ein enger Zeitplan und Drehen nach dem Motto „run and gun“ - das waren die Zutaten für die Renault Twizzy Spots, konzipiert im Rahmen einer Guerilla Marketing Kampagne für den Elektro – Funflitzer von Renault. Viel Spaß beim Gucken!'),
(5,1,'„Braun Olympia“','Werbung','Hier existierte ein bereits fertig geschnittener Spot, der dem Kunden Braun so gut gefallen hatte, dass ich im Auftrag von congaz Düsseldorf nicht - lizensiertes Material im Studio so nachdrehen sollte dass sich die Aufnahmen von Getty mit den von mir nachträglich aufgenommenen Close Ups so gut mischen sollten, dass der fertige Clip „wie aus einem Guss“ wirken sollte.\r<br/>Voilá!'),
(6,1,'„Loose Connection“ ','Kurzfilm','„Loose Connection“ war mein Diplomfilm als Abschlussarbeit an der Fachhochschule Dortmund, Fachbereich Kamera. \r<br/>Ein Jugendlicher schein gefangen in seiner Welt aus Computer und Technik. Dieses Thema greift der Film auf nonverbaler, überhöhter Ebene auf und konterkariert diese Sichtweise zugleich.\r<br/>\r<br/>Mit diesem Film konnte ich im Jahre 2009 den Deutschen Kamerapreis als Förderpreis gewinnen.'),
(7,1,'Lukas Podolski','Online Testimonial','Für diesen kurzen „Social Spot“ hat mich Lukas Podolski beauftragt, wobei Lukas zusammen mit Per Mertesacker dieses Projekt ins Leben gerufen hat, um mit zahlreichen Prominenten ein Benefiz Fußballturnier zu veranstalten. Die Erlöse kommen der Lukas Podolski Stiftung sowie der Per Mertesacker Stiftung zugute. Hat großen Spaß gemacht!'),
(8,1,'Rosia Montana','Dokumentarfilm','Die Gold- und Silberminen von Rosia Montana, einer kleinen Stadt am Rande der Karpaten sollen wieder in Betrieb genommen werden. Den Gewinn teilen sich die kanadische Rohstofffirma und eine rumänische Staatsgesellschaft im Verhältnis 4:1. Schäden an der Umwelt und eine entwurzelte Bevölkerung, das sind die Kernthemen dieses Dokumentarfilms, der in Rumänien viel Zustimmung und Beifall erfahren hat.'),
(9,1,'Lilith','Kurzfilm','In diesem Kurzspielfilm, ausgezeichnet mit dem Prädikat „Besonders Wertvoll“ macht eine Frau im fortgeschrittenen Alter eine unerwartete Entdeckung. Durch intensive Vorbereitungen und viel Einsatz vom ganzen Team ist es uns gelungen, einen Film zu erzählen, der visuell und inhaltlich stimmig über eine ungewöhnliche Begegnung erzählt.'),
(10,1,'Fußball ist unser Bier','Veltins','Web – Spot mit Gerald Asamoah in der Hauptrolle. Die Brauerei Veltins hat für diesen Dreh 4 Trickfußballer engagiert, die sich auf dem Brauereigelände austoben durften. Dies wurde in einem dokumentarischen Stil mit zwei eher roughen Handkameras langbrennweitig umgesetzt. Unschärfen und ungewöhnliche Perspektiven waren gewünscht und wurden für die Action gern in Kauf genommen :-).'),
(11,1,'Der Liebhaber','Testimonial','Mit wenig Budget in einer Privatwohnung auf 16mm gedreht, war hier das Licht-Setup nicht ganz unspannend. Mittels frei hängender Rohrkonstruktion über dem Bett konnten wir das weiche Top-Light über den Darstellern realisieren. Außerhalb des Fensters wurde mittels Greenscreen ein nachträglich angefertigtes Foto eingefügt und bewegt, um die Illusion einer späten Abendstimmung zu erzeugen.'),
(12,1,'man stirbt.','Experimenteller Dokumentarfilm','Experimenteller Dokumentarfilm über ein häufig tabuisiertes Thema. \r<br/>Zahlreiche Preise und Auszeichnungen:\r<br/>\r<br/>„Bester Deutscher Film“ beim Kurzfilmfestival Hamburg, 2009; Lobende Erwähnung der Jury, Kategorie „Bestes Drehbuch“, Internationales Festival der Filmhochschulen, München 2009\r<br/>1. Preis der Jury beim Kurzfilmfestival „unlimited“, Köln 2009\r<br/>1. Kölner Design Preis; Publikumspreis beim Festival DokumentArt Neubrandenburg, 2009.'),
(1,2,'Bürstner Elegance','Imagefilm','Bürstner war ein besonderes Projekt.\r<br/>Die Aufgabe: Einen emotionalen Imagefilm für das Reisemobilunternehmen herzustellen.\r<br/>Dafür sind wir nach Südfrankreich gefahren und haben dort vor einer großartigen Landschaft eine anstrengende aber auch sehr schöne und intensive Drehwoche erlebt.\r<br/>Der Film sollte eine leichte, von Landschaft, Natur und Licht inspirierte Stimmung erzeugen. Das ist uns sehr gut gelungen, wie ich finde.'),
(2,2,'Jack Wolfskin','Werbung','Für Jack Wolfskin in den Dolomiten. Ich wurde als „Kletterkameramann“ engagiert. Das Konzept bestand aus einem losen rotem Faden (3 abenteuerlustige Kletterer ziehen durch die Dolomiten) und viel Improvisation in und an den wunderschönen Motiven. DoP Andrés Marder und Regisseur Andreas Arntz ließen sich teilweise vor Ort inspirieren und gaben den Models Gelegenheit, in der Natur teilweise frei zu agieren.  Meine Aufgabe als 2. Kameramann bestand hauptsächlich darin, in ausgesetzten Passagen und an Steilwänden zu filmen.'),
(3,2,'Insupad','Imagefilm','Wieder ein gemeinsames Projekt mit dem langjährigen Partner tsitrone Werbeagentur. Oliver Horst, Inhaber von tsitrone medien GmbH und Co. KG, hatte den Auftrag bekommen, die komplette Entwicklung des Corporate Designs und Inszenierung des Produkts für das Fachpublikum zu übernehmen. In diesem Rahmen haben wir dieses Video produziert. Hier kommen sowohl Patienten als auch Ärzte zu Wort.'),
(4,2,'Renault Twizzy','Werbung','10 Renault Twizzy Clips in 5 verschiedenen Städten. Ein enger Zeitplan und Drehen nach dem Motto „run and gun“ - das waren die Zutaten für die Renault Twizzy Spots, konzipiert im Rahmen einer Guerilla Marketing Kampagne für den Elektro – Funflitzer von Renault. Viel Spaß beim Gucken!'),
(5,2,'„Braun Olympia“','Werbung','Hier existierte ein bereits fertig geschnittener Spot, der dem Kunden Braun so gut gefallen hatte, dass ich im Auftrag von congaz Düsseldorf nicht - lizensiertes Material im Studio so nachdrehen sollte dass sich die Aufnahmen von Getty mit den von mir nachträglich aufgenommenen Close Ups so gut mischen sollten, dass der fertige Clip „wie aus einem Guss“ wirken sollte.\r<br/>Voilá!'),
(6,2,'„Loose Connection“ ','Kurzfilm','„Loose Connection“ war mein Diplomfilm als Abschlussarbeit an der Fachhochschule Dortmund, Fachbereich Kamera. \r<br/>Ein Jugendlicher schein gefangen in seiner Welt aus Computer und Technik. Dieses Thema greift der Film auf nonverbaler, überhöhter Ebene auf und konterkariert diese Sichtweise zugleich.\r<br/>\r<br/>Mit diesem Film konnte ich im Jahre 2009 den Deutschen Kamerapreis als Förderpreis gewinnen.'),
(7,2,'Lukas Podolski','Online Testimonial','Für diesen kurzen „Social Spot“ hat mich Lukas Podolski beauftragt, wobei Lukas zusammen mit Per Mertesacker dieses Projekt ins Leben gerufen hat, um mit zahlreichen Prominenten ein Benefiz Fußballturnier zu veranstalten. Die Erlöse kommen der Lukas Podolski Stiftung sowie der Per Mertesacker Stiftung zugute. Hat großen Spaß gemacht!'),
(8,2,'Rosia Montana','Dokumentarfilm','Die Gold- und Silberminen von Rosia Montana, einer kleinen Stadt am Rande der Karpaten sollen wieder in Betrieb genommen werden. Den Gewinn teilen sich die kanadische Rohstofffirma und eine rumänische Staatsgesellschaft im Verhältnis 4:1. Schäden an der Umwelt und eine entwurzelte Bevölkerung, das sind die Kernthemen dieses Dokumentarfilms, der in Rumänien viel Zustimmung und Beifall erfahren hat.'),
(9,2,'Lilith','Kurzfilm','In diesem Kurzspielfilm, ausgezeichnet mit dem Prädikat „Besonders Wertvoll“ macht eine Frau im fortgeschrittenen Alter eine unerwartete Entdeckung. Durch intensive Vorbereitungen und viel Einsatz vom ganzen Team ist es uns gelungen, einen Film zu erzählen, der visuell und inhaltlich stimmig über eine ungewöhnliche Begegnung erzählt.'),
(10,2,'Fußball ist unser Bier','Veltins','Web – Spot mit Gerald Asamoah in der Hauptrolle. Die Brauerei Veltins hat für diesen Dreh 4 Trickfußballer engagiert, die sich auf dem Brauereigelände austoben durften. Dies wurde in einem dokumentarischen Stil mit zwei eher roughen Handkameras langbrennweitig umgesetzt. Unschärfen und ungewöhnliche Perspektiven waren gewünscht und wurden für die Action gern in Kauf genommen :-).'),
(11,2,'Der Liebhaber','Testimonial','Mit wenig Budget in einer Privatwohnung auf 16mm gedreht, war hier das Licht-Setup nicht ganz unspannend. Mittels frei hängender Rohrkonstruktion über dem Bett konnten wir das weiche Top-Light über den Darstellern realisieren. Außerhalb des Fensters wurde mittels Greenscreen ein nachträglich angefertigtes Foto eingefügt und bewegt, um die Illusion einer späten Abendstimmung zu erzeugen.'),
(12,2,'man stirbt.','Experimenteller Dokumentarfilm','Experimenteller Dokumentarfilm über ein häufig tabuisiertes Thema. \r<br/>Zahlreiche Preise und Auszeichnungen:\r<br/>\r<br/>„Bester Deutscher Film“ beim Kurzfilmfestival Hamburg, 2009; Lobende Erwähnung der Jury, Kategorie „Bestes Drehbuch“, Internationales Festival der Filmhochschulen, München 2009\r<br/>1. Preis der Jury beim Kurzfilmfestival „unlimited“, Köln 2009\r<br/>1. Kölner Design Preis; Publikumspreis beim Festival DokumentArt Neubrandenburg, 2009.');

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

INSERT INTO `users` VALUES
(1,'test','nhDr7OyKlXQju+Ge/WKGrPQ9lPBSUFfpK+B1xqx/+8zLZqRNX0+5G1zBQklXUFy86lCpkAofsExlXiorUcKSNQ==','ROLE_USER',1);

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
  ADD KEY `projectid` (`project_id`,`lang_id`),
  ADD KEY `languageid` (`lang_id`);

--
-- Индексы таблицы `project_field_lang`
--
ALTER TABLE `project_field_lang`
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
