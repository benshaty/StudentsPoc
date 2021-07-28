CREATE TABLE `students_poc`.`users` 
( `id` INT NOT NULL AUTO_INCREMENT , 
`username` VARCHAR(255) NOT NULL , 
`password` VARCHAR(250) NOT NULL , 
`email` VARCHAR(250) NOT NULL , 
`userlevel` INT NOT NULL DEFAULT '1' , 
PRIMARY KEY (`id`))
 ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;
