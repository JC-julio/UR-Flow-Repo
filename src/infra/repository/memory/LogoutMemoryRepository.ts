import { Injectable } from '@nestjs/common';
import ManagerRepositoryInterface from 'src/application/repository/ManagerRepositoryInterface';


@Injectable()
export default class logoutMemoryRepository implements ManagerRepositoryInterface {
    private blacklistDataBase: Array<any> = []

  async logout(token: string): Promise<void> {
    await this.blacklistDataBase.push({
    bannedToken: token,
    })
  }

  async GetOne(token: string): Promise<any> {
      const isListed = await this.blacklistDataBase.find(
        (blacklistDataBase) => blacklistDataBase.bannedToken === token)
        if(!isListed)
            throw new Error("Token não encontrado")
        const returnToken = {
            bannedToken: isListed.bannedToken,
        }
        return returnToken;
  }
}
