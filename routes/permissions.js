const express = require('express');
const Permission = require('../models/permission'); // Adjust the path as needed
const translate = require('@iamtraction/google-translate');
const router = express.Router();
const admin = require('../firebase/firebaseAdmin');
router.get('/', async (req, res) => {
  // const { method, endpoint } = req.body;
  // try {
  //   const newPermission = new Permission({ method, endpoint });
  //   await newPermission.save();
  //   console.log(newPermission)
  // const translated=await  translate({message:"مزادات مصر"}, { to: 'en' })
  //   res.status(201).json({ message: 'Permission created', permission: translated.text });
  // } catch (error) {
  //   res.status(400).json({ message: 'Error creating permission', error });
  // }





  try {
  
    const message = {
      notification: {
        title: "mazadat",
        body: 'تم ترسية المزاد بنجاح  ',
      
      },
      token: 'eEQj-fiHDJHXSxeWxkV4X6:APA91bFKWyToFnXNtVuqGnmCLCzhaGQXuW4V7tM2yIqwaF-StpUMo3cHB2Z7nb_TPlLKdOnRZlwqgCKsxzf5dekLRog5rZY-6-c2n50_L8RKWaccqscNCEKR9G7GjTP8IP4t9AaaMar0',
      android: {
        notification: {
          image: 'https://foo.bar.pizza-monster.png'
        },
 
      },
      webpush: {
        headers: {
          image: 'https://foo.bar.pizza-monster.png'
        }
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1
          }
        },
        fcm_options: {
          image: 'https://foo.bar.pizza-monster.png'
        }
      },
    };

      const response = await admin.messaging().send(message)
    
      res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
  







}});


module.exports = router;
