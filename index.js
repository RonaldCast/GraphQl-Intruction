const express = require('express')
const app = express()

const express_graphql = require('express-graphql');
//para poder construir un esquema
const {buildSchema} = require('graphql');

//el esquema
//data


//Mutation: se usan para en actualizar el estado

const schema = buildSchema(`

    type Query{
        course(id: Int!): Course
        courses(topic: String): [Course]
    }

    type Mutation{
        updateCourseTopic(id: Int!, topic: String): Course
    }

    type Course {
        id: Int,
        title: String,
        topic: String,
        author: String
        url: String

    }
`);


const { courses } = require("./data.json");
let getCourse = (args) => {
 
    let id = args.id
    return courses.find(n => n.id === id)
}
let getCourses = (args) => {
    
    if (args.topic) {
        
          let topic = args.topic;
          return courses.filter(n => n.topic.toUpperCase().includes(topic.toUpperCase()));
    }else{
        return courses;
    }
}

let updateCourseTopic = ({id, topic})=> {
    courses.map(course => {
        if(course.id === id){
            course.topic = topic
            return course;
        }
    })

    return courses.find(n => n.id === id)
}

//una funcion que retorna
const root = {
  course: getCourse,
  courses: getCourses,
  updateCourseTopic: updateCourseTopic
};

//integrando grapQL
//configuración
//schema: establece el esquema
//rootValue: esta retorna los datos
//graphiql: para la interfaz
app.use('/graphql', express_graphql({
    schema:  schema,
    rootValue: root,
    graphiql: true
    
}))


app.set('PORT',process.env.PORT || 3000)
app.listen(app.get('PORT'), () => {
    console.log("http://localhost:3000")
})


/*
///cliente

query getSingleCourse($courseID: Int!) {

  course(id: $courseID) {
    title
    author
  }
  
}

//query varieble 
{
  "courseID": 3
}


*/


/**
 * Client usando fragment
 
    query getCoursesWithFragments($courseID1: Int!, $courseID2: Int!){
  course1: course(id: $courseID1){
    ...courseField
  }
  
   course2: course(id: $courseID2){
    ...courseField
  }
}

fragment courseField on Course {
  title
  author
  url
}


//variable query
{
  "courseID1":1,
  "courseID2": 2
}
 */
