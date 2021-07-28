const express = require('express');
const router = express.Router();
const db = require('./db');
const multer = require('multer');
const appUtils = require('./appUtils');
const {
    request
} = require('express');
const forms = multer({
    dest: './upload/'
});

// homepage & login
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

router.get("/reports", (request, response) => {
    if (appUtils.checkCookie(request) && request.session.loggedin) {
        appUtils.extendCookie(request);
        appUtils.setCookieURL(request);
        response.status(200); // 200 is OK 
        response.render("pages/reports", {
            data: request.session,
            page_name: 'reports',
            activeUser: {
                username: request.session.username,
                userLevel: request.session.userLevel
            }
        });
    } else {
        response.redirect("/");
    }
});

router.get("/logoff", (request, response) => {
    request.session.destroy();
    response.redirect("/");
})

// view all user grades
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
    if (appUtils.checkCookie(request) && request.session.loggedin && request.session.userLevel == 2) {
        appUtils.setCookieURL(request);
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