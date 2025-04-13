"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AccountRepository_1 = __importDefault(require("./infrastructure/repositories/AccountRepository"));
const database_1 = __importDefault(require("./infrastructure/database")); // Database connectie
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 🔹 Database connectie testen
        yield database_1.default.authenticate();
        console.log("✅ Database connected!");
        // 🔹 Account aanmaken voor customerID 9
        const newAccountData = {
            username: "alicejohnson", // Gebruik een unieke gebruikersnaam
            password: "securePassword123", // Gebruik een veilig wachtwoord
            customerID: 9, // Het customerID van de klant
            // creationDate wordt automatisch ingevuld, maar kan optioneel meegegeven worden als je dat wilt
        };
        const accountRepository = new AccountRepository_1.default();
        // Account aanmaken
        const newAccount = yield accountRepository.create(newAccountData);
        console.log("✅ Nieuw account aangemaakt:", newAccount.toJSON());
        // Sluit de database connectie
        yield database_1.default.close();
    }
    catch (error) {
        console.error("❌ Fout tijdens het aanmaken van account:", error);
    }
}))();
