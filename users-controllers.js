const { v4: uuid } = require("uuid");
const HttpError = require('./http-error');
 
const DUMMY_USERS = [
  {
    id: "p1",
    email:"p1@gmail.com",
    password:"p1pwd",
    classList: [{
      title: "P1C1",
      id: uuid(),
      students: [{name:'sally', count:8,backgroundColor:'yellow',}],
      styling: { groups: 4, format: "groups", theme: "" },
      count: 0,
    },
    {
      title: "P1C2",
      id: uuid(),
      students: [{name:'jilly', count:8,backgroundColor:'yellow',}],
      styling: { groups: 4, format: "groups", theme: "" },
      count: 0,
    },
    {
      title: "P1C3",
      id: uuid(),
      students: [{name:'bobby', count:8,backgroundColor:'yellow',}],
      styling: { groups: 4, format: "groups", theme: "" },
      count: 0,
    }]

    },
    {
      id: 'p2',
      email:'p2@gmail.com',
      password:'p2pwd',
      classList: [{
              title: "P2C1",
      id: uuid(),

              students: [{name:'sally', count:8,backgroundColor:'yellow',}],
              styling: { groups: 4, format: "groups", theme: "" },
              count: 0,
            },
            {
              title: "P2C2",
      id: uuid(),

              students: [{name:'jilly', count:8,backgroundColor:'yellow',}],
              styling: { groups: 4, format: "groups", theme: "" },
              count: 0,
            },
            {
              title: "P2C3",
      id: uuid(),

              students: [{name:'bobby', count:8,backgroundColor:'yellow',}],
              styling: { groups: 4, format: "groups", theme: "" },
              count: 0,
            }]
  
      }

  
]


const getUserById = (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_USERS.find(u => {
    return u.id === userId;
  })
  if (!user){
    return next(new HttpError('Could not find a user for the provided id.', 404))
  }
  res.json({user});

}

const createClass = (req, res, next) => {
  const userId = req.params.uid;
  const { title, students, styling, count} = req.body;

  const user = DUMMY_USERS.find(u => {
    return u.id === userId;
  })
  if (!user){
    return next(new HttpError('Cannot add class to an unknown user.', 404))

  }
  const createdClass = {
    title,
    students,
    styling,
    count,
    id: uuid(),

  };
  user.classList.push(createdClass)
  res.json({user});

}
const updateClass = (req, res, next) => {
  const userId = req.params.uid;
  const classId = req.params.cid;
  const { students, styling, count} = req.body;

  const user = DUMMY_USERS.find(u => u.id === userId);
  console.log(user.classList)
  const updatedClass = user.classList.find(c => c.id === classId);

  updatedClass.students = students;
  updatedClass.styling = styling;
  updatedClass.count = count; 

  res.json({user});

}
const deleteClass = (req, res, next) => {
  const userId = req.params.uid;
  const classId = req.params.cid;
  const user = DUMMY_USERS.find(u => u.id === userId);
  const newClassList = user.classList.filter(c => c.id !== classId);

  user.classList = newClassList;
  res.json({user});

}
const signUp = (req, res, next) => {
  const {email, password} = req.body;

  const createdUser = {
    id: uuid(),
    email,
    password,

  }
  DUMMY_USERS.push(createdUser);
  console.log(DUMMY_USERS)
  res.status(201).json({user:createdUser})
  
}

const login = (req, res, next) => {
  const {email, password} = req.body;

  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password){
    throw new HttpError('Could not identify user, credentials seem to be invalid');
  }
  res.json({message:'Logged in!'});
}

exports.getUserById = getUserById;
exports.signUp = signUp;
exports.login = login;
exports.createClass = createClass;
exports.updateClass = updateClass;
exports.deleteClass = deleteClass;
