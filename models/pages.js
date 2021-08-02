// File dependencies
const express = require('express');
const router = express.Router();
const db = require('./db');
const appUtils = require('./appUtils');

// Homepage & Login
router.get("/", (request, response) => {
    if (appUtils.checkCookie(request) && request.session.loggedin) {
        appUtils.extendCookie(request);
        appUtils.setCookieURL(request);
        response.status(200); // 200 is OK 
        response.render("pages/index", {
            data: request.session,
            page_name: 'home',
            activeUser: {
                username: request.session.username,
                userLevel: request.session.userLevel
            }
        });
    } else {
        response.status(200); // 200 is OK 
        response.render("pages/login");
    }
});

// Reports
router.get("/reports", (request, response) => {
    appUtils.setCookieURL(request);
    if (appUtils.checkCookie(request) && request.session.loggedin) {
        appUtils.extendCookie(request);
        response.status(200); // 200 is OK 
        /*
        SQL query:
            SELECT `courses`.`name`, CAST(AVG(`grades`.`grade`) AS DECIMAL(10,2)) FROM `grades` INNER JOIN `courses` ON `grades`.`courseid` = `courses`.`id` INNER JOIN `users` ON `grades`.`userid` = `users`.`id` WHERE `userid` = 1 GROUP BY `courses`.`name`
        */
            db.runQuery("SELECT `courses`.`name`, CAST(AVG(`grades`.`grade`) AS DECIMAL(10,2)) AS `grade` FROM `grades` INNER JOIN `courses` ON `grades`.`courseid` = `courses`.`id` INNER JOIN `users` ON `grades`.`userid` = `users`.`id` WHERE `username` = '"+request.session.username+"' GROUP BY `courses`.`name`")
            .then(
                (res) => {
                    response.status(200); // 200 is OK 
                    response.render("pages/reports", {
                        data: request.session,
                        page_name: 'reports',
                        grades: res,
                        activeUser: {
                            username: request.session.username,
                            userLevel: request.session.userLevel
                        }
                    });
                }
            )
            .catch(
                (err) => {
                    response.status(400); // 400 is NOT OK 
                    response.send(err);
                }
            )
        
    } else {
        response.redirect("/");
    }
});

// Logoff
router.get("/logoff", (request, response) => {
    request.session.destroy();
    response.redirect("/");
})

// View all user grades
router.get('/all', (request, response) => {
    appUtils.setCookieURL(request);
    if (appUtils.checkCookie(request) && request.session.loggedin) {
        appUtils.extendCookie(request);
        db.runQuery("SELECT * FROM `courses`")
            .then(
                (courses) => {
                    db.runQuery("SELECT `grades`.`id`, `users`.`username` , `courses`.`name` AS `coursename`, `grades`.`grade` FROM `grades` INNER JOIN `courses` ON `grades`.`courseid` = `courses`.`id` INNER JOIN `users` ON `grades`.`userid` = `users`.`id` WHERE `users`.`username` = '" + request.session.username + "'")
                        .then(
                            (res) => {
                                let sumCourse = 0;
                                let avarage = 0;
                                for(var i=0; i < res.length; i++) {
                                    avarage += parseInt(res[i].grade);
                                }
                                avarage /= res.length;
                                response.status(200); // 200 is OK 
                                response.render("pages/grades_view", {
                                    data: res,
                                    courses: courses,
                                    avarage: parseFloat(avarage).toFixed(2),
                                    page_name: 'all',
                                    activeUser: {
                                        username: request.session.username,
                                        userLevel: request.session.userLevel
                                    }
                                });
                            }
                        )
                        .catch(
                            (err) => {
                                response.status(400); // 400 is NOT OK 
                                response.send(err);
                            }
                        )
                }
            )
            .catch(
                (err) => {
                    console.log(err);
                }
            )

    } else {
        response.status(200); // 200 is OK 
        response.redirect('/');
    }
})

// view all users grades (admin only)
router.get('/allgrades', (request, response) => {
    appUtils.setCookieURL(request);
    if (appUtils.checkCookie(request) && request.session.loggedin && request.session.userLevel == 2) {
        appUtils.extendCookie(request);
        db.runQuery("SELECT * FROM `courses`")
            .then(
                (courses) => {
                    db.runQuery("SELECT * FROM `users`")
                        .then(
                            (users) => {
                                db.runQuery("SELECT `grades`.`id`, `users`.`username` , `courses`.`name` AS `coursename`, `grades`.`grade` FROM `grades` INNER JOIN `courses` ON `grades`.`courseid` = `courses`.`id` INNER JOIN `users` ON `grades`.`userid` = `users`.`id`")
                                    .then(
                                        (res) => {
                                            response.status(200); // 200 is OK 
                                            response.render("pages/grades_view", {
                                                data: res,
                                                courses: courses,
                                                users: users,
                                                page_name: 'allgrades',
                                                activeUser: {
                                                    username: request.session.username,
                                                    userLevel: request.session.userLevel
                                                }
                                            });
                                        }
                                    )
                                    .catch(
                                        (err) => {
                                            response.status(400); // 400 is NOT OK 
                                            response.send(err);
                                        }
                                    )
                            }
                        )
                        .catch(
                            (err) => {
                                response.status(400); // 400 is NOT OK 
                                response.send(err);
                            }
                        )
                }
            )
            .catch(
                (err) => {
                    console.log(err);
                }
            )
    } else {
        response.status(200); // 200 is OK 
        response.redirect('/');
    }
})

// Manage users (admin only)
router.get("/users", (request, response) => {
    appUtils.setCookieURL(request);
    if (appUtils.checkCookie(request) && request.session.loggedin && request.session.userLevel == 2) {
        appUtils.extendCookie(request);
        db.runQuery("SELECT * FROM `users`")
            .then(
                (res) => {

                    response.status(200); // 200 is OK 
                    response.render("pages/users", {
                        page_name: 'users',
                        data: res,
                        activeUser: {
                            username: request.session.username,
                            userLevel: request.session.userLevel
                        }
                    });
                }
            )
            .catch(
                (err) => {
                    response.status(400); // 400 is NOT OK 
                    response.send(err);
                }
            )
    } else {
        response.status(200); // 200 is OK 
        response.redirect('/');
    }
});

// Manage courses (admin only)
router.get("/courses", (request, response) => {
    appUtils.setCookieURL(request);
    if (appUtils.checkCookie(request) && request.session.loggedin && request.session.userLevel == 2) {
        appUtils.extendCookie(request);
        db.runQuery("SELECT * FROM `courses`")
            .then(
                (res) => {

                    response.status(200); // 200 is OK 
                    response.render("pages/courses", {
                        page_name: 'courses',
                        data: res,
                        activeUser: {
                            username: request.session.username,
                            userLevel: request.session.userLevel
                        }
                    });
                }
            )
            .catch(
                (err) => {
                    response.status(400); // 400 is NOT OK 
                    response.send(err);
                }
            )
    } else {
        response.status(200); // 200 is OK 
        response.redirect('/');
    }
});

module.exports = router;