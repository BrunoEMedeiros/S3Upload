import express from "express";
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config.js'

import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const s3Client = new S3Client({
    region: 'sa-east-1',
    credentials: { 
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

app.post('/upload', async(req, res)=>{
    // Uso o uuid para gerar um token aleatório para usar como nome da imagem no bucket
    const fileName = `${uuidv4()}.jpeg`
    
    let buffer = Buffer.from(req.body.image, 'base64')

    await s3Client.send(
        new PutObjectCommand({
            ContentType: 'image/jpeg', // Tipo MIME do arquivo  
            Bucket: 'sucumba',
            Key: fileName,
            Body: buffer,
        }),
    );

    // Use esse padrão de retorno de URL para gravar no banco
    return res.status(200).json({
        message: 'Sucess',
        url: `https://sucumba.s3.sa-east-1.amazonaws.com/${fileName}`
    })

})

app.listen(3000,()=>{
    console.log('Running at 3000 port')
})
