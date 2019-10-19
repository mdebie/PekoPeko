import * as moment from 'moment'
import { Service } from 'typedi'
import { FirebaseCollectionsEnum } from '../../lib/firestore/collections.enum'
import { FirestoreLib } from '../../lib/firestore/Firestore'
import { Driver } from './DriverEntity'

@Service()
export class DriverRepository {
  get today(): number {
    return moment()
      .startOf('day')
      .unix()
  }

  constructor(private firestore: FirestoreLib) {}

  /**
   * Gets the Driver for today from a firestore DB.
   * returns undefined if no driver is found
   */
  public async getTodaysDriver(): Promise<Driver> {
    const drivers = await this.firestore.getAll<Driver>(
      FirebaseCollectionsEnum.driver,
      ['date', '==', this.today]
    )
    return drivers.length > 0 ? drivers[0] : undefined
  }

  /**
   * Sets a Driver in a firestore DB
   * @param {string} driver
   */
  public async setTodaysDriver(driver: Driver): Promise<void> {
    driver.date = this.today
    return await this.firestore.set<Driver>(
      FirebaseCollectionsEnum.driver,
      driver
    )
  }
}
