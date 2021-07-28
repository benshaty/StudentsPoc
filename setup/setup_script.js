const db = require('../models/db');
const fs = require('fs');

const setupDataBase = async () => {
    let createDB = await runSetupQuery("./create_db.sql");
    if (createDB){
        let createUsers = await runSetupQuery("users_create.sql");
    let createGrades = await runSetupQuery("grades_create.sql");
    let createCourses = await runSetupQuery("courses_create.sql");
        if (createUsers && createGrades && createCourses){
            let insertAdmin = await runSetupQuery("insert_admin.sql");
            let insertCourse = await runSetupQuery("insert_course.sql");
            console.log("Setup database is completed!!");
            if (insertAdmin && insertCourse) {
                console.log("Sample data inserted");
            }
            process.exit();
        }
    } else {
        console.log("Error while setup database.")
        process.exit();
    }
}

const runSetupQuery = (filename)=> {
    let res = false;
    const data = fs.readFileSync(require('path').resolve(__dirname,filename), 'utf8').toString();
    return db.runQuery(data)
    .then(() => {
        console.log(`${filename} did it's work :)`);
        return true;
    })
    .catch(
        (err) => {
            console.log("didnt work " + err);
            return false;
        }
    )
}

db.connect()
.then(()=>{
    setupDataBase();
})
.catch((err)=>{
    process.exit();
});