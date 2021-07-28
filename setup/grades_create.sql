CREATE TABLE `students_poc`.`grades` 
( `id` INT NOT NULL AUTO_INCREMENT , 
`userid` INT NOT NULL , 
`courseid` INT NOT NULL , 
`grade` INT NOT NULL , 
PRIMARY KEY (`id`)) 
ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;