import {
  CollectionReference,
  DocumentData,
  Firestore,
  Query
} from '@google-cloud/firestore'
import { RepositoryException } from '../../server-utils/RepositoryException'
import { FirebaseCollectionsEnum } from './collections.enum'

export class FirestoreLib {
  private _firestore: Firestore

  constructor() {
    this._firestore = new Firestore()
  }

  public async getAll<T extends DocumentData>(
    collectionName: FirebaseCollectionsEnum,
    whereClause: [string, '<' | '<=' | '==' | '>' | '>=', any]
  ): Promise<T[]> {
    let collectionRef: CollectionReference | Query = this._firestore.collection(
      collectionName
    )
    if (whereClause) {
      collectionRef = collectionRef.where(...whereClause)
    }
    try {
      const collections = await collectionRef.get()
      return collections.docs
        .filter(doc => doc.exists)
        .map(doc => doc.data()) as T[]
    } catch (exception) {
      throw new RepositoryException(
        'FirestoreLib getAll is invalid, bad query ?\n',
        exception
      )
    }
  }

  public async get<T extends DocumentData>(
    collectionName: FirebaseCollectionsEnum,
    id: string
  ): Promise<T> {
    try {
      const doc = await this._firestore.doc(`${collectionName}/${id}`).get()
      return doc.data() as T
    } catch (exception) {
      throw new RepositoryException(
        'FirestoreLib get is invalid, bad id ?\n',
        exception
      )
    }
  }

  public async set<T extends { id: string }>(
    collectionName: FirebaseCollectionsEnum,
    data: T
  ): Promise<void> {
    try {
      await this._firestore
        .collection(collectionName)
        .doc(data.id)
        .set(data)
    } catch (exception) {
      throw new RepositoryException('FirestoreLib set is invalid\n', exception)
    }
  }
}
