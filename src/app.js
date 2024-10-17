import express from "express";
import { v4 as uuidv4 } from 'uuid';
import fileUpload from "express-fileupload";

import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

/* 
    Se quiser limitar o tamanho do arquivo que a api pode receber coloque aqui
    Exemplo:
    app.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 }, // Em bytes
    }));
*/

app.use(fileUpload())

const s3Client = new S3Client({
    region: ,
    credentials: { 
        accessKeyId: ,
        secretAccessKey: 
    }
});

app.post('/upload', async(req, res)=>{

    // Defini o parametro do multpart/form-data como image apenas de exemplo
    // podem ser passado quais e quantos campos quiser

    const fileName = `${uuidv4()}.${req.files.image.mimetype.split('/')[1]}`
    await s3Client.send(
        new PutObjectCommand({
            Bucket: 'quimicainbox',
            Key: fileName,
            Body: req.files.image.data,
        }),
    );

    return res.status(200).json({
        message: 'Sucess',
        url: `https://quimicainbox.s3.sa-east-1.amazonaws.com/${fileName}`
    })

})

app.listen(3000,()=>{
    console.log('Running at 3000 port')
})
