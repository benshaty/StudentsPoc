// get the prev window.onload function and add some stuff to it
var pervOnload = window.onload;
window.onload = function () {
    if (pervOnload) {
        pervOnload();
    }
    let flag = (typeof AllUsersPage !== 'undefined' && AllUsersPage) ? true : false;
    document.getElementById("saveBtn").addEventListener('click', ()=>addGrade(flag));
    
};

$(document).ready(function() {
    $('body').tooltip({
        selector: "[data-tooltip=tooltip]",
        container: "body"
    });
});


const addGrade = (hasUserField) =>{
    let course = document.getElementById('course').value;
    let gradeInput = document.getElementById('grade');
    let grade = gradeInput.value;
    let username = (hasUserField) ? document.getElementById('username').value : ActiveUsername;
    if (!checkGrade(gradeInput)) {
        alert("Number can be from 0 to 100 only");
        return;
    }
    if (course.length != 0) {
        let data = {
            "username" : username,
            "grade" : grade,
            "course" : course
        }
        let initParam= { 
            "method":"POST",
             headers: {"Content-Type": "application/json"},
             body: JSON.stringify(data)
            };
        fetch(`/api/add_grade`,initParam).then(res=>res.json())
        .then((body) => {
            //console.log("response " + body.message);
            document.getElementById('closeModal').click();
            if (body.success == 'true') {
                location.reload();
            }
        })
        
    } else {
        alert('fill all data');
    }
}

const checkGrade = (e) => {
    const el = e.target || e
    if(el.type == "number" && el.max && el.min ){
        let value = parseInt(el.value);
        el.value = value; // normalize numbers (000 => 0)
        let max = parseInt(el.max);
        let min = parseInt(el.min);
        if ( value > max ) return false;
        if ( value < min ) return false;
        return true;
    }
}