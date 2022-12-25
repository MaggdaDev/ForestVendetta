class PasswordGenerator {
    static generatePassword() {
        return "JGPW" + Math.round(Math.random() * 10000000);
    }
}

module.exports = PasswordGenerator;