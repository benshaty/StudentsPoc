
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
                    '<td><input type="text" class="form-control" name="multiply" id="multiply"></td>' +
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
                    let course = {
                        id: row[0],
                        name: row[1],
                        multiply: row[2],
                    }
                    if (course.id == '--') {
                        if (addCourse(course)) {
                            location.reload();
                        };
                    } else {
                        if (editCourse(course)) {
                            location.reload();
                        }
                    }
                    $(this).parents("tr").find(".add, .edit").toggle();
                    $(".add-new").removeAttr("disabled");
                }
            });


            // Edit row on edit button click
            $(document).on("click", ".edit", function () {
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
                let course = {
                    id: row[0],
                    name: row[1],
                    multiply: row[2],
                }
                let initParam = {
                    "method": "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(course)
                };
                fetch(`/api/delete_course/${course.id}`, initParam)
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


        const addCourse = async (course) => {
            let initParam = {
                "method": "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(course)
            };
            return fetch("/api/add_course", initParam);
        }

        const editCourse = async (course) => {
            let initParam = {
                "method": "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(course)
            };
            return fetch(`/api/edit_course/${course.id}`, initParam);
        }