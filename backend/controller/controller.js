
const db = require('../model/database')
const brcypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY = "mykey"
const nodemailer = require("nodemailer");


exports.createuser = async (req, res) => {
  try {
    const salt = await brcypt.genSalt(10)
    const hash = await brcypt.hash(req.body.pass, salt)

    const token = jwt.sign({ email: req.body.email }, JWT_SECRET_KEY, {
      expiresIn: '30d'
    })

    const create = new db({
      name: req.body.name,
      email: req.body.email,
      pass: hash,
    })

    async function main() {
      let transporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "maheshpatilhp132@gmail.com", // generated ethereal user
          pass: "1vUx65Y3WCyX0bDP", // generated ethereal password
        },
      });


      let info = await transporter.sendMail({
        from: 'maheshpatilkg132@gmail.com', // sender address
        to: `${req.body.email}`, // list of receivers
        subject: "verification email", // Subject line
        html: `<h2>Please click on the below link to verify your account</h2>
               <a href='http://localhost:3000/verification/${token}'>http://localhost:3000/verification/${token}</a>
        `,
        name: "Mahesh"

      })
    }
    main().then(async (resonce) => {
      res.json('verification mail has been send, please verify your email')
      const user = await create.save()
    }).catch(console.error);

  } catch (error) {
    res.status(500).json(error.message)
  }

}





exports.getalldata = async (req, res) => {
  try {
    const data = await db.find({})
    res.send(data)

  } catch (error) {
    console.log(error.message);
  }
}

exports.getbyid = async (req, res) => {
  try {
    const user = await db.findOne({ _id: req.params.id }).populate('blogs')
    res.send(user)
  } catch (error) {
    res.json({ message: 'user not found' })
  }

}
exports.login = async (req, res) => {
  try {

    const user = await db.findOne({ email: req.body.email }).populate('blogs')

    if (!user) {
      res.status(203).json("wrong email or password is Entered");
    }

    if (user) {
      const valide = await brcypt.compare(req.body.pass, user.pass)
      if (valide) {

        if (user.verify) {
          const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY, {
            expiresIn: '30d'
          })
          res.cookie("login cookie", token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            httpOnly: true,
            samesite: 'lax'
          })
          res.send(user)
        }
        else {
          res.status(203).json('Your Account is not verified')
        }

      } else {
        res.status(203).json("Wrong email or password is entered")
      }

    }


  } catch (error) {
    res.send(error.message)
  }
}

exports.verifytoken = (req, res, next) => {
  const cookie = req.headers.cookie;
  if (cookie) {
    const token = cookie.split('=')[1]

    if (!token) {
      res.json({ message: "no token found" })
    }
    jwt.verify(String(token), JWT_SECRET_KEY, (err, user) => {
      if (err) {
        res.json({ message: "invalid token" })
      }
      req.email = user.email
    })
  }

  next()
}
exports.getdata = async (req, res, next) => {
  const email = req.email
  let user;
  try {
    user = await db.findOne({ email })
    res.json(user)
  } catch (error) {
    res.json({ message: "user not found" })
  }

}


exports.logout = (req, res, next) => {
  const cookie = req.headers.cookie;
  const token = cookie.split('=')[1]


  if (!token) {
    res.json({ message: "no token found" })
  }
  jwt.verify(String(token), JWT_SECRET_KEY, (err, user) => {
    if (err) {
      res.json({ message: "invalid token" })
    }
    res.clearCookie('login cookie')
    res.json('successfully deleted')
  })
}


exports.verification = (req, res, next) => {
  const id = req.params['id']

  if (id) {
    jwt.verify(id, JWT_SECRET_KEY, (err, user) => {
      if (err) {
        res.status(203).json("something went wrong")
      }
      console.log(user)
      if (user) {
        req.email = user.email
        next()
      }

    })
  }
}

exports.getverify = async (req, res, next) => {
  const email = req.email
  let user;
  try {
    user = await db.findOneAndUpdate({ email: email }, {
      verify: true
    })
    res.json(user)
  } catch (error) {
    res.json({ message: "user not found" })
  }

}