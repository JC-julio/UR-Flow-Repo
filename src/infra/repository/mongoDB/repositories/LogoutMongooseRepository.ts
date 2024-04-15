import { Injectable } from '@nestjs/common';
import TokenModel from '../models/MongooseModelBlackList';
import LogoutRepositoryInterface from '../../../../application/repository/LogoutRepositoryInterface';
@Injectable()
export default class LogoutMongooseRepository implements LogoutRepositoryInterface {
  async logout(token: string): Promise<void> {
    await TokenModel.create({
    bannedToken: token,
    })
  }
  
  async GetOne(token: string): Promise<any> {
    const isBlackListed = await TokenModel.findOne({bannedToken: token})
    if(!isBlackListed)
      throw new Error("Token não encontrado")
    const returnToken = {
      bannedToken: isBlackListed.bannedToken
    }
    return returnToken
    }
}
