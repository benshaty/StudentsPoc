var pass;
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
            var actions = $("table td:last-child").html();
            // Append table with add row form on add new button click
            $(".add-new").click(function () {
                $(this).attr("disabled", "disabled");
                var index = $("table tbody tr:last-child").index();
                var row = '<tr>' +
                    '<td><input type="text" readonly class="form-control" name="id" id="id" value="--"></td>' +
                    '<td><input type="text" class="form-control" name="name" id="name"></td>' +
                    '<td><input type="text" class="form-control" name="email" id="email"></td>' +
                    '<td><input type="text" class="form-control" name="userLevel" id="userLevel"></td>' +
                    '<td><input type="text" class="form-control" name="password" id="password"></td>' +
                    '<td>' + actions + '</td>' +
                    '</tr>';
                $("table").append(row);
                $("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
                $('[data-toggle="tooltip"]').tooltip();
            });

            // Add row on add button click
            $(document).on("click", ".add", function () {
                var empty = false;
                var input = $(this).parents("tr").find('input[type="text"]');
                input.each(function () {
                    if (!$(this).val()) {
                        $(this).addClass("error");
                        empty = true;
                    } else {
                        $(this).removeClass("error");
                    }
                });
                $(this).parents("tr").find(".error").first().focus();
                if (!empty) {
                    input.each(function () {
                        $(this).parent("td").html($(this).val());
                    });
                    let row = $(this).parents("tr").find('td').get().map(function (cell) {
                        return $(cell).html();
                    });
                    let user = {
                        id: row[0],
                        username: row[1],
                        email: row[2],
                        userLevel: row[3],
                        password: row[4],
                        passwordChange: true
                    }
                    if (user.password == pass) {
                        user.passwordChange = false;
                    }
                    if (user.id == '--') {
                        if (addUser(user)) {
                            location.reload();
                        };
                    } else {
                        if (editUser(user)) {
                            location.reload();
                        }
                    }
                    $(this).parents("tr").find(".add, .edit").toggle();
                    $(".add-new").removeAttr("disabled");
                }
            });


            // Edit row on edit button click
            $(document).on("click", ".edit", function () {
                let _pass = $(this).parents("tr").find("td")[4];
                pass = $(_pass).text();
                $(this).parents("tr").find("td:not(:last-child, :first-child)").each(function () {
                    $(this).html('<input type="text" class="form-control" value="' + $(this)
                        .text() + '">');
                });
                $(this).parents("tr").find(".add, .edit").toggle();
                $(".add-new").attr("disabled", "disabled");
            });



            // Delete row on delete button click
            $(document).on("click", ".delete", function () {
                let row = $(this).parents("tr").find('td').get().map(function (cell) {
                    return $(cell).html();
                });
                let user = {
                    id: row[0],
                    username: row[1],
                    email: row[2],
                    userLevel: row[3],
                    password: row[4]
                }
                let initParam = {
                    "method": "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user)
                };
                fetch(`/api/delete_user/${user.id}`, initParam)
                    .then(res => res.json())
                    .then(body => {
                        console.log(body.message);
                        if (body.error != '1') {
                            $(".add-new").removeAttr("disabled");
                            $(this).parents("tr").remove();
                        }
                    });

            });
        });


        const addUser = async (user) => {
            let initParam = {
                "method": "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            };
            return fetch("/api/add_user", initParam);
        }

        const editUser = async (user) => {
            let initParam = {
                "method": "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            };
            return fetch(`/api/edit_user/${user.id}`, initParam);
        }