
const { v4: uuid } = require("uuid");
const HttpError = require('./http-error');

const User = require('./user-model')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

const createClass = async(req, res, next) => {
  const userId = req.params.uid;
  const { title, students, styling, count, id} = req.body;
  let user;
  try{
    user = await User.findById(userId);
  } catch(err) {
    const error = new HttpError('Could not find user',500)
    return next(error)
  }
  
  if (!user){
    return next(new HttpError('Cannot add class to an unknown user.', 404))

  }
  const createdClass = {
    title,
    students,
    styling,
    count,
    id
  };

  user.classList.push(createdClass)
  try{
    await user.save();
  } catch (err) {
    const error = new HttpError('Could not create class', 500);
    return next(error);
  }
  res.json({user});

}
const updateClass = async(req, res, next) => {
  const userId = req.params.uid;
  const classId = req.params.cid;
  
  const { students, styling, count} = req.body;
  let user;
  try{
    user = await User.findById(userId);
  } catch(err) {
    const error = new HttpError('Could not find user',500)
    return next(error)
  }

  const updatedClass = user.classList.find(c => c.id === classId);
  updatedClass.students = students;
  updatedClass.styling = styling;
  updatedClass.count = count; 

  try{
    user.markModified('classList') //ensures that database knows that classList has changed and needs to be saved
    await user.save();
  } catch (err) {
    const error = new HttpError('Could not update class', 500);
    return next(error);
  }
  res.json({user});

}
const deleteClass = async(req, res, next) => {
  const userId = req.params.uid;
  const classId = req.params.cid;
  let user;

  try{
    user = await User.findById(userId);
  } catch(err) {
    const error = new HttpError('Could not find user',500)
    return next(error)
  }

  const newClassList = user.classList.filter(c => c.id !== classId);

  user.classList = newClassList;
  try{
    await user.save();
  } catch (err) {
    const error = new HttpError('Could not delete class', 500);
    return next(error);
  }
  res.json({user});

}
const signUp = async (req, res, next) => {
  const {email, password} = req.body;
  let existingUser;
  try{
    existingUser = await User.findOne({email: email});
    } catch (err) {
      const error = new HttpError('Sign up failed, try again later', 500);
      return next(error);
    }
  if (existingUser) {
    const error = new HttpError('User already exists, please login instead', 422);
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create user, please try again', 500);
    return next(error);
  }
  const createdUser = new User({
    // id: uuid(),
    email,
    password: hashedPassword,
    classList: []
  })
  try{
    await createdUser.save();

  } catch(err) {
    const error = new HttpError('Could not sign up, please try again later', 500);
    return next(error);
  }
  let token;
  try{
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email}, 'supersecret_dont_share', {expiresIn:'1h'}
    )
  } catch(err) {
    const error = new HttpError('Sign up failed, try again later', 500);
    return next(error);
  }

  res.status(201).json({userId: createdUser.id, email:createdUser.email, token:token})
  
}

const login = async(req, res, next) => {
  const {email, password} = req.body;
  let existingUser;
  try{
    id ? existingUser = await User.findOne({id:id}):
    existingUser = await User.findOne({ email:email});
  } catch(err) {
    const error = new HttpError('Login failed',500)
    return next(error)
  }

  let isValidPassword = false;
  try{
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError('Could not log you in, please check your credentials', 500);
    return next(error)
  }
  let token;
  try{
    token = jwt.sign(
      { userId: existingUser.id, email:existingUser.email},'supersecret_dont_share', {expiresIn: '1h'}
    )
  } catch (err) {
    const error = new HttpError('Login failed, please try again later', 500);
    return next(error)
  }
  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    classList:existingUser.classList
  })

}
const googleLogin = async(req, res, next) => {
  const { id, email, token } = req.body;
  console.log('googlelogin', token)
  let existingUser;
  try{
    existingUser = await User.findOne({email:email});
    console.log('existinguser', existingUser)

  } catch(err) {
    const error = new HttpError('Login failed',500);
    return next(error)
  }
  if (existingUser){
    res.json({
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
      classList: existingUser.classList
    })
    console.log('if existing user',existingUser)
  } else {
    console.log('no existing user')
    const createdUser = new User({
      id,
      email,
      password: 'google',
      classList: []
    })
    try{
      await createdUser.save();
      console.log('createdusersaved??')
  
    } catch(err) {
      const error = new HttpError('Could not sign up, please try again later', 500);
      return next(error);
    }
    let token;
    try{
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email}, 'supersecret_dont_share', {expiresIn:'1h'}
      )
    } catch(err) {
      const error = new HttpError('Sign up failed, try again later', 500);
      return next(error);
    }
  
    res.status(201).json({userId: createdUser.id, email:createdUser.email, token:token, classList:createdUser.classList})
    

  }



}

exports.getUserById = getUserById;
exports.signUp = signUp;
exports.login = login;
exports.googleLogin = googleLogin;
exports.createClass = createClass;
exports.updateClass = updateClass;
exports.deleteClass = deleteClass;
