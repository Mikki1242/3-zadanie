import { LocalStorageService } from './LocalStorageService'

/**
 * @typedef Note
 * @property {string} noteId - идентификатор примечания
 * @property {string} title - название примечания
 * @property {array} todos - список задач
 */

/**
 * Ключ, под которым мы сохраняем заметки в LS
 * @type {string}
 */
export const STORAGE_KEY = 'notes'

export const NoteService = {
  /**
   * Хранит все предоставленные элементы заметок
   * @param {Note[]} items
   */
  storeAll (items) {
    LocalStorageService.setItem(STORAGE_KEY, items)
  },
  /**
   * Получить все заметки
   * @return {notes[]}
   */
  fetchNotes () {
    return LocalStorageService.getItem(STORAGE_KEY, [])
  },
  /**
   * Получить заметку по идентификатору
   * @return {note}
   */
  getItemById (noteId) {
    const items = LocalStorageService.getItem(STORAGE_KEY, [])
    const index = items.findIndex(i => i.noteId === noteId)
    if (index === -1) return
    return items[index]
  },
  /**
   * Обновляет заметку.
   * @param {String} noteId
   * @param {Note} payload
   */
  updateItem (noteId, payload) {
    const items = NoteService.fetchNotes()
    const index = items.findIndex(i => i.noteId === noteId)
    if (index === -1) {
      items.push(payload)
    } else {
      items.splice(index, 1, payload)
    }
    NoteService.storeAll(items)
  },
  /**
   * Удалить заметку из списка
   * @param {string} noteId
   */
  removeItem (noteId) {
    const items = NoteService.fetchNotes()
    const index = items.findIndex(i => i.noteId === noteId)
    items.splice(index, 1)
    NoteService.storeAll(items)
  }
}
