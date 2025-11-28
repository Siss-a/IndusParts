// uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Criar diretório de uploads se não existir
const uploadsDir = path.join(__dirname, '..', 'uploads', 'imagens');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}


// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Gerar nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'produto-' + uniqueSuffix + ext);
    }
});


// Filtro de arquivos (apenas imagens)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
   
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido. Envie apenas imagens (JPEG, PNG, GIF, WEBP)'), false);
    }
};


// Configuração do multer
const uploadImagem = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB padrão
    }
});


// Função para remover arquivo antigo
async function removerArquivoAntigo(nomeArquivo, tipo = 'imagem') {
    try {
        const caminhoArquivo = path.join(uploadsDir, nomeArquivo);
       
        if (fs.existsSync(caminhoArquivo)) {
            fs.unlinkSync(caminhoArquivo);
            console.log(`Arquivo ${nomeArquivo} removido com sucesso`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao remover arquivo:', error);
        return false;
    }
}


export { uploadImagem, removerArquivoAntigo };