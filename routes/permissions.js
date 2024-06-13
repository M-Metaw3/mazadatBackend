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
      token: 'cZTVaO8iToWIESFPsfWi6C:APA91bHdg5PcreWEzbU9doM3q2zSV8yiGuetw68gXuXaDx7tRylScpxQm6MWUq5anh9-8Sxht-zuAbOkHynknS7-7_nyW9lTcoRXJnKw_Wyvpj0r6AVfy_v-YCcC41MhGiQIlDmzxmcp',
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
