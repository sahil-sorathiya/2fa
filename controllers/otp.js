const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../helpers/nodemailer");
const Otp = require("../models/otp");

exports.otpRequest = async (req, res) => {

    try {
      const otpString = Math.floor(100000 + Math.random() * 900000).toString()
      const uuid = uuidv4()
      const { emailOfUser, domainname } = req.body;
      const otpObj = new Otp({
        otp: otpString,
        uuid: uuid,
        domain: req.domainData._id,
        client: req.clientData._id
      })
    
      const dbResponse = await otpObj.save();
  
      if(!dbResponse) {
        return res.status(400).json({
          error: true,
          errorMessage: "Otp object not saved in database"
        })
      }
  
      const maildata =
        process.env.SENDMAIL === "true"
          ? await sendMail(emailOfUser, otpString, true, domainname)
          : `Hello I'm maildata(SENDMAIL env variable is false. so no mail has been sent). userMail: ${emailOfUser}, otpString: ${otpString}, clientDomain: ${domainname}`;
      return res.status(200).json({
        error: false,
        successMessage:
          "Verification mail with OTP sent successfully to given email address",
          maildata,
      });
      
    } catch (error) {
      return res.status(400).json({
        error: true,
        errorMessage: error.message,
      });
    }
  }