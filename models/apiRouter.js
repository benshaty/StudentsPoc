// File dependencies
var express = require('express');
var router = express.Router();
const db = require('./db');
const appUtils = require('./appUtils');

// Login
router.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        db.runQuery(`SELECT * FROM users WHERE username = '${username}'`)
            .then(
                (res) => {
                    if (res.length > 0 && appUtils.compairPass(password, res[0].password)) {
                        request.session.loggedin = true;
                        request.session.username = username;
                        request.session.cookie.maxAge = Date.now() + (10 * 1000);
                        request.session.userLevel = res[0].userlevel;
                        // return to priv url set in the cookie
                        response.redirect((request.session.current_url) ? request.session.current_url : '/');
                    } else {
                        request.session.loggedin = false;
                        request.session.username = null;
                        response.redirect('/');
                    }
                }
            )
            .catch(
                (err) => {
                    response.status(400); // 400 is NOT OK 
                    response.send(err);
                }
            )
    } else {
        response.send('Please enter Username and Password!');
    }
});

// Add user
router.post("/add_user",
    (request, response) => {
        db.runQuery("INSERT INTO `users` (`username`, `password`, `email`, `userlevel`) " + `VALUES ('${request.body.username}','${appUtils.createHash(request.body.password)}','${request.body.email}','${request.body.userLevel}'); `)
            .then(
                (res) => {
                    response.status(201); // 201 is CREATED 
                    response.send({
                        "message": "added successfully to the db"
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
);

// Add grade
router.post("/add_grade",
    (request, response) => {
        db.runQuery("SELECT `id` from `users` WHERE `username` = '" + request.body.username + "'")
            .then((resUserId) => {
                db.runQuery("INSERT INTO `grades` (`id`, `userid`, `courseid`, `grade`) VALUES (NULL, '" + resUserId[0].id + "', '" + request.body.course + "', '" + request.body.grade + "')")
                    .then(
                        (res) => {
                            response.status(201); // 201 is CREATED 
                            response.send({
                                "message": "grade added to user " + request.body.username,
                                "success": 'true'
                            });
                        }
                    )
                    .catch(
                        (err) => {
                            response.status(400); // 400 is NOT OK 
                            response.send({
                                "message": err + " from insert user",
                                "success": 'false'
                            });
                        }
                    )
            })
            .catch(
                (err) => {
                    response.status(400); // 400 is NOT OK 
                    response.send({
                        "message": err + " from get user",
                        "success": 'false'
                    });
                }
            )
    }
);

// Update user
router.put("/edit_user/:user", (request, response) => {
    if (request.params.user != '1') {
        let sql = "";
        if (request.body.passwordChange) {
            sql = "UPDATE `users` SET `username` = '" + request.body.username + "', `password` = '" + appUtils.createHash(request.body.password) + "', `email` = '" + request.body.email + "', `userlevel` = '" + request.body.userLevel + "' WHERE `users`.`id` = " + request.params.user;
        } else {
            sql = "UPDATE `users` SET `username` = '" + request.body.username + "', `password` = '" + request.body.password + "', `email` = '" + request.body.email + "', `userlevel` = '" + request.body.userLevel + "' WHERE `users`.`id` = " + request.params.user;
        }
        db.runQuery(sql)
            .then(
                (res) => {
                    response.status(200); // 200 is OK 
                    response.send({
                        "message": "updated successfully to the db"
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
        console.log("cant edit admin pass : 1234");
    }

});

// Delete user
router.delete("/delete_user/:usr", (request, response) => {
    if (request.params.usr == '0') {
        response.status(200);
        response.send({
            "message": `User id ${request.params.usr} has been deleted`
        });
    } else if (request.params.usr == '1') {
        response.status(406); // 406 is Not Acceptable
        response.send({
            "message": "Cannot delete Admin account",
            "error": "1"
        });
    } else {
        db.runQuery(`DELETE FROM users WHERE id='${request.params.usr}';`)
            .then(
                (res) => {
                    response.status(202); // 202 is ACCEPTED
                    response.send({
                        "message": `User id ${request.params.usr} has been deleted`
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
})

// Delete course
router.delete("/delete_course/:course", (request, response) => {
    db.runQuery(`DELETE FROM courses WHERE id='${request.params.course}';`)
        .then(
            (res) => {
                response.status(202); // 202 is ACCEPTED
                response.send({
                    "message": `Course id ${request.params.course} has been deleted`
                });
            }
        )
        .catch(
            (err) => {
                response.status(400); // 400 is NOT OK 
                response.send(err);
            }
        )
})


// Update course
router.put("/edit_course/:course", (request, response) => {
    let sql = "UPDATE `courses` SET `name` = '"+ request.body.name+"', `multiply` = '"+request.body.multiply + "' WHERE `courses`.`id` = '" + request.params.course + "'";
    db.runQuery(sql)
        .then(
            (res) => {
                response.status(200); // 200 is OK 
                response.send({
                    "message": "updated successfully to the db"
                });
            }
        )
        .catch(
            (err) => {
                response.status(400); // 400 is NOT OK 
                response.send(err);
            }
        )
});


// Add course
router.post("/add_course",
    (request, response) => {
        db.runQuery("INSERT INTO `courses` (`name`, `multiply`) " + `VALUES ('${request.body.name}','${request.body.multiply}'); `)
            .then(
                (res) => {
                    response.status(201); // 201 is CREATED 
                    response.send({
                        "message": "added successfully to the db"
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
);


module.exports = router;