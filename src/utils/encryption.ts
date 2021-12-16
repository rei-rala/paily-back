import bcrypt from 'bcrypt'
const saltRounds = 11

export const hashPassword = (password: string) => bcrypt.hash(password, saltRounds).then(hash => hash)
export const compareVsEncrypted = (password: string, encryptedPassword: string) => bcrypt.compare(password, encryptedPassword)