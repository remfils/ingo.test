CREATE TABLE project_description (
  id int(11) NOT NULL AUTO_INCREMENT,
  preview_url varchar(255) DEFAULT NULL,
  description text DEFAULT NULL,
  movie_id int(11) DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB
AUTO_INCREMENT = 3
AVG_ROW_LENGTH = 8192
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE project_fields (
  id int(11) NOT NULL AUTO_INCREMENT,
  movie_id int(11) DEFAULT NULL,
  field_name varchar(255) DEFAULT NULL,
  field_value varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB
AUTO_INCREMENT = 7
AVG_ROW_LENGTH = 2730
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE projects (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  color varchar(255) NOT NULL,
  year int(11) NOT NULL,
  logo varchar(255) NOT NULL,
  movie_id int(11) DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB
AUTO_INCREMENT = 3
AVG_ROW_LENGTH = 8192
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE users (
  id mediumint(9) NOT NULL AUTO_INCREMENT,
  login varchar(100) NOT NULL,
  password varchar(255) NOT NULL,
  role varchar(255) NOT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB
AUTO_INCREMENT = 3
AVG_ROW_LENGTH = 8192
CHARACTER SET utf8
COLLATE utf8_general_ci;