"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerCreateUpdateRegisterRepository = void 0;
const client_1 = require("@prisma/client");
const userIsAdminConfirm_1 = require("../userisAdminConfirm/userIsAdminConfirm");
const prisma = new client_1.PrismaClient();
class ConsumerCreateUpdateRegisterRepository {
    async UserIsAdminConfirm({ idToken, fullNameToken }) {
        let isAdmin = await (0, userIsAdminConfirm_1.UserIsAdminConfirmRepository)(idToken, fullNameToken);
        return isAdmin;
    }
    //https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html
    //1 the affected-rows value per row is 1 if the row is inserted as a new row, 
    //2 if an existing row is updated, 
    //and 0 if an existing row is set to its current values.
    async RequestRegisterCreateUpdateRepository({ firstName, fullName, email, password, lastUpDateBy }) {
        let result = await prisma.$executeRaw `INSERT INTO Registers SET fullName = ${fullName}, 
            firstName = ${firstName},  email = ${email}, password = ${password}, active = ${true}, lastUpDateBy = ${lastUpDateBy}
            ON DUPLICATE KEY UPDATE fullName = ${fullName}, firstName = ${firstName},  email = ${email}, password = ${password}, 
            active = ${true}, lastUpDateBy = ${lastUpDateBy}`;
        return result;
    }
}
exports.ConsumerCreateUpdateRegisterRepository = ConsumerCreateUpdateRegisterRepository;
//# sourceMappingURL=index.js.map