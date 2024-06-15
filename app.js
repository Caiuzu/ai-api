const express = require('express');
const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// Configuração do Winston
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    label({ label: 'API Gemini' }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    myFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Middleware para logs
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Middleware para JSON
app.use(express.json());

// Inicializando o Gemini
const genAI = new GoogleGenerativeAI(process.env.API_KEY); 
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Configuração de geração de texto
const generationConfig = {
    temperature: 1, // Controlando a criatividade
    topP: 0.95,  // Controlando a variedade
    topK: 64,    // Controlando a variedade
    maxOutputTokens: 8192, // Definindo o tamanho máximo do texto gerado
    responseMimeType: "text/plain", // Definindo o tipo de resposta
};

// Configuração do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API Gemini',
      version: '1.0.0',
      description: 'API para gerar texto com o Gemini',
    },
  },
  apis: ['./app.js'], // Caminho dos arquivos de rotas
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /generate:
 *   post:
 *     summary: Gera texto usando o Gemini
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: O prompt para gerar texto
 *     responses:
 *       200:
 *         description: Texto gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *       500:
 *         description: Erro ao gerar texto
 */
app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await model.generateContent(prompt, generationConfig); // Usando a configuração
    const response = await result.response;
    const text = response.text();

    logger.info('Resposta do Gemini:', text); 
    res.json({ text }); 
  } catch (error) {
    logger.error('Erro ao gerar resposta do Gemini:', error);
    res.status(500).json({ error: 'Erro ao gerar resposta do Gemini' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Servidor ouvindo na porta ${port}`);
});