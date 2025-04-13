import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import AccountController from './apicontroller/CustomerAccountController';
import AccountRepository from './infrastructure/repositories/AccountRepository';
import CustomerRepository from './infrastructure/repositories/CustomerRepository';
import AccountCatalog from './domain/AccountCatalog';
import CustomerCatalog from './domain/CustomerCatalog';

const app = express();

// Controllers en dependencies
const accountController = new AccountController(
    new AccountRepository(),
    new CustomerRepository(),
    new AccountCatalog(),
    new CustomerCatalog()
);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
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

app.delete('/api/account/:username', async (req, res, next) => {
    try {
        await accountController.deleteAccountByUsername(req, res);
    } catch (err) {
        next(err);
    }
});

// Start de server en log een bericht dat de server draait
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app; // Exporteer de app voor gebruik in tests of andere modules