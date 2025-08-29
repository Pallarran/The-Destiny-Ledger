import Dexie, { Table } from 'dexie'
import { Build } from '@/stores/types'

// Database schema interface
interface DestinyLedgerDB extends Dexie {
  builds: Table<Build, string>
  settings: Table<{ key: string; value: any }, string>
  snapshots: Table<{ id: string; buildId: string; data: Build; createdAt: Date }, string>
}

// Database instance
class DestinyLedgerDatabase extends Dexie implements DestinyLedgerDB {
  builds!: Table<Build, string>
  settings!: Table<{ key: string; value: any }, string>
  snapshots!: Table<{ id: string; buildId: string; data: Build; createdAt: Date }, string>

  constructor() {
    super('DestinyLedgerDB')
    
    // Define schema - version 1
    this.version(1).stores({
      builds: 'id, name, createdAt, updatedAt, version',
      settings: 'key, value',
      snapshots: 'id, buildId, createdAt'
    })

    // Hooks for automatic timestamp management
    this.builds.hook('creating', function (_primKey, obj, _trans) {
      obj.createdAt = new Date()
      obj.updatedAt = new Date()
    })

    this.builds.hook('updating', function (modifications) {
      ;(modifications as any).updatedAt = new Date()
    })
  }
}

// Single database instance
export const db = new DestinyLedgerDatabase()

// Database utility functions
export class DatabaseService {
  // Build operations
  static async saveProject(build: Build): Promise<void> {
    await db.builds.put(build)
  }

  static async getAllBuilds(): Promise<Build[]> {
    return await db.builds.orderBy('updatedAt').reverse().toArray()
  }

  static async getBuildById(id: string): Promise<Build | undefined> {
    return await db.builds.get(id)
  }

  static async deleteBuild(id: string): Promise<void> {
    await db.transaction('rw', [db.builds, db.snapshots], async () => {
      // Delete the build
      await db.builds.delete(id)
      // Delete all related snapshots
      await db.snapshots.where('buildId').equals(id).delete()
    })
  }

  static async duplicateBuild(originalId: string, newId: string, newName: string): Promise<Build | null> {
    const original = await db.builds.get(originalId)
    if (!original) return null

    const duplicate: Build = {
      ...original,
      id: newId,
      name: newName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.builds.add(duplicate)
    return duplicate
  }

  // Settings operations
  static async getSetting(key: string): Promise<any> {
    const setting = await db.settings.get(key)
    return setting?.value
  }

  static async setSetting(key: string, value: any): Promise<void> {
    await db.settings.put({ key, value })
  }

  static async deleteSetting(key: string): Promise<void> {
    await db.settings.delete(key)
  }

  // Snapshot operations (for backup/restore)
  static async createSnapshot(buildId: string): Promise<string> {
    const build = await db.builds.get(buildId)
    if (!build) throw new Error('Build not found')

    const { v4: uuidv4 } = await import('uuid')
    const snapshotId = uuidv4()

    await db.snapshots.add({
      id: snapshotId,
      buildId,
      data: build,
      createdAt: new Date(),
    })

    return snapshotId
  }

  static async restoreSnapshot(snapshotId: string): Promise<Build | null> {
    const snapshot = await db.snapshots.get(snapshotId)
    if (!snapshot) return null

    // Create a new build from the snapshot data
    const { v4: uuidv4 } = await import('uuid')
    const restoredBuild: Build = {
      ...snapshot.data,
      id: uuidv4(),
      name: `${snapshot.data.name} (Restored)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.builds.add(restoredBuild)
    return restoredBuild
  }

  // Data management
  static async clearAllData(): Promise<void> {
    await db.transaction('rw', [db.builds, db.settings, db.snapshots], async () => {
      await db.builds.clear()
      await db.settings.clear()
      await db.snapshots.clear()
    })
  }

  static async exportData(): Promise<{ builds: Build[]; settings: any[] }> {
    const [builds, settings] = await Promise.all([
      db.builds.toArray(),
      db.settings.toArray(),
    ])

    return { builds, settings }
  }

  static async importData(data: { builds: Build[]; settings: any[] }): Promise<void> {
    await db.transaction('rw', [db.builds, db.settings], async () => {
      await db.builds.clear()
      await db.settings.clear()
      
      await db.builds.bulkAdd(data.builds)
      await db.settings.bulkAdd(data.settings)
    })
  }

  // Database stats
  static async getStats(): Promise<{
    buildsCount: number
    snapshotsCount: number
    settingsCount: number
    lastUpdated: Date | null
  }> {
    const [buildsCount, snapshotsCount, settingsCount, lastUpdated] = await Promise.all([
      db.builds.count(),
      db.snapshots.count(),
      db.settings.count(),
      db.builds.orderBy('updatedAt').last(),
    ])

    return {
      buildsCount,
      snapshotsCount,
      settingsCount,
      lastUpdated: lastUpdated?.updatedAt || null,
    }
  }
}