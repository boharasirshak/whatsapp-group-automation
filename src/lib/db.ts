import * as fs from 'fs'

/**
 * A simple JSON database class performing basic CRD operations
 * The UPDATE operation is not implemented as it is not necessary for the current use case
 * @type T The type of the data to store in the database
 */
class JsonDb<T> {
  private _data: T[]
  private readonly _path: string

  /**
   * Constructor for the JSON database
   * @param path The path to the JSON file to use as the database
   */
  constructor (path: string) {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify([]))
    }
    this._path = path
    const file = fs.readFileSync(path, 'utf-8')
    this._data = JSON.parse(file)
  }

  /**
   * Find one entry that matches the filter
   * @param filter Filter function
   * @returns an entry that matches the filter
   */
  public findOne (filter: (data: T) => boolean): T | undefined {
    return this._data.find(filter)
  }

  /**
   * Find many entries that match the filter
   * @param filter Filter function
   * @returns an array of entries that match the filter
   */
  public findMany (filter: (data: T) => boolean): T[] {
    return this._data.filter(filter)
  }

  /**
   * Insert one entry into the database
   * @param entry The entry to insert
   */
  public insertOne (entry: T): void {
    this._data.push(entry)
  }

  /**
   * Insert many entries into the database
   * @param entries The entries to insert
   */
  public insertMany (entries: T[]): void {
    this._data.push(...entries)
  }

  /**
   * Delete one entry from the database
   * @param filter Filter function
   */
  public deleteOne (filter: (data: T) => boolean): void {
    const index = this._data.findIndex(filter)
    if (index !== -1) {
      this._data.splice(index, 1)
    }
  }

  /**
   * Delete many entries from the database
   * @param filter Filter function
   */
  public deleteMany (filter: (data: T) => boolean): void {
    this._data = this._data.filter((entry) => !filter(entry))
  }

  /**
   * Commit the changes to the database, writing to the file
   */
  public commit (): void {
    fs.writeFileSync(this._path, JSON.stringify(this._data, null, 2))
  }
}

export default JsonDb
