import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';


import AccountController from './apicontroller/CustomerAccountController';
import AccountRepository from './infrastructure/repositories/AccountRepository';
import CustomerRepository from './infrastructure/repositories/CustomerRepository';
import AccountCatalog from './domain/AccountCatalog';
import CustomerCatalog from './domain/CustomerCatalog';
import DomainController from './apicontroller/DomainController';
import DomainRepository from './infrastructure/repositories/DomainRepository';
import WebsiteController from './apicontroller/WebsiteController';  // Let op: default export instance

//dotenv 
dotenv.config();

// --- Upload folder setup ---
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// --- Multer configuratie ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

const app = express();

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// *** Global request logger (toegevoegd) ***
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// --- Controllers ---
const accountController = new AccountController(
    new AccountRepository(),
    new CustomerRepository(),
    new AccountCatalog(),
    new CustomerCatalog(),
    new DomainRepository()
);
const domainController = new DomainController(new DomainRepository(), new AccountRepository());

// --- Routes ---

// Account routes (ongewijzigd)
app.get('/api/account-customer', async (req, res, next) => {
    try {
        await accountController.getAllAccountCustomer(req, res);
    } catch (err) {
        next(err);
    }
});
app.post('/api/account', async (req, res, next) => {
    try {
        await accountController.addAccountAndCustomer(req, res);
    } catch (err) {
        next(err);
    }
});
app.put('/api/account/:username', async (req, res, next) => {
    console.log('Received PUT request for username:', req.params.username);
    try {
        await accountController.updateAccountAndCustomer(req, res);
    } catch (err) {
        console.error('Error in PUT request:', err);
        next(err);
    }
});
app.delete('/api/account/:username', async (req, res, next) => {
    try {
        await accountController.deleteAccountByUsername(req, res);
    } catch (err) {
        next(err);
    }
});

// Domain routes (ongewijzigd)
app.post('/api/domain', async (req, res, next) => {
    try {
        await domainController.createDomain(req, res);
    } catch (err) {
        next(err);
    }
});
app.get('/api/domain', async (req, res, next) => {
    try {
        await domainController.getAllDomains(req, res);
    } catch (err) {
        next(err);
    }
});
app.delete('/api/domain/:domainname', async (req, res, next) => {
    try {
        await domainController.deleteDomainByDomainName(req, res);
    } catch (err) {
        next(err);
    }
});

// --- Website routes ---
// *** Hier: Multer middleware upload.single('file') blijft vóór controller call ***
// *** WebsiteController is instance (default export), dus direct gebruiken ***

app.post('/api/website', upload.single('file'), async (req, res, next) => {
    console.log('POST /api/website route hit'); // Toegevoegd logging
    try {
        await WebsiteController.createWebsite(req, res);
    } catch (err) {
        next(err);
    }
});

app.get('/api/website', async (req, res, next) => {
    try {
        await WebsiteController.getAllWebsites(req, res);
    } catch (err) {
        next(err);
    }
});

app.delete('/api/website/:name', async (req, res, next) => {
    try {
        await WebsiteController.deleteWebsiteByName(req, res);
    } catch (err) {
        next(err);
    }
});

// --- Static folder for uploads ---
app.use('/uploads', express.static(uploadDir));

// --- Start server ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
