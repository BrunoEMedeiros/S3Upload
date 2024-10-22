import express from "express";
import { v4 as uuidv4 } from 'uuid';

// Sem essa biblioteca não sera possivel usar o req.files ou seja, não vai conseguir subir imagens
import fileUpload from "express-fileupload";

// A documentação da AWS que basea esse código: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
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
    Habilitar o middleware "express-fileupload" é necessario para lidar com arquivos
    Se quiser limitar o tamanho do arquivo que a api pode receber coloque aqui
    Exemplo:
    app.use(fileUpload({
        limits: { fileSize: tamanho maximo do arquivo em bytes },
    }));
*/
app.use(fileUpload())

// Aqui vão as suas configurações da sua conta da AWS
// O mais correto é gravar em um local como .env
const s3Client = new S3Client({
    region: '',
    credentials: { 
        accessKeyId: '',
        secretAccessKey: ''
    }
});

app.post('/upload', async(req, res)=>{

    /* 
        Defini o parametro do multpart/form-data como image apenas de exemplo
        podem ser passado quais e quantos campos quiser.
        req.files.image.data que é passado dentro do Body é a imagem vinda
        da requisição HTTP, desta forma ela é carregada como Buffer
    */
    
    // Uso o uuid para gerar um token aleatório para usar como nome da imagem no bucket
    const fileName = `${uuidv4()}.jpeg`
    await s3Client.send(
        new PutObjectCommand({
            Bucket: 'quimicainbox',
            Key: fileName,
            Body: req.files.image.data,
        }),
    );

    // Use esse padrão de retorno de URL para gravar no banco
    return res.status(200).json({
        message: 'Sucess',
        url: `https://quimicainbox.s3.sa-east-1.amazonaws.com/${fileName}`
    })

})

app.listen(3000,()=>{
    console.log('Running at 3000 port')
})
