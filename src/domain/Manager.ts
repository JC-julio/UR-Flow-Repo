import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
config();

export default class Manager {
  constructor(
  readonly name: string, readonly password: string) {}

  static create(props: managerDto) {
    if(!props)
      throw new Error("Dados não encontrados")
    return new Manager(
      props.name, props.password);
  }
  
  public async validPassword(password) {
    const passwordIsValid = await bcrypt.compare(this.password, password)
    if(!passwordIsValid){
      throw new Error("Senha incorreta!")
      }
    return true;
  }

  public async generateToken(managerId) {
    const token = await jwt.sign({managerEntity: managerId}, process.env.secretJWTkey, {expiresIn: '7d'});
    return token;
  }

  static async validToken(token) {
    try {
      if(await jwt.verify(token, process.env.secretJWTkey))
      return true;
    } catch (error) {
      switch( error.message ){
          case 'jwt malformed': {
              throw new Error('Token inválido')
          }
          default: {
            throw new Error('Token inválido')
          }
      }
    }
  }
}
  
export type managerDto = {
  name: string;
  password: string;
};